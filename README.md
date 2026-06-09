# OnTrail

OnTrail is a sports diary and training community app. The existing application lets users log exercises, write diary-style training notes, track distance and duration, comment on other users' workouts, follow unread comments, join groups, browse leaderboards, view yearly and monthly summaries, search entries, and export data.

This repository currently contains the legacy implementation:

- Backend: Clojure 1.6, Ring, Compojure, Aleph, Monger, MongoDB.
- Frontend: server-served static HTML, jQuery, RxJS, Handlebars, older CSS/LESS assets, and some ClojureScript/Reagent.
- Data: MongoDB collections for users, exercises, sports, groups, and unread comment cache.
- Tests: Clojure unit tests under `test/ontrail/test`.

The modernization target is a maintainable product with:

- PostgreSQL as the source of truth.
- Hanko.io for authentication and identity.
- TypeScript backend serving a JSON API and realtime/event endpoints.
- Drizzle ORM for typed PostgreSQL access and migrations.
- Bun/Vite/React frontend with a modern responsive interface.
- A migration path that keeps existing diary data, public URLs, and core behavior intact.

## Product Scope

OnTrail should remain focused on training history and community feedback, not become a generic social network. The primary workflows are:

- Record an exercise with sport, date, duration, distance, heart rate, notes, tags, and sport-specific details.
- Browse latest exercises and filtered exercise lists.
- Read one exercise with comments, reactions, and author profile context.
- Comment on exercises and track unread discussion.
- View personal summaries by sport, tags, week, month, and year.
- View public leaderboards and record lists for common running, swimming, cycling, skiing, and other sport distances.
- Manage profile details, avatar preferences, groups, and favourites.
- Import and export diary data.

## Target Architecture

Recommended repository layout for the new system:

```text
apps/
  api/                 TypeScript HTTP API
  web/                 Bun + Vite + React frontend
packages/
  auth/                Hanko JWT/session verification
  db/                  Drizzle schema, migrations, PostgreSQL access
  domain/              Exercise, summary, group, comment, user logic
  api-contracts/       Shared request/response types
migrations/            SQL migrations
scripts/
  migrate/             MongoDB to PostgreSQL migration tools
docs/
  api/                 API contracts and compatibility notes
```

Keep the legacy Clojure app available during migration until data parity and feature parity are proven.

## PostgreSQL Model Direction

The Mongo collections map roughly to these PostgreSQL tables:

- `users`: Hanko subject, username, normalized username, email snapshot, profile fields, avatar settings.
- `exercises`: owner, sport, title, body, markdown body, tags, date, duration, distance, average heart rate, pace, timestamps.
- `exercise_details`: sport-specific numeric details such as repeats and elevation.
- `comments`: exercise comments with author, body, timestamps, and migrated legacy id.
- `cares`: lightweight reactions on exercises.
- `groups`: group name, normalized name, description.
- `group_members`: many-to-many membership table.
- `favourites`: user-to-user following/favourite relationship.
- `unread_comments`: per-user unread discussion state.
- `sports`: configured sports and display metadata.

Use stable UUID primary keys for new rows and keep legacy Mongo object ids in explicit `legacy_id` columns until migration audits are complete.

## Authentication Direction

Hanko should own login, registration, passkeys, passwordless flows, and session identity. The TypeScript API should verify Hanko tokens and map the Hanko subject to an OnTrail user row.

Migration rules:

- Preserve existing usernames.
- Keep legacy password hashes only long enough to support an account transition flow if needed.
- Prefer Hanko account creation or linking over reimplementing password authentication.
- Treat `nobody` as an anonymous viewer concept in application logic, not a real authenticated user.

## API Direction

The current API is mostly under `/rest/v1` and `/rest/v2`. The new API should use versioned JSON endpoints, for example:

- `GET /api/v1/exercises`
- `POST /api/v1/exercises`
- `GET /api/v1/exercises/{id}`
- `PATCH /api/v1/exercises/{id}`
- `DELETE /api/v1/exercises/{id}`
- `POST /api/v1/exercises/{id}/comments`
- `POST /api/v1/exercises/{id}/cares`
- `GET /api/v1/users/{username}/summary`
- `GET /api/v1/groups`
- `POST /api/v1/groups/{name}/join`
- `GET /api/v1/export`

During the transition, either maintain compatibility handlers for important legacy URLs or provide redirects/adapters that keep bookmarks working.

## Frontend Direction

The React app should be the primary user experience from day one, not a marketing page. Prioritize dense, practical screens for repeated training diary use:

- Latest feed with filters, unread indicators, comments, and quick navigation.
- Exercise editor optimized for fast entry.
- User diary and yearly/monthly summary views.
- Detail page with comments and reactions.
- Group and leaderboard pages.
- Profile and account settings.

Use Bun for package management and Vite for development/build tooling. Keep state management simple until complexity justifies a dedicated library.

## Migration Principles

- Preserve data first, redesign second.
- Introduce the new backend behind explicit APIs while the old app remains runnable.
- Write repeatable migrations and validation reports before cutting over.
- Move business rules into tested TypeScript domain packages rather than embedding them in handlers.
- Keep Drizzle migrations as the authoritative schema history.
- Keep units explicit: duration, distance, pace, and dates must have canonical storage and display conversion tests.
- Do not rely on manual Mongo document shape assumptions without sampling and validation.

## Legacy Commands

The current application is a Leiningen project. Typical legacy commands are:

```sh
lein test
lein ring server
lein run
```

MongoDB is expected locally as database `ontrail`.

## Planning Documents

- [TODO.md](TODO.md) contains the phased modernization checklist.
- [AGENTS.md](AGENTS.md) contains project-specific guidance for coding agents working in this repository.
