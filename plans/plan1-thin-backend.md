# plan1 — thin backend: move all formatting to the frontend

Follows `plan0-sanity.md`. Principle: **the backend returns canonical numbers, raw timestamps,
and IDs — nothing humanized.** All format conversion (durations, distances, paces, dates,
Finnish verbs, day names, HR-derived metrics) moves to a **shared TypeScript formatter module**
on the frontend. The legacy backend interleaves data + presentation in every read path
(`as-ex-result`, `to-summary`, `simple-result`, …); the rewrite cuts the presentation half out.

What stays on the backend is only: **queries/aggregation** (SQL), **authz** (auth, ownership,
visibility), **viewer-specific data** (unread/new), and **avatar hashing** (privacy — see §4).
**Stemming is not moved to the frontend** — it is replaced by Postgres FTS (`finnish` config).

---

## 1. Canonical data contract (what the wire carries)

Integer columns, no preformatting:

| Field | Unit | Notes |
|---|---|---|
| `duration` | **centiseconds** (1 min = 6000, 1 h = 360000) | legacy `parser/to-db` encoding; keep it |
| `distance` | **meters** | |
| `avghr` | bpm (int) | |
| `pace` | `round(distance / duration * 360000)` | **sort/filter only** — a generated column. The *displayed* pace is computed by the FE from `duration`+`distance`, not from this field (matches legacy `get-pace`). |
| `detailRepeats` / `detailVolume` / `detailElevation` | int (kpl / kg / m) | |
| `creationDate` / `lastModifiedDate` / comment `date` | **ISO-8601 timestamp** | never a preformatted `dd.MM.yyyy` string |
| `tags` | `string[]` | |

Raw exercise the backend returns (illustrative): identifiers + the integers above + `user`,
`sport`, `title`, `body` (sanitized HTML), `tags[]`, `comments[]` (each: `id, user, body,
created`), `cares[]` (each: `user`, `avatarHash`), `avatarHash`, `synopsis`. Plus viewer-scoped
fields from §4. **No** `did`, `pace`, `hrReserve`, `bpmdist`, human dates/distances/times.

Summaries/stats/weekly/tops return the **numeric** members only (`nduration`, `ndistance`,
`tduration`, `tdistance`, `avghr`, `count`, `repeats`, `elevation`, histogram bins/counts,
percentile pace numbers, rank) — never the `duration`/`distance`/`pace` *strings* the legacy
code ships alongside them.

---

## 2. Backend formatting/parsing to move → frontend (the catalog)

### `formats.clj` — 100% presentation, all → FE shared formatter
| Legacy fn | Does | FE formatter |
|---|---|---|
| `to-human-time`, `minutes-part`, `seconds-part` | centiseconds → `"1 h 23 min"` / `"5 min 4 s"` | `formatDuration(cs)` |
| `to-human-distance` | meters → `"12,3 km"` / `"500 m"` (Finnish comma, trailing-zero strip) | `formatDistance(m)` |
| `to-human-pace-minkm/-500m/-100m/-kmh` | duration+distance → pace in the sport's unit | `formatPace(cs, m, sport)` |
| `pace-conversion-fun` | **sport → pace unit** (cycling/roller/kick → km/h; swim → /100m; rowing → /500m; else min/km) | a `PACE_UNIT_BY_SPORT` table in the FE |
| `get-pace` | picks unit + formats | folded into `formatPace` |
| `get-hres-percentage`, `get-heart-rate-reserve` | (avghr, resthr, maxhr) → `"73 %"` (Syke-%) | `formatHrReserve(avghr, profile)` |
| `get-bpmdist-r`, `get-bpmdist` | (avghr, resthr, duration, distance) → `"1,42 m/b"` (Etenemä) | `formatBpmDist(ex, profile)` |
| `to-human-date`, `to-form-date`, `to-human-comment-date`, `to-simple-date` | timestamp → Finnish date / `yyyy-MM-dd` / date+time | `formatDate` / `formatDateTime` (moment-fi → dayjs/Intl) |

### `parser.clj` — input parsing, → FE (backend validates ranges only)
`parse-duration` (all regex variants: `3h31`, `3.31.28`, `45 min 12 s`, …), `parse-distance`
(`5km`, `3250m`, `maraton`→42195, bare-number heuristics), `parse-date`, `parse-tags`,
`parse-natural`, `calc-pace`. → FE parses human input into the canonical ints/ISO and sends
those. Backend does cheap server-side **validation** (non-negative, sane bounds) but not
parsing. ⇒ the `/validate/time` and `/validate/distance` endpoints disappear (FE-side);
`/validate/username` stays (DB lookup), login validation stays (authz).

### `nlp.clj`
- `verb-map` / `get-verb` — sport → Finnish past-tense verb (`"juoksi"`, `did`). **Reference
  dict → FE constant.**
- `sports` (sorted keys of `verb-map`) — the canonical sport list. **Reference data** → one
  small `GET` config endpoint *or* a FE constant (decision below).
- `stem`, Snowball `finnishStemmer`, `stop-words` — **search indexing, NOT presentation.**
  → deleted; Postgres FTS `finnish` config does stemming. Stopwords become the FTS dictionary.

### `exercise.clj` — `as-ex-result` / `as-ex-result-list` / `decorate-results`
The whole decorator collapses. Per field: `distance`/`duration`/`pace`/`did`/`date`/
`creationDate`(human)/`hrReserve`/`bpmdist` → **FE**. `commentCount` → FE counts the array.
`comments`/`cares`/`tags`/`detail*`/`title`/`body`/`synopsis` → pass through.
`avatar` → §4. `isNew`/`newComments`/`new-count` → §4 (viewer data). `visibility`/`:hiding` →
**stays backend (authz)**.

