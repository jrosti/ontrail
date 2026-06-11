# plan1 — thin backend: move all formatting to the frontend

Follows `plan0-sanity.md`. Principle: **the backend returns canonical numbers, raw timestamps,
and IDs — nothing humanized.** All format conversion (durations, distances, paces, dates,
Finnish verbs, day names, HR-derived metrics) moves to a **shared TypeScript formatter module**
on the frontend using `Intl` APIs for locale-aware output. The legacy backend interleaves data +
presentation in every read path (`as-ex-result`, `to-summary`, `simple-result`, …); the rewrite
cuts the presentation half out.

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
| `pace` | `round(distance / duration * 360000)` | **sort/filter only** — a generated column. The *displayed* pace is computed by the FE from `duration`+`distance`, not from this field. |
| `detailRepeats` / `detailVolume` / `detailElevation` | int (kpl / kg / m) | |
| `createdAt` / `lastModifiedAt` / comment `createdAt` | **ISO-8601 timestamp** | never a preformatted `dd.MM.yyyy` string |
| `tags` | `string[]` | |

Raw exercise the backend returns: identifiers + the integers above + `user`, `sport`, `title`,
`body` (sanitized HTML), `tags[]`, `comments[]` (each: `id, user, body, createdAt`), `cares[]`
(each: `user`, `avatarHash`), `avatarHash`, `synopsis`. Plus viewer-scoped fields from §4.
**No** `did`, `pace`, `hrReserve`, `bpmdist`, human dates/distances/times.

Summaries/stats/weekly/tops return the **numeric** members only — never the
`duration`/`distance`/`pace` *strings* the legacy code ships alongside them.

---

## 2. Backend formatting/parsing to move → frontend (the catalog)

### `formats.clj` — 100% presentation, all → FE shared formatter using `Intl`

| Legacy fn | Does | FE formatter |
|---|---|---|
| `to-human-time`, `minutes-part`, `seconds-part` | centiseconds → `"1 h 23 min"` / `"5 min 4 s"` | `formatDuration(cs)` — `Intl.DurationFormat` where supported, manual fallback |
| `to-human-distance` | meters → `"12,3 km"` / `"500 m"` (Finnish comma, trailing-zero strip) | `formatDistance(m)` — `Intl.NumberFormat('fi', { style:'unit', unit:'kilometer' })` |
| `to-human-pace-minkm/-500m/-100m/-kmh` | duration+distance → pace in the sport's unit | `formatPace(cs, m, sport)` |
| `pace-conversion-fun` | **sport → pace unit** (cycling/roller/kick → km/h; swim → /100m; rowing → /500m; else min/km) | `PACE_UNIT_BY_SPORT` table in the FE |
| `get-hres-percentage`, `get-heart-rate-reserve` | (avghr, resthr, maxhr) → `"73 %"` | `formatHrReserve(avghr, profile)` — `Intl.NumberFormat('fi', {style:'percent'})` |
| `get-bpmdist-r`, `get-bpmdist` | (avghr, resthr, duration, distance) → `"1,42 m/b"` | `formatBpmDist(ex, profile)` — `Intl.NumberFormat('fi', {maximumFractionDigits:2})` |
| `to-human-date`, `to-form-date`, `to-human-comment-date`, `to-simple-date` | timestamp → Finnish date | `formatDate` / `formatDateTime` — `Intl.DateTimeFormat('fi')` |

### `parser.clj` — input parsing → FE (backend validates ranges only)
`parse-duration`, `parse-distance`, `parse-date`, `parse-tags`, `parse-natural`, `calc-pace`.
→ FE parses human input into the canonical ints/ISO and sends those. Backend does cheap
server-side **validation** (non-negative, sane bounds) but not parsing. ⇒ the
`/validate/time` and `/validate/distance` endpoints disappear (FE-side); `/validate/username`
stays (DB lookup); login validation stays (authz).

### `nlp.clj`
- `verb-map` / `get-verb` — sport → Finnish past-tense verb (`"juoksi"`, `did`). **Reference dict → FE constant.**
- `sports` (sorted keys of `verb-map`) — the canonical sport list. **FE constant** (no `/config` endpoint; a deploy updates them).
- `stem`, Snowball `finnishStemmer`, `stop-words` — **search indexing, NOT presentation.** → deleted; Postgres FTS `finnish` config does stemming.

