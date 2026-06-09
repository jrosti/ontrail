-- ── Missing indexes ───────────────────────────────────────────────────────────

-- Summary queries group by (owner_id, sport_key) and filter by year — a
-- composite covering index beats the two separate ones for GROUP BY plans.
create index if not exists exercises_owner_sport_date_idx
  on exercises (owner_id, sport_key, exercise_date desc);

-- Unread query: subquery checks c2.author_id = $userId (no index today)
create index if not exists comments_author_idx
  on comments (author_id);

-- Care toggle checks author_id on cares (PK is (exercise_id, author_id),
-- so a reverse scan is needed for "all cares by user" queries)
create index if not exists cares_author_idx
  on cares (author_id);

-- Group membership lookup by user ("which groups am I in?")
create index if not exists group_members_user_idx
  on group_members (user_id);

-- Migration and profile lookup by email
create index if not exists users_email_idx
  on users (email)
  where email is not null;

-- ── Excluded sports constant ──────────────────────────────────────────────────
-- These sports are excluded from totals/summaries (illness, massage, rest, event)
-- Using a small table makes it easy to extend without redeploying.
create table if not exists excluded_sports (
  sport_key text primary key
);

insert into excluded_sports (sport_key) values
  ('Sairaus'), ('Hieronta'), ('Tapahtuma'), ('Lepo')
on conflict do nothing;

-- ── v_exercise_feed ───────────────────────────────────────────────────────────
-- Canonical feed row used by list, search, and export endpoints.
-- Replaces the repeated exerciseSelect() fragment in the API.
create or replace view v_exercise_feed as
select
  e.id,
  u.id          as owner_id,
  u.username    as owner_username,
  u.display_name as owner_display_name,
  u.avatar_initials as owner_initials,
  u.avatar_color    as owner_color,
  e.sport_key,
  e.title,
  e.body_html,
  e.body_markdown,
  e.tags,
  e.exercise_date,
  e.duration_sec,
  e.distance_m,
  e.avg_hr,
  e.climb_m,
  e.feel_rating,
  e.detail_kcal,
  e.pace,
  e.details,
  e.gpx_points,
  e.search_vec,
  e.legacy_id,
  e.legacy_object_id,
  e.created_at,
  e.updated_at,
  (select count(*)::int from comments c where c.exercise_id = e.id) as comment_count,
  (select count(*)::int from cares   ca where ca.exercise_id = e.id) as care_count
from exercises e
join users u on u.id = e.owner_id;

-- ── v_sport_totals ────────────────────────────────────────────────────────────
-- All-time per-user per-sport aggregates, excluding rest/illness/event sports.
create or replace view v_sport_totals as
select
  e.owner_id,
  u.username,
  e.sport_key,
  count(*)::int                        as session_count,
  sum(e.duration_sec)::bigint          as total_duration_sec,
  sum(e.distance_m)::bigint            as total_distance_m,
  sum(e.climb_m)::bigint               as total_climb_m,
  sum(e.detail_kcal)::bigint           as total_kcal,
  round(avg(e.avg_hr))::int            as avg_hr,
  max(e.distance_m)                    as max_distance_m,
  max(e.duration_sec)                  as max_duration_sec,
  min(e.exercise_date)                 as first_date,
  max(e.exercise_date)                 as last_date
from exercises e
join users u on u.id = e.owner_id
where e.sport_key not in (select sport_key from excluded_sports)
group by e.owner_id, u.username, e.sport_key;

-- ── v_year_totals ─────────────────────────────────────────────────────────────
-- Per-user per-year per-sport. Backs year summary and year-over-year charts.
create or replace view v_year_totals as
select
  e.owner_id,
  u.username,
  extract(year from e.exercise_date)::int as year,
  e.sport_key,
  count(*)::int                        as session_count,
  sum(e.duration_sec)::bigint          as total_duration_sec,
  sum(e.distance_m)::bigint            as total_distance_m,
  sum(e.climb_m)::bigint               as total_climb_m,
  sum(e.detail_kcal)::bigint           as total_kcal,
  round(avg(e.avg_hr))::int            as avg_hr
from exercises e
join users u on u.id = e.owner_id
where e.sport_key not in (select sport_key from excluded_sports)
group by e.owner_id, u.username, year, e.sport_key;

