import { sql } from '../db/client';

export interface SportSummary {
  sport: string;
  totalDurationSec: number;
  totalDistanceM: number | null;
  totalClimbM: number | null;
  totalKcal: number | null;
  sessionCount: number;
  avgHr: number | null;
  bestDurationSec: number | null;
  bestDistanceM: number | null;
  firstDate: string | null;
  lastDate: string | null;
}

export interface YearSummary {
  year: number;
  sport: string;
  sessionCount: number;
  totalDurationSec: number;
  totalDistanceM: number | null;
  totalClimbM: number | null;
  totalKcal: number | null;
  avgHr: number | null;
}

export interface MonthSummary {
  year: number;
  month: number;
  sport: string;
  sessionCount: number;
  totalDurationSec: number;
  totalDistanceM: number | null;
  totalClimbM: number | null;
  avgHr: number | null;
}

export interface WeekSummary {
  year: number;
  week: number;
  sport: string;
  sessionCount: number;
  totalDurationSec: number;
  totalDistanceM: number | null;
  totalClimbM: number | null;
  avgHr: number | null;
}

export interface AthleteProfile {
  userId: string;
  username: string;
  displayName: string;
  restHr: number | null;
  maxHr: number | null;
  aerk: number | null;
  anaerk: number | null;
  zone2LowerBpm: number | null;
  zone4LowerBpm: number | null;
  totalSessions: number;
  careerDurationSec: number;
  careerDistanceM: number;
  careerClimbM: number;
  careerKcal: number;
  firstExerciseDate: string | null;
  lastExerciseDate: string | null;
  firstYear: number | null;
  lastYear: number | null;
  activeWeeks: number;
  primarySport: string | null;
  sessions30d: number;
  sessions90d: number;
  sessions365d: number;
  durationSec30d: number;
  durationSec90d: number;
}

export interface PersonalRecord {
  sport: string;
  bestDurationSec: number | null;
  bestDurationExerciseId: string | null;
  bestDistanceM: number | null;
  bestDistanceExerciseId: string | null;
  bestPace: number | null;
  bestPaceExerciseId: string | null;
  peakAvgHr: number | null;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  displayName: string;
  avatarInitials: string;
  avatarColor: string;
  sessionCount: number;
  totalDurationSec: number;
  totalDistanceM: number;
}

export async function getSportSummary(username: string): Promise<SportSummary[]> {
  const rows = await sql<
    {
      sport_key: string;
      total_duration_sec: string;
      total_distance_m: string | null;
      total_climb_m: string | null;
      total_kcal: string | null;
      session_count: number;
      avg_hr: number | null;
      max_distance_m: number | null;
      max_duration_sec: number | null;
      first_date: string | null;
      last_date: string | null;
    }[]
  >`
    select sport_key, total_duration_sec, total_distance_m, total_climb_m, total_kcal,
           session_count, avg_hr, max_distance_m, max_duration_sec,
           first_date::text, last_date::text
    from v_sport_totals
    where username = ${username}
    order by total_duration_sec desc
  `;
  return rows.map((r) => ({
    sport: r.sport_key,
    totalDurationSec: Number(r.total_duration_sec),
    totalDistanceM: r.total_distance_m ? Number(r.total_distance_m) : null,
    totalClimbM: r.total_climb_m ? Number(r.total_climb_m) : null,
    totalKcal: r.total_kcal ? Number(r.total_kcal) : null,
    sessionCount: r.session_count,
    avgHr: r.avg_hr,
    bestDurationSec: r.max_duration_sec,
    bestDistanceM: r.max_distance_m,
    firstDate: r.first_date,
    lastDate: r.last_date,
  }));
}

