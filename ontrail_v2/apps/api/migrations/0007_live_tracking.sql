-- Live tracking: an in-progress workout streamed from a phone/watch app.
--
-- A session is owned by a user and watched through an unguessable `share_token`
-- (public link, no login). Points are keyed by a client-supplied `seq` so a flaky
-- mobile connection can safely retry a batch. Finishing a session converts it into a
-- regular `exercises` row (`exercise_id`); discarding it deletes the track.

create table if not exists live_sessions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references users(id) on delete cascade,
  share_token text not null unique,
  sport_key text not null references sports(key),
  title text not null default '',
  status text not null default 'active' check (status in ('active', 'finished', 'discarded')),
  started_at timestamptz not null default now(),
  last_point_at timestamptz,
  ended_at timestamptz,
  -- Running totals, updated as batches arrive. Recomputed exactly from all points on finish.
  distance_m double precision not null default 0 check (distance_m >= 0),
  point_count integer not null default 0 check (point_count >= 0),
  last_seq integer,
  last_lat double precision,
  last_lon double precision,
  last_hr integer,
  exercise_id uuid references exercises(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- At most one active session per user (race-free guard for POST /api/live).
create unique index if not exists live_sessions_one_active_idx
  on live_sessions (owner_id) where status = 'active';

create table if not exists live_points (
  session_id uuid not null references live_sessions(id) on delete cascade,
  seq integer not null check (seq >= 0),
  recorded_at timestamptz not null,
  lat double precision not null check (lat between -90 and 90),
  lon double precision not null check (lon between -180 and 180),
  ele real,
  hr integer check (hr is null or hr between 20 and 250),
  primary key (session_id, seq)
);
