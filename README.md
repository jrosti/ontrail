# OnTrail

OnTrail is a sports diary and training community app. Users log exercises, write diary-style training notes, track distance and duration, comment on each other's workouts, follow unread comments, join groups, browse leaderboards, view yearly and monthly summaries, search entries, and export data.

## Current State

The repository contains two implementations in parallel:

**Legacy** (root, Clojure/MongoDB):
- Backend: Clojure 1.6, Ring, Compojure, Aleph, Monger, MongoDB.
- Frontend: server-served static HTML, jQuery, RxJS, Handlebars, older CSS/LESS assets, some ClojureScript/Reagent.
- Data: MongoDB collections `onuser`, `exercise`, `onsport`, `groups`, `nccache`.
- Tests: Clojure unit tests under `test/ontrail/test`.

**Modern** (`ontrail_v2/`, TypeScript/PostgreSQL):
- API: Bun HTTP server, raw `postgres` client, raw SQL migrations, port 3002.
- Auth: Hanko.io — JWT verification via JWKS, cookie and Bearer token support, auto-provisioned users.
- DB: PostgreSQL with `sports`, `users`, `exercises`, `comments`, `cares` tables.
- Web: Vite/React frontend with Hanko login, routing, diary/feed/exercise/log pages.
- Infra: Docker Compose with PostgreSQL, Hanko (port 8000), MailSlurper (port 9080/9085).

Implemented API routes:
- `GET /api/health`, `GET /api/sports`, `GET /api/me`
- `GET /api/exercises`, `POST /api/exercises`
- `GET /api/exercises/:id`, `PATCH /api/exercises/:id`, `DELETE /api/exercises/:id`
- `POST /api/exercises/:id/comments`, `DELETE /api/exercises/:id/comments/:commentId`

## Product Scope

OnTrail stays focused on training history and community feedback, not a generic social network. The primary workflows are:

- Record an exercise with sport, date, duration, distance, heart rate, notes, tags, and sport-specific details.
- Browse latest exercises and filtered exercise lists.
- Read one exercise with comments, reactions, and author profile context.
- Comment on exercises and track unread discussion.
- View personal summaries by sport, tags, week, month, and year.
- View public leaderboards and record lists for running, swimming, cycling, skiing, and other sports.
- Manage profile details, avatar preferences, groups, and favourites.
- Import and export diary data.

## Repository Layout

```text
ontrail_v2/
  apps/
    api/               TypeScript HTTP API (Bun, port 3002)
    web/               Bun + Vite + React frontend
    mock/              Mock API server for local frontend dev
  docs/
    api/               API plans and compatibility notes
  infra/
    docker-compose.yml PostgreSQL + Hanko + MailSlurper
    hanko/             Hanko config and binary
(root)                 Legacy Clojure application
```

Planned but not yet created:
```text
packages/
  domain/              Exercise, summary, group, comment, user logic
  api-contracts/       Shared request/response types
scripts/
  migrate/             MongoDB → PostgreSQL migration tools
```

## PostgreSQL Schema

Tables in `ontrail_v2/apps/api/migrations/0001_initial.sql`:

- `sports` — key, name_fi/en, glyph, color, metric, pace_unit
- `users` — UUID pk, hanko_subject, username, normalized_username, email, display_name, avatar_initials/color, synopsis, legacy_id
- `exercises` — UUID pk, owner_id, sport_key, title, body_html, body_markdown, tags[], exercise_date, duration_sec, distance_m, avg_hr, climb_m, feel_rating, details jsonb, gpx_points jsonb, legacy_id
- `comments` — UUID pk, exercise_id FK, author_id FK, body, legacy_id
- `cares` — composite PK (exercise_id, author_id)

Still needed: `groups`, `group_members`, `favourites`, `unread_comments`.

## Local Development

```sh
# Start infra (PostgreSQL + Hanko + MailSlurper)
cd ontrail_v2/infra && docker compose up -d

# Run API migrations and start API
cd ontrail_v2/apps/api
bun run db:migrate
bun run dev          # PORT=3002

# Start frontend
cd ontrail_v2/apps/web
bun run dev
```

## Migration Principles

- Preserve data first, redesign second.
- Keep the legacy Clojure app runnable until data parity and feature parity are proven.
- Write repeatable, idempotent migrations.
- Keep units explicit: duration (seconds), distance (metres), dates (ISO date string), pace derived on read.
- Preserve legacy Mongo `_id` values in `legacy_id` columns until migration audits complete.
- Move business rules into tested TypeScript domain packages rather than embedding them in handlers.

## Legacy Commands

```sh
lein test
lein ring server
lein run
```

MongoDB is expected locally as database `ontrail`.

## Planning Documents

- [TODO.md](TODO.md) — phased modernization checklist.
- [AGENTS.md](AGENTS.md) — guidance for coding agents working in this repository.
- [ontrail_v2/docs/api/backend-plan.md](ontrail_v2/docs/api/backend-plan.md) — API implementation slices and test plan.