-- ── v_month_totals ────────────────────────────────────────────────────────────
-- Per-user per-year per-month per-sport. Backs monthly breakdown charts.
create or replace view v_month_totals as
select
  e.owner_id,
  u.username,
  extract(year  from e.exercise_date)::int as year,
  extract(month from e.exercise_date)::int as month,
  e.sport_key,
  count(*)::int                        as session_count,
  sum(e.duration_sec)::bigint          as total_duration_sec,
  sum(e.distance_m)::bigint            as total_distance_m,
  sum(e.climb_m)::bigint               as total_climb_m,
  round(avg(e.avg_hr))::int            as avg_hr
from exercises e
join users u on u.id = e.owner_id
where e.sport_key not in (select sport_key from excluded_sports)
group by e.owner_id, u.username, year, month, e.sport_key;

-- ── v_week_totals ─────────────────────────────────────────────────────────────
-- Per-user per-ISO-year per-week per-sport. Backs weekly calendar view.
-- Uses ISO year (extract isoyear) so week 1 of 2025 doesn't land in 2024.
create or replace view v_week_totals as
select
  e.owner_id,
  u.username,
  extract(isoyear from e.exercise_date)::int as year,
  extract(week    from e.exercise_date)::int as week,
  e.sport_key,
  count(*)::int                        as session_count,
  sum(e.duration_sec)::bigint          as total_duration_sec,
  sum(e.distance_m)::bigint            as total_distance_m,
  sum(e.climb_m)::bigint               as total_climb_m,
  round(avg(e.avg_hr))::int            as avg_hr
from exercises e
join users u on u.id = e.owner_id
where e.sport_key not in (select sport_key from excluded_sports)
group by e.owner_id, u.username, year, week, e.sport_key;

-- ── v_personal_records ────────────────────────────────────────────────────────
-- Best performance per user per sport: longest session, longest distance,
-- best pace (lowest min/km), highest HR.
-- "Best pace" only meaningful when distance > 0.
create or replace view v_personal_records as
select
  e.owner_id,
  u.username,
  e.sport_key,
  -- Longest single session
  max(e.duration_sec)                  as best_duration_sec,
  (select id from exercises e2
   where e2.owner_id = e.owner_id and e2.sport_key = e.sport_key
   order by e2.duration_sec desc limit 1) as best_duration_exercise_id,
  -- Longest distance
  max(e.distance_m)                    as best_distance_m,
  (select id from exercises e2
   where e2.owner_id = e.owner_id and e2.sport_key = e.sport_key
     and e2.distance_m is not null
   order by e2.distance_m desc limit 1) as best_distance_exercise_id,
  -- Best pace (highest pace value = fastest; pace = distance/duration*360)
  max(e.pace)                          as best_pace,
  (select id from exercises e2
   where e2.owner_id = e.owner_id and e2.sport_key = e.sport_key
     and e2.pace is not null and e2.distance_m >= 1000
   order by e2.pace desc limit 1)      as best_pace_exercise_id,
  -- Peak HR
  max(e.avg_hr)                        as peak_avg_hr
from exercises e
join users u on u.id = e.owner_id
where e.sport_key not in (select sport_key from excluded_sports)
group by e.owner_id, u.username, e.sport_key;

