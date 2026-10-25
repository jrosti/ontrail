# Provisioning Hanko accounts from the OnTrail user database

**Why.** Hanko only knows about Hanko accounts. A legacy user who has not logged in yet is not in
Hanko, so a stranger could register their name, and a legacy user registering through Hanko would get
a second, empty OnTrail account. Provisioning creates the Hanko account up front, with the username
already set, so Hanko's own uniqueness rule reserves every existing name.

## What it does

`apps/api/src/scripts/provision-hanko-users.ts` (idempotent; skips users with a `hanko_subject`):

1. For each `users` row with an email and no `hanko_subject`, call the Hanko admin API
   (`POST /users`) with the email (primary + verified) and a username. No email is sent.
2. Store the returned id in `users.hanko_subject` (and `migration_users`, if the user came from the
   Mongo import, as `invited`).
3. Report users with no email (they cannot log in through Hanko) and email conflicts
   (`email_exists`: several accounts share an email; merge them first, see
   `duplicate-email-policy.md`).

```
HANKO_ADMIN_URL=http://localhost:8001 bun run src/scripts/provision-hanko-users.ts --dry-run
HANKO_ADMIN_URL=http://localhost:8001 bun run src/scripts/provision-hanko-users.ts
```

`migrate-users.ts` (the Mongo import) now sets the Hanko username the same way when it creates an
account.

## Which username

Hanko's flows only accept `^\w+$` (ASCII letters, digits, `_`), 2 to 32 characters, unique
case-insensitively. The first candidate that is valid and free is used:

1. the user's display name, if valid as is;
2. their OnTrail username, if valid;
3. the OnTrail username with Finnish letters folded (`Jörö` -> `Joro`), then the display name folded;
4. the first candidate with `_2`, `_3`, … when every name is taken.

## What users see

On the first login the API (`findOrCreateUserFromClaims`):

- finds the provisioned user by `hanko_subject` and shows the Hanko username as the display name;
- keeps the previous display name in `users.legacy_display_name` (set once). Until a Hanko username
  exists, the old display name is what is shown;
- keeps `users.username` (the URL key) unchanged.

## Backstops in the API

- **Email linking.** A Hanko account with no OnTrail user whose *verified* email matches exactly one
  unlinked OnTrail user is linked to it instead of creating a new user. Ambiguous matches are not
  guessed.
- **Name protection.** A brand-new Hanko account whose username belongs to another OnTrail user
  (case-insensitively, diacritics folded) is refused with `409 {"error":"username_taken"}`; public
  endpoints treat it as anonymous. An existing user renaming to a taken name keeps their current name.
  This covers users that cannot be provisioned (no email).

## Production notes

- Run `--dry-run` first and read the planned names.
- Hanko is configured with a mandatory username (`username.optional: false`,
  `acquire_on_login: true`), so accounts that have none must pick one at next login.
- Not done yet: a web flow to recover from `username_taken` (the login page only shows a message).
