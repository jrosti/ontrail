-- Switch the canonical duration unit from seconds to CENTISECONDS.
--
-- The legacy Mongo `exercise.duration` is centiseconds (1 s = 100, 1 min = 6000,
-- 1 h = 360000; see plans/units.md). Storing seconds forced a ÷100 on migration
-- that lost sub-second precision and made per-period totals drift from the legacy
-- summaries. We now keep the legacy unit: rename duration_sec -> duration_cs and
-- redefine the pace generated column with the native centisecond formula
-- (round(distance_m / duration_cs * 360000)). Display conversion moves to the FE.
--
-- Existing exercise rows hold seconds-magnitude values in what becomes duration_cs;
-- they must be re-migrated from Mongo (migrate-exercises.ts, truncate-and-reload).

-- Drop the views that reference duration_sec / pace before altering the column.
drop view if exists v_exercise_feed cascade;
drop view if exists v_sport_totals cascade;
drop view if exists v_year_totals cascade;
drop view if exists v_month_totals cascade;
drop view if exists v_week_totals cascade;
drop view if exists v_personal_records cascade;
drop view if exists v_athlete_profile cascade;
drop view if exists v_leaderboard_month cascade;
drop view if exists v_leaderboard_year cascade;

-- pace (generated, ×360 seconds formula) depends on duration_sec — drop, rename, re-add.
drop index if exists exercises_pace_idx;
alter table exercises drop column if exists pace;
alter table exercises rename column duration_sec to duration_cs;

alter table exercises
  add column pace integer
    generated always as (
      case when duration_cs > 0 and distance_m is not null
        then round(distance_m::numeric / duration_cs * 360000)
      end
    ) stored;
create index if not exists exercises_pace_idx on exercises (pace);

-- ── Recreate the views (duration_cs + *_duration_cs aliases) ──────────────────

create view v_exercise_feed as
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
  e.duration_cs,
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

create view v_sport_totals as
select
  e.owner_id,
  u.username,
  e.sport_key,
  count(*)::int                        as session_count,
  sum(e.duration_cs)::bigint           as total_duration_cs,
  sum(e.distance_m)::bigint            as total_distance_m,
  sum(e.climb_m)::bigint               as total_climb_m,
  sum(e.detail_kcal)::bigint           as total_kcal,
  round(avg(e.avg_hr))::int            as avg_hr,
  max(e.distance_m)                    as max_distance_m,
  max(e.duration_cs)                   as max_duration_cs,
  min(e.exercise_date)                 as first_date,
  max(e.exercise_date)                 as last_date
from exercises e
join users u on u.id = e.owner_id
where e.sport_key not in (select sport_key from excluded_sports)
group by e.owner_id, u.username, e.sport_key;

create view v_year_totals as
select
  e.owner_id,
  u.username,
  extract(year from e.exercise_date)::int as year,
  e.sport_key,
  count(*)::int                        as session_count,
  sum(e.duration_cs)::bigint           as total_duration_cs,
  sum(e.distance_m)::bigint            as total_distance_m,
  sum(e.climb_m)::bigint               as total_climb_m,
  sum(e.detail_kcal)::bigint           as total_kcal,
  round(avg(e.avg_hr))::int            as avg_hr
from exercises e
join users u on u.id = e.owner_id
where e.sport_key not in (select sport_key from excluded_sports)
group by e.owner_id, u.username, year, e.sport_key;

create view v_month_totals as
select
  e.owner_id,
  u.username,
  extract(year  from e.exercise_date)::int as year,
  extract(month from e.exercise_date)::int as month,
  e.sport_key,
  count(*)::int                        as session_count,
  sum(e.duration_cs)::bigint           as total_duration_cs,
  sum(e.distance_m)::bigint            as total_distance_m,
  sum(e.climb_m)::bigint               as total_climb_m,
  round(avg(e.avg_hr))::int            as avg_hr
from exercises e
join users u on u.id = e.owner_id
where e.sport_key not in (select sport_key from excluded_sports)
group by e.owner_id, u.username, year, month, e.sport_key;

create view v_week_totals as
select
  e.owner_id,
  u.username,
  extract(isoyear from e.exercise_date)::int as year,
  extract(week    from e.exercise_date)::int as week,
  e.sport_key,
  count(*)::int                        as session_count,
  sum(e.duration_cs)::bigint           as total_duration_cs,
  sum(e.distance_m)::bigint            as total_distance_m,
  sum(e.climb_m)::bigint               as total_climb_m,
  round(avg(e.avg_hr))::int            as avg_hr
