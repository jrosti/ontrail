import { randomBytes } from 'node:crypto';
import type { Exercise } from '../../../web/src/types';
import { sql } from '../db/client';
import type { FinishInput } from '../live/finish';
import {
  downsample,
  type LivePoint,
  localDate,
  MAX_EXERCISE_TRACK_POINTS,
  pathDistanceM,
} from '../live/geo';
import { emitToUser, liveChannel } from '../sse';
import { getExercise, insertExercise } from './exercises';
import type { DbUser } from './users';

/** Hard cap on stored points per session (~28 h at 1 Hz). */
export const MAX_SESSION_POINTS = 100_000;
/** Most points returned by one public snapshot call; clients page with `after`. */
const SNAPSHOT_POINT_LIMIT = 5000;

interface SessionRow {
  id: string;
  owner_id: string;
  share_token: string;
  sport_key: string;
  title: string;
  status: 'active' | 'finished' | 'discarded';
  started_at: Date;
  last_point_at: Date | null;
  ended_at: Date | null;
  distance_m: number;
  point_count: number;
  last_seq: number | null;
  last_lat: number | null;
  last_lon: number | null;
  last_hr: number | null;
  exercise_id: string | null;
}

interface PointRow {
  seq: number;
  recorded_at: Date;
  lat: number;
  lon: number;
  ele: number | null;
  hr: number | null;
}

/** What the owner's app sees (includes the internal id and the share token). */
export interface LiveSession {
  id: string;
  shareToken: string;
  status: SessionRow['status'];
  sport: string;
  title: string;
  startedAt: string;
  lastPointAt: string | null;
  endedAt: string | null;
  distanceM: number;
  pointCount: number;
  lastSeq: number | null;
  lastHr: number | null;
  exerciseId: string | null;
}

export interface PublicLive {
  status: 'active' | 'finished';
  sport: string;
  title: string;
  owner: { username: string; displayName: string; initials: string; color: string };
  startedAt: string;
  lastPointAt: string | null;
  endedAt: string | null;
  elapsedCs: number;
  distanceM: number;
  pointCount: number;
  lastSeq: number | null;
  lastHr: number | null;
  avgHr: number | null;
  exerciseId: string | null;
  points: LivePoint[];
}

function sessionColumns() {
  return sql`
  id::text, owner_id::text, share_token, sport_key, title, status, started_at, last_point_at,
  ended_at, distance_m, point_count, last_seq, last_lat, last_lon, last_hr, exercise_id::text
  `;
}

function iso(d: Date | null): string | null {
  return d ? d.toISOString() : null;
}

function toSession(row: SessionRow): LiveSession {
  return {
    id: row.id,
    shareToken: row.share_token,
    status: row.status,
    sport: row.sport_key,
    title: row.title,
    startedAt: row.started_at.toISOString(),
    lastPointAt: iso(row.last_point_at),
    endedAt: iso(row.ended_at),
    distanceM: Math.round(row.distance_m),
    pointCount: row.point_count,
    lastSeq: row.last_seq,
    lastHr: row.last_hr,
    exerciseId: row.exercise_id,
  };
}

function toPoint(row: PointRow): LivePoint {
  return {
    seq: row.seq,
    t: row.recorded_at.toISOString(),
    lat: row.lat,
    lon: row.lon,
    ...(row.ele != null ? { ele: row.ele } : {}),
    ...(row.hr != null ? { hr: row.hr } : {}),
  };
}

/** 128 random bits as 22 URL-safe characters. */
export function newShareToken(): string {
  return randomBytes(16).toString('base64url');
}

export const SHARE_TOKEN_PATTERN = /^[A-Za-z0-9_-]{22}$/;

export async function getActiveSession(owner: DbUser): Promise<LiveSession | null> {
  const rows = await sql<SessionRow[]>`
    select ${sessionColumns()} from live_sessions
    where owner_id = ${owner.id} and status = 'active'
  `;
  return rows[0] ? toSession(rows[0]) : null;
}

export type StartResult =
  | { kind: 'created'; session: LiveSession }
  | { kind: 'active_exists'; session: LiveSession }
  | { kind: 'invalid_sport' };

export async function startLiveSession(
  owner: DbUser,
  input: { sport?: string; title?: string },
): Promise<StartResult> {
  const sport = input.sport ?? 'run';
  const sports = await sql`select 1 from sports where key = ${sport}`;
  if (sports.length === 0) return { kind: 'invalid_sport' };

  try {
    const rows = await sql<SessionRow[]>`
      insert into live_sessions (owner_id, share_token, sport_key, title)
      values (${owner.id}, ${newShareToken()}, ${sport}, ${input.title ?? ''})
      returning ${sessionColumns()}
    `;
    return { kind: 'created', session: toSession(rows[0]) };
  } catch (error) {
    // live_sessions_one_active_idx: the owner already has an active session.
    if ((error as { code?: string }).code === '23505') {
      const existing = await getActiveSession(owner);
      if (existing) return { kind: 'active_exists', session: existing };
    }
    throw error;
  }
}

