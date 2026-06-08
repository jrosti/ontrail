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

## 1. Source schema (Mongo `ontrail` DB) — reconstructed from code

Collections (`mongodb.clj`): `exercise`, `onuser`, `groups`, `nccache`, `onsport`.

### `exercise` — from `mutate/from-user-ex` etc., **reconciled with live data [audit]**
Type column shows what is *actually stored* (not the idealized code type). 100% = present on all
374,182 docs.
```
_id              ObjectId         100%
user             string           100%   # author username (FK by name); 375 distinct, 2 orphan (§4)
sport            string           100%   # 75 distinct values incl. malformed "Paino:" (§4)
title            string           100%   # 13 still ""; blank→sport fallback not always applied
body             string           100%   # 49,426 (13%) are ""
creationDate     BSON date        100%   # noon-shifted (+12h); 10 garbage (<yr2000) + 4 future (§4)
lastModifiedDate BSON date        100%   # feed sort key; 28 garbage (<2005)
duration         long|int|null    100%   # centiseconds. long 315,171 / int 58,855 / null 156; 368 are 0
distance         long|int|null    100%   # meters.       long 298,991 / int 74,854 / null 337; 12,920 are 0
avghr            int|long|null    100%   # bpm — TRI-STATE: null 205,214 / 0 → 38,720 / >0 → 130,248
pace             int|null         95.2%  # derived; absent 18,067 / null 2,123; formula EXACT (0 mismatch)
tags             [string]         100%   # 98,540 docs have ≥1; 5,493 distinct tags; all strings
detailElevation  int              5.8%   # 21,861 docs; m;  max 27,000 (UNDER short cap)
detailRepeats    int              0.8%   # 2,851 docs; kpl; max 2,000
detailVolume     int              0.1%   # 301 docs;   kg;  max 10,960
comments         [ … ]            80.8%  # array present (often []); non-empty on 42,862; 186,007 total
cares            [ … ]            13.3%  # present only when non-empty; 49,810 docs; 144,591 total

# UNDOCUMENTED fields (legacy treenit.net / Heia importers) — not in units.md [audit]
detail           object           0.3%   # 965 docs: {weight(g), resthr, temperature, comment}
detailKcal       int              0.1%   # 252 docs: calories (a 4th detail metric)
origin           string           0.3%   # 965 docs: import source, single value "treenit.net"
hid              long             2.6%   # 9,557 docs: external import id

comment subdoc: { _id?:ObjectId, user:string, body:HTML, date:STRING, avatar:string, title?:string }
                # _id MISSING on 46 (same 46 carry legacy `title`); date is a STRING on 100%
cares  subdoc:  { user:string, avatar:string }   # a SET (addToSet); no timestamp
```
⚠️ **comment `date` is a humanized STRING** (`"dd.MM.yyyy[ HH:mm]"`), not an instant. ⚠️ `avatar`
in comments/cares is a Gravatar URL snapshotted at write time — **redundant** (330,598 of them;
recompute from email). ⚠️ **`did`/`verb` is NOT stored** — computed at read time; nothing to
migrate.

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
- **`onsport`** — `{_id: sportId}` registry written only by the (dropped) importer; sport list is
  now an FE constant. Drop.

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
  user_id         bigint not null references app_user(id),  -- orphans aliased/placeholdered first (§4 Q1)
  sport           text not null,
  title           text not null,
  body            text,                      -- sanitized HTML
  created_at      timestamptz not null,      -- from creationDate (garbage/future clamped to sane date, §4 Q5)
  last_modified_at timestamptz not null,
  duration        integer,                   -- centiseconds; NULL allowed (source has nulls)
  distance        integer,                   -- meters; NULL allowed; NULL'd on the 898 dur=0&dist>0 docs (§4 Q8)
  avghr           integer,                   -- bpm; 0→NULL + 12 outliers(>230)→NULL on load (§4 Q3); NULL = no HR
  pace            integer generated always as
                    (case when duration > 0 then round(distance::numeric/duration*360000) end) stored,
  tags            text[] not null default '{}',
  detail_repeats   integer, detail_volume integer, detail_elevation integer,
  detail_kcal      integer,                  -- [audit] 252 docs (Q6)
  source           text                      -- [audit] from `origin` (965 docs, "treenit.net"); else NULL (Q7)
  -- dropped: `hid`, `detail.{weight,resthr,temperature,comment}`, `mdbody` (see §3/§4)
);
create index on exercise (last_modified_at desc);
create index on exercise (user_id);
create index on exercise using gin (tags);
create index on exercise using gin (to_tsvector('finnish',
       coalesce(title,'')||' '||coalesce(body,'')));   -- plan0 FTS

