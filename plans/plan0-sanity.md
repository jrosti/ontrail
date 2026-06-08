# plan0-sanity — code-vs-plan sanity pass

Companion to `highlevel-plan.md`. Goes through the **actual** legacy code endpoint by
endpoint and checks the rewrite's central bet: **Postgres holds the data + does the
aggregation, the TS backend stays thin (query + authz + serialize raw values), and all
presentation/formatting moves to the SPA.** Then it verifies the claim that search/stats
are Mongo-workaround precompute, and ends with the feature decisions I need from you.

Source of truth for the legacy API is the inline `v1routes` in `src/ontrail/core.clj`.

---

## 0. Where logic lives today, and where it goes

The legacy backend mixes four kinds of logic in every read endpoint. The rewrite splits them:

| Kind of logic | Example in legacy code | Destination |
|---|---|---|
| **Query / filter / aggregate** | `mongerfilter`, `summary`/`stats` `db.group` JS, `weekly` interval loops | **Postgres SQL** (WHERE builder, `GROUP BY`, window fns, FTS) |
| **Presentation / humanizing** | `formats.clj`, `nlp/get-verb`, week-day names, Finnish strings | **SPA** (shared TS formatters) |
| **Auth / visibility** | `auth`, `:hiding` rule, ownership checks, `is-own?` | **Backend** — the one small audited module |
| **Cache / precompute** | `summary-memos`, `nccache`, search inverted-index, keen/favourite memos | **Deleted** — recomputed live in SQL |

**Canonical units** (keep these as integer columns; format only in the SPA):
`duration` = centiseconds (1 min = 6000), `distance` = meters, `avghr` = bpm,
`pace` = `round(distance/duration*360000)`, `detail*` = small non-negative ints.

**Core entities** (from `as-ex-result` / `from-user-ex` / `mongerfilter`):
- `exercise(user, sport, title, body, mdbody, creation_date, last_modified_date, duration,
  distance, avghr, pace, tags[], detail_* …)`
- embedded `comments[]` → child table `comment(exercise_id, user, body, created)`
- embedded `cares[]` (a set) → child table `care(exercise_id, user)` (unique pair)
- `onuser(username, lusername, password_hash, email, gravatar, profile{resthr,maxhr,goals,synopsis,aerk,anaerk})`
- `groups(name, lname, description, users[])` → `group` + `group_member` join table
- **drop**: `nccache` (derived), and `onsport` appears unused (sports come from `nlp/verb-map`).

---

## 1. Endpoint-by-endpoint

Legend — **Q** = becomes a SQL query, **F** = formatting moves to SPA, **A** = authz stays in
backend, **DROP** = backing cache/precompute deleted (behavior recomputed in SQL).

### Feed / exercise read

| Endpoint | Legacy impl | Rewrite |
|---|---|---|
| `GET /ex/:id` | `exercise/get-ex` find-one + `as-ex-result` decorate + reset unread | **Q** select join comments/cares. **F** all of `as-ex-result` (human date/distance/time, `get-pace`, `get-verb`, hrReserve, bpmdist) moves to SPA. **A** `visibility`/`:hiding`. **DROP** `newcount-reset`. |
| `GET /ex-list-all/:page` | `get-latest-ex-list-default-order`, sort `lastModifiedDate`, 20/pg | **Q** `ORDER BY last_modified DESC LIMIT/OFFSET`. **F** decorate in SPA. |
| `GET /ex-list-filter` | `mongerfilter/make-query-from` → Mongo `$and`; `sortby` | **Q** the whole `mongerfilter` becomes a small allow-listed WHERE/ORDER builder (sport/tags/user eq, `lte/gte/lt/gt` on pace/distance/duration/avghr/elevation, date ranges, group membership, favourites). Pagination = LIMIT/OFFSET. |

### Create / update / social write (`mutate.clj`)

