# ontrail rewrite — toolchain & decisions

**Guiding principle:** the running box is disposable; the system *is* the git repo (config + schema + migrations) plus an off-box encrypted dump. Optimize for fast rebuild, not high availability. Maintenance is done by an agent (Codex); humans review only the security boundary and the data migration.

---

## Stack

| Layer | Choice | Why |
|---|---|---|
| Host | Single **UpCloud** VM, Helsinki | Already there; zero-cost egress, Finnish/EU residency, fits €25. Don't move to a hyperscaler (cost, complexity, worse security dead-end). Hetzner is a no-pressure later optimization. |
| Data engine | **PostgreSQL**, native (PGDG apt), auto-patched | The keystone and the one irreplaceable piece. Holds the data **and** both beloved features. |
| Search | Postgres FTS: `finnish` snowball config + GIN index | Drop-in for the old Java Snowball stemmer. `dict_voikko` later if Finnish quality needs it. |
| Statistics | SQL views / materialized views | Live aggregation is fine at this scale; the old precompute/cache jobs were Mongo workarounds — don't port them. |
| Backend | **Traditional TypeScript API** (Hono or Fastify, *not* Nest) | Mainstream pattern agents build most reliably; unifies with the SPA; absorbs scheduled/async work (digests, imports, phone-sync) as background jobs → one service, no separate worker. |
| Data layer | Thin & SQL-close (`postgres` lib or Kysely) | Avoid a heavy ORM and its migration DSL; keep Postgres the source of truth so the app layer stays swappable. |
| Auth | **Hanko**, self-hosted | Passkey/WebAuthn-first (durable standard). Keep email magic-link / password as a **permanent** fallback — not passkey-only. Issues JWT; backend validates. |
| Frontend | **TypeScript SPA** (Petri) | Web-wizard's stack; shared types with the backend across the API boundary. The disposable layer — rewritable in 2031 with no harm. |
| Proxy / TLS | **Caddy** | Automatic, auto-renewing HTTPS in a 3-line config; serves SPA static files + reverse-proxies the API on localhost. |
| Process mgmt | **systemd** (Postgres + Caddy + Node service); OS auto-patched | One Docker Compose is an acceptable alternative, but keep **Postgres native** regardless. |
| Backups | `pg_dump` → encrypted (`age`) → S3 | Put-only key to a **versioned / object-locked** bucket (a popped box can't wipe history). Encrypt because the dump carries `onuser` (emails + hashes). Off-account copy on R2/B2 = nice-to-have. |
| CI/CD | **GitHub Actions** → build SPA + backend → rsync/restart over SSH | Migrations via a tool (dbmate / sqitch / Flyway), versioned in the repo. |

## Backend decision: trad TS over PostgREST

Considered PostgREST + Row-Level Security (auto-generated API, authz enforced in the DB). Set aside because: (1) agents build conventional TS APIs more reliably than fiddly, silent-failing PostgREST+RLS; (2) the app's real logic (groups, permissions, feeds, imports, digests) needs a TS service + worker anyway, so PostgREST would mean *more* moving parts, not fewer; (3) the data isn't sensitive enough to need RLS's bulletproof enforcement. Recreate RLS's one good property — a small auditable security surface — by centralizing all authz into a single module.

## Durability strategy (agent-maintained)

Strong **types + tests are the durability mechanism**, not language choice. The agent absorbs dependency churn for free, so "low-churn language" stops mattering; what matters is a conventional, well-typed, well-tested codebase any present-or-future agent can pick up safely. Pin the runtime, keep the dependency list short.

## Data & user migration

- **Source = the mongodump you already have.** Load collections into Postgres as JSONB first (faithful 1:1, verifiable), then normalize the core (`onuser`, `exercise`, `onsport`, `groups`) into real tables.
- **Drop the derived/cache collections** (`nccache`, precomputed summaries) — recompute in Postgres.
- **User auth cutover:** email-claim flow if emails on file are good; scrypt-bridge (import hashes → temporary verify → enroll passkey → sunset) if emails are stale.
- **Acceptance test:** your wife runs her usual stats/searches with no regression. Parity is on user-visible features, not the old Mongo-workaround machinery.

## Legacy box — do before cutover

- Run the mongodump, encrypt, archive **off-account** → the asset is safe; a breach becomes downtime, not loss.
- Scan **full git history** (gitleaks / trufflehog); rotate anything found. Known: a committed Keen key; confirm prod didn't run on the default AES `KEY`/`MACKEY` from the public repo.
- Put **Caddy in front for HTTPS** this week (logins currently cross plaintext).
- Box holds only **dead-end scoped creds** — no account-wide API token, no pivot SSH key; S3 key put-only.
- Set a **cutover deadline** to bound the exposure window.

## Human-owned vs agent-owned

- **Read it yourself:** the auth module (one small file) and the Mongo→Postgres migration correctness (data is irreplaceable).
- **Let the agent run:** everything else.

## Open / to confirm

- Rough row counts (exercises, users) — decides whether even materialized views are overkill.
- Email quality on file — picks the user-migration path.
- Whether the realtime chat survives, or polling / drop it.
- Who owns the worker-style jobs (imports/digests) — Petri in TS, or your Python scripts offline.
