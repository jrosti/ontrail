# OnTrail Modernization TODO

This checklist tracks the migration from the legacy Clojure/Mongo/static frontend application to
PostgreSQL, Hanko authentication, TypeScript API, and Bun/Vite/React frontend.

See `plans/` for detailed design decisions:
- `plans/highlevel-plan.md` — stack, hosting, security, migration strategy
- `plans/plan0-sanity.md` — legacy endpoint inventory, feature decisions (what's kept/dropped)
- `plans/plan1-thin-backend.md` — data contract, formatting → FE, shared formatter module
- `plans/plan2-migration.md` — Mongo→Postgres field-by-field conversion, all Q1–Q12 decided
- `plans/plan3-tech-stack.md` — frontend stack decisions (React, Vite, TanStack Query, TipTap, SVG charts)
- `plans/plan4-exercise-data-audit.md` — live data audit: 374,182 exercises, real field shapes
- `plans/units.md` — canonical stored units reference

## Implementation status

### Done

- [x] Docker Compose infra: PostgreSQL 18, Hanko (port 8000), MailSlurper (port 8080/8085/2525)
- [x] Bun TypeScript HTTP API on port 3002 (no framework, biome lint)
- [x] Raw SQL migration runner (`src/db/migrate.ts`)
- [x] Initial schema: `sports`, `users`, `exercises`, `comments`, `cares` tables
- [x] Hanko JWT verification via JWKS (Bearer + cookie), auto-provision users on first login
- [x] `GET /api/health`, `GET /api/sports`, `GET /api/me`
- [x] Exercise CRUD: `GET/POST /api/exercises`, `GET/PATCH/PUT/DELETE /api/exercises/:id`
- [x] Comments: `POST /api/exercises/:id/comments`, `DELETE /api/exercises/:id/comments/:commentId`
- [x] Feed list with sport/user/tag filters and pagination
- [x] GPX point normalization and validation (`normalizeGpxPoints`)
- [x] Sports seeded from FE constants on startup
- [x] React frontend: Hanko login, routing, diary/feed/exercise/log pages, GPX upload, OSM map
- [x] Finnish translations for Hanko UI (corrected ä/ö)
- [x] Mongodump loaded and audited (374,182 exercises · 672 users · see plan4)
- [x] All migration decisions made (plan2 Q1–Q12, plan0 feature decisions)

### Schema gaps (need migrations)

- [ ] Add `pace` as a generated column: `round(distance_m::numeric / duration_sec * 360)` (plan2)
- [ ] Add `detail_kcal integer` column to exercises (252 legacy docs)
- [ ] Add `source text` column to exercises (965 legacy docs, "treenit.net")
- [ ] Add `user_visit` table for unread comment tracking (plan2 §2)
- [ ] Add groups schema: `groups`, `group_members` tables
- [ ] Add `favourites` table — **decided: drop** (plan0 §4)
- [ ] Add `unread_comments` tracking — use `user_visit` + comment timestamps instead
- [ ] Add FTS: `search_vec tsvector` generated column on exercises with `finnish` config + GIN index (plan2 §2)
- [ ] Add `legacy_object_id char(24)` on users and exercises for permalink resolution (plan2 §2)
- [ ] Add `resthr`, `maxhr`, `aerk`, `anaerk`, `goals` columns to users (HR profile fields)

### API endpoints still needed

- [ ] `POST /api/exercises/:id/cares` — toggle care/reaction (table exists, no route)
- [ ] `DELETE /api/exercises/:id/cares` — remove care
- [ ] `GET /api/users/:username` — public user profile
- [ ] `PATCH /api/users/me` — update own profile (display name, synopsis, HR fields)
- [ ] `GET /api/users/:username/exercises` — user diary (currently via exercises?user= filter)
- [ ] `GET /api/users/:username/summary` — yearly/sport/tag summaries (plan0 §1)
- [ ] `GET /api/users/:username/summary/:year` — year summary
- [ ] `GET /api/users/:username/summary/:year/by/month` — monthly breakdown
- [ ] `GET /api/users/:username/summary/:year/by/week` — weekly breakdown
- [ ] `GET /api/users/:username/summary/tags` — tag summary
- [ ] `GET /api/users/:username/records` — personal bests (800m…24h, Cooper — plan0 §4)
- [ ] `GET /api/leaderboards/:category` — tops/leaderboards (plan0 §4)
- [ ] `GET /api/exercises/:id/stats` — pace histogram, f80/f95 percentiles (plan0 §1)
- [ ] `GET /api/search?q=` — FTS search (plan0 §1)
- [ ] `GET /api/users` — user list / search by username prefix
- [ ] `GET /api/groups` — groups list
- [ ] `POST /api/groups` — create group
- [ ] `GET /api/groups/:name` — group detail
- [ ] `POST /api/groups/:name/join` — join group
- [ ] `POST /api/groups/:name/part` — leave group
- [ ] `GET /api/unread` — unread comment counts
- [ ] `POST /api/unread/mark-all-read` — mark all read
- [ ] `GET /api/export.json` — full JSON export (raw rows, FE assembles CSV)
- [ ] `GET /api/sse` — Server-Sent Events for live feed notifications (plan0 §3, final item)

### Data migration (Mongo → Postgres)

- [ ] Write `scripts/migrate/` tooling: load mongodump collections into staging JSONB tables
- [ ] Build username→id map with orphan aliases (`j.satta`→`jsatta`, `[deleted]` placeholder)
- [ ] Normalize `app_user` from `onuser` staging (flatten profile, keep scrypt hash)
- [ ] Normalize `exercise` from staging: duration ÷100→seconds, avghr 0→NULL, clamp dates, map sports, NULL distance for dur=0 docs
- [ ] Normalize `comment` from embedded arrays: parse date strings, assign seq
- [ ] Normalize `care` from embedded arrays
- [ ] Normalize `group` + `group_member` from `groups` staging
- [ ] Hanko account linking for migrated users (email-claim flow vs. scrypt bridge)
- [ ] Validation report: counts, spot totals, orphan reconciliation, permalink samples
- [ ] Acceptance test: primary user stats/searches match legacy output

### Frontend pages still needed

- [ ] User diary page (own + other-user exercises, filtered)
- [ ] User profile page (HR profile, synopsis, groups, records card)
- [ ] Summary/analytics page wired to real API (sport, year, month, week breakdowns)
- [ ] Weekly training view with calendar grid and sport icons (plan0 §4)
- [ ] Leaderboards page
- [ ] Groups pages (list, detail, join/part)
- [ ] Search page wired to real API
- [ ] Unread indicators on feed + "mark all read"
- [ ] Cares/reactions UI wired to API
- [ ] JSON export download

### Frontend shared formatter module (plan1 §3)

- [ ] `formatDuration(sec)` — via `Intl.DurationFormat('fi')` with fallback
- [ ] `formatDistance(m)` — via `Intl.NumberFormat('fi', {style:'unit', unit:'kilometer'})`
- [ ] `formatPace(sec, m, sport)` — picks unit from `PACE_UNIT_BY_SPORT`
- [ ] `formatDate(iso)` / `formatDateTime(iso)` — via `Intl.DateTimeFormat('fi')`
- [ ] `formatHrReserve(avghr, profile)` — via `Intl.NumberFormat('fi', {style:'percent'})`
- [ ] `formatBpmDist(ex, profile)`
- [ ] `verbFor(sport)` — Finnish past-tense verb map (from `nlp.clj`)
- [ ] `PACE_UNIT_BY_SPORT` constant
- [ ] `SPORTS` constant (canonical list from `nlp.clj`)
- [ ] CSV builder using the above
- [ ] Unit tests against legacy output samples

### Testing

- [ ] API unit tests: duration/distance parsing, GPX normalization, permission helpers, summary calculations
- [ ] Repository integration tests: run migrations against disposable PostgreSQL, verify ownership + comment visibility
- [ ] API integration tests: signed test JWTs, assert 401/403/200 paths for each authenticated route
- [ ] Playwright e2e: login, create exercise, edit exercise, comment, group join, summaries

### Operations

- [ ] Caddy config for production (HTTPS, static SPA, reverse-proxy API)
- [ ] systemd service files for API
- [ ] `pg_dump` → `age` encryption → S3 backup script
- [ ] GitHub Actions: build SPA + API → rsync/restart over SSH
- [ ] Security: scan git history (gitleaks/trufflehog), rotate any leaked keys, confirm prod not running default AES KEY/MACKEY

## Dropped / out of scope (decided 2026-06-09)

- Websocket chat and in-memory message ring (→ SSE for notifications only)
- Keen.io analytics / most-read widgets
- Bespoke challenges (Marrasputki, lvhaaste2015, Huippuhuhtikuu)
- Avatar upload / S3 image upload (keep Gravatar)
- Per-user image gallery
- "Suosikit" favourites (auto-derived group)
- Feed table/list view (cards only)
- `heiaimport` / `treenitimport` (exercises already in data)
- `mdbody` Markdown field (keep rich-text HTML body)
- Keen/most-read/most-cared-14 feed widgets
- Events view (`Tapahtuma` sport remains as ordinary exercise)