create table comment (
  id            bigint generated always as identity primary key,
  exercise_id   bigint not null references exercise(id) on delete cascade,
  user_id       bigint not null references app_user(id),  -- 6,097 orphan-author comments handled in §4 Q1
  body          text,                        -- sanitized HTML
  created_at    timestamptz,                 -- parsed from legacy STRING; minute precision, some date-only
  seq           integer not null,            -- array position; ONLY reliable order (46 comments lack _id)
  legacy_object_id char(24)                  -- NULL for the 46 _id-less legacy comments
  -- dropped: `avatar` (recompute), `title` (46 legacy rows)
);

create table care (
  exercise_id bigint not null references exercise(id) on delete cascade,
  user_id     bigint not null references app_user(id),
  primary key (exercise_id, user_id)         -- was an addToSet set
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
| `_id` (ObjectId) | `legacy_object_id` (char24) + new identity PK | Keep hex for permalinks & for resolving body/comment cross-references; new PK for FKs. |
| `exercise.user` (name) | `exercise.user_id` | Resolve via `app_user.username`. **[audit]** 2 orphan authors (`j.satta` 12, `tatteus` 2) — alias/placeholder per §4 Q1 *before* the FK, don't fail loudly (they exist for real). |
| `creationDate` | `created_at` | **Already noon-shifted (+12h)** — keep the shift (users picked the day, not the time); do **not** "correct." **[audit]** Clean the 10 garbage (`<yr2000`, incl. epoch parse-fails) + 4 future dates first (§4 Q5). |
| `lastModifiedDate` | `last_modified_at` | Direct. **[audit]** 28 garbage (`<2005`) cleaned as above. **Do not** touch the 28,371 `created_at > last_modified_at` rows — that's the expected noon-shift artifact, not corruption. |
| `duration`/`distance`/`avghr`/`detail*` | same | **[audit] Source is mixed `NumberLong`/`int`/`null`, not clean ints** — cast `(doc->>'f')::bigint` → `integer` (all values fit), `null`→SQL NULL (§4 Q2). `avghr`: **`0`→NULL and clamp the 12 `>230` outliers→NULL** (§4 Q3); keep the 364 in (0,30). **`distance`→NULL on the 898 `duration=0 & distance>0` docs** (§4 Q8). `detail*` → `integer`; **no stored value clips the old 32767 cap** (max elevation 27,000), so this is forward-safety only. |
| `pace` | generated column | Don't copy the stored value; recompute via the generated column. **[audit]** Formula verified **exact (0/45,810 mismatches)** — safe. |
| `tags` | `text[]` | Direct; all 139,020 instances are strings (no bad types). |
| `body` | `body` | **Sanitize HTML** on load (allowlist). **Embedded `<img src=blog.ontrail.net…>` left as-is** (§4) — keep `img` in the allowlist. |
| `mdbody` | — | Drop. **[audit]** 3,554 docs (only 2,130 non-empty). |
| `detail.*` / `detailKcal` / `origin` / `hid` | `detail_kcal`, `source`, else drop | **[audit] undocumented importer fields.** `detailKcal`(252)→`detail_kcal`; `origin`(965)→`source`; **drop `hid`**(9,557) and the `detail` object (965; extract `detail.weight` only if a bodyweight feature ships) — §4 Q6/Q7. |
| `comments[]` | `comment` rows | Explode; `user`→`user_id` (**6,097 orphan-author comments** — §4 Q1); **parse `date` string → `created_at`** (`dd.MM.yyyy[ HH:mm]`, TZ-naive Europe/Helsinki, minute precision, **some date-only**); `seq` = array index (**only reliable order — 46 lack `_id`**); drop `avatar` + legacy `title`. |
| `cares[]` | `care` rows | Explode set → `(exercise_id, user_id)`; drop `avatar`; no timestamp. **[audit]** 265 cares by orphan `Ursa Minor` — §4 Q1. |
| `onuser.*` | `app_user.*` | Flatten `profile.*` into columns. Keep `password_hash` **verbatim** (scrypt bridge). `email` carried (private); **1 user has no email** (default-avatar). Skip/handle `username="nobody"`; create `[deleted]` placeholder for orphans (§4 Q1). |
| `groups.users[]` | `group_member` | Explode to join rows; resolve usernames. |
| `nccache`, `onsport` | — | Drop. |

### Auth migration (per highlevel-plan)
scrypt hashes are standard MCF and re-verifiable, so: import `password_hash` as-is →
on next login verify against scrypt → enroll passkey / re-issue under Hanko → sunset scrypt.
No password reset needed if emails are good.

---

## 4. Data cleanup / edge cases (decide before normalize step)

1. **Embedded images in bodies** — `plan0` dropped image hosting. Historical `body`/comment HTML
   contains `<img src="http://blog.ontrail.net/…">`. **Decision (§7): leave as-is** — keep the
   URLs, keep `img` in the HTML sanitizer allowlist. They render while `blog.ontrail.net` lives
   and become broken-image icons once it's shut off. Implication: that image service (or at least
   its read path / a static mirror of the image files) must stay reachable to preserve old
   images, even though no new uploads are accepted.