| Endpoint | Legacy impl | Rewrite |
|---|---|---|
| `POST /ex/:user` | `create-ex`: parse → insert → index → reset memo → ws | **Q** INSERT. **A** caller==user. **F** parsing (`parse-duration/-distance/-date/-tags`, `calc-pace`) ideally done in SPA, backend validates canonical ints. **DROP** index insert + `reset-memo-for`. Keep a websocket/event emit (see Q-decisions). |
| `POST /update/:id` | `find-and-modify {_id,user}` set | **Q** UPDATE … WHERE id AND user. **A** ownership in the WHERE. |
| `DELETE /ex/:ex-id` | check owner, remove | **Q+A** DELETE WHERE id AND user. |
| `POST /ex/:id/comment` | `$push` embedded comment + bump `lastModified` | **Q** INSERT into comment. **DROP** `newcount-comment-ex` fan-out + in-mem index. |
| `POST /ex/:id/care` | `$addToSet` cares | **Q** INSERT … ON CONFLICT DO NOTHING (unique). |
| `DELETE …/comment/:cid` (own × 2) | pull by comment+user / by ex-owner | **Q+A** DELETE with ownership predicate. |

### Summaries & stats — **all `db.group` + memoized** (see §2)

| Endpoint | Legacy impl | Rewrite |
|---|---|---|
| `GET /summary/:user[/:year[/bymonth\|by/week]]` | `sportsummary` per-sport `get-summary` (server JS reduce) + `summary-memos` ref + combined-sport buckets (`Byfoot/Bywheel/Hiihtolajit/Soudut`) + `YHTEENSÄ` total | **Q** `SELECT sport, sum(...) … GROUP BY sport` with date predicate; combined buckets via `CASE`/grouping sets; total via `GROUPING SETS`/rollup excluding `Sairaus/Hieronta/Tapahtuma`. **F** humanize. **DROP** all memoization. |
| `GET /summary-tags/:user…` | same machinery keyed on `tags` | **Q** `unnest(tags) GROUP BY tag`. |
| `GET /summary/:user/:year/by/week` + `/weekly-list/:user/:year/:month` | `weekly` builds week intervals in Clojure, queries per range, accumulates per sport, day names | **Q** `date_trunc('week')` + `GROUP BY week, sport`; day buckets via `generate_series`. **F** day names, week labels, `statspace/statsduration` in SPA. |
| `GET /page-detail?action=…` (sport stats) | `stats/sport-detail`: `db.group` JS builds a **pace histogram**; running percentiles f80/f95 | **Q** histogram via `width_bucket`, percentiles via `percentile_cont(0.8/0.95)`. **F** `pacetominkm`. |
| `GET /tops/totals/:year`, `/tops/totals/:sport/:year` | `races`: per-user `get-year-summary-sport` over **all users**, ttl-memoized, ranked | **Q** single `GROUP BY user … ORDER BY` + `rank() OVER`. **DROP** users-memo. (Legacy year is hardcoded `2018` in the JS client — confirm intended.) |

### Search — **in-memory inverted index** (see §2)

| Endpoint | Legacy impl | Rewrite |
|---|---|---|
| `GET /search?q=&page=` | `search.clj`: inverted index (ref) + timestamps (atom), Finnish stemmer, stopwords, 120s memo, no delete handling | **Q** `tsvector` column with `finnish` config + GIN index; `to_tsquery`; `ORDER BY last_modified`. Indexes body+title+tags+sport+comments+`u:`/`c:` user tokens — replicate with a generated tsvector over those columns. **F** `format-summary` Finnish string. **DROP** the whole in-mem index + rebuild-at-boot. |

### Unread / activity — **`nccache`** (see §2)

| Endpoint | Legacy impl | Rewrite |
|---|---|---|
| `GET /ex-unread-comments`, `/ex-unread-own-comments`, `/ex-unread-count/:type`, `/mark-all-read` | `newcomment`+`unread`: per-user comment-count cache (Mongo `nccache` + Clojure refs), `lastvisit` tracking, fan-out on every comment | **Q** model a `last_visit(user)` + `comment.created`; "unread" = comments newer than last visit on exercises the user authored/commented. Plain SQL, **no fan-out, no cache**. |
| `GET /ex-most-comments` | `unread/most-comments`: Mongo `aggregate` `$unwind`/`$group` last 14 days | **Q** `GROUP BY exercise_id ORDER BY count(*) DESC` with date filter. |
| `GET /logged-ins`, `/rest/v1/system` | `loggedin`: active users (last-visit window) + `system/stats` (heap/uptime) | **Q** active users from `last_visit`. System heap/uptime → trivial Node equivalent or drop. |

### Profiles, users, groups