export async function getSportSummaryByYear(
  username: string,
  year: number,
): Promise<YearSummary[]> {
  const rows = await sql<
    {
      year: number;
      sport_key: string;
      session_count: number;
      total_duration_sec: string;
      total_distance_m: string | null;
      total_climb_m: string | null;
      total_kcal: string | null;
      avg_hr: number | null;
    }[]
  >`
    select year, sport_key, session_count, total_duration_sec, total_distance_m,
           total_climb_m, total_kcal, avg_hr
    from v_year_totals
    where username = ${username} and year = ${year}
    order by total_duration_sec desc
  `;
  return rows.map((r) => ({
    year: r.year,
    sport: r.sport_key,
    sessionCount: r.session_count,
    totalDurationSec: Number(r.total_duration_sec),
    totalDistanceM: r.total_distance_m ? Number(r.total_distance_m) : null,
    totalClimbM: r.total_climb_m ? Number(r.total_climb_m) : null,
    totalKcal: r.total_kcal ? Number(r.total_kcal) : null,
    avgHr: r.avg_hr,
  }));
}

export async function getSummaryByMonth(username: string, year: number): Promise<MonthSummary[]> {
  const rows = await sql<
    {
      year: number;
      month: number;
      sport_key: string;
      session_count: number;
      total_duration_sec: string;
      total_distance_m: string | null;
      total_climb_m: string | null;
      avg_hr: number | null;
    }[]
  >`
    select year, month, sport_key, session_count, total_duration_sec,
           total_distance_m, total_climb_m, avg_hr
    from v_month_totals
    where username = ${username} and year = ${year}
    order by month asc, total_duration_sec desc
  `;
  return rows.map((r) => ({
    year: r.year,
    month: r.month,
    sport: r.sport_key,
    sessionCount: r.session_count,
    totalDurationSec: Number(r.total_duration_sec),
    totalDistanceM: r.total_distance_m ? Number(r.total_distance_m) : null,
    totalClimbM: r.total_climb_m ? Number(r.total_climb_m) : null,
    avgHr: r.avg_hr,
  }));
}

export async function getSummaryByWeek(username: string, year: number): Promise<WeekSummary[]> {
  const rows = await sql<
    {
      year: number;
      week: number;
      sport_key: string;
      session_count: number;
      total_duration_sec: string;
      total_distance_m: string | null;
      total_climb_m: string | null;
      avg_hr: number | null;
    }[]
  >`
    select year, week, sport_key, session_count, total_duration_sec,
           total_distance_m, total_climb_m, avg_hr
    from v_week_totals
    where username = ${username} and year = ${year}
    order by week asc, total_duration_sec desc
  `;
  return rows.map((r) => ({
    year: r.year,
    week: r.week,
    sport: r.sport_key,
    sessionCount: r.session_count,
    totalDurationSec: Number(r.total_duration_sec),
    totalDistanceM: r.total_distance_m ? Number(r.total_distance_m) : null,
    totalClimbM: r.total_climb_m ? Number(r.total_climb_m) : null,
    avgHr: r.avg_hr,
  }));
}

export async function getAthleteProfile(username: string): Promise<AthleteProfile | null> {
  const rows = await sql<
    {
      user_id: string;
      username: string;
      display_name: string;
      resthr: number | null;
      maxhr: number | null;
      aerk: number | null;
      anaerk: number | null;
      zone2_lower_bpm: number | null;
      zone4_lower_bpm: number | null;
      total_sessions: number;
      career_duration_sec: string;
      career_distance_m: string;
      career_climb_m: string;
      career_kcal: string;
      first_exercise_date: string | null;
      last_exercise_date: string | null;
      first_year: number | null;
      last_year: number | null;
      active_weeks: number;
      primary_sport: string | null;
      sessions_30d: number;
      sessions_90d: number;
      sessions_365d: number;
      duration_sec_30d: string;
      duration_sec_90d: string;
    }[]
  >`
    select * from v_athlete_profile where username = ${username} limit 1
  `;
  const r = rows[0];
  if (!r) return null;
  return {
    userId: r.user_id,
    username: r.username,
    displayName: r.display_name,
    restHr: r.resthr,
    maxHr: r.maxhr,
    aerk: r.aerk,
    anaerk: r.anaerk,
    zone2LowerBpm: r.zone2_lower_bpm,
    zone4LowerBpm: r.zone4_lower_bpm,
    totalSessions: r.total_sessions,
    careerDurationSec: Number(r.career_duration_sec),
    careerDistanceM: Number(r.career_distance_m),
    careerClimbM: Number(r.career_climb_m),
    careerKcal: Number(r.career_kcal),
    firstExerciseDate: r.first_exercise_date,
    lastExerciseDate: r.last_exercise_date,
    firstYear: r.first_year,
    lastYear: r.last_year,
    activeWeeks: r.active_weeks,
    primarySport: r.primary_sport,
    sessions30d: r.sessions_30d,
    sessions90d: r.sessions_90d,
    sessions365d: r.sessions_365d,
    durationSec30d: Number(r.duration_sec_30d),
    durationSec90d: Number(r.duration_sec_90d),
  };
}

