# OnTrail Modernization TODO

This checklist tracks the migration from the legacy Clojure/Mongo/static frontend application to PostgreSQL, Hanko authentication, TypeScript API, Drizzle ORM, and Bun/Vite/React frontend.

## 1. Discovery and Baseline

- [ ] Run the existing Clojure test suite and document failures.
- [ ] Document how to start the legacy app locally, including MongoDB setup and required properties.
- [ ] Inventory every current route in `src/ontrail/core.clj`, `src/ontrail/v2routes.clj`, page templates, and static frontend calls.
- [ ] Inventory Mongo collections and actual document shapes from a representative database dump.
- [ ] Identify production-only integrations: email, analytics, Bugsnag, Keen, imports, file uploads, and websocket behavior.
- [ ] Capture screenshots of the main legacy workflows for parity reference.
- [ ] Define what data is public, private, authenticated-only, and owner-only.
- [ ] Decide whether legacy public URLs must be preserved exactly or redirected.

## 2. Product and Design Definition

- [ ] Define core navigation: latest, my diary, add exercise, comments, groups, leaderboards, profile.
- [ ] Define responsive layouts for desktop and mobile.
- [ ] Design the exercise feed with filtering, pagination or infinite loading, unread indicators, and empty states.
- [ ] Design the exercise editor for fast training entry.
- [ ] Design summaries for year, month, week, sport, and tag views.
- [ ] Design group and leaderboard pages.
- [ ] Design profile/account settings integrated with Hanko.
- [ ] Define visual system: typography, spacing, color, buttons, forms, tables, charts, and icon usage.
- [ ] Define accessibility requirements for keyboard use, contrast, form labels, and focus states.

## 3. Data Model and PostgreSQL

- [ ] Confirm Drizzle ORM as the PostgreSQL access and migration tool.
- [ ] Create initial Drizzle schema and PostgreSQL migrations.
- [ ] Add `users` table with Hanko subject, username, normalized username, email snapshot, profile fields, avatar settings, and legacy id.
- [ ] Add `sports` table for sport metadata.
- [ ] Add `exercises` table with canonical units for duration, distance, pace, heart rate, dates, title, body, markdown body, and tags.
- [ ] Add `exercise_details` table or JSONB column for sport-specific numeric details.
- [ ] Add `comments` table with legacy ids.
- [ ] Add `cares` table for reactions.
- [ ] Add `groups` and `group_members` tables.
- [ ] Add `favourites` table.
- [ ] Add `unread_comments` or equivalent event/read model.
- [ ] Add indexes for feed queries, user diary queries, sport filters, date filters, summaries, comments, and username lookup.
- [ ] Decide whether search uses PostgreSQL full-text search first or an external search service later.
- [ ] Add seed data for local development.

## 4. Data Migration

- [ ] Write a Mongo export script for `onuser`, `exercise`, `onsport`, `groups`, and `nccache`.
- [ ] Write a shape validation report that flags missing, unexpected, or malformed fields.
- [ ] Map Mongo `_id` values to PostgreSQL UUIDs and preserve `legacy_id`.
- [ ] Migrate users and profiles.
- [ ] Migrate exercises, preserving dates, duration, distance, tags, markdown/body content, sport names, average heart rate, pace, and details.
- [ ] Migrate embedded comments into the `comments` table.
- [ ] Migrate cares/reactions.
- [ ] Migrate groups and memberships.
- [ ] Migrate favourites if the legacy data source is confirmed.
- [ ] Migrate unread comment state or define an acceptable reset strategy.
- [ ] Validate row counts against Mongo counts.
- [ ] Validate summary totals for sample users and years against the legacy app.
- [ ] Validate selected exercise detail pages against the legacy app.
- [ ] Make migration repeatable and idempotent for test runs.

## 5. Hanko Authentication

- [ ] Create Hanko project configuration for local, staging, and production.
- [ ] Add frontend Hanko elements or SDK integration.
- [ ] Add TypeScript API middleware that verifies Hanko JWT/session identity.
- [ ] Implement user provisioning on first authenticated request.
- [ ] Implement account linking for migrated users by email and/or controlled invite flow.
- [ ] Preserve username uniqueness and normalized username lookup.
- [ ] Define anonymous access behavior for public feed, public profiles, summaries, and hidden content.
- [ ] Remove legacy password authentication from the new API.
- [ ] Document operational steps for Hanko environment variables and callback URLs.

