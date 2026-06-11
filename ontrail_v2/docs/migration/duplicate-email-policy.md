# Duplicate-email policy (Mongo `onuser` → Postgres + Hanko)

**Status:** decided 2026-06-11. Implements the resolution for the duplicate-email hazard
flagged in `apps/api/src/scripts/migrate-users.ts` and `../../../plans/plan2-migration.md` §4.

## The problem

Legacy `onuser` lets multiple accounts share one email. Measured against the live dump:

- **672** total accounts; **1** has no email.
- **34** distinct emails are shared by **>1** account, covering **76** accounts
  (~42 "extra" accounts beyond one-per-email).
- Clusters are mixed: pure throwaway/test accounts (0 exercises) and, more often, the
  **same person's** multiple real accounts accumulated over years — each with its own history.

Why it matters at the target:

- **Hanko requires a unique login email.** Only one account per email can own the login.
- In the target schema, **`users.email` is NOT unique** — only `username` (unique) and the
  Hanko login email are constrained. Exercise history is keyed by author, not email, so
  preserving every account's data is independent of the login-email collision.

## Policy: merge non-canonical accounts into the canonical one

For each email shared by >1 account:

1. **Pick the canonical account** = the one with the most exercises. Tie-breakers, in order:
   most recent activity (`max(lastModifiedDate)`), then fuller profile (more non-null
   `profile.*` fields), then lowest legacy `_id`.
2. **Canonical account** gets the Hanko login (verified primary email) → `migration_users.state = 'invited'`.
3. **Non-canonical accounts are merged into the canonical:** reassign their exercises,
   comments, and cares to the canonical `user_id`, then drop the duplicate `users` rows.
   Record each merge in `migration_users` (`state = 'merged'`, pointing at the canonical
   `ontrail_user_id`) so the action is auditable.

Singletons (one account per email) migrate normally. The lone no-email account →
`state = 'pending'` (no Hanko login possible without an email).

### Verification (`exercise.user` matches `username` exactly, case-sensitive)

```
jari.rosti@gmail.com (5): Kiiski(0) jro2(0) zxcv2(0) zxcv3(0) zxcv4(0)   → all empty test accounts
svante.karkkainen@me.com (3): Svante_K(5) svante(2) "Svante "(0)         → Svante_K canonical
```

(Note: jari's *real* history lives under `Jörö` / `jarirosti@gmail.com`, a different,
non-colliding email — already migrated as the first end-to-end test.)

## ⚠️ Caveat — shared email may be two different people

A shared email is sometimes a couple/family using one address, not one person with several
accounts. Merging then incorrectly fuses two people's histories, and is **irreversible**.

Mitigations before the bulk run:
- Produce a **dry-run report** of every planned merge (email, canonical, absorbed accounts,
  per-account exercise/comment/care counts) and eyeball the 34 clusters — there are few enough.
- Support a **manual exclusion list** of emails to treat as singletons (do not merge); those
  non-canonical accounts fall back to **preserve-without-login** (`state = 'skipped'`, history kept).
- Merge runs inside a transaction per email cluster; keep staging until acceptance passes.

## Implementation notes

- `migrate-users.ts` currently processes one account at a time and would 409 on the 2nd+
  account for an email. The merge policy needs a **pre-pass** that groups input by
  `lower(email)`, selects the canonical, and orders processing canonical-first.
- Add `'merged'` to the `migration_users.state` CHECK constraint (currently
  `pending|invited|claimed|skipped`) — see `migrations/0003_user_migration.sql`.
- Reassignment touches `exercises.owner_id`, `comments.user_id`, `cares.user_id`,
  `group_members.user_id`; de-dup cares/group_members on conflict after re-pointing.
