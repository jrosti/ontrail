# plan2 — data migration: Mongo → Postgres

Defines the **source schema**, the **target Postgres schema**, and the **field-by-field
conversion** including the known hazards. Units are fixed by `units.md`; scope (kept/dropped) by
`plan0-sanity.md`; the raw-data contract by `plan1-thin-backend.md`. Strategy follows
`highlevel-plan.md`: load the mongodump as JSONB 1:1, normalize into real tables via SQL, verify,
cut over.

> **Updated 2026-06-09 against the live dump.** The source schema below was originally
> reconstructed from code; it has now been **reconciled with the actual restored data**
> (374,182 exercises) — see `plan4-exercise-data-audit.md` for the full profile. Real-data
> deltas are folded in here and tagged **[audit]**. The audit's §11 questionnaire (Q1–Q12) holds
> the open decisions; this plan adopts the suggested defaults unless that questionnaire says
> otherwise. Measured population: **374,182 exercises · 672 users · 375 distinct authors ·
> 186,007 comments · 144,591 cares**.

---

## 1. Source schema (Mongo `ontrail` DB) — reconciled with live data [audit]

### `exercise` — 100% presence unless noted

```
_id              ObjectId         100%
user             string           100%   # author username; 375 distinct, 2 orphan (§4)
sport            string           100%   # 75 distinct values incl. malformed "Paino:"
title            string           100%   # 13 still ""; blank→sport fallback not always applied
body             string           100%   # 49,426 (13%) are ""
creationDate     BSON date        100%   # noon-shifted (+12h); 10 garbage (<yr2000) + 4 future
lastModifiedDate BSON date        100%   # feed sort key; 28 garbage (<2005)
duration         long|int|null    100%   # centiseconds. long 315,171 / int 58,855 / null 156; 368 are 0
distance         long|int|null    100%   # meters.       long 298,991 / int 74,854 / null 337; 12,920 are 0
avghr            int|long|null    100%   # bpm — TRI-STATE: null 205,214 / 0 → 38,720 / >0 → 130,248
pace             int|null         95.2%  # derived; absent 18,067 / null 2,123; formula EXACT
tags             [string]         100%   # 98,540 docs have ≥1; 5,493 distinct tags
detailElevation  int              5.8%   # 21,861 docs; m;  max 27,000
detailRepeats    int              0.8%   # 2,851 docs; kpl; max 2,000
detailVolume     int              0.1%   # 301 docs;   kg;  max 10,960
comments         [ … ]            80.8%  # non-empty on 42,862; 186,007 total
cares            [ … ]            13.3%  # present only when non-empty; 49,810 docs; 144,591 total

# UNDOCUMENTED fields (legacy treenit.net / Heia importers)
detail           object           0.3%   # 965 docs: {weight(g), resthr, temperature, comment}
detailKcal       int              0.1%   # 252 docs: calories (a 4th detail metric)
origin           string           0.3%   # 965 docs: import source, single value "treenit.net"
hid              long             2.6%   # 9,557 docs: external import id

comment subdoc: { _id?:ObjectId, user:string, body:HTML, date:STRING, avatar:string, title?:string }
                # _id MISSING on 46 (same 46 carry legacy `title`); date is a STRING on 100%
cares  subdoc:  { user:string, avatar:string }   # a SET (addToSet); no timestamp
```

⚠️ **comment `date` is a humanized STRING** (`"dd.MM.yyyy[ HH:mm]"`), not an instant.
⚠️ `avatar` in comments/cares is a Gravatar URL snapshotted at write time — **redundant** (330,598
of them; recompute from email).
⚠️ **`did`/`verb` is NOT stored** — computed at read time; nothing to migrate.

### `onuser` — from `user/create-user`, `profile/post-profile`

```
_id          ObjectId
username     string        # natural key, used in URLs
lusername    string        # lower(username), uniqueness/lookup
passwordHash string        # scrypt MCF: $s0$e0801$salt$hash  (lambdaworks 16384/8/1)
email        string        # PRIVATE (never exposed); drives Gravatar hash
gravatar     boolean       # whether to use Gravatar vs default image
profile      { resthr:int, maxhr:int, aerk:int?, anaerk:int?, goals:string?, synopsis:string? }
```

Sentinels: `username = "nobody"` is the anonymous sentinel (not a real account); `admin` is a
normal account treated specially in some filters.

### `groups` — from `group.clj`

```
_id          ObjectId
name         string        # natural key, used in URLs
lname        string        # lower(name)
description  string
users        [string]      # member usernames
```

### Dropped collections

- **`nccache`** — per-user unread-comment cache `{u, ref}`; derived, recomputed in SQL. Drop.
- **`onsport`** — `{_id: sportId}` registry written only by the (dropped) importer; sport list is now an FE constant. Drop.

---

## 2. Target Postgres schema (DDL sketch)