2. **HTML sanitization** — bodies and comments are raw editor HTML; run an allowlist sanitizer at
   migration *and* enforce on write going forward (plan1 carry-over).
3. **Comment timestamps are lossy** — only a TZ-naive `dd.MM.yyyy HH:mm` string exists; migrate to
   minute precision, no seconds, assume Europe/Helsinki. `seq` preserves intra-exercise order.
4. **Orphans [audit] — BLOCKS the NOT NULL FKs (highest priority, Q1).** Measured: **authors** 2
   users / 14 ex (`j.satta` 12, `tatteus` 2); **comment authors** 5 users / 6,097 comments
   (`Ursa Minor` 5,796, `kettis` 128, `Elmo` 96, `Jiihoo` 47, `Murakami` 30); **care users** 1 /
   265 (`Ursa Minor`). Default: alias the obvious rename (`j.satta`→`jsatta`), one `[deleted]`
   placeholder absorbs the rest, **keep all content**. Build the username→id map (incl. aliases +
   placeholder) before normalizing.
5. **`nobody` / `admin`** — don't create a real `nobody` account; `admin` migrates normally.
6. **Title fallback** mostly applied on write; **[audit]** 13 docs still have `title=""` —
   backfill to `sport` on load.
7. **[audit] Mixed numeric types** — `duration`/`distance`/`avghr` stored as `NumberLong` **and**
   `int` **and** `null`; the staging→typed cast must coerce all three (Q2).
8. **[audit] `avghr` tri-state** — null 205,214 / `0` 38,720 / `>0` 130,248. Treat `0` as NULL
   (no 0-bpm hearts); decide the 12 `>230` and 364 `(0,30)` outliers (Q3).
9. **[audit] Garbage / future dates** — 10 `creationDate <yr2000` (incl. epoch parse-fails),
   4 future, 28 `lastModifiedDate <2005`. **Clamp** these ~14 + 28 to a sane date (sibling date /
   plausible bound), **not** null (Q5); **leave** the 28,371 expected noon-shift inversions.
10. **[audit] Sport tail** — 75 distinct incl. malformed `"Paino:"` (7, weight logging) and
    `"lumityö"` (2). Normalize/map the fringe; keep the `YHTEENSÄ` exclusion set
    (`Sairaus`/`Hieronta`/`Tapahtuma`/`Lepo`) for summaries (Q4).
11. **[audit] Undocumented importer fields** — `detail`(965)/`detailKcal`(252)/`origin`(965)/
    `hid`(9,557): keep `detail_kcal`+`source`, drop the rest (Q6/Q7).
12. **[audit] Legacy comments** — 46 lack `_id` and carry a `title`; rely on `seq`, drop `title` (Q9).
13. **[audit] `duration=0 & distance>0`** — 898 docs. **Null the `distance`** (unmeasured movement);
    `duration` stays 0/NULL, generated `pace` stays NULL (Q8).

---

## 5. Procedure

1. **Dump**: `mongodump` the legacy DB (also the off-box encrypted archive from highlevel-plan).
2. **Load raw**: import each collection into a staging table as `jsonb` (1:1, verifiable) —
   `stage_exercise(doc jsonb)`, etc.