| Endpoint | Legacy impl | Rewrite |
|---|---|---|
| `GET /profile/:user` → `group/user-detail` | profile + **records** (PB table: 800m…24h, `get-record` per row, sorted by pace) | **Q** records = N parametric `ORDER BY pace LIMIT 1` queries (or one lateral). **F** humanize. |
| `POST /profile` | `post-profile` set profile subdoc | **Q+A** UPDATE; parse hr ints. |
| `GET /list-users/:page`, `/find-users/:term/:page` | paginated, prefix match on `lusername` | **Q** `WHERE lusername LIKE 'term%'`. |
| `GET /own-groups`, `/groups/:page`, `POST /groups/:name/join\|part` | `group`: membership in `users[]` array | **Q** `group_member` join; join/part = INSERT/DELETE. **A** auth on write. |
| `GET /page-detail action=group` | `group-detail` + `fetch-group-stats` → bespoke **challenges** (Marrasputki / lvhaaste2015 / Huippuhuhtikuu) + `Suosikit` (favourites) | See Q-decisions — these are hardcoded, dated, per-group features. |

### Auth & accounts

| Endpoint | Legacy impl | Rewrite |
|---|---|---|
| `POST /rest/v1/login`, `POST /rest/v2/login`, `/logout` | scrypt verify → AES-encrypted cookie token (`authToken`=`user|hashpart`) | Replace with **Hanko**-issued JWT (plan); keep scrypt-bridge for migration. **A** the audited module. |
| `POST /register`, `/change-password` | create/update onuser, email on register | **Q+A** INSERT/UPDATE; email via background job. |
| `GET /validate/{time,distance,username}`, `POST /validate/login` | server-side parse/availability checks | `time/distance` validation moves to SPA (shared parser); `username` availability stays **Q** (DB lookup); `login` validation stays **A**. |

### Export & external

| Endpoint | Legacy impl | Rewrite |
|---|---|---|
| `GET /export.csv`, `/export.json`, `/raw/:user` | `csv.clj`: server builds CSV incl. humanized columns | **Q** select rows; **F** CSV assembly + humanized columns can be SPA or a thin backend serializer. |
| `GET /keen/most-read`, `/keen/count/:id` | Keen.io HTTP for pageview counts, ttl-memoized; powers feed widgets | See Q-decisions (external analytics dep). |
| `GET /rest/v1/async` (websocket) | `lamina` broadcast channel + 500-msg in-mem ring + chat + ping/`/who` | See Q-decisions (realtime). |

---

## 2. Are search & stats really Mongo-workaround precompute? — **Yes, confirmed.**

Concrete evidence in the code:

1. **Summaries (`summary.clj` + `sportsummary.clj`)** run server-side **JavaScript** through
   Mongo's `db.group` (`:$reduce "function(exercise, prev){…}"`) because old Mongo couldn't do
   this in the query layer. The results are then **memoized in a Clojure `ref`**
   (`summary-memos`), and **every write** calls `reset-memo-for` which **asynchronously
   recomputes** a user's overall/yearly/monthly summaries (`memoizes-after-reset`). That is a
   hand-rolled materialized-view-with-invalidation. → In Postgres this is a plain
   `GROUP BY` (live, or a materialized view if row counts ever demand it). The memo layer
   **disappears**.

2. **Stats (`stats.clj`)** likewise uses a `db.group` JS reduce to build a **pace histogram**
   bucket-by-bucket and compute f80/f95 **percentiles** in app code. → `width_bucket` +
   `percentile_cont`. Native SQL.

3. **Search (`search.clj`)** is an **in-memory inverted index** (`inverted-index` ref +
   `timestamps` atom), tokenized with a bundled Java **Snowball Finnish stemmer**, **rebuilt at
   every startup** (`rebuild-index!` in `-main`), incrementally updated on write, with a 120s
   memoized intersect-sort — and it **explicitly does not handle deletes/destructive edits**
   (documented in its own header). This is a classic workaround for Mongo's weak text search of
   that era. → Postgres FTS (`finnish` snowball config + GIN), correct on update/delete, no boot
   cost, no stale index.

4. **Other caches that vanish the same way:** `nccache`/`newcomment` (per-user unread-comment
   counters fanned out to every user on each comment), `races/users-memo`,
   `favourite/*-memo`, `keen` ttl agents. All are precompute/caching the plan says to **drop and
   recompute in SQL** — and the code confirms they exist only because the data engine couldn't.