### `exercise.clj` — `as-ex-result` / `as-ex-result-list` / `decorate-results`
The whole decorator collapses. Per field: `distance`/`duration`/`pace`/`did`/`date`/
`creationDate`(human)/`hrReserve`/`bpmdist` → **FE**. `commentCount` → FE counts the array.
`comments`/`cares`/`tags`/`detail*`/`title`/`body`/`synopsis` → pass through.
`avatar` → §4. `isNew`/`newComments`/`new-count` → §4 (viewer data). `visibility`/`:hiding` →
**stays backend (authz)**.

### `summary.clj` / `sportsummary.clj`
- `to-summary`, humanize — drop the humanized members; SQL returns numerics. **FE** formats via `Intl`.
- `get-db-summary` JS reduce, combined buckets (`Byfoot/Bywheel/Hiihtolajit/Soudut`), `YHTEENSÄ` total (excl. `Sairaus/Hieronta/Tapahtuma`), distinct sports/tags — **stays backend** (aggregation → `GROUP BY`/grouping sets).
- `summary-memos` + `reset-memo-for` — **deleted** (live SQL).

### `stats.clj`
- `to-stats-summary`, `pacetominkm`, formatted `f80`/`f95` strings — **FE** (return raw pace numbers + histogram counts/bins).
- pace-histogram + `percentile_cont` — **stays backend** (SQL).

### `weekly.clj`
- `simple-result`, `humanize`, Finnish day names, `dayIndex`, `from`/`to`/`week` labels — **FE.** Day/week names via `Intl.DateTimeFormat('fi', {weekday:'long'})`.
- week interval bucketing + per-sport accumulation — **stays backend** (→ `date_trunc('week')` + `GROUP BY week, sport`, `generate_series` for empty days).

### `races.clj` (leaderboards/tops)
- `totals-by` humanized members — keep **numeric** + `rank`; **FE** formats via `Intl`. Ranking/sort — **stays backend** (`rank() OVER … ORDER BY`).

### `csv.clj` — export
CSV is generated by the **FE** (it has the rows + the shared formatters). Backend serves only raw rows (same data as the JSON export). **No `/export.csv` endpoint** in the new backend. Conversion code stays single-source on the FE.

---

## 3. The shared FE formatter module (what to build once)

A single typed module using **`Intl` APIs throughout**:

```
formatDuration(cs)            formatDate(iso)        verbFor(sport)        // nlp verb-map
formatDistance(m)             formatDateTime(iso)    PACE_UNIT_BY_SPORT    // pace-conversion-fun
formatPace(cs, m, sport)      formatHrReserve(avghr, profile)              SPORTS               // sport list
formatHr(bpm)                 formatBpmDist(ex, profile)                   isoWeek(iso), dayName(iso)
```

Use `Intl.NumberFormat('fi')`, `Intl.DateTimeFormat('fi')`, `Intl.DurationFormat` (with polyfill
fallback for duration). The sport verb map and YHTEENSÄ exclusion set are FE constants sourced
byte-for-byte from legacy `nlp.clj`/`weekly.clj`. Unit-test the formatters against a sample of
legacy outputs so nothing visibly shifts.

---

## 4. Stays on the backend (do **not** move)

- **Authz:** `authenticate`, token/JWT, ownership predicates, `visibility`/`:hiding`.
- **Aggregation/queries:** summaries, stats (incl. percentiles), weekly buckets, tops ranking, records, search (FTS), unread/most-comments. These are SQL, not formatting.
- **Avatar hashing — exception to "send raw":** the avatar is `gravatar(md5(email))`, and email is **private** (never exposed to other users). So the backend sends a precomputed `avatarHash` (or full Gravatar URL), *not* the email.
- **Viewer-specific data:** send raw timestamps and let the FE decide display, but the *computation* is data: send `lastModifiedAt` (raw) + the viewer's `lastVisit` (raw) and let the FE derive `isNew`; send `newComments` **count** from the unread query.
- **`pace` generated column** for sort/filter (FE still formats display pace from duration+distance).

---

## 5. Decisions (2026-06-09)

1. **Reference data → frontend constants.** Sport list, verb map, day/month names ship as typed FE constants. No `/config` endpoint; a deploy updates them.
2. **CSV → frontend-generated.** The FE assembles the CSV from raw rows using the shared formatter module. No `/export.csv` endpoint in the new backend.
3. **`pace` → generated stored column.** `pace = round(distance/duration*360000)` as a generated column (guarded against `duration = 0` → null), indexed for sort/filter.
4. **Locale formatting → `Intl` APIs.** All number, date, and unit formatting uses `Intl.NumberFormat`, `Intl.DateTimeFormat`, and `Intl.DurationFormat` with locale `'fi'`. No moment.js, no custom Finnish format strings. The shared formatter module wraps these into the domain-named helpers above.