from exercises e
join users u on u.id = e.owner_id
where e.sport_key not in (select sport_key from excluded_sports)
group by e.owner_id, u.username, year, week, e.sport_key;

create view v_personal_records as
select
  e.owner_id,
  u.username,
  e.sport_key,
  -- Longest single session
  max(e.duration_cs)                   as best_duration_cs,
  (select id from exercises e2
   where e2.owner_id = e.owner_id and e2.sport_key = e.sport_key
   order by e2.duration_cs desc limit 1) as best_duration_exercise_id,
  -- Longest distance
  max(e.distance_m)                    as best_distance_m,
  (select id from exercises e2
   where e2.owner_id = e.owner_id and e2.sport_key = e.sport_key
     and e2.distance_m is not null
   order by e2.distance_m desc limit 1) as best_distance_exercise_id,
  -- Best pace (highest pace value = fastest; pace = distance_m / duration_cs * 360000)
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

create view v_athlete_profile as
select
  u.id            as user_id,
  u.username,
  u.display_name,
  u.resthr,
  u.maxhr,
  u.aerk,
  u.anaerk,
  case when u.maxhr is not null and u.resthr is not null
    then u.resthr + round((u.maxhr - u.resthr) * 0.60)::int
  end as zone2_lower_bpm,
  case when u.maxhr is not null and u.resthr is not null
    then u.resthr + round((u.maxhr - u.resthr) * 0.80)::int
  end as zone4_lower_bpm,
  count(e.id)::int                            as total_sessions,
  coalesce(sum(e.duration_cs), 0)::bigint     as career_duration_cs,
  coalesce(sum(e.distance_m), 0)::bigint      as career_distance_m,
  coalesce(sum(e.climb_m), 0)::bigint         as career_climb_m,
  coalesce(sum(e.detail_kcal), 0)::bigint     as career_kcal,
  min(e.exercise_date)                        as first_exercise_date,
  max(e.exercise_date)                        as last_exercise_date,
  extract(year from min(e.exercise_date))::int as first_year,
  extract(year from max(e.exercise_date))::int as last_year,
  count(distinct date_trunc('week', e.exercise_date::timestamptz))::int as active_weeks,
  (select e2.sport_key
   from exercises e2
   where e2.owner_id = u.id
     and e2.sport_key not in (select sport_key from excluded_sports)
   group by e2.sport_key
   order by sum(e2.duration_cs) desc
   limit 1) as primary_sport,
  count(case when e.exercise_date >= current_date - 29 then 1 end)::int  as sessions_30d,
  count(case when e.exercise_date >= current_date - 89 then 1 end)::int  as sessions_90d,
  count(case when e.exercise_date >= current_date - 364 then 1 end)::int as sessions_365d,
  coalesce(sum(case when e.exercise_date >= current_date - 29
    then e.duration_cs end), 0)::bigint as duration_cs_30d,
  coalesce(sum(case when e.exercise_date >= current_date - 89
    then e.duration_cs end), 0)::bigint as duration_cs_90d
from users u
left join exercises e on e.owner_id = u.id
group by u.id;

create view v_leaderboard_month as
select
  u.id          as user_id,
  u.username,
  u.display_name,
  u.avatar_initials,
  u.avatar_color,
  count(e.id)::int                       as session_count,
  sum(e.duration_cs)::bigint             as total_duration_cs,
  coalesce(sum(e.distance_m), 0)::bigint as total_distance_m,
  rank() over (order by sum(e.duration_cs) desc) as rank
from users u
join exercises e on e.owner_id = u.id
where e.exercise_date >= date_trunc('month', current_date)
  and e.sport_key not in (select sport_key from excluded_sports)
group by u.id;

create view v_leaderboard_year as
select
  u.id          as user_id,
  u.username,
  u.display_name,
  u.avatar_initials,
  u.avatar_color,
  count(e.id)::int                       as session_count,
  sum(e.duration_cs)::bigint             as total_duration_cs,
  coalesce(sum(e.distance_m), 0)::bigint as total_distance_m,
  rank() over (order by sum(e.duration_cs) desc) as rank
from users u
join exercises e on e.owner_id = u.id
where extract(year from e.exercise_date) = extract(year from current_date)
  and e.sport_key not in (select sport_key from excluded_sports)
group by u.id;
