import { sql } from '../db/client';

export interface SportSummary {
  sport: string;
  totalDurationCs: number;
  totalDistanceM: number | null;
  totalClimbM: number | null;
  totalKcal: number | null;
  sessionCount: number;
  avgHr: number | null;
  bestDurationCs: number | null;
  bestDistanceM: number | null;
  firstDate: string | null;
  lastDate: string | null;
}

export interface YearSummary {
  year: number;
  sport: string;
  sessionCount: number;
  totalDurationCs: number;
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
  totalDurationCs: number;
  totalDistanceM: number | null;
  totalClimbM: number | null;
  avgHr: number | null;
}

export interface WeekSummary {
  year: number;
  week: number;
  sport: string;
  sessionCount: number;
  totalDurationCs: number;
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
  careerDurationCs: number;
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
  durationCs30d: number;
  durationCs90d: number;
}

export interface PersonalRecord {
  sport: string;
  bestDurationCs: number | null;
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
  totalDurationCs: number;
  totalDistanceM: number;
}

export async function getSportSummary(username: string): Promise<SportSummary[]> {
  const rows = await sql<
    {
      sport_key: string;
      total_duration_cs: string;
      total_distance_m: string | null;
      total_climb_m: string | null;
      total_kcal: string | null;
      session_count: number;
      avg_hr: number | null;
      max_distance_m: number | null;
      max_duration_cs: number | null;
      first_date: string | null;
      last_date: string | null;
    }[]
  >`
    select sport_key, total_duration_cs, total_distance_m, total_climb_m, total_kcal,
           session_count, avg_hr, max_distance_m, max_duration_cs,
           first_date::text, last_date::text
    from v_sport_totals
    where username = ${username}
    order by total_duration_cs desc
  `;
  return rows.map((r) => ({
    sport: r.sport_key,
    totalDurationCs: Number(r.total_duration_cs),
    totalDistanceM: r.total_distance_m ? Number(r.total_distance_m) : null,
    totalClimbM: r.total_climb_m ? Number(r.total_climb_m) : null,
    totalKcal: r.total_kcal ? Number(r.total_kcal) : null,
    sessionCount: r.session_count,
    avgHr: r.avg_hr,
    bestDurationCs: r.max_duration_cs,
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
      total_duration_cs: string;
      total_distance_m: string | null;
      total_climb_m: string | null;
      total_kcal: string | null;
      avg_hr: number | null;
    }[]
  >`
    select year, sport_key, session_count, total_duration_cs, total_distance_m,
           total_climb_m, total_kcal, avg_hr
    from v_year_totals
    where username = ${username} and year = ${year}
    order by total_duration_cs desc
  `;
  return rows.map((r) => ({
    year: r.year,
    sport: r.sport_key,
    sessionCount: r.session_count,
    totalDurationCs: Number(r.total_duration_cs),
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
      total_duration_cs: string;
      total_distance_m: string | null;
      total_climb_m: string | null;
      avg_hr: number | null;
    }[]
  >`
    select year, month, sport_key, session_count, total_duration_cs,
           total_distance_m, total_climb_m, avg_hr
    from v_month_totals
    where username = ${username} and year = ${year}
    order by month asc, total_duration_cs desc
  `;
  return rows.map((r) => ({
    year: r.year,
    month: r.month,
    sport: r.sport_key,
    sessionCount: r.session_count,
    totalDurationCs: Number(r.total_duration_cs),
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
      total_duration_cs: string;
      total_distance_m: string | null;
      total_climb_m: string | null;
      avg_hr: number | null;
    }[]
  >`
    select year, week, sport_key, session_count, total_duration_cs,
           total_distance_m, total_climb_m, avg_hr
    from v_week_totals
    where username = ${username} and year = ${year}
    order by week asc, total_duration_cs desc
  `;
  return rows.map((r) => ({
    year: r.year,
    week: r.week,
    sport: r.sport_key,
    sessionCount: r.session_count,
    totalDurationCs: Number(r.total_duration_cs),
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
      career_duration_cs: string;
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
      duration_cs_30d: string;
      duration_cs_90d: string;
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
    careerDurationCs: Number(r.career_duration_cs),
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
    durationCs30d: Number(r.duration_cs_30d),
    durationCs90d: Number(r.duration_cs_90d),
  };
}

export async function getPersonalRecords(username: string): Promise<PersonalRecord[]> {
  const rows = await sql<
    {
      sport_key: string;
      best_duration_cs: number | null;
      best_duration_exercise_id: string | null;
      best_distance_m: number | null;
      best_distance_exercise_id: string | null;
      best_pace: number | null;
      best_pace_exercise_id: string | null;
      peak_avg_hr: number | null;
    }[]
  >`
    select sport_key, best_duration_cs, best_duration_exercise_id::text,
           best_distance_m, best_distance_exercise_id::text,
           best_pace, best_pace_exercise_id::text, peak_avg_hr
    from v_personal_records
    where username = ${username}
    order by best_duration_cs desc nulls last
  `;
  return rows.map((r) => ({
    sport: r.sport_key,
    bestDurationCs: r.best_duration_cs,
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
  sport?: string,
): Promise<LeaderboardEntry[]> {
  const dateFilter =
    period === 'month'
      ? sql`e.exercise_date >= date_trunc('month', current_date)`
      : sql`extract(year from e.exercise_date) = extract(year from current_date)`;
  const sportFilter = sport
    ? sql`and e.sport_key = ${sport}`
    : sql`and e.sport_key not in (select sport_key from excluded_sports)`;

  const rows = await sql<
    {
      rank: bigint;
      user_id: string;
      username: string;
      display_name: string;
      avatar_initials: string;
      avatar_color: string;
      session_count: number;
      total_duration_cs: string;
      total_distance_m: string;
    }[]
  >`
    select
      rank() over (order by sum(e.duration_cs) desc) as rank,
      u.id::text as user_id,
      u.username,
      u.display_name,
      u.avatar_initials,
      u.avatar_color,
      count(e.id)::int as session_count,
      sum(e.duration_cs)::bigint as total_duration_cs,
      coalesce(sum(e.distance_m), 0)::bigint as total_distance_m
    from users u
    join exercises e on e.owner_id = u.id
    where ${dateFilter}
    ${sportFilter}
    group by u.id
    order by sum(e.duration_cs) desc
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
    totalDurationCs: Number(r.total_duration_cs),
    totalDistanceM: Number(r.total_distance_m),
  }));
}

export interface TagSummary {
  tag: string;
  sessionCount: number;
  totalDurationCs: number;
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
      total_duration_cs: string;
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
      sum(e.duration_cs)::bigint         as total_duration_cs,
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
    order by total_duration_cs desc
  `;
  return rows.map((r) => ({
    tag: r.tag,
    sessionCount: r.session_count,
    totalDurationCs: Number(r.total_duration_cs),
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
      total_duration_cs: string;
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
      sum(e.duration_cs)::bigint         as total_duration_cs,
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
    order by total_duration_cs desc
  `;
  return rows.map((r) => ({
    tag: r.tag,
    sessionCount: r.session_count,
    totalDurationCs: Number(r.total_duration_cs),
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
  totalDurationCs: number;
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
      total_duration_cs: string;
      total_distance_m: string | null;
    }[]
  >`
    select
      extract(month from e.exercise_date)::int as month,
      tag,
      count(*)::int                            as session_count,
      sum(e.duration_cs)::bigint              as total_duration_cs,
      sum(e.distance_m)::bigint                as total_distance_m
    from exercises e
    join users u on u.id = e.owner_id
    cross join unnest(e.tags) as tag
    where u.username = ${username}
      and extract(year from e.exercise_date) = ${year}
      and e.sport_key not in (select sport_key from excluded_sports)
      and tag <> ''
    group by month, tag
    order by month asc, total_duration_cs desc
  `;
  return rows.map((r) => ({
    month: r.month,
    tag: r.tag,
    sessionCount: r.session_count,
    totalDurationCs: Number(r.total_duration_cs),
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