Surrogate keys + a `legacy_object_id` on permalinked entities so old `#ex/<hex>` /
`#user/<name>` / `#group/<name>` links keep working.

```sql
create table app_user (
  id            bigint generated always as identity primary key,
  username      text not null unique,
  lusername     text not null unique,
  password_hash text not null,              -- scrypt MCF, verified as-is (bridge)
  email         text,                       -- private
  gravatar      boolean not null default true,
  resthr int, maxhr int, aerk int, anaerk int,
  goals text, synopsis text,
  legacy_object_id char(24) unique
);

create table exercise (
  id              bigint generated always as identity primary key,
  legacy_object_id char(24) unique,         -- old permalink + body/comment cross-refs
  user_id         bigint not null references app_user(id),
  sport           text not null,
  title           text not null,
  body            text,                      -- sanitized HTML
  created_at      timestamptz not null,      -- from creationDate (garbage/future clamped)
  last_modified_at timestamptz not null,
  duration_sec    integer,                   -- seconds (÷100 from centiseconds); NULL allowed
  distance_m      integer,                   -- meters; NULL allowed; NULL'd on 898 dur=0&dist>0
  avghr           integer,                   -- bpm; 0→NULL + 12 outliers(>230)→NULL on load
  pace            integer generated always as
                    (case when duration_sec > 0 then round(distance_m::numeric/duration_sec*360) end) stored,
  tags            text[] not null default '{}',
  detail_repeats   integer, detail_volume integer, detail_elevation integer,
  detail_kcal      integer,                  -- [audit] 252 docs
  source           text,                     -- [audit] from `origin` (965 docs, "treenit.net")
  search_vec      tsvector generated always as (
    to_tsvector('finnish', coalesce(title,'') || ' ' || coalesce(body,''))
  ) stored
);
create index on exercise (last_modified_at desc);
create index on exercise (user_id);
create index on exercise using gin (tags);
create index on exercise using gin (search_vec);

create table comment (
  id            bigint generated always as identity primary key,
  exercise_id   bigint not null references exercise(id) on delete cascade,
  user_id       bigint not null references app_user(id),
  body          text,                        -- sanitized HTML
  created_at    timestamptz,                 -- parsed from legacy STRING; minute precision
  seq           integer not null,            -- array position; ONLY reliable order
  legacy_object_id char(24)                  -- NULL for the 46 _id-less legacy comments
);

create table care (
  exercise_id bigint not null references exercise(id) on delete cascade,
  user_id     bigint not null references app_user(id),
  primary key (exercise_id, user_id)
);

create table grp (
  id bigint generated always as identity primary key,
  name text not null unique, lname text not null unique,
  description text, legacy_object_id char(24) unique
);
create table group_member (
  group_id bigint not null references grp(id),
  user_id  bigint not null references app_user(id),
  primary key (group_id, user_id)
);

create table user_visit (                    -- replaces nccache last-visit tracking
  user_id bigint primary key references app_user(id),
  last_visit timestamptz
);
```

---

## 3. Field-by-field conversion rules