-- ── v_athlete_profile ─────────────────────────────────────────────────────────
-- Single-row athlete analytics per user: career totals, active years,
-- consistency metrics, HR zone thresholds.
create or replace view v_athlete_profile as
select
  u.id            as user_id,
  u.username,
  u.display_name,
  u.resthr,
  u.maxhr,
  u.aerk,
  u.anaerk,
  -- HR reserve (Karvonen) thresholds when profile is set
  case when u.maxhr is not null and u.resthr is not null
    then u.resthr + round((u.maxhr - u.resthr) * 0.60)::int
  end as zone2_lower_bpm,
  case when u.maxhr is not null and u.resthr is not null
    then u.resthr + round((u.maxhr - u.resthr) * 0.80)::int
  end as zone4_lower_bpm,
  -- Career totals (all sports including excluded)
  count(e.id)::int                            as total_sessions,
  coalesce(sum(e.duration_sec), 0)::bigint    as career_duration_sec,
  coalesce(sum(e.distance_m), 0)::bigint      as career_distance_m,
  coalesce(sum(e.climb_m), 0)::bigint         as career_climb_m,
  coalesce(sum(e.detail_kcal), 0)::bigint     as career_kcal,
  -- Active span
  min(e.exercise_date)                        as first_exercise_date,
  max(e.exercise_date)                        as last_exercise_date,
  extract(year from min(e.exercise_date))::int as first_year,
  extract(year from max(e.exercise_date))::int as last_year,
  -- Consistency: distinct weeks with at least one session
  count(distinct date_trunc('week', e.exercise_date::timestamptz))::int as active_weeks,
  -- Top sport by time (excluding rest sports)
  (select e2.sport_key
   from exercises e2
   where e2.owner_id = u.id
     and e2.sport_key not in (select sport_key from excluded_sports)
   group by e2.sport_key
   order by sum(e2.duration_sec) desc
   limit 1) as primary_sport,
  -- Sessions in last 30 / 90 / 365 days
  count(case when e.exercise_date >= current_date - 29 then 1 end)::int  as sessions_30d,
  count(case when e.exercise_date >= current_date - 89 then 1 end)::int  as sessions_90d,
  count(case when e.exercise_date >= current_date - 364 then 1 end)::int as sessions_365d,
  -- Duration in last 30 / 90 days
  coalesce(sum(case when e.exercise_date >= current_date - 29
    then e.duration_sec end), 0)::bigint as duration_sec_30d,
  coalesce(sum(case when e.exercise_date >= current_date - 89
    then e.duration_sec end), 0)::bigint as duration_sec_90d
from users u
left join exercises e on e.owner_id = u.id
group by u.id;

-- ── v_leaderboard_month ───────────────────────────────────────────────────────
-- Top athletes by total training duration in the current calendar month.
-- Excludes rest/illness sports. Used for the monthly leaderboard widget.
create or replace view v_leaderboard_month as
select
  u.id          as user_id,
  u.username,
  u.display_name,
  u.avatar_initials,
  u.avatar_color,
  count(e.id)::int                       as session_count,
  sum(e.duration_sec)::bigint            as total_duration_sec,
  coalesce(sum(e.distance_m), 0)::bigint as total_distance_m,
  rank() over (order by sum(e.duration_sec) desc) as rank
from users u
join exercises e on e.owner_id = u.id
where e.exercise_date >= date_trunc('month', current_date)
  and e.sport_key not in (select sport_key from excluded_sports)
group by u.id;

-- ── v_leaderboard_year ────────────────────────────────────────────────────────
-- Same but for the current calendar year.
create or replace view v_leaderboard_year as
select
  u.id          as user_id,
  u.username,
  u.display_name,
  u.avatar_initials,
  u.avatar_color,
  count(e.id)::int                       as session_count,
  sum(e.duration_sec)::bigint            as total_duration_sec,
  coalesce(sum(e.distance_m), 0)::bigint as total_distance_m,
  rank() over (order by sum(e.duration_sec) desc) as rank
from users u
join exercises e on e.owner_id = u.id
where extract(year from e.exercise_date) = extract(year from current_date)
  and e.sport_key not in (select sport_key from excluded_sports)
group by u.id;

-- ── v_unread_comments ─────────────────────────────────────────────────────────
-- For each user, lists exercise IDs with comments newer than their last visit,
-- where the comment was not written by the user themselves.
-- The API simply queries: SELECT * FROM v_unread_comments WHERE watcher_id = $1
create or replace view v_unread_comments as
select
  watchers.user_id  as watcher_id,
  e.id              as exercise_id,
  count(c.id)::int  as new_comment_count,
  max(c.created_at) as latest_comment_at
from (
  -- Users who are exercise owners
  select owner_id as user_id, id as exercise_id from exercises
  union
  -- Users who have commented on an exercise
  select distinct author_id as user_id, exercise_id from comments
) watchers
join exercises e   on e.id = watchers.exercise_id
join comments c    on c.exercise_id = e.id
left join user_visit uv on uv.user_id = watchers.user_id
where c.author_id != watchers.user_id
  and (uv.last_visit is null or c.created_at > uv.last_visit)
group by watchers.user_id, e.id
having count(c.id) > 0;

-- ── v_tag_usage ───────────────────────────────────────────────────────────────
-- Tag frequency per user, for tag cloud and autocomplete.
create or replace view v_tag_usage as
select
  e.owner_id,
  u.username,
  tag,
  count(*)::int                as use_count,
  max(e.exercise_date)         as last_used
from exercises e
join users u on u.id = e.owner_id
cross join unnest(e.tags) as tag
group by e.owner_id, u.username, tag;