### `summary.clj` / `sportsummary.clj`
- `to-summary`, `avghr`, `humanize` — drop the humanized members; SQL returns numerics. **FE**
  formats duration/distance/pace/avghr/elevation.
- `get-db-summary` JS reduce, combined buckets (`Byfoot/Bywheel/Hiihtolajit/Soudut`), `YHTEENSÄ`
  total (excl. `Sairaus/Hieronta/Tapahtuma`), distinct sports/tags — **stays backend** (it's the
  aggregation; → `GROUP BY`/grouping sets). The bucket→sport mapping stays with the query.
- `summary-memos` + `reset-memo-for` — **deleted** (live SQL).

### `stats.clj`
- `to-stats-summary`, `pacetominkm`, the formatted `f80`/`f95` strings — **FE** (return raw pace
  numbers + histogram counts/bins).
- pace-histogram + `percentile_cont` — **stays backend** (SQL). `cumul`/`get-percentiles` math →
  backend SQL; only the `min/km` string formatting moves.

### `weekly.clj`
- `simple-result`, `humanize`, `to-human-stats-duration`, `to-stats-pace`, `to-week-day`
  (Finnish day names), `dayIndex`, `sportId`, `from`/`to`/`week` labels — **FE.** (FE derives day
  name, day index, and ISO week number from the raw timestamp via dayjs.)
- week interval bucketing + per-sport accumulation — **stays backend** (→ `date_trunc('week')` +
  `GROUP BY week, sport`, `generate_series` for empty days).

### `races.clj` (leaderboards/tops)
- `totals-by` selects both numeric and humanized members — keep **numeric** + `rank`; **FE**
  formats. Ranking/sort/category-key — **stays backend** (`rank() OVER … ORDER BY`).

### `group.clj` — records (PB) + group detail
- `get-record`/`get-records` formatting (`to-human-distance`/`-time`/`get-pace`) — **FE**; backend
  returns the raw best row (distance/duration/pace numerics) per record category. The
  best-effort query — **stays backend** (SQL `ORDER BY pace LIMIT 1`).

### `csv.clj` — export
- JSON export = raw rows, trivial backend. **CSV** currently builds humanized columns
  (`distancetext`/`durationtext`/`pacetext`) server-side. To honor "formatting on the FE,"
  the formatters live in a **shared TS module importable by both** — CSV is generated by the FE
  (it has the rows + the formatters), or by a thin backend endpoint reusing that same shared
  module. Either way the conversion code exists **once**. (Decision below.)

---

## 3. The shared FE formatter module (what to build once)

A single typed module, the home for everything pulled out above:

```
formatDuration(cs)            formatDate(iso)        verbFor(sport)        // nlp verb-map
formatDistance(m)             formatDateTime(iso)    PACE_UNIT_BY_SPORT    // pace-conversion-fun
formatPace(cs, m, sport)      formatHrReserve(avghr, profile)             SPORTS               // sport list
formatHr(bpm)                 formatBpmDist(ex, profile)                  isoWeek(iso), dayName(iso)
```

Finnish locale rules to replicate exactly: comma decimal separator, trailing-zero stripping in
km, `km/h` / `m/b` / `min/km` unit strings, Finnish month/day names. Pull the day/month names and
verb map straight from `nlp.clj` + `weekly.clj` so the strings match byte-for-byte. Unit-test
the formatters against a sample of legacy outputs so nothing visibly shifts.

---

## 4. Stays on the backend (do **not** move)

- **Authz:** `authenticate`, token/JWT, ownership predicates, `visibility`/`:hiding`.
- **Aggregation/queries:** summaries, stats (incl. percentiles), weekly buckets, tops ranking,
  records, search (FTS), unread/most-comments. These are SQL, not formatting.
- **Avatar hashing — exception to "send raw":** the avatar is `gravatar(md5(email))`, and email
  is **private** (never exposed to other users). So the backend sends a precomputed `avatarHash`
  (or full Gravatar URL), *not* the email. This is a privacy-preserving derivation, not
  presentation — keep it server-side.
- **Viewer-specific data (not formatting):** prefer sending **raw timestamps** and let the FE
  decide display, but the *computation* is data: send `lastModifiedDate` (raw) + the viewer's
  `lastVisit` (raw) and let the FE derive `isNew`; send `newComments` **count** from the unread
  query. Don't ship a server-rendered "isNew" boolean baked with server clock assumptions.
- **`pace` generated column** for sort/filter (FE still formats display pace from duration+distance).

---

## 5. Decisions (2026-06-09)

1. **Reference data → frontend constants.** Sport list, verb map, day/month names ship as typed
   FE constants (also reused by the FE input parser/validator). No `/config` endpoint; a deploy
   updates them. → keep these strings in the shared formatter module, sourced byte-for-byte from
   legacy `nlp.clj`/`weekly.clj`.
2. **CSV → frontend-generated.** The FE assembles the CSV from raw rows using the shared
   formatter module. Backend serves only raw rows (same data as the JSON export); **no
   `/export.csv` endpoint** in the new backend. Conversion code stays single-source on the FE.
3. **`pace` → generated stored column.** `pace = round(distance/duration*360000)` as a generated
   column (guarded against `duration = 0` → null), indexed for sort/filter. Display pace is still
   computed by the FE from `duration`+`distance`.

**Net:** the only formatting-adjacent code left on the backend is the privacy-driven
`avatarHash` derivation (§4); everything else humanized moves to the shared FE module. The
backend's read endpoints become "query → serialize raw row," and the formatter module is the
single home for every conversion, importable by FE views and the FE CSV builder alike.