export type AddPointsResult =
  | 'not_found'
  | 'forbidden'
  | 'not_active'
  | 'session_full'
  | {
      accepted: number;
      duplicates: number;
      pointCount: number;
      distanceM: number;
      lastSeq: number | null;
      lastHr: number | null;
    };

export async function addLivePoints(
  id: string,
  owner: DbUser,
  points: LivePoint[],
): Promise<AddPointsResult> {
  // Sorted and de-duplicated by seq so one INSERT never hits the same key twice.
  const unique = [...new Map(points.map((p) => [p.seq, p])).values()].sort((a, b) => a.seq - b.seq);

  const outcome = await sql.begin(async (tx) => {
    const rows = await tx<SessionRow[]>`
      select ${sessionColumns()} from live_sessions where id = ${id} for update
    `;
    const session = rows[0];
    if (!session) return 'not_found' as const;
    if (session.owner_id !== owner.id) return 'forbidden' as const;
    if (session.status !== 'active') return 'not_active' as const;
    if (session.point_count + unique.length > MAX_SESSION_POINTS) return 'session_full' as const;

    const insertRows = unique.map((p) => ({
      session_id: id,
      seq: p.seq,
      recorded_at: p.t,
      lat: p.lat,
      lon: p.lon,
      ele: p.ele ?? null,
      hr: p.hr ?? null,
    }));
    const inserted = await tx<PointRow[]>`
      insert into live_points ${tx(insertRows, 'session_id', 'seq', 'recorded_at', 'lat', 'lon', 'ele', 'hr')}
      on conflict (session_id, seq) do nothing
      returning seq, recorded_at, lat, lon, ele, hr
    `;
    inserted.sort((a, b) => a.seq - b.seq);

    // Only points newer than the running tail extend the live totals. Late (out-of-order)
    // points are stored and picked up by the exact recompute on finish.
    const fresh = inserted.filter((p) => p.seq > (session.last_seq ?? -1));
    const tail = fresh.at(-1);
    let distanceM = session.distance_m;
    let lastHr = session.last_hr;
    if (tail) {
      const from =
        session.last_lat != null && session.last_lon != null
          ? { lat: session.last_lat, lon: session.last_lon }
          : null;
      distanceM += pathDistanceM(fresh, from);
      lastHr = [...fresh].reverse().find((p) => p.hr != null)?.hr ?? lastHr;
      await tx`
        update live_sessions set
          distance_m = ${distanceM}, point_count = point_count + ${inserted.length},
          last_seq = ${tail.seq}, last_lat = ${tail.lat}, last_lon = ${tail.lon},
          last_hr = ${lastHr}, last_point_at = ${tail.recorded_at}, updated_at = now()
        where id = ${id}
      `;
    } else if (inserted.length > 0) {
      await tx`
        update live_sessions set point_count = point_count + ${inserted.length}, updated_at = now()
        where id = ${id}
      `;
    }

    return {
      token: session.share_token,
      fresh: fresh.map(toPoint),
      result: {
        accepted: inserted.length,
        duplicates: unique.length - inserted.length,
        pointCount: session.point_count + inserted.length,
        distanceM: Math.round(distanceM),
        lastSeq: tail?.seq ?? session.last_seq,
        lastHr,
      },
    };
  });

  if (typeof outcome === 'string') return outcome;
  if (outcome.fresh.length > 0) {
    emitToUser(liveChannel(outcome.token), 'points', {
      points: outcome.fresh,
      distanceM: outcome.result.distanceM,
      pointCount: outcome.result.pointCount,
      lastSeq: outcome.result.lastSeq,
      lastHr: outcome.result.lastHr,
    });
  }
  return outcome.result;
}

/** Public snapshot by share token; discarded sessions are indistinguishable from missing. */
export async function getPublicLive(token: string, afterSeq = -1): Promise<PublicLive | null> {
  const rows = await sql<
    (SessionRow & {
      username: string;
      display_name: string;
      avatar_initials: string;
      avatar_color: string;
      avg_hr: number | null;
    })[]
  >`
    select
      s.id::text, s.owner_id::text, s.share_token, s.sport_key, s.title, s.status, s.started_at,
      s.last_point_at, s.ended_at, s.distance_m, s.point_count, s.last_seq, s.last_lat, s.last_lon,
      s.last_hr, s.exercise_id::text,
      u.username, u.display_name, u.avatar_initials, u.avatar_color,
      (select round(avg(hr))::int from live_points p where p.session_id = s.id) as avg_hr
    from live_sessions s
    join users u on u.id = s.owner_id
    where s.share_token = ${token} and s.status <> 'discarded'
  `;
  const row = rows[0];
  if (!row) return null;

  const pointRows = await sql<PointRow[]>`
    select seq, recorded_at, lat, lon, ele, hr from live_points
    where session_id = ${row.id} and seq > ${afterSeq}
    order by seq limit ${SNAPSHOT_POINT_LIMIT}
  `;

  const end = row.ended_at ?? row.last_point_at ?? row.started_at;
  return {
    status: row.status === 'finished' ? 'finished' : 'active',
    sport: row.sport_key,
    title: row.title,
    owner: {
      username: row.username,
      displayName: row.display_name,
      initials: row.avatar_initials,
      color: row.avatar_color,
    },
    startedAt: row.started_at.toISOString(),
    lastPointAt: iso(row.last_point_at),
    endedAt: iso(row.ended_at),
    elapsedCs: Math.max(0, Math.round((end.getTime() - row.started_at.getTime()) / 10)),
    distanceM: Math.round(row.distance_m),
    pointCount: row.point_count,
    lastSeq: row.last_seq,
    lastHr: row.last_hr,
    avgHr: row.avg_hr,
    exerciseId: row.exercise_id,
    points: pointRows.map(toPoint),
  };
}

