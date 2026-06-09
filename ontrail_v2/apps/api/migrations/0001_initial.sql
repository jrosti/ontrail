create table if not exists sports (
  key text primary key,
  name_fi text not null,
  name_en text not null,
  glyph text not null,
  color text not null,
  metric text not null check (metric in ('pace', 'speed', 'reps', 'time')),
  pace_unit text not null check (pace_unit in ('min/km', 'km/h', 'min/100m', 'min/500m')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  hanko_subject text unique,
  username text not null unique,
  normalized_username text not null unique,
  email text,
  display_name text not null,
  avatar_initials text not null,
  avatar_color text not null,
  synopsis text,
  legacy_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists exercises (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references users(id) on delete cascade,
  sport_key text not null references sports(key),
  title text not null,
  body_html text,
  body_markdown text,
  tags text[] not null default '{}',
  exercise_date date not null,
  duration_sec integer not null check (duration_sec >= 0),
  distance_m integer check (distance_m >= 0),
  avg_hr integer check (avg_hr > 0),
  climb_m integer check (climb_m >= 0),
  feel_rating text check (feel_rating in ('easy', 'ok', 'hard')),
  details jsonb not null default '{}'::jsonb,
  gpx_points jsonb,
  legacy_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists exercises_feed_idx on exercises (exercise_date desc, created_at desc);
create index if not exists exercises_owner_date_idx on exercises (owner_id, exercise_date desc);
create index if not exists exercises_sport_date_idx on exercises (sport_key, exercise_date desc);
create index if not exists exercises_tags_idx on exercises using gin (tags);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references exercises(id) on delete cascade,
  author_id uuid not null references users(id) on delete cascade,
  body text not null,
  legacy_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists comments_exercise_created_idx on comments (exercise_id, created_at asc);

create table if not exists cares (
  exercise_id uuid not null references exercises(id) on delete cascade,
  author_id uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (exercise_id, author_id)
);