**Conclusion:** the plan's "the old precompute/cache jobs were Mongo workarounds — don't port
them" is accurate. The only non-obvious nuance: the **derived numbers must still match** (pace
encoding, the combined-sport buckets, the `YHTEENSÄ` exclusions, the pace-histogram percentile
method). Those are *formulas*, not caches — port the formulas, drop the machinery.

---

## 3. Feature decisions needed from you

Everything above is mechanical except a handful of **product-scope** calls that change what the
new system must contain. These aren't answerable from the code. Captured here; the high-leverage
four are asked interactively (answers recorded below once given).

**Asked now:**
1. **Realtime chat + activity feed** (`websocket.clj`) — keep websockets, downgrade to polling, or drop?
2. **Pageview "most-read" analytics** (Keen.io) — self-host view-counting in Postgres, or drop the widgets?
3. **Bespoke dated challenges** (`Marrasputki`, `lvhaaste2015`, `Huippuhuhtikuu`) — generic challenge feature, port as-is, or drop?
4. **Avatars** — keep Gravatar, or switch to uploaded avatars via the existing S3 image service?

**Lower-priority open questions (default = keep at parity unless you say otherwise):**
- Imports (`heiaimport`, `treenitimport`) — port, or one-time-only at migration? (plan asks who owns worker jobs)
- The S3 image/blog service (`blog.ontrail.net`, `s3list`) — fold into the new backend or leave standalone?
- Markdown vs the Froala HTML editor for exercise bodies (`mdbody` vs `body`).
- "Suosikit" auto-derived favourites group and the PB **records** table — keep both?
- CSV/JSON export — parity required, or drop `raw`/`export-all` variants?
- `:hiding` visibility rule — is it actively used, or can the privacy model be simplified?

### Decisions (2026-06-09)

1. **Realtime → polling feed only.** Drop the websocket chat and the in-memory message ring
   entirely. The activity feed becomes a normal endpoint the SPA polls periodically. No
   persistent-connection path in the new backend. → removes `websocket.clj`, `lamina`/`aleph`
   async, `/rest/v1/async`, and the chat/`/who`/ping machinery.
2. **View counts → drop the widgets.** No Keen.io, no pageview tracking, no `most-read`. →
   removes `keen.clj`, `keen-routes`, the `mostRead`/`mostRead14`/`mostCared14` feed widgets,
   and the `clj-http` analytics dependency. No tracking surface to build.
3. **Challenges → drop them.** Do not port Marrasputki / lvhaaste2015 / Huippuhuhtikuu. The
   underlying exercises remain as normal data. → removes `fetch-group-stats` and all bespoke
   challenge code in `group.clj`; `group-detail` simplifies to description + member list
   (+ `Suosikit` favourites, pending the lower-priority question).
4. **Avatars → keep Gravatar.** Derive from email md5 as today; no avatar upload, no S3
   dependency for this. (Independent of the separate decision on the S3 blog/image service.)

**Net effect on scope:** these four cut three whole subsystems (websocket/chat, Keen analytics,
challenges) and avoid building avatar upload. The thin-backend + Postgres-aggregation core from
§1–§2 is unaffected. Lower-priority open questions above remain at "keep at parity" until decided.

---

## 4. UI feature inventory & decisions (`resources/public/index.html`)

Mapped from the nav menus + ~50 client-side templates. The new SPA is a rewrite, so this is the
target feature set, not the markup.

### Keep — core diary (no decision needed)
Latest feed (Uusimmat) · view/add/edit/delete exercise · comments · cares/likes · login ·
register · forgot-password (mailto) · profile edit + change password · own exercises ·
sport summary (Lajit) · weekly training (Harjoitusviikot) · text search · find users ·
groups + join/part · advanced filter (sport/distance/pace/hr/date/sort) · unread
"Kommentit"/"Seuratut" counts + mark-all-read · **detail inputs** (Toistot/reps,
Volyymi/kg, Nousumetrit/elevation in the collapsible "Yksityiskohdat" panel) · delete-confirm
modals · date pickers · user/sport/tag multiselects · **other-user profile card** (HR profile,
goals, groups, records via card-reveal) · **infinite scroll** on feeds.