export async function getPersonalRecords(username: string): Promise<PersonalRecord[]> {
  const rows = await sql<
    {
      sport_key: string;
      best_duration_sec: number | null;
      best_duration_exercise_id: string | null;
      best_distance_m: number | null;
      best_distance_exercise_id: string | null;
      best_pace: number | null;
      best_pace_exercise_id: string | null;
      peak_avg_hr: number | null;
    }[]
  >`
    select sport_key, best_duration_sec, best_duration_exercise_id::text,
           best_distance_m, best_distance_exercise_id::text,
           best_pace, best_pace_exercise_id::text, peak_avg_hr
    from v_personal_records
    where username = ${username}
    order by best_duration_sec desc nulls last
  `;
  return rows.map((r) => ({
    sport: r.sport_key,
    bestDurationSec: r.best_duration_sec,
    bestDurationExerciseId: r.best_duration_exercise_id,
    bestDistanceM: r.best_distance_m,
    bestDistanceExerciseId: r.best_distance_exercise_id,
    bestPace: r.best_pace,
    bestPaceExerciseId: r.best_pace_exercise_id,
    peakAvgHr: r.peak_avg_hr,
  }));
}

export async function getLeaderboard(
  period: 'month' | 'year',
  limit = 50,
): Promise<LeaderboardEntry[]> {
  const view = period === 'month' ? sql`v_leaderboard_month` : sql`v_leaderboard_year`;
  const rows = await sql<
    {
      rank: string;
      user_id: string;
      username: string;
      display_name: string;
      avatar_initials: string;
      avatar_color: string;
      session_count: number;
      total_duration_sec: string;
      total_distance_m: string;
    }[]
  >`
    select rank, user_id::text, username, display_name, avatar_initials, avatar_color,
           session_count, total_duration_sec, total_distance_m
    from ${view}
    order by rank asc
    limit ${limit}
  `;
  return rows.map((r) => ({
    rank: Number(r.rank),
    userId: r.user_id,
    username: r.username,
    displayName: r.display_name,
    avatarInitials: r.avatar_initials,
    avatarColor: r.avatar_color,
    sessionCount: r.session_count,
    totalDurationSec: Number(r.total_duration_sec),
    totalDistanceM: Number(r.total_distance_m),
  }));
}

export interface TagSummary {
  tag: string;
  sessionCount: number;
  totalDurationSec: number;
  totalDistanceM: number | null;
  totalClimbM: number | null;
  avgHr: number | null;
  firstDate: string | null;
  lastDate: string | null;
}

// Tag summaries — same shape as sport summaries but grouped by tag.
// All three functions exclude the excluded_sports set.
export async function getTagSummary(username: string): Promise<TagSummary[]> {
  const rows = await sql<
    {
      tag: string;
      session_count: number;
      total_duration_sec: string;
      total_distance_m: string | null;
      total_climb_m: string | null;
      avg_hr: number | null;
      first_date: string | null;
      last_date: string | null;
    }[]
  >`
    select
      tag,
      count(*)::int                       as session_count,
      sum(e.duration_sec)::bigint         as total_duration_sec,
      sum(e.distance_m)::bigint           as total_distance_m,
      sum(e.climb_m)::bigint              as total_climb_m,
      round(avg(e.avg_hr))::int           as avg_hr,
      min(e.exercise_date)::text          as first_date,
      max(e.exercise_date)::text          as last_date
    from exercises e
    join users u on u.id = e.owner_id
    cross join unnest(e.tags) as tag
    where u.username = ${username}
      and e.sport_key not in (select sport_key from excluded_sports)
      and tag <> ''
    group by tag
    order by total_duration_sec desc
  `;
  return rows.map((r) => ({
    tag: r.tag,
    sessionCount: r.session_count,
    totalDurationSec: Number(r.total_duration_sec),
    totalDistanceM: r.total_distance_m ? Number(r.total_distance_m) : null,
    totalClimbM: r.total_climb_m ? Number(r.total_climb_m) : null,
    avgHr: r.avg_hr,
    firstDate: r.first_date,
    lastDate: r.last_date,
  }));
}

