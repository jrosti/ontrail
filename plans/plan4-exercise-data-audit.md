# plan4 — `exercise` collection data audit (from the LIVE dump)

Unlike `plan2-migration.md` (schema reconstructed **from code**, "no live DB available"), this
file profiles the **actual restored data** — the 2016-era `mongodump` loaded into the local
MongoDB 3.2 container (`v2-run-mongo.sh`). Every number below is measured against the real
`ontrail.exercise` collection.

**Population:** `exercise` = **374,182** documents · `onuser` = 672 · 375 distinct authors appear
in exercises.

> Purpose: pin down the *real* shape (types, presence, anomalies) so the Mongo→Postgres
> normalize step (`plan2` §3) handles what the code-derived schema couldn't see. Where this
> contradicts `plan2`/`units.md`, **this file is ground truth** — it's the data itself.

---

## 1. Field catalog (measured)

Presence is out of 374,182. "types" lists the BSON types actually stored (the surprise is that
many numerics are stored as **both** `NumberLong` and `int**, plus explicit `null`).

| Field | Present | Stored types (counts) | Notes |
|---|---|---|---|
| `_id` | 100% | objectId | permalink key |
| `user` | 100% | string | author username (FK by name); 375 distinct |
| `sport` | 100% | string | 75 distinct values (see §4) |
| `title` | 100% | string | 13 still `""` (blank-→-sport fallback not always applied) |
| `body` | 100% | string | 49,426 (13.2%) are `""` (empty body) |
| `creationDate` | 100% | **date** (BSON) | noon-shifted; range incl. garbage (see §5) |
| `lastModifiedDate` | 100% | **date** (BSON) | feed sort key |
| `duration` | 100% | **long 315,171 · int 58,855 · null 156** | centiseconds; 368 are `0` |
| `distance` | 100% | **long 298,991 · int 74,854 · null 337** | meters; 12,920 are `0` |
| `avghr` | 100% | **int 157,589 · long 11,379 · null 205,214** | bpm; see §3 (null/0/value) |
| `pace` | 95.2% | int 353,992 · null 2,123 | **absent on 18,067 docs**; derived sort key |
| `tags` | 100% | array | 98,540 docs have ≥1 tag; 5,493 distinct tags; all strings |
| `comments` | 80.8% | array | present (often `[]`) on 302,499; **non-empty on only 42,862** |
| `cares` | 13.3% | array | present **only when non-empty** (49,810); asymmetric vs comments |
| `mdbody` | 0.9% | string | 3,554 docs (1,424 `""`); Markdown — **DROP** per plan0 |

### Undocumented fields — not in `units.md` or `plan2` (all from the legacy importer)

| Field | Present | Type | Meaning (inferred) | Migration |
|---|---|---|---|---|
| `detail` | 965 (0.3%) | object | treenit.net import payload: `{resthr, weight, comment, temperature}` — `weight` in **grams** (e.g. 92000 = 92 kg); all 965 have the same 4 keys | extract `weight`/`resthr` if wanted, else drop |
| `origin` | 965 (0.3%) | string | import source — single value `"treenit.net"` | provenance only; drop or keep as `source` |
| `hid` | 9,557 (2.6%) | long | external import id (Heia/“hid”) — dedupe key for the old importers | drop (imports not ported) |
| `detailKcal` | 252 (0.1%) | int | **calories** — a 4th detail metric `units.md` never lists | keep as `detail_kcal` or drop |
| `detailElevation` | 21,861 (5.8%) | int | meters (documented) | keep |
| `detailRepeats` | 2,851 (0.8%) | int | count (documented) | keep |
| `detailVolume` | 301 (0.1%) | int | kg (documented) | keep |

The `did`/`verb` field referenced around the code is **not stored** (0 occurrences) — it is
computed at read time in `as-ex-result`. Confirmed display-only; nothing to migrate.

---

## 2. Numeric ranges (measured)

| Field | min | max | avg | negatives | notes |
|---|---|---|---|---|---|
| `duration` (cs) | 0 | 9,000,000 | ~4,051 s | 0 | max = 25 h; 5,838 docs > 4 h; **898 docs have duration 0 but distance > 0** |
| `distance` (m) | 0 | 514,500 | ~10.7 km | 0 | 57 docs > 300 km (ultras / bad data); 12,920 are exactly 0 |
| `avghr` (bpm) | 0 | 9,089 | ~105 | 0 | see §3 — 12 docs > 230 bpm, 364 in (0,30) |
| `pace` | 0 | 2,880,000 | — | 0 | 73,893 are 0 (no distance); **0 mismatches vs the `round(distance/duration*360000)` formula** |
| `detailRepeats` | 0 | 2,000 | 27.9 | 0 | within int |
| `detailVolume` | 0 | 10,960 | 2,292 | 0 | within int |
| `detailElevation` | 0 | 27,000 | 263 | 0 | **under the 32767 short cap** — no existing value clips |

**Good news for `plan2`:** the `pace` formula is exact across all 45,810 checkable rows → the
generated-column plan is safe. And no `detail*` value exceeds the legacy short cap, so widening
to `integer` is forward-safety only, not a fix for clipped data.

---

## 3. `avghr` is tri-state, not "0 = none"

`units.md` says "`0`/absent = none." Reality is three distinct states:

- `null`  — **205,214** (54.8%)  ← the real "no HR"
- `0`     — **38,720** (10.3%)
- `> 0`   — **130,248** (34.8%)

So a Postgres `integer` column must allow NULL, and the migration must decide whether `0` is also
"no data" (almost certainly yes — 0 bpm is not a real heart rate). **Open question Q3.**

---

## 4. `sport` — 75 distinct, including malformed values

The FE will ship a fixed sport list; the data has 75. The long tail includes non-sports and a
clear glitch:

- **`"Paino:"`** (7 docs, all user `Snakster`, title "Paino", empty body) — **weight logging
  mis-recorded as a sport**, with a trailing colon. Not an exercise.
- **`"lumityö"`** (2) — lowercase, ad-hoc ("snow work").
- `"Muu laji"` (3,862), `"Muu merkintä"` (2,581) — generic "other".
- `"Lepo"` (156, rest), `"Sairaus"` (1,346, illness), `"Hieronta"` (2,483, massage),
  `"Tapahtuma"` (51, event) — already excluded from some summary totals (`YHTEENSÄ`); confirm the
  exclusion set carries over.

Top sports: Juoksu 153,598 · Pyöräily 36,268 · Kävely 32,949 · Kuntosali 12,485 · Jumppa 12,024.
**Open question Q4:** canonical sport list + mapping for the tail (merge/keep/drop `Paino:`,
`lumityö`, etc.).

---

## 5. Date anomalies

`creationDate`/`lastModifiedDate` are real BSON dates (good), but:

- **Garbage `creationDate`s:** 10 docs before year 2000 — including **`0012-09-20`** (year 12 AD)
  and `1970-01-01` (epoch zero, i.e. a parse failure). 28 `lastModifiedDate`s before 2005
  (down to year **0201**).
- **Future dates:** 4 docs with `creationDate` in the future (up to **2026-07-15**).
- **28,371 docs have `creationDate > lastModifiedDate`** ("inverted"). This is **expected, not
  corruption**: `creationDate` is shifted to **noon** of the chosen day (`units.md`), while
  `lastModifiedDate` is set to the actual wall-clock `now` at creation — so a morning entry gets
  created-at-noon > modified-at-09:00. Migration must **not** "fix" these by clamping.

**Open question Q5:** clamp/null the handful of garbage/future dates, or carry verbatim?

---

## 6. Embedded `comments` / `cares`

- **comments:** 186,007 total across 42,862 exercises. Subdoc fields: `{user, body, date,
  avatar}` on all; **`_id` missing on 46**; **`title` present on 46** (the *same* 46 — an older
  comment format; sample `{title:".", body:"", date:"20.09.2012"}`). `date` is a **string on
  100%** (`"dd.MM.yyyy"` / `"dd.MM.yyyy HH:mm"`) — confirms the `units.md` ⚠️; minute precision at
  best, some date-only. → `comment.seq` (array index) is the **only** reliable intra-exercise
  order; cannot rely on `_id`.
- **cares:** 144,591 total across 49,810 exercises. Subdoc `{user, avatar}` only — **no
  timestamp** (it was an `$addToSet` set). `avatar` is a snapshotted Gravatar URL → recompute,
  drop the stored value (`plan2` §3 already says so).
- **Asymmetry:** `comments:[]` empty arrays are persisted (field present on 80.8%), but `cares`
  is present **only when non-empty** (13.3%). The normalize step keys off array contents, so this
  is harmless — noted so counts aren't misread.

---

## 7. Referential integrity (orphans) — must resolve before FK creation

`plan2` makes `exercise.user_id`, `comment.user_id`, `care.user_id` NOT NULL FKs. The data has
names with **no matching `onuser`**:

- **Orphan authors:** 2 users / 14 exercises — **`j.satta`** (12), **`tatteus`** (2). Likely
  renamed accounts (note real user `jsatta` exists — `j.satta` looks like the same person with a
  dot).
- **Orphan comment authors:** 5 users / **6,097 comments** — **`Ursa Minor` (5,796)**, `kettis`
  (128), `Elmo` (96), `Jiihoo` (47), `Murakami` (30). `Ursa Minor` (with a space) is a large
  legacy account that no longer exists in `onuser`.
- **Orphan care users:** 1 user / 265 cares — **`Ursa Minor`** again.

**Open question Q1 (highest priority — blocks FK creation):** for each orphan, *alias* to an
existing user (e.g. `j.satta`→`jsatta`), create a placeholder/“deleted user” account, or
drop their rows? `Ursa Minor`'s 5,796 comments + 265 cares are real content — dropping loses
conversation history.

---

## 8. Mixed numeric types — the normalize step must coerce

Every core numeric is stored inconsistently as `NumberLong` **and** plain `int` **and** sometimes
`null` (see §1). Loading the dump as JSONB and then casting will hit this:

- `duration`: long / int / null
- `distance`: long / int / null
- `avghr`: int / long / null

The cast to Postgres `integer` must handle all three (`(doc->>'duration')::bigint` then range-check
→ `integer`, with NULL passthrough). None of the values exceed int range, so `integer` is safe;
only the **source type heterogeneity** is the trap. **Open question Q2:** treat `null` numeric as
SQL NULL (recommended) and decide `0` vs NULL semantics per field (ties to §3 for `avghr`, and the
898 `duration=0 & distance>0` rows for pace/derived metrics).

---

## 9. Open questions for migration (consolidated)

| # | Question | Why it matters | Suggested default |
|---|---|---|---|
| **Q1** | Orphan users (`j.satta`, `tatteus`, `Ursa Minor`, …) — alias / placeholder / drop? | Blocks NOT NULL FKs; `Ursa Minor` = 5,796 comments | Alias the obvious (`j.satta`→`jsatta`); create one `[deleted]` placeholder for the rest; **keep** their content |
| **Q2** | Mixed long/int/null numerics → coercion rule | Every cast hits it | Cast via bigint→integer; `null`→SQL NULL |
| **Q3** | `avghr` `0` — real value or "no data"? | 38,720 zeros + 205,214 nulls | Treat `0` as NULL (no 0-bpm hearts) |
| **Q4** | Canonical `sport` list + tail mapping (`Paino:`, `lumityö`, `Muu laji`, …) | FE ships a fixed list; 75 in data | Map `Paino:`→drop/own-type; keep `Muu laji`/`Muu merkintä`; preserve the `YHTEENSÄ`-exclusion set (`Sairaus`/`Hieronta`/`Tapahtuma`/`Lepo`) |
| **Q5** | Garbage/future dates (yr 0012, 1970 epoch, 2026-07-15) | 14 docs; breaks year-bucketed stats | Null or clamp the obvious parse failures; **leave** the 28,371 expected noon-shift inversions |
| **Q6** | `detailKcal` (252) and `detail.{weight,resthr,temperature}` (965) — keep or drop? | Undocumented; small | Keep `detail_kcal`; extract `detail.weight` only if a weight feature survives, else drop the `detail` object |
| **Q7** | `origin` / `hid` import provenance — keep? | 965 / 9,557 docs | Drop (imports not ported per plan0); optionally keep `origin` as `source` text |
| **Q8** | 898 docs `duration=0, distance>0` — pace/derived metrics divide by zero | Already `pace=null` for these in source | Leave duration 0 / NULL; generated pace column already guards `duration>0` |
| **Q9** | Legacy comments missing `_id` + carrying `title` (46) | `_id` not a reliable comment key | Use array-position `seq`; ignore `title` |
| **Q10** | `mdbody` (3,554) — confirmed drop? | plan0 says rich-text HTML wins | Drop (already decided) |

---

## 10. What this audit *confirms* from earlier plans
- `pace = round(distance/duration*360000)` — **exact**, 0 mismatches → generated column is safe.
- comment `date` is a **string**, not an instant → lossy; `seq` for ordering.
- `cares` is a set with `{user, avatar}`, no timestamp → join table, recompute avatar.
- `did`/`verb` is **not stored** → display-only, nothing to migrate.
- `detail*` values are **within** the short cap → widening to `integer` is forward-safety only.

## 11. Decision questionnaire — how each issue gets fixed

Every question and option carries the **affected row counts** so the impact of each choice is
explicit (population: 374,182 exercises · 672 users · 186,007 comments · 144,591 cares).
**All 12 answered 2026-06-09** — summary below; rationale in each Q's **Decision** line.

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

### Q1 — Orphan users — BLOCKS FK creation
Names with no `onuser` row. **Authors:** 2 users / **14 exercises** — `j.satta` (12), `tatteus`
(2). **Comment authors:** 5 users / **6,097 comments** — `Ursa Minor` (5,796), `kettis` (128),
`Elmo` (96), `Jiihoo` (47), `Murakami` (30). **Care users:** 1 user / **265 cares** — `Ursa
Minor`. See §7.
- **(a) ★ Alias known + placeholder rest** — map obvious renames (`j.satta`→`jsatta`); one
  `[deleted]` account absorbs the rest. **Lost: 0.**
- **(b) Placeholder for all** — every orphan → one `[deleted]` user. **Lost: 0** (but `j.satta`'s
  12 ex not reunited with `jsatta`).
- **(c) Drop orphan rows** — **Lost: 14 exercises + 6,097 comments + 265 cares.**
- **Decision (2026-06-09): (a) Alias known + placeholder.** `j.satta`→`jsatta` (reunites 12 ex);
  all others (`tatteus`, `Ursa Minor`, `kettis`, `Elmo`, `Jiihoo`, `Murakami`) → one `[deleted]`
  placeholder account. **0 rows lost.**

### Q2 — Mixed long/int/null numerics → coercion rule
`duration`: long 315,171 / int 58,855 / null 156. `distance`: long 298,991 / int 74,854 / null
337. `avghr`: int 157,589 / long 11,379 / null 205,214. Max values (duration 9,000,000; distance
514,500; avghr 9,089) **all fit `integer`**. See §8.
- **(a) ★ Cast bigint→integer, null→SQL NULL** — affects **all 374,182**; 0 overflow rows.
- **(b) Use `bigint` columns** — affects all; larger storage, no data needs it.
- **Decision (2026-06-09): (a) `integer`, null→SQL NULL.**

### Q3 — `avghr` zeros
Tri-state across 374,182: **null 205,214 (54.8%)** · **0 → 38,720 (10.3%)** · **>0 → 130,248
(34.8%)**. Implausible outliers: **12** docs `>230` bpm (max 9,089), **364** in (0,30). See §3.
- **(a) ★ `0` → NULL** — reclassifies **38,720** zeros as "no data" (→ 243,934 NULL total).
- **(b) Keep `0` distinct** — preserves all 38,720 zeros; skews averages unless filtered.
- **Decision (2026-06-09): (a) `0`→NULL, and clamp the outliers.** The 38,720 zeros and the **12**
  `>230` bpm outliers → NULL (→ 243,946 NULL, 130,236 real). The 364 in (0,30) **left as-is**
  (low/plausible-enough).

### Q4 — `sport` tail (75 distinct values)
Non-sports / glitches: **`Paino:`** 7 (weight logging, 1 user), **`lumityö`** 2 (lowercase),
**`Muu laji`** 3,862, **`Muu merkintä`** 2,581. Already-excluded-from-`YHTEENSÄ`: **`Hieronta`**
2,483, **`Sairaus`** 1,346, **`Lepo`** 156, **`Tapahtuma`** 51. Top: Juoksu 153,598 · Pyöräily
36,268 · Kävely 32,949. See §4.
- **(a) ★ Canonical list + map tail** — normalize the ~9 fringe values (≈ 13 docs of true
  glitches: `Paino:` 7 + `lumityö` 2 + …); keep "Muu *"; preserve the exclusion set.
- **(b) Keep all 75 verbatim** — **0 docs changed**; FE must tolerate `Paino:` etc.
- **(c) Canonical, drop unmapped** — risks dropping fringe-sport exercises (count depends on the
  final list).
- **Decision (2026-06-09): (a) Canonical list + map tail.** Remap the ~9–13 glitch docs
  (`Paino:` 7, `lumityö` 2, …) into the canonical set / "Muu *"; keep the `YHTEENSÄ`-exclusion set
  (`Sairaus`/`Hieronta`/`Tapahtuma`/`Lepo`). *(Mapping table TBD as part of the canonical list.)*

### Q5 — Garbage / future dates
**creationDate < 2000: 10** (incl. `0012-09-20`, `1970-01-01` epoch parse-fail). **future
(>today): 4** (to `2026-07-15`). **lastModifiedDate < 2005: 28** (to `0201-…`). Separately,
**28,371** docs have `creationDate > lastModifiedDate` — **expected** noon-shift artifact, leave
untouched. See §5.
- **(a) ★ Null/clamp the garbage only** — touches **~14** creation + **28** modified rows; leaves
  the 28,371 inversions.
- **(b) Carry all verbatim** — **0 changed**; the ~14 break year-bucketed stats.
- **Decision (2026-06-09): (a)+clamp.** Fix only the garbage/future rows (~14 `creationDate` + 28
  `lastModifiedDate`) by **clamping to a sane date** (derive from the sibling date / a plausible
  bound) rather than nulling — keeps them in stats. **Leave** the 28,371 noon-shift inversions.

### Q6 — Undocumented detail fields
**`detailKcal`** (calories) on **252** docs. **`detail`** object `{weight(g), resthr,
temperature, comment}` on **965** docs (all 4 keys present). See §1.
- **(a) ★ Keep `detail_kcal`** (252 rows) / drop.
- **(b) ★ Drop whole `detail` object** (965 rows) — or extract `detail.weight` only if a
  bodyweight feature survives.
- **Decision (2026-06-09): Keep `detail_kcal` (252), drop the whole `detail` object (965).**

### Q7 — Import provenance (`origin`, `hid`)
**`origin`='treenit.net'** on **965** docs (single value). **`hid`** external id on **9,557**
docs. See §1.
- **(a) ★ Drop both** — removes 965 `origin` + 9,557 `hid` values; imports not ported (plan0).
- **(b) Keep `origin` as `source` text** (965 rows) — drop `hid` (9,557).
- **Decision (2026-06-09): (b) Keep `origin`→`source` (965); drop `hid` (9,557).**

### Q8 — `duration=0 & distance>0` (**898** docs)
Would divide-by-zero for pace/derived metrics; `pace` already null in these. See §2.
- **(a) ★ Leave duration 0/NULL** — generated `pace` guards `duration>0`; **0 rows need repair.**
- **(b) Attempt repair** — infer duration for 898 rows (no source; not advisable).
- **Decision (2026-06-09): Set `distance`→NULL for these 898 docs.** A distance with no duration is
  unmeasured movement; null it (rather than keeping a distance that produces no pace and skews
  distance totals). `duration` stays 0/NULL; generated `pace` remains NULL.

### Q9 — Legacy comments without `_id` / carrying `title`
**46** comments lack `_id`; the **same 46** carry a `title` field (sample `{title:".",
body:""}`). Out of 186,007 total comments. See §6.
- **(a) ★ Use array-position `seq`; ignore `title`** — affects ordering for all 186,007; the 46
  need no `_id`.
- **(b) Synthesize an id + keep `title`** — extra handling for 46 rows; low value.
- **Decision (2026-06-09): (a) Use `seq`; drop `title`** (46 rows lose a mostly-`.` title).

### Q10 — `mdbody` (Markdown)
Present on **3,554** docs (**1,424** of them empty `""` → only **2,130** with real Markdown). See §1.
- **(a) ★ Drop** — discards `mdbody` on 3,554 docs; rich-text HTML `body` wins (plan0 §4).
- **(b) Keep/merge** — reconcile 2,130 non-empty mdbodies with `body`.
- **Decision (2026-06-09): (a) Drop `mdbody`** (3,554 docs; 2,130 non-empty).

### Q11 — Stored `avatar` snapshots in comments/cares
Gravatar URL stored on **186,007 comments + 144,591 cares** = **330,598** redundant snapshots. See §6.
- **(a) ★ Drop, recompute from email** — removes all 330,598 (plan2 §3).
- **(b) Keep snapshot** — retains 330,598 stale URLs.
- **Decision (2026-06-09): (a) Drop all 330,598 snapshots; recompute from email.**

### Q12 — `pace` storage
**absent on 18,067** docs · **null on 2,123** · int on 353,992. Formula
`round(distance/duration*360000)` verified **exact: 0 mismatches / 45,810 checkable**. See §1–§2.
- **(a) ★ Use generated column** — ignore stored `pace` on all 374,182; recompute. Source
  presence/null irrelevant.
- **Decision (2026-06-09): (a) Generated column.**

---

## 12. What this audit *adds* beyond earlier plans
- Numerics are stored as **mixed long/int/null**, not clean ints (§1, §8).
- `avghr` is **tri-state** (null/0/value), not "0/absent" (§3).
- **Undocumented fields**: `detail` object, `detailKcal`, `origin`, `hid` (§1).
- Concrete **orphan-user** counts that block FK creation (§7).
- **Garbage dates** and the explanation for 28k "inverted" dates (§5).
- Malformed sport `"Paino:"` and the 75-value reality (§4).
- Comments carry a legacy `title` and 46 lack `_id` (§6).