### Decisions (2026-06-09)

| Feature | Decision | Notes |
|---|---|---|
| **Leaderboards** (top-listat I & II — ~10 categories — + most-cared-14) | **Keep all** | One SQL `GROUP BY user … rank()` per category; most-cared-14 survives because cares are kept (the Keen-based most-read does not). |
| **Per-user image gallery** ("Talletetut kuvat", S3) | **Drop** | Removes the standalone S3 image-service dependency entirely. (Resolves the lower-priority "S3 service" open question: gone.) |
| **Charts / graphs** (weekly bars, training graphs, pace f80/f95 percentiles) | **Keep** | Same SQL aggregates; charting lib in the SPA. |
| **Personal records / PB table** (800m…24h, Cooper, etc.) | **Keep** | Each row = best pace over a distance/duration; N parametric SQL queries. (Resolves that lower-priority question.) |
| **Events view** (Katso tapahtumia / `Tapahtuma` sport) | **Drop** | No dedicated events board; any such entries are ordinary exercises. |
| **Tag summaries** (Avainsanat) | **Keep** | `unnest(tags) GROUP BY tag`. Tagging + tag-filter kept regardless. |
| **Exercise body editor** | **Rich-text (HTML)** | Keep WYSIWYG→HTML as today; **must sanitize** server-side on the new backend. The legacy `mdbody` Markdown field can be dropped. (Resolves the Markdown-vs-Froala question.) |
| **"Suosikit" favourites** (auto-group from comment activity + feed filter) | **Drop** | Removes `favourite.clj` and the fav feed-filter; explicit groups remain for filtering. |
| **Feed display modes** (card feed + compact sortable table, Tiivistelmä/Lista toggle) | **Cards only** | Drop the `tableview` table; one rendering path (cards). Infinite scroll kept. |
| **Summary granularity** (All/Year/Month/Week + Mon–Sun calendar-grid month view w/ per-day sport icons) | **Keep all + calendar grid** | All four breakdowns + the icon calendar. Leans hard on §1 weekly/`date_trunc` SQL; richest UI piece. |
| **Derived per-exercise metrics** (Syke-% HR-reserve, Etenemä/`bpmdist` m-per-beat) | **Keep both** | Computed in the SPA from `avghr` + profile `resthr/maxhr`; no storage. Profile HR fields stay required-ish. |
| **Data export** (full JSON dump + per-year CSV) | **Keep both** | Thin serializers; supports data ownership. `export-raw`/`export-all` variants fold into these. |
| **Inline images in entries** (Lisää kuva upload + images embedded in body) | **Drop entirely** | No upload anywhere; removes the S3 image service completely. ⚠️ **Migration risk:** old entry bodies contain `<img>` tags pointing at `blog.ontrail.net` — those URLs will break unless the images are rehosted or the tags stripped. Decide at migration (see plan1). |
| **Per-sport icons** (sprite glyph per sport, used in calendar grid + tooltips) | **Keep** | Recreate the sport-icon set; needed for the calendar-grid view above. |

**Further scope removed:** image gallery (+S3 service) and favourites. **Confirmed kept beyond
core:** all leaderboards, charts, PB records, tag summaries — these depend on the §1–§2
SQL-aggregation work, so that work is firmly in scope.

**Imports → drop.** Do not port `heiaimport` / `treenitimport`. They were one-off ingestion
paths from the Heia and Treeniti services; the resulting exercises already live in the data and
migrate with it. → removes both modules, the `lein import` alias, and any phone-sync/import
worker from the new backend's scope.

**Subsystems fully removed by the §3–§4 decisions:** websocket/chat, Keen analytics,
challenges, S3 image service (gallery **and** inline entry images), favourites, imports, the
table/`tableview` rendering. **Confirmed in scope beyond core:** leaderboards, charts, PB
records, tag summaries, the full summary-granularity set + calendar-grid view (with sport
icons), derived HR metrics, and JSON/CSV export.

**Carried into plan1 (migration):**
- ⚠️ Embedded `<img src="blog.ontrail.net/…">` in historical entry bodies — rehost vs strip vs leave-broken.
- Rich-text HTML bodies must be **sanitized** on write in the new backend.
- Whether the `:hiding` visibility rule is still populated (else simplify the privacy model) — checkable from data, not a user decision.