## 6. TypeScript Backend

- [ ] Create TypeScript API app structure.
- [ ] Choose the API runtime/framework, favoring a small Bun-compatible stack.
- [ ] Add configuration loading for environment variables.
- [ ] Add structured logging.
- [ ] Add PostgreSQL connection management and health checks.
- [ ] Add Drizzle migration commands for local, staging, and production.
- [ ] Add Drizzle query modules for users, exercises, comments, groups, summaries, and search.
- [ ] Add auth middleware and current-user context.
- [ ] Implement exercise create, read, update, delete.
- [ ] Implement exercise list with filters matching legacy behavior where needed.
- [ ] Implement comments and comment deletion permissions.
- [ ] Implement cares/reactions.
- [ ] Implement user profile read/update.
- [ ] Implement summaries by year, month, week, sport, and tags.
- [ ] Implement leaderboards and record lists.
- [ ] Implement groups list, detail, join, leave, and own groups.
- [ ] Implement unread comments.
- [ ] Implement search.
- [ ] Implement CSV/JSON export.
- [ ] Implement import endpoints or offline import tools.
- [ ] Implement realtime updates with WebSockets or server-sent events.
- [ ] Add OpenAPI documentation or checked API contract tests.

## 7. React Frontend

- [ ] Create Bun/Vite/React app.
- [ ] Add TypeScript.
- [ ] Add routing.
- [ ] Add API client with typed request/response models.
- [ ] Add Hanko login and session handling.
- [ ] Build app shell and navigation.
- [ ] Build latest feed.
- [ ] Build exercise detail page.
- [ ] Build exercise editor and validation.
- [ ] Build comment and reaction UI.
- [ ] Build my diary view.
- [ ] Build profile page.
- [ ] Build summary dashboards and charts.
- [ ] Build groups pages.
- [ ] Build leaderboards and record lists.
- [ ] Build search.
- [ ] Build import/export UI where appropriate.
- [ ] Add loading, error, empty, and permission states.
- [ ] Add responsive layout checks for phone, tablet, and desktop.
- [ ] Add accessibility pass for forms, navigation, and dialogs.

## 8. Testing

- [ ] Add TypeScript unit tests for parsing, formatting, pace, summaries, permissions, and filters.
- [ ] Add TypeScript integration tests with PostgreSQL.
- [ ] Add migration tests using sample Mongo fixtures.
- [ ] Add API contract tests.
- [ ] Add React component tests for critical forms and data states.
- [ ] Add Playwright end-to-end tests for login, create exercise, edit exercise, comment, group join, and summaries.
- [ ] Add visual regression snapshots for main screens if practical.
- [ ] Compare old and new summary outputs for a representative migrated dataset.

## 9. Operations

- [ ] Choose deployment target.
- [ ] Add non-Docker deployment build scripts for the TypeScript API.
- [ ] Add frontend production build pipeline.
- [ ] Add PostgreSQL backup and restore documentation.
- [ ] Add migration rollback strategy.
- [ ] Add logging, metrics, and error reporting.
- [ ] Add staging environment.
- [ ] Add production cutover checklist.
- [ ] Add post-cutover monitoring checklist.

## 10. Cutover

- [ ] Freeze legacy writes or implement a final delta migration.
- [ ] Run final Mongo export.
- [ ] Run PostgreSQL import.
- [ ] Run validation reports.
- [ ] Smoke test critical workflows in staging.
- [ ] Switch traffic to the new frontend and API.
- [ ] Keep legacy app read-only until confidence window ends.
- [ ] Archive legacy credentials and document final state.

## Open Decisions

- [ ] Exact Hanko account linking strategy for existing users.
- [ ] Whether comments and unread state must migrate perfectly or can be recalculated/reset.
- [ ] Whether search starts with PostgreSQL full-text search.
- [ ] Whether realtime updates are required for launch.
- [ ] Whether legacy mobile/static pages are retired immediately or redirected gradually.
- [ ] Whether old `/rest/v1` endpoints are supported by adapters during transition.
