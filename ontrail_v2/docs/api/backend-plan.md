# Backend Implementation Plan

The real API will replace `apps/mock` incrementally while preserving the current React API contract.

## Implemented Slice

- Bun TypeScript HTTP server in `apps/api`.
- PostgreSQL migrations in `apps/api/migrations`.
- Real `sports` table and `GET /api/sports`.
- Health check at `GET /api/health`.
- Hanko JWT verification from `Authorization: Bearer` or the `hanko` cookie.
- First-login user provisioning from Hanko subject/email claims.
- Exercise create/read/update/delete backed by PostgreSQL.
- Exercise ownership enforced with the authenticated JWT-derived user.
- Comments are writable only by authenticated users and readable only on authenticated exercise detail requests.

## Next Slices

1. Feed list search text filtering.
2. Cares and unread comment tracking.
3. Year/month/week summaries.
4. User profiles, avatars, favourites, groups, challenges, and leaderboards.
5. Legacy import utilities preserving MongoDB ids.

Writes must wait for verified current-user context. Public reads can be implemented earlier where legacy behavior allows anonymous access.

## Test Plan

- Unit tests: pure parsing, duration/distance normalization, GPX point validation, summary calculations, and permission helper behavior.
- Repository integration tests: run migrations against disposable PostgreSQL, seed users/sports/exercises/comments, and verify owner enforcement plus comment visibility.
- API integration tests: call the Bun server with signed test JWTs and assert `401`, `403`, and success paths for each authenticated route.
- Frontend integration tests: run the React app against the real API with controlled fixtures and verify logging, editing, GPX upload, map rendering, sports picker, and comments.
- E2E tests: use Playwright with testcontainers for PostgreSQL and compatible auth/mail services so the full login and exercise diary workflow is repeatable.
