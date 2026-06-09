# Backend Implementation Plan

The real API has replaced `apps/mock` for all core exercise functionality.
See `plans/` in the repo root for the full design decisions.

## Implemented

- Bun TypeScript HTTP server in `apps/api` (port 3002, no framework, biome lint)
- PostgreSQL migrations in `apps/api/migrations/` (custom SQL runner)
- Hanko JWT verification from `Authorization: Bearer` or the `hanko` cookie
- First-login user provisioning from Hanko subject/email claims
- `GET /api/health`, `GET /api/sports`, `GET /api/me`
- Exercise create/read/update/delete backed by PostgreSQL
- Exercise ownership enforced via JWT-derived user
- Exercise list with sport/user/tag filters and pagination
- Comments: add (authenticated only) and delete (author or exercise owner)
- GPX point normalization and validation

## Schema notes (vs. plan2-migration.md)

The live schema (`migrations/0001_initial.sql`) diverges from plan2 in places where
implementation made better decisions:

| Plan2 says | Implementation has | Notes |
|---|---|---|
| `duration` centiseconds | `duration_sec` (seconds) | Better unit — ÷100 applied at migration |
| `app_user` table | `users` table | Implementation naming wins |
| `pace` generated column | **missing — needs migration** | Add: `round(distance_m::numeric/duration_sec*360)` |
| `body_html` + `body_markdown` | `body_html` + `body_markdown` | Keep both; drop `body_markdown` only if unused |
| `feel_rating` not in plans | `feel_rating text` | Implementation addition, keep it |
| `detail_kcal`, `source` columns | **missing — needs migration** | Add for 252/965 legacy docs |
| `user_visit` table | **missing — needs migration** | Needed for unread tracking |
| FTS `search_vec` generated column | **missing — needs migration** | Add with `finnish` config |
| `legacy_object_id` on users/exercises | **missing — needs migration** | Needed for permalink redirect |

## Next Slices

1. Add missing schema columns (pace, detail_kcal, source, user_visit, FTS, legacy_object_id).
2. Cares endpoint (table exists, no route).
3. User profile read/update.
4. Summaries: sport, year, month, week (GROUP BY SQL — plan0 §1).
5. Leaderboards and personal records (plan0 §4).
6. Groups: list, detail, join, leave.
7. Unread comment tracking (user_visit + comment timestamps).
8. Search (FTS with `finnish` config).
9. Export (raw JSON rows; CSV assembled by FE).
10. SSE endpoint for live notifications (final item — feature parity target).

## Test Plan

- Unit tests: pure parsing, duration/distance normalization, GPX point validation, summary calculations, permission helper behavior.
- Repository integration tests: run migrations against disposable PostgreSQL, seed users/sports/exercises/comments, verify owner enforcement plus comment visibility.
- API integration tests: call the Bun server with signed test JWTs and assert `401`, `403`, and success paths for each authenticated route.
- Frontend integration tests: run the React app against the real API with controlled fixtures.
- E2E tests: Playwright with testcontainers for the full login and exercise diary workflow.
