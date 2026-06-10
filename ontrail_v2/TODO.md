# OnTrail Modernization TODO

This checklist tracks the migration from the legacy Clojure/Mongo/static frontend application to
PostgreSQL, Hanko authentication, TypeScript API, and Bun/Vite/React frontend.

## Implementation status

### Done ✅

**Infrastructure & backend**
- Docker Compose infra: PostgreSQL, Hanko, MailSlurper
- Bun TypeScript HTTP API (no framework, biome lint)
- Raw SQL migration runner
- Schema: `sports`, `users`, `exercises`, `comments`, `cares`, `groups`, `group_members`, `user_visit`
- Schema extras: `search_vec` FTS column, `legacy_object_id`, `pace` generated column, HR profile fields
- DB views: `v_sport_totals`, `v_year_totals`, `v_month_totals`, `v_week_totals`, `v_week_totals`,
  `v_personal_records`, `v_athlete_profile`, `v_leaderboard_month`, `v_leaderboard_year`,
  `v_unread_comments`, `v_tag_usage`, `v_exercise_feed`
- Hanko JWT verification, auto-provision users on first login
- All CRUD: exercises, comments, cares (toggle), groups (join/leave/create)
- Feed with sport/user/tag/group/range/date/sort filters and pagination
- Summary endpoints: all-time, by year, by month, by week, tag summaries
- Personal records endpoint (`v_personal_records`)
- Athlete profile endpoint (`v_athlete_profile`)
- Leaderboards (month/year)
- Unread tracking + mark-all-read
- User list/search, public profile
- Export: JSON, CSV
- SSE live feed
- FTS search
- Legacy permalink resolution (`/api/legacy/ex/:objectId`, `/api/legacy/user/:username`)
- Sports seeded from FE constants on startup
- Group member list endpoint

**Frontend**
- Hanko login page, auth flow
- Feed page with virtualised infinite scroll, filter panel (group/distance/duration/HR/date/sort)
- Exercise log (create/edit) with GPX upload, sport picker, rich-text editor
- Exercise detail page with map, comments, cares
- Analytics page with year/month/week scope, period picker, trend chart, heatmap, sport breakdown
- Calendar page: infinite scroll newest-first, year selector, week totals, sport chips with distance
- Diary page (own + other users)
- Profile page (edit name/synopsis/HR profile, JSON export)
- Groups page (list, join/leave/create, group → feed link)
- Athlete page (`/user/:username`): workouts / sport summary / tag summary tabs
- Top lists page (`/toplists`): monthly/yearly leaderboard
- Search page
- Shared Intl-based formatters: `fmtDist`, `fmtDur`, `fmtPaceSport`, `fmtSpeed`, `fmtInt`, etc.
- Responsive layout, dark-mode support, Finnish + English i18n

### To do 🔲

**High priority (user-visible features)**
- [ ] Personal records UI — backend exists (`/api/users/:username/records`), no display yet
- [ ] XLSX export — user requested alongside CSV/JSON
- [x] Weekly summary widget in feed right rail
- [x] CSV export via ProfilePage
- [ ] HR zone analysis in analytics page (data is available via athlete profile + exercises)
- [ ] Tag autocomplete in LogPage (API: `/api/users/:username/tags`)
- [ ] Nightly Lighthouse performance reports against the live environment after release

**Medium priority**
- [ ] Profile page: show groups the user belongs to
- [ ] Athlete page: show personal records card
- [ ] Feed: user filter dropdown in filter panel (currently free text)
- [ ] Exercise card: show group membership badge when not in group-filtered feed
- [ ] Pagination on DiaryPage: accumulate pages (currently replaces, loses earlier results)
- [ ] Exercise detail: show tags as clickable feed links
- [ ] BottomNav: replace groups tab with top-lists tab (groups accessible via sidebar)
- [ ] Sport filter chips in DiaryPage should pull from actual sports in user's history

**Data migration (Mongo → Postgres)**
- [ ] Scripts to load mongodump into staging JSONB tables
- [ ] User normalization (username→id map, orphan aliases)
- [ ] Exercise normalization (duration ÷100→seconds, sport mapping, date clamping)
- [ ] Comment + care normalization from embedded arrays
- [ ] Group normalization
- [ ] Hanko account linking for migrated users
- [ ] Acceptance test: spot totals match legacy output

**Testing**
- [ ] API unit tests: duration/distance parsing, GPX normalization, permission helpers
- [ ] Repository integration tests: migrations against disposable Postgres
- [ ] API integration tests: signed test JWTs, assert 401/403/200 paths
- [ ] Playwright e2e: login → log exercise → comment → summary

**Operations**
- [ ] Caddy config (HTTPS, static SPA, reverse-proxy)
- [ ] systemd service files
- [ ] `pg_dump` → encrypted backup script
- [ ] GitHub Actions CI: build + test + rsync/restart
- [ ] Security audit: scan git history, rotate any leaked keys

## Dropped / out of scope

- WebSocket chat, in-memory message ring (→ SSE notifications only)
- Keen.io analytics widgets
- Bespoke challenges (Marrasputki, lvhaaste2015, etc.)
- Avatar upload / S3 image gallery
- "Suosikit" favourites
- Feed table/list view (cards only)
- `heiaimport` / `treenitimport` legacy import scripts
- Events view (`Tapahtuma` is just an ordinary exercise sport)