export async function getTagSummaryByYear(username: string, year: number): Promise<TagSummary[]> {
  const rows = await sql<
    {
      tag: string;
      session_count: number;
      total_duration_sec: string;
      total_distance_m: string | null;
      total_climb_m: string | null;
      avg_hr: number | null;
      first_date: string | null;
      last_date: string | null;
    }[]
  >`
    select
      tag,
      count(*)::int                       as session_count,
      sum(e.duration_sec)::bigint         as total_duration_sec,
      sum(e.distance_m)::bigint           as total_distance_m,
      sum(e.climb_m)::bigint              as total_climb_m,
      round(avg(e.avg_hr))::int           as avg_hr,
      min(e.exercise_date)::text          as first_date,
      max(e.exercise_date)::text          as last_date
    from exercises e
    join users u on u.id = e.owner_id
    cross join unnest(e.tags) as tag
    where u.username = ${username}
      and extract(year from e.exercise_date) = ${year}
      and e.sport_key not in (select sport_key from excluded_sports)
      and tag <> ''
    group by tag
    order by total_duration_sec desc
  `;
  return rows.map((r) => ({
    tag: r.tag,
    sessionCount: r.session_count,
    totalDurationSec: Number(r.total_duration_sec),
    totalDistanceM: r.total_distance_m ? Number(r.total_distance_m) : null,
    totalClimbM: r.total_climb_m ? Number(r.total_climb_m) : null,
    avgHr: r.avg_hr,
    firstDate: r.first_date,
    lastDate: r.last_date,
  }));
}

export interface TagMonthSummary {
  month: number;
  tag: string;
  sessionCount: number;
  totalDurationSec: number;
  totalDistanceM: number | null;
}

export async function getTagSummaryByMonth(
  username: string,
  year: number,
): Promise<TagMonthSummary[]> {
  const rows = await sql<
    {
      month: number;
      tag: string;
      session_count: number;
      total_duration_sec: string;
      total_distance_m: string | null;
    }[]
  >`
    select
      extract(month from e.exercise_date)::int as month,
      tag,
      count(*)::int                            as session_count,
      sum(e.duration_sec)::bigint              as total_duration_sec,
      sum(e.distance_m)::bigint                as total_distance_m
    from exercises e
    join users u on u.id = e.owner_id
    cross join unnest(e.tags) as tag
    where u.username = ${username}
      and extract(year from e.exercise_date) = ${year}
      and e.sport_key not in (select sport_key from excluded_sports)
      and tag <> ''
    group by month, tag
    order by month asc, total_duration_sec desc
  `;
  return rows.map((r) => ({
    month: r.month,
    tag: r.tag,
    sessionCount: r.session_count,
    totalDurationSec: Number(r.total_duration_sec),
    totalDistanceM: r.total_distance_m ? Number(r.total_distance_m) : null,
  }));
}

export async function getTagUsage(
  username: string,
): Promise<{ tag: string; useCount: number; lastUsed: string }[]> {
  const rows = await sql<
    {
      tag: string;
      use_count: number;
      last_used: string;
    }[]
  >`
    select tag, use_count, last_used::text
    from v_tag_usage
    where username = ${username}
    order by use_count desc, last_used desc
  `;
  return rows.map((r) => ({ tag: r.tag, useCount: r.use_count, lastUsed: r.last_used }));
}
