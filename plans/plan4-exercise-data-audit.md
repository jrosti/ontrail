# plan4 — `exercise` collection data audit (from the LIVE dump)

Unlike `plan2-migration.md` (schema reconstructed **from code**), this file profiles the
**actual restored data** — the 2016-era `mongodump` loaded into a local MongoDB 3.2 container.
Every number below is measured against the real `ontrail.exercise` collection.

**Population:** `exercise` = **374,182** documents · `onuser` = 672 · 375 distinct authors appear
in exercises.

> Purpose: pin down the *real* shape (types, presence, anomalies) so the Mongo→Postgres
> normalize step (`plan2` §3) handles what the code-derived schema couldn't see. Where this
> contradicts `plan2`/`units.md`, **this file is ground truth**.

---

## 1. Field catalog (measured)

| Field | Present | Stored types (counts) | Notes |
|---|---|---|---|
| `_id` | 100% | objectId | permalink key |
| `user` | 100% | string | author username; 375 distinct |
| `sport` | 100% | string | 75 distinct values (see §4) |
| `title` | 100% | string | 13 still `""` |
| `body` | 100% | string | 49,426 (13.2%) are `""` |
| `creationDate` | 100% | **date** (BSON) | noon-shifted; range incl. garbage (see §5) |
| `lastModifiedDate` | 100% | **date** (BSON) | feed sort key |
| `duration` | 100% | **long 315,171 · int 58,855 · null 156** | centiseconds; 368 are `0` |
| `distance` | 100% | **long 298,991 · int 74,854 · null 337** | meters; 12,920 are `0` |
| `avghr` | 100% | **int 157,589 · long 11,379 · null 205,214** | bpm; see §3 (null/0/value) |
| `pace` | 95.2% | int 353,992 · null 2,123 | **absent on 18,067 docs**; derived sort key |
| `tags` | 100% | array | 98,540 docs have ≥1 tag; 5,493 distinct tags; all strings |
| `comments` | 80.8% | array | non-empty on only 42,862; 186,007 total |
| `cares` | 13.3% | array | present **only when non-empty** (49,810); 144,591 total |
| `mdbody` | 0.9% | string | 3,554 docs (1,424 `""`); Markdown — **DROP** |

### Undocumented fields — legacy importer

| Field | Present | Type | Meaning | Migration |
|---|---|---|---|---|
| `detail` | 965 (0.3%) | object | treenit.net import payload: `{resthr, weight, comment, temperature}` — `weight` in **grams** | drop |
| `origin` | 965 (0.3%) | string | import source — single value `"treenit.net"` | keep as `source` |
| `hid` | 9,557 (2.6%) | long | external import id (Heia/"hid") | drop |
| `detailKcal` | 252 (0.1%) | int | **calories** — a 4th detail metric | keep as `detail_kcal` |
| `detailElevation` | 21,861 (5.8%) | int | meters (documented) | keep |
| `detailRepeats` | 2,851 (0.8%) | int | count (documented) | keep |
| `detailVolume` | 301 (0.1%) | int | kg (documented) | keep |

The `did`/`verb` field is **not stored** (0 occurrences) — display-only; nothing to migrate.

---

## 2. Numeric ranges (measured)

| Field | min | max | avg | notes |
|---|---|---|---|---|
| `duration` (cs) | 0 | 9,000,000 | ~4,051 s | max = 25 h; **898 docs have duration 0 but distance > 0** |
| `distance` (m) | 0 | 514,500 | ~10.7 km | 57 docs > 300 km; 12,920 are exactly 0 |
| `avghr` (bpm) | 0 | 9,089 | ~105 | see §3 — 12 docs > 230 bpm, 364 in (0,30) |
| `pace` | 0 | 2,880,000 | — | 73,893 are 0 (no distance); **0 mismatches vs formula** |
| `detailRepeats` | 0 | 2,000 | 27.9 | within int |
| `detailVolume` | 0 | 10,960 | 2,292 | within int |
| `detailElevation` | 0 | 27,000 | 263 | **under the 32767 short cap** — no existing value clips |

**Good news:** `pace` formula is exact across all 45,810 checkable rows → generated-column plan
is safe. And no `detail*` value exceeds the legacy short cap.

---

## 3. `avghr` is tri-state, not "0 = none"

