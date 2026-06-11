-- exercises: generated columns, extra columns, indexes
alter table exercises
  add column if not exists pace integer
    generated always as (
      case when duration_sec > 0 and distance_m is not null
        then round(distance_m::numeric / duration_sec * 360)
      end
    ) stored;

alter table exercises add column if not exists detail_kcal integer;
alter table exercises add column if not exists source text;
alter table exercises add column if not exists legacy_object_id char(24) unique;

alter table exercises
  add column if not exists search_vec tsvector
    generated always as (
      to_tsvector('finnish', coalesce(title, '') || ' ' || coalesce(body_html, ''))
    ) stored;

create index if not exists exercises_search_vec_idx on exercises using gin (search_vec);
create index if not exists exercises_pace_idx on exercises (pace);

-- users: extra columns
alter table users add column if not exists legacy_object_id char(24) unique;
alter table users add column if not exists resthr integer;
alter table users add column if not exists maxhr integer;
alter table users add column if not exists aerk integer;
alter table users add column if not exists anaerk integer;
alter table users add column if not exists goals text;
alter table users add column if not exists password_hash text;

-- groups
create table if not exists groups (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  normalized_name text not null unique,
  description text,
  legacy_object_id char(24) unique,
  created_at timestamptz not null default now()
);

create table if not exists group_members (
  group_id uuid not null references groups(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);

create table if not exists user_visit (
  user_id uuid primary key references users(id) on delete cascade,
  last_visit timestamptz not null default now()
);