3. **Resolve identities first [audit]**: build the username→id map **including** the orphan
   aliases and the `[deleted]` placeholder (§4 #4), and the group-name→id map. Nothing FK-bound
   loads until this map covers every author/commenter/carer name in the data.
4. **Normalize**: SQL `INSERT … SELECT` from staging into the §2 tables in dependency order
   (`app_user` → `grp`/`group_member` → `exercise` → `comment`/`care`), applying §3 rules —
   including the numeric coercion (§4 #7), `avghr 0→NULL` (#8), date cleaning (#9), sport mapping
   (#10), and field drops (#11–#12).
5. **Verify** (§6).
6. **Cut over** behind the deadline from highlevel-plan.

Keep staging tables until acceptance passes — re-runnable, idempotent (truncate-and-reload).

---

## 6. Verification / acceptance

- **Counts** match the **[audit] measured source totals**: exercises **374,182**, users **672**
  (+ `[deleted]` placeholder if created), comments **186,007** (= sum of array lengths), cares
  **144,591**, tag instances **139,020**. Group memberships from `groups.users[]`.
- **Spot totals**: per-user `sum(duration)`, `sum(distance)`, `count(*)` equal the legacy
  summary numbers for several users (catches unit/aggregation drift). Cross-check against the
  live API still running locally (`/rest/v1/summary/:user`).
- **Orphan reconciliation [audit]**: every one of the 375 authors + all comment/care users
  resolves to an `app_user.id` (0 unresolved); the alias map (`j.satta`→`jsatta`) and placeholder
  routing produced the expected row moves.
- **Permalinks**: a sample of `legacy_object_id`s resolve.
- **Search**: known queries return the expected exercises (FTS parity vs the old index).
- **Auth**: a test user logs in against the migrated scrypt hash.
- **Acceptance (highlevel-plan)**: primary user runs her usual stats/searches with no regression.
- **Report**: print rows touched by each cleanup — orphans aliased/placeholdered/dropped,
  `avghr 0→NULL` (38,720) and outliers, cleaned garbage/future dates (~14 + 28), sport
  remappings, dropped fields (`hid` 9,557 / `detail` 965 / `mdbody` 3,554). `detail*` at the
  32767 cap is now known to be **0** rows — keep the check as a regression guard.

---

## 7. Decisions (2026-06-09)
1. **Embedded images → leave as-is.** Keep the `blog.ontrail.net` `<img>` URLs and the `img`
   allowlist entry; no stripping, no rehosting. ⇒ **the image service's read path must stay
   alive** (or be mirrored as static files) for old images to keep showing; new uploads remain
   off (plan0).
2. **Permalinks → keep `legacy_object_id`.** Store the old ObjectId hex on `app_user`,
   `exercise`, `grp` (as in §2 DDL) and resolve/redirect old `#ex/<hex>` / `#user/<name>` /
   `#group/<name>` links to the new IDs. Preserves shared links and any in-body cross-references.
3. **Data-cleanup decisions → ANSWERED 2026-06-09** (full table + rationale in
   `plan4-exercise-data-audit.md` §11). Summary, with the ones that **diverge from the earlier
   default** called out:
   - **Q1 orphans:** alias `j.satta`→`jsatta`; all other orphans → one `[deleted]` placeholder; 0 rows lost.
   - **Q2 numerics:** `integer`, null→SQL NULL.
   - **Q3 avghr:** `0`→NULL **and clamp the 12 `>230` outliers to NULL** (definitive, not optional); keep the 364 in (0,30).
   - **Q4 sport:** canonical list + map the ~9–13 glitch docs; keep the `YHTEENSÄ` exclusion set.
   - **Q5 dates → CLAMP, not null** *(diverges from the §3/§4 "null/clamp" default)*: clamp the ~14 garbage + 4 future + 28 old to a sane date (sibling date / plausible bound); leave the 28,371 inversions.
   - **Q6:** keep `detail_kcal` (252); drop the whole `detail` object (965).
   - **Q7:** keep `origin`→`source` (965); drop `hid` (9,557).
   - **Q8 dur=0 → SET `distance`→NULL** *(new rule)*: for the 898 `duration=0 & distance>0` docs, null the distance (unmeasured movement); pace stays NULL via the generated column.
   - **Q9:** comments order by `seq`; drop the legacy `title` (46).
   - **Q10:** drop `mdbody` (3,554).
   - **Q11:** drop the 330,598 avatar snapshots; recompute from email.
   - **Q12:** `pace` = generated column.
   - **title="":** backfill `title`=`sport` (13 docs).