| Source | Target | Rule / hazard |
|---|---|---|
| `_id` (ObjectId) | `legacy_object_id` (char24) + new identity PK | Keep hex for permalinks. |
| `exercise.user` (name) | `exercise.user_id` | Resolve via `app_user.username`. **[audit]** 2 orphan authors — alias/placeholder per §4 Q1. |
| `creationDate` | `created_at` | **Already noon-shifted** — keep the shift. **[audit]** Clean the 10 garbage + 4 future dates (§4 Q5). |
| `lastModifiedDate` | `last_modified_at` | Direct. **[audit]** 28 garbage cleaned. **Do not** touch the 28,371 `created_at > last_modified_at` rows — expected noon-shift artifact. |
| `duration` (centiseconds) | `duration_sec` (seconds) | **Divide by 100**. Cast `(doc->>'duration')::bigint / 100`; null→SQL NULL. |
| `distance` | `distance_m` | Cast `(doc->>'distance')::bigint`; null→SQL NULL. **`distance`→NULL on the 898 `duration=0 & distance>0` docs.** |
| `avghr` | `avghr` | Cast; **`0`→NULL and clamp the 12 `>230` outliers→NULL** (§4 Q3); keep the 364 in (0,30). |
| `pace` | generated column | Don't copy; recompute. Formula verified exact (0/45,810 mismatches). |
| `tags` | `text[]` | Direct; all strings. |
| `body` | `body` | **Sanitize HTML** on load (allowlist). Keep `<img>` in the allowlist (§4 #1). |
| `mdbody` | — | Drop (3,554 docs). |
| `detail.*` / `detailKcal` / `origin` / `hid` | `detail_kcal`, `source`, else drop | `detailKcal`(252)→`detail_kcal`; `origin`(965)→`source`; **drop `hid`**(9,557) and the `detail` object (965). |
| `comments[]` | `comment` rows | Explode; `user`→`user_id` (6,097 orphan-author comments — §4 Q1); **parse `date` string → `created_at`** (`dd.MM.yyyy[ HH:mm]`, TZ-naive Europe/Helsinki); `seq` = array index; drop `avatar` + legacy `title`. |
| `cares[]` | `care` rows | Explode set → `(exercise_id, user_id)`; drop `avatar`. |
| `onuser.*` | `app_user.*` | Flatten `profile.*` into columns. Keep `password_hash` **verbatim** (scrypt bridge). `email` carried (private). Skip `username="nobody"`; create `[deleted]` placeholder for orphans. |
| `groups.users[]` | `group_member` | Explode to join rows; resolve usernames. |
| `nccache`, `onsport` | — | Drop. |

### Auth migration
scrypt hashes are standard MCF and re-verifiable: import `password_hash` as-is →
on next login verify against scrypt → enroll passkey / re-issue under Hanko → sunset scrypt.

---

## 4. Data cleanup / edge cases (all decided 2026-06-09)

1. **Embedded images in bodies** — historical `body`/comment HTML contains `<img src="http://blog.ontrail.net/…">`. **Decision: leave as-is** — keep the URLs, keep `img` in the HTML sanitizer allowlist. The image service read path must stay reachable.
2. **HTML sanitization** — bodies and comments are raw editor HTML; run an allowlist sanitizer at migration *and* enforce on write going forward.
3. **Comment timestamps are lossy** — only a TZ-naive `dd.MM.yyyy HH:mm` string exists; migrate to minute precision, assume Europe/Helsinki. `seq` preserves intra-exercise order.
4. **Orphans — BLOCKS the NOT NULL FKs.** Default: alias `j.satta`→`jsatta`, one `[deleted]` placeholder absorbs the rest, **keep all content**.
5. **`nobody` / `admin`** — don't create a real `nobody` account; `admin` migrates normally.
6. **Title fallback** — 13 docs still have `title=""`; backfill to `sport` on load.
7. **Mixed numeric types** — `duration`/`distance`/`avghr` stored as `NumberLong` **and** `int` **and** `null`; cast must coerce all three.
8. **`avghr` tri-state** — treat `0` as NULL; clamp 12 `>230` outliers to NULL.
9. **Garbage / future dates** — clamp ~14 + 28 to a sane date; leave the 28,371 noon-shift inversions.
10. **Sport tail** — 75 distinct incl. malformed `"Paino:"`. Normalize/map the fringe; keep the `YHTEENSÄ` exclusion set.
11. **Undocumented importer fields** — keep `detail_kcal` + `source`, drop the rest.
12. **Legacy comments** — 46 lack `_id` and carry a `title`; rely on `seq`, drop `title`.
13. **`duration=0 & distance>0`** — 898 docs. Null the `distance`.

---

## 5. Procedure

1. **Dump**: `mongodump` the legacy DB (also the off-box encrypted archive from highlevel-plan).
2. **Load raw**: import each collection into a staging table as `jsonb` — `stage_exercise(doc jsonb)`, etc.
3. **Resolve identities first**: build the username→id map **including** the orphan aliases and the `[deleted]` placeholder, and the group-name→id map. Nothing FK-bound loads until this map covers every author/commenter/carer name in the data.
4. **Normalize**: SQL `INSERT … SELECT` from staging into the §2 tables in dependency order (`app_user` → `grp`/`group_member` → `exercise` → `comment`/`care`), applying §3 rules.
5. **Verify** (§6).
6. **Cut over** behind the deadline from highlevel-plan.

Keep staging tables until acceptance passes — re-runnable, idempotent (truncate-and-reload).

---

## 6. Verification / acceptance

- **Counts** match the measured source totals: exercises **374,182**, users **672** (+ `[deleted]` placeholder if created), comments **186,007**, cares **144,591**, tag instances **139,020**.
- **Spot totals**: per-user `sum(duration_sec)`, `sum(distance_m)`, `count(*)` equal the legacy summary numbers for several users.
- **Orphan reconciliation**: every one of the 375 authors + all comment/care users resolves to an `app_user.id` (0 unresolved).
- **Permalinks**: a sample of `legacy_object_id`s resolve.
- **Search**: known queries return the expected exercises.
- **Auth**: a test user logs in against the migrated scrypt hash.
- **Acceptance (highlevel-plan)**: primary user runs her usual stats/searches with no regression.
- **Report**: print rows touched by each cleanup.

---

## 7. Decisions (2026-06-09)

1. **Embedded images → leave as-is.** Keep `img` in the allowlist; the image service read path must stay alive.
2. **Permalinks → keep `legacy_object_id`.** Resolve/redirect old `#ex/<hex>` links to new IDs.
3. **All Q1–Q12 answered** — see `plan4-exercise-data-audit.md` §11 for full rationale.
