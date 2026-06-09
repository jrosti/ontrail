# Stored units reference

How each numeric field is **stored** in the `exercise` collection, derived from the code that
writes it (`parser.clj`, `mutate.clj`) and reads it (`formats.clj`, `summary.clj`, `stats.clj`).
This is the ground truth the migration and the FE formatters must preserve.

> Conventions: "store" = the value persisted in Mongo/Postgres; "display" = what the user sees.
> The rewrite keeps the **store** units identical and moves all display conversion to the FE
> using `Intl` APIs (see `plan1-thin-backend.md`).

---

## duration — **centiseconds** (hundredths of a second)

The base unit is 1/100 s. Built in `parser.clj`:

```
to-db   [min] = min * 60 * 100      ; 1 minute  = 6000
hours   [h]   = h * 60 * 60 * 100   ; 1 hour     = 360000
secs    [s]   = s * 100             ; 1 second   = 100
```

So `1 s = 100`, `1 min = 6000`, `1 h = 360000`. The smallest representable unit is hundredths,
used by the tenths/hundredths regex variants (e.g. `"5 min 4,15 s"`).

Confirmed by the reverse in `formats/to-human-time`:
`hours = duration/360000`, `minutes = (duration/6000) mod 60`, `seconds = (duration/100) mod 60`,
`hundreds = duration mod 100`.

Input parsing (`parse-duration`) accepts many human forms — `45`, `45 m`, `3h`, `3h31`,
`3.31.28`, `1:23`, `5 min 4 s`, `2 h 5 min 3 s`, `5 min 4,15 s` — all normalized to centiseconds.

> **Note:** the new PostgreSQL schema stores duration in **seconds** (`duration_sec`), not
> centiseconds. The migration must divide by 100. The FE formatter must account for this.

## distance — **meters**

`parser.clj`:

```
kilometers [km]            = km * 1000
kilometers-and-meters km m = km*1000 + m
as-double-km str           = round(1000 * parseDouble(str))   ; "5,2" → 5200
```

Named shortcuts: `kilsa` = 1000, `maraton`/`mara` = 42195, `maili` = 1609.
Heuristic in `parse-distance`: a bare number ≥ 1 000 000 is treated as **meters but too large**
and divided by 1000. `""` → 0.

## pace — **derived integer**, `round(distance / duration * 360000)`

Computed on write in `mutate/calc-pace`:

```
pace = round( (distance / duration) * 360000 )
```

With `distance` in meters and `duration` in centiseconds. Larger value = faster. It is *not*
what the UI shows — display pace is recomputed from `duration` + `distance` per sport, so
`pace` exists purely for `ORDER BY`/range filtering. (Rewrite: a generated stored column.)

> **Note:** with the new schema storing `duration_sec` (seconds), the pace formula becomes
> `round(distance * 360 / duration_sec)` — same semantic, adjusted for seconds.

### display pace units (per sport — computed at display time in FE)
- **min/km** (default): `(duration/6000) / (distance/1000)` → minutes per km
- **km/h** (cycling, roller ski/blade, kickbike, cyclocross…): `(distance/1000) / (duration/360000)`
- **/500 m** (rowing): pace over 500 m
- **/100 m** (swimming): pace over 100 m

(The sport→unit table lives in `formats/pace-conversion-fun`; it moves to the FE as `PACE_UNIT_BY_SPORT`.)

## avghr — **bpm** (integer)

Stored as a plain integer beats-per-minute. `0`/absent = no HR. See `plan4-exercise-data-audit.md`
§3 for the tri-state reality in the legacy data.

## detail fields — **plain integers, unit per field**

- `detailRepeats` — count (kpl)
- `detailVolume` — kilograms (kg)
- `detailElevation` — meters (m)
- `detailKcal` — calories (kcal) [audit: 252 docs]

(Legacy range: non-negative 16-bit short, 0–32767. New schema uses `integer`.)

## dates — **BSON dates (joda `DateTime`)**, stored as instants

`creationDate`, `lastModifiedDate` are real date objects.
- `creationDate`: parsed from user's date input and **shifted +12 h** (`parse-date` adds 12 hours so the day lands at noon, avoiding timezone date-rollover). Empty input → now.
- `lastModifiedDate`: set to now on create/comment/care; on edit preserved unless exercise is older than 43200 minutes (30 days).
- comment `date`: stored already humanized in legacy (`to-human-comment-date`) — ⚠️ a **string**, not an instant. The rewrite stores comment timestamps as real instants.

## tags — **array of strings**

`parse-tags`: comma-split, trimmed, `/`→`-` (`cleanse-tag`), empties dropped.

---

## Derived display metrics (not stored — computed from the above + profile)

- **Syke-% / HR reserve**: `round(100*(avghr-resthr)/(maxhr-resthr))` using the user's profile `resthr`/`maxhr`.
- **Etenemä / bpmdist**: `distance / ((avghr-resthr) * duration / 6000)` → meters per heartbeat. Needs profile `resthr`.

## Profile fields (in `onuser.profile`) — **integers**

`resthr`, `maxhr` (bpm), `aerk`, `anaerk` (aerobic/anaerobic threshold HR, bpm), all via
`parse-natural`. Defaults on user creation: `resthr 42`, `maxhr 192`.

---

## Quick reference

| Field | Stored unit | 1 unit means | Example (stored → shown) |
|---|---|---|---|
| `duration` (Mongo) | centiseconds | 1/100 s | `366000` → `1 h 1 min` |
| `duration_sec` (Postgres) | seconds | 1 s | `3660` → `1 h 1 min` |
| `distance` / `distance_m` | meters | 1 m | `5200` → `5,2 km` |
| `pace` | int `dist/dur*360000` | sort key (higher = faster) | filter/sort only |
| `avghr` | bpm | 1 beat/min | `145` → `145` |
| `detailRepeats` | count | 1 rep | `20` → `20 kpl` |
| `detailVolume` | kilograms | 1 kg | `1500` → `1500 kg` |
| `detailElevation` | meters | 1 m | `850` → `850 m` |
| `creationDate` / `lastModifiedDate` | BSON date (instant) | — | noon-shifted day |
| comment `date` (Mongo) | **string** (legacy) | — | `"dd.MM.yyyy HH:mm"` |
| `tags` | string[] | — | `["pitkä","kynnys"]` |
