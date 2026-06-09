import { sql } from '../db/client';

// Sports to exclude from totals (YHTEENSÄ exclusion set)
const EXCLUDED_SPORTS = ['Sairaus', 'Hieronta', 'Tapahtuma', 'Lepo'];

export interface SportSummary {
  sport: string;
  totalDurationSec: number;
  totalDistanceM: number | null;
  sessionCount: number;
  avgHr: number | null;
}

export interface MonthSummary {
  month: number;
  sport: string;
  totalDurationSec: number;
  totalDistanceM: number | null;
  sessionCount: number;
}

export interface WeekSummary {
  week: number;
  sport: string;
  totalDurationSec: number;
  totalDistanceM: number | null;
  sessionCount: number;
}

export async function getSportSummary(username: string): Promise<SportSummary[]> {
  const rows = await sql<
    {
      sport: string;
      total_duration_sec: number;
      total_distance_m: number | null;
      session_count: number;
      avg_hr: number | null;
    }[]
  >`
    select
      e.sport_key as sport,
      sum(e.duration_sec)::int as total_duration_sec,
      sum(e.distance_m)::int as total_distance_m,
      count(*)::int as session_count,
      round(avg(e.avg_hr))::int as avg_hr
    from exercises e
    join users u on u.id = e.owner_id
    where u.username = ${username}
      and e.sport_key != all(${EXCLUDED_SPORTS})
    group by e.sport_key
    order by total_duration_sec desc
  `;
  return rows.map((r) => ({
    sport: r.sport,
    totalDurationSec: r.total_duration_sec,
    totalDistanceM: r.total_distance_m,
    sessionCount: r.session_count,
    avgHr: r.avg_hr,
  }));
}

export async function getSportSummaryByYear(
  username: string,
  year: number,
): Promise<SportSummary[]> {
  const rows = await sql<
    {
      sport: string;
      total_duration_sec: number;
      total_distance_m: number | null;
      session_count: number;
      avg_hr: number | null;
    }[]
  >`
    select
      e.sport_key as sport,
      sum(e.duration_sec)::int as total_duration_sec,
      sum(e.distance_m)::int as total_distance_m,
      count(*)::int as session_count,
      round(avg(e.avg_hr))::int as avg_hr
    from exercises e
    join users u on u.id = e.owner_id
    where u.username = ${username}
      and extract(year from e.exercise_date) = ${year}
      and e.sport_key != all(${EXCLUDED_SPORTS})
    group by e.sport_key
    order by total_duration_sec desc
  `;
  return rows.map((r) => ({
    sport: r.sport,
    totalDurationSec: r.total_duration_sec,
    totalDistanceM: r.total_distance_m,
    sessionCount: r.session_count,
    avgHr: r.avg_hr,
  }));
}

export async function getSummaryByMonth(username: string, year: number): Promise<MonthSummary[]> {
  const rows = await sql<
    {
      month: number;
      sport: string;
      total_duration_sec: number;
      total_distance_m: number | null;
      session_count: number;
    }[]
  >`
    select
      extract(month from e.exercise_date)::int as month,
      e.sport_key as sport,
      sum(e.duration_sec)::int as total_duration_sec,
      sum(e.distance_m)::int as total_distance_m,
      count(*)::int as session_count
    from exercises e
    join users u on u.id = e.owner_id
    where u.username = ${username}
      and extract(year from e.exercise_date) = ${year}
      and e.sport_key != all(${EXCLUDED_SPORTS})
    group by month, e.sport_key
    order by month asc, total_duration_sec desc
  `;
  return rows.map((r) => ({
    month: r.month,
    sport: r.sport,
    totalDurationSec: r.total_duration_sec,
    totalDistanceM: r.total_distance_m,
    sessionCount: r.session_count,
  }));
}

export async function getSummaryByWeek(username: string, year: number): Promise<WeekSummary[]> {
  const rows = await sql<
    {
      week: number;
      sport: string;
      total_duration_sec: number;
      total_distance_m: number | null;
      session_count: number;
    }[]
  >`
    select
      extract(week from e.exercise_date)::int as week,
      e.sport_key as sport,
      sum(e.duration_sec)::int as total_duration_sec,
      sum(e.distance_m)::int as total_distance_m,
      count(*)::int as session_count
    from exercises e
    join users u on u.id = e.owner_id
    where u.username = ${username}
      and extract(year from e.exercise_date) = ${year}
      and e.sport_key != all(${EXCLUDED_SPORTS})
    group by week, e.sport_key
    order by week asc, total_duration_sec desc
  `;
  return rows.map((r) => ({
    week: r.week,
    sport: r.sport,
    totalDurationSec: r.total_duration_sec,
    totalDistanceM: r.total_distance_m,
    sessionCount: r.session_count,
  }));
}
