# Stored units reference

How each numeric field is **stored** in the `exercise` collection, derived from the code that
writes it (`parser.clj`, `mutate.clj`) and reads it (`formats.clj`, `summary.clj`, `stats.clj`).
This is the ground truth the migration and the FE formatters must preserve.

> Conventions: "store" = the value persisted in Mongo; "display" = what the user sees. The
> rewrite keeps the **store** units identical and moves all display conversion to the FE
> (see `plan1-thin-backend.md`).

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

## distance — **meters**

`parser.clj`:

```
kilometers [km]            = km * 1000
kilometers-and-meters km m = km*1000 + m
as-double-km str           = round(1000 * parseDouble(str))   ; "5,2" → 5200
```

Named shortcuts: `kilsa` = 1000, `maraton`/`mara` = 42195, `maili` = 1609.
Heuristic in `parse-distance`: a bare number ≥ 1 000 000 is treated as **meters but too large**
and divided by 1000 (guards against someone typing kilometers as a raw number "over 1000 km").
`""` → 0. Reverse in `formats/to-human-distance` divides by 1000 for km, `mod 1000` for the
meter remainder — confirming meters.

## pace — **derived integer**, `round(distance / duration * 360000)`

Computed on write in `mutate/calc-pace`:

```
pace = round( (distance / duration) * 360000 )
```

With `distance` in meters and `duration` in centiseconds, this is a **sortable/filterable**
encoding only. Larger value = faster. It is *not* what the UI shows — display pace is recomputed
from `duration` + `distance` per sport (`formats/get-pace`), so `pace` exists purely for
`ORDER BY`/range filtering. (Rewrite: a generated stored column, per `plan1` §5.)

### display pace units (per sport — for reference, computed at display time)
- **min/km** (default): `(duration/6000) / (distance/1000)` → minutes per km
- **km/h** (cycling, roller ski/blade, kickbike, cyclocross…): `(distance/1000) / (duration/360000)`
- **/500 m** (rowing): pace over 500 m
- **/100 m** (swimming): pace over 100 m

(The sport→unit table lives in `formats/pace-conversion-fun`; it moves to the FE.)

## avghr — **bpm** (integer)

Stored as a plain integer beats-per-minute (`parse-natural` → `Integer`). `0`/absent = no HR.

## detail fields — **plain integers, unit per field**

Parsed via `mutate/positive-short` (non-negative `Short`), keyed by any `detail*` param:
- `detailRepeats` — count (kpl)
- `detailVolume` — kilograms (kg)
- `detailElevation` — meters (m)

(Range: non-negative 16-bit short, i.e. 0–32767. Note this cap if migrating elevation/volume.)

## dates — **BSON dates (joda `DateTime`)**, stored as instants

`creationDate`, `lastModifiedDate`, and comment `date` are real date objects (serialized via
`monger.joda-time`), **not** strings.
- `creationDate`: parsed from the user's date (`dd.MM.yyyy` / `yyyy-MM-dd` / `dd/MM/yyyy` /
  `yyyy/MM/dd`) and **shifted +12 h** (`parse-date` adds 12 hours so the day lands at noon,
  avoiding timezone date-rollover). Empty input → now.
- `lastModifiedDate`: set to now on create/comment/care; on edit it is **preserved** unless the
  exercise is older than 43200 minutes (30 days), in which case `get-last-modified` keeps the
  original creation date. Used as the default feed sort key and for "isNew".
- comment `date`: stored already humanized in legacy (`to-human-comment-date`) — ⚠️ a string, not
  an instant. The rewrite should store comment timestamps as real instants too.

## tags — **array of strings**

`parse-tags`: comma-split, trimmed, `/`→`-` (`cleanse-tag`), empties dropped.

---

## Derived display metrics (not stored — computed from the above + profile)

- **Syke-% / HR reserve** (`formats/get-heart-rate-reserve`): `round(100*(avghr-resthr)/(maxhr-resthr))`
  using the user's profile `resthr`/`maxhr`; `%` string.
- **Etenemä / bpmdist** (`formats/get-bpmdist`): `distance / ((avghr-resthr) * duration / 6000)`
  → meters per heartbeat (`"m/b"`). Needs profile `resthr`.

## Profile fields (in `onuser.profile`) — **integers**

`resthr`, `maxhr` (bpm), `aerk`, `anaerk` (aerobic/anaerobic threshold HR, bpm), all via
`parse-natural`. Defaults on user creation: `resthr 42`, `maxhr 192`.

---

## Quick reference

| Field | Stored unit | 1 unit means | Example (stored → shown) |
|---|---|---|---|
| `duration` | centiseconds | 1/100 s | `366000` → `1 h 1 min` |
| `distance` | meters | 1 m | `5200` → `5,2 km` |
| `pace` | int `dist/dur*360000` | sort key (higher = faster) | filter/sort only |
| `avghr` | bpm | 1 beat/min | `145` → `145` |
| `detailRepeats` | count | 1 rep | `20` → `20 kpl` |
| `detailVolume` | kilograms | 1 kg | `1500` → `1500 kg` |
| `detailElevation` | meters | 1 m | `850` → `850 m` |
| `creationDate` / `lastModifiedDate` | BSON date (instant) | — | noon-shifted day |
| comment `date` | **string** (legacy) | — | `"dd.MM.yyyy HH:mm"` |
| `tags` | string[] | — | `["pitkä","kynnys"]` |