export type FinishResult =
  | 'not_found'
  | 'forbidden'
  | 'not_active'
  | { session: LiveSession; exercise: Exercise };

/** Convert the session into a regular exercise. Idempotent: a finished session returns its exercise. */
export async function finishLiveSession(
  id: string,
  owner: DbUser,
  input: FinishInput,
): Promise<FinishResult> {
  const outcome = await sql.begin(async (tx) => {
    const rows = await tx<SessionRow[]>`
      select ${sessionColumns()} from live_sessions where id = ${id} for update
    `;
    const session = rows[0];
    if (!session) return 'not_found' as const;
    if (session.owner_id !== owner.id) return 'forbidden' as const;
    if (session.status === 'discarded') return 'not_active' as const;
    if (session.status === 'finished') {
      return { session: toSession(session), exerciseId: session.exercise_id, fresh: false };
    }

    const pointRows = await tx<PointRow[]>`
      select seq, recorded_at, lat, lon, ele, hr from live_points
      where session_id = ${id} order by seq
    `;
    const now = new Date();
    const hasTrack = pointRows.length >= 2;
    const trackDistance = hasTrack ? pathDistanceM(pointRows) : 0;
    const trackSpanMs = hasTrack
      ? pointRows[pointRows.length - 1].recorded_at.getTime() - pointRows[0].recorded_at.getTime()
      : now.getTime() - session.started_at.getTime();
    const hrs = pointRows.flatMap((p) => (p.hr != null ? [p.hr] : []));

    const exerciseId = await insertExercise(tx, owner, {
      sport: session.sport_key,
      title: input.title ?? session.title,
      body: input.body,
      tags: input.tags,
      date: input.date ?? localDate(pointRows[0]?.recorded_at ?? session.started_at),
      durationCs: input.durationCs ?? Math.max(0, Math.round(trackSpanMs / 10)),
      distanceM: input.distanceM ?? (hasTrack ? Math.round(trackDistance) : undefined),
      avgHr:
        input.avgHr ??
        (hrs.length > 0 ? Math.round(hrs.reduce((a, b) => a + b, 0) / hrs.length) : undefined),
      feelRating: input.feelRating,
      gpxPoints: downsample(
        pointRows.map((p) => ({
          lat: p.lat,
          lon: p.lon,
          ...(p.ele != null ? { ele: p.ele } : {}),
        })),
        MAX_EXERCISE_TRACK_POINTS,
      ),
    });

    const updated = await tx<SessionRow[]>`
      update live_sessions set
        status = 'finished', ended_at = ${now}, exercise_id = ${exerciseId},
        distance_m = ${trackDistance}, point_count = ${pointRows.length}, updated_at = now()
      where id = ${id}
      returning ${sessionColumns()}
    `;
    return { session: toSession(updated[0]), exerciseId, fresh: true };
  });

  if (typeof outcome === 'string') return outcome;
  const exercise = outcome.exerciseId ? await getExercise(outcome.exerciseId, true) : null;
  // The exercise can be deleted after finishing; the idempotent replay then has nothing to return.
  if (!exercise) return 'not_found';
  if (outcome.fresh) {
    emitToUser(liveChannel(outcome.session.shareToken), 'finished', {
      exerciseId: exercise.id,
      distanceM: outcome.session.distanceM,
    });
  }
  return { session: outcome.session, exercise };
}

/** Throw away an active session and its track. Finished sessions are deleted via their exercise. */
export async function discardLiveSession(
  id: string,
  owner: DbUser,
): Promise<'ok' | 'not_found' | 'forbidden' | 'not_active'> {
  const outcome = await sql.begin(async (tx) => {
    const rows = await tx<SessionRow[]>`
      select ${sessionColumns()} from live_sessions where id = ${id} for update
    `;
    const session = rows[0];
    if (!session) return 'not_found' as const;
    if (session.owner_id !== owner.id) return 'forbidden' as const;
    if (session.status !== 'active') return 'not_active' as const;
    await tx`delete from live_points where session_id = ${id}`;
    await tx`
      update live_sessions set status = 'discarded', ended_at = now(), point_count = 0, updated_at = now()
      where id = ${id}
    `;
    return session.share_token;
  });

  if (outcome === 'not_found' || outcome === 'forbidden' || outcome === 'not_active')
    return outcome;
  emitToUser(liveChannel(outcome), 'discarded', {});
  return 'ok';
}
