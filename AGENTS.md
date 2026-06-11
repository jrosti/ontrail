# AGENTS.md

This repository contains OnTrail, a legacy sports diary and training community application that is being modernized.

## Project Context

The current app is implemented in Clojure/ClojureScript with MongoDB and static frontend assets:

- `project.clj`: legacy Leiningen project.
- `src/ontrail`: Clojure backend modules.
- `src-cljs/ontrail`: old ClojureScript code.
- `resources/public`: static HTML, CSS, LESS, JavaScript, and image assets.
- `test/ontrail/test`: legacy Clojure tests.
- `s3`: older related subproject with its own Clojure and frontend files.

The target architecture is:

- PostgreSQL database.
- Hanko.io authentication.
- TypeScript backend.
- Drizzle ORM for typed PostgreSQL access and migrations.
- Bun/Vite/React frontend.

## Domain Summary

OnTrail is not just a workout logger. It combines a personal sports diary with community features:

- Exercises with sport, date, duration, distance, heart rate, title, body, tags, and sport-specific details.
- Comments and lightweight reactions on exercises.
- Unread comment tracking.
- User profiles and avatars.
- Groups and group-specific challenges.
- Favourites/following.
- Search.
- Weekly, monthly, yearly, sport, and tag summaries.
- Leaderboards and record lists.
- CSV/JSON export and legacy import utilities.

Preserve these behaviors unless a migration plan explicitly removes them.

## Legacy Data Model

MongoDB database name: `ontrail`.

Collection constants are defined in `src/ontrail/mongodb.clj`:

- `onuser`
- `nccache`
- `exercise`
- `onsport`
- `groups`

Exercises currently embed comments and reactions. New PostgreSQL design should normalize those into tables while preserving legacy ids during migration.

## Working Rules

- Do not casually delete or rewrite legacy code. It is the behavior reference until migration parity is proven.
- Prefer documentation, tests, and migration adapters over broad rewrites.
- Keep migration work repeatable. One-off manual data fixes should become scripts or documented SQL.
- Preserve existing user data, usernames, exercise history, comments, groups, and summaries.
- Keep units explicit. Legacy code stores durations, distances, pace, and dates in app-specific formats; verify before changing.
- Treat `nobody` as the legacy anonymous viewer concept.
- Keep Finnish sport names and existing public-facing terminology unless product direction changes.
- Always add or update tests when fixing a bug or implementing a new feature. If a meaningful automated test is not feasible, document why and cover the behavior with the closest practical verification.

## Suggested New Layout

When adding the modern implementation, prefer this structure unless there is a better repo-local reason:

```text
apps/
  api/
  web/
packages/
  auth/
  db/
  domain/
  api-contracts/
migrations/
scripts/
  migrate/
docs/
```

## Backend Guidance

For TypeScript backend work:

- Keep HTTP handlers thin.
- Put business rules in domain packages.
- Use Drizzle ORM for schema definitions, typed queries, and migrations unless the plan is explicitly changed.
- Use PostgreSQL transactions for multi-row writes such as exercise creation with details or comment state updates.
- Verify Hanko identity in middleware and pass a typed current user through request context.
- Add tests for permissions, parsing, summary calculations, and migration-sensitive behavior.
- Use stable API response contracts; document changes in `docs/api` or OpenAPI when introduced.
- Do not add Docker as a project dependency or operational requirement.

## Frontend Guidance

For React frontend work:

- Build the actual diary application as the first screen, not a landing page.
- Optimize for repeated use: fast logging, scannable feed, clear summaries, and low-friction commenting.
- Use responsive layouts that work on mobile and desktop.
- Keep forms accessible with labels, errors, focus states, and keyboard support.
- Prefer typed API clients and small focused components.
- Do not bring old jQuery patterns into the new React app.

## Verification

Use the most relevant checks for the files touched:

- Legacy Clojure: `lein test`
- TypeScript backend: `bun test`, `bun run lint`, `bun run typecheck`, `bun run build`
- React frontend: `bun test`, `bun run lint`, `bun run build`
- End-to-end frontend checks: Playwright once the new app exists

Bug fixes and new features should include focused tests that would fail before the change and pass after it.

If a command cannot run because dependencies or services are missing, document the blocker in the final response.

## Documentation

Keep these files current:

- `README.md`: project overview and migration direction.
- `TODO.md`: phased modernization checklist.
- `AGENTS.md`: instructions for future coding agents.

Update docs when architecture, commands, setup, or migration decisions change.