- `null`  — **205,214** (54.8%)  ← the real "no HR"
- `0`     — **38,720** (10.3%)
- `> 0`   — **130,248** (34.8%)

A Postgres `integer` column must allow NULL; the migration treats `0` as NULL (no 0-bpm hearts).

---

## 4. `sport` — 75 distinct, including malformed values

- **`"Paino:"`** (7 docs, all user `Snakster`) — weight logging mis-recorded as a sport.
- **`"lumityö"`** (2) — lowercase, ad-hoc ("snow work").
- `"Muu laji"` (3,862), `"Muu merkintä"` (2,581) — generic "other".
- `"Lepo"` (156), `"Sairaus"` (1,346), `"Hieronta"` (2,483), `"Tapahtuma"` (51) — excluded from `YHTEENSÄ` summaries.

Top sports: Juoksu 153,598 · Pyöräily 36,268 · Kävely 32,949 · Kuntosali 12,485 · Jumppa 12,024.

---

## 5. Date anomalies

- **Garbage `creationDate`s:** 10 docs before year 2000 — including `0012-09-20` and `1970-01-01` (epoch zero, parse failure). 28 `lastModifiedDate`s before 2005 (down to year 0201).
- **Future dates:** 4 docs with `creationDate` in the future (up to 2026-07-15).
- **28,371 docs have `creationDate > lastModifiedDate`** — **expected, not corruption**: `creationDate` is shifted to **noon** of the chosen day while `lastModifiedDate` is set to the actual wall-clock `now` at creation. Migration must **not** "fix" these.

---

## 6. Embedded `comments` / `cares`

- **comments:** 186,007 total across 42,862 exercises. `date` is a **string on 100%** (`"dd.MM.yyyy"` / `"dd.MM.yyyy HH:mm"`) — minute precision at best. `_id` missing on 46; `title` present on the same 46. → `comment.seq` (array index) is the **only** reliable intra-exercise order.
- **cares:** 144,591 total across 49,810 exercises. Subdoc `{user, avatar}` only — **no timestamp**.
- **Asymmetry:** `comments:[]` empty arrays are persisted (field present on 80.8%), but `cares` is present **only when non-empty** (13.3%).

---

## 7. Referential integrity (orphans) — must resolve before FK creation

- **Orphan authors:** 2 users / 14 exercises — **`j.satta`** (12), **`tatteus`** (2).
- **Orphan comment authors:** 5 users / **6,097 comments** — **`Ursa Minor` (5,796)**, `kettis` (128), `Elmo` (96), `Jiihoo` (47), `Murakami` (30).
- **Orphan care users:** 1 user / 265 cares — **`Ursa Minor`** again.

---

## 8. Mixed numeric types

Every core numeric is stored inconsistently as `NumberLong` **and** plain `int` **and** sometimes
`null`. The cast to Postgres `integer` must handle all three: `(doc->>'duration')::bigint` then
cast to `integer`, with NULL passthrough.

---

## 11. Decision questionnaire — all answered 2026-06-09

| Q | Decision | Rows affected |
|---|---|---|
| Q1 orphans | Alias `j.satta`→`jsatta`; rest → `[deleted]` placeholder | 0 lost (14 ex + 6,097 comments + 265 cares kept) |
| Q2 numerics | `integer`, null→SQL NULL | all 374,182 cast |
| Q3 avghr | `0`→NULL **and** clamp 12 `>230` outliers→NULL; keep (0,30) | 38,732 → NULL |
| Q4 sport | Canonical list + map tail; keep exclusion set | ~9–13 glitch docs remapped |
| Q5 dates | **Clamp** garbage/future to a sane date; leave inversions | ~14 + 28 clamped |
| Q6 detail | Keep `detail_kcal`; drop whole `detail` object | keep 252 / drop 965 |
| Q7 provenance | Keep `origin`→`source`; drop `hid` | keep 965 / drop 9,557 |
| Q8 dur=0 | **Set `distance`→NULL** for these | 898 distances nulled |
| Q9 comments | Use `seq`; drop legacy `title` | 46 lose `title` |
| Q10 mdbody | Drop | 3,554 dropped |
| Q11 avatars | Drop snapshots; recompute from email | 330,598 dropped |
| Q12 pace | Generated column | all 374,182 |
| (title="") | Backfill `title`=`sport` | 13 backfilled |
