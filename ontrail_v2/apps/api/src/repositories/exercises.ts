import type { Comment, Exercise, ExerciseListItem } from '../../../web/src/types';
import { sql } from '../db/client';
import { emitToUser } from '../sse';
import type { DbUser } from './users';

interface ExerciseRow {
  id: string;
  owner_username: string;
  owner_display_name: string;
  owner_initials: string;
  owner_color: string;
  sport_key: string;
  title: string;
  body_html: string | null;
  tags: string[];
  exercise_date: string;
  duration_sec: number;
  distance_m: number | null;
  avg_hr: number | null;
  climb_m: number | null;
  feel_rating: 'easy' | 'ok' | 'hard' | null;
  details: Record<string, number>;
  gpx_points: { lat: number; lon: number; ele?: number }[] | null;
  comment_count: number;
  care_count: number;
  created_at: string;
  updated_at: string;
}

interface ExerciseUpdateRow {
  owner_id: string;
  sport_key: string;
  title: string;
  body_html: string | null;
  tags: string[];
  exercise_date: string;
  duration_sec: number;
  distance_m: number | null;
  avg_hr: number | null;
  climb_m: number | null;
  feel_rating: 'easy' | 'ok' | 'hard' | null;
  details: Record<string, number>;
  gpx_points: { lat: number; lon: number; ele?: number }[] | null;
}

interface CommentRow {
  id: string;
  username: string;
  display_name: string;
  avatar_initials: string;
  avatar_color: string;
  body: string;
  created_at: string;
}

const ANON_BODY = 'Rekisteröidy nähdäksesi harjoitukset';

function toListItem(row: ExerciseRow, authenticated: boolean): ExerciseListItem {
  return {
    id: row.id,
    ownerUsername: row.owner_username,
    ownerDisplayName: row.owner_display_name,
    ownerInitials: row.owner_initials,
    ownerColor: row.owner_color,
    sport: row.sport_key,
    title: row.title,
    tags: row.tags,
    date: row.exercise_date,
    durationSec: row.duration_sec,
    distanceM: row.distance_m ?? undefined,
    avgHr: row.avg_hr ?? undefined,
    climbM: row.climb_m ?? undefined,
    gpxPoints: authenticated ? (row.gpx_points ?? undefined) : undefined,
    commentCount: authenticated ? row.comment_count : 0,
    careCount: row.care_count,
  };
}

function toComment(row: CommentRow): Comment {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    avatarInitials: row.avatar_initials,
    avatarColor: row.avatar_color,
    body: row.body,
    createdAt: row.created_at,
  };
}

function toExercise(row: ExerciseRow, comments: Comment[], authenticated: boolean): Exercise {
  return {
    ...toListItem(row, authenticated),
    body: authenticated ? (row.body_html ?? undefined) : ANON_BODY,
    gpxPoints: authenticated ? (row.gpx_points ?? undefined) : undefined,
    feelRating: authenticated ? (row.feel_rating ?? undefined) : undefined,
    details: authenticated ? row.details : {},
    comments: authenticated ? comments : [],
    cares: [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function normalizeGpxPoints(points: unknown): Exercise['gpxPoints'] {
  if (!Array.isArray(points)) return undefined;
  return points.flatMap((point) => {
    if (!point || typeof point !== 'object') return [];
    const source = point as Record<string, unknown>;
    const lat = Number(source.lat);
    const lon = Number(source.lon);
    const ele = source.ele == null ? undefined : Number(source.ele);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return [];
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return [];
    return [{ lat, lon, ...(Number.isFinite(ele) ? { ele } : {}) }];
  });
}

function exerciseSelect() {
  return sql`
    select
      e.id::text,
      u.username as owner_username,
      u.display_name as owner_display_name,
      u.avatar_initials as owner_initials,
      u.avatar_color as owner_color,
      e.sport_key,
      e.title,
      e.body_html,
      e.tags,
      e.exercise_date::text,
      e.duration_sec,
      e.distance_m,
      e.avg_hr,
      e.climb_m,
      e.feel_rating,
      e.details,
      e.gpx_points,
      (select count(*)::int from comments c where c.exercise_id = e.id) as comment_count,
      (select count(*)::int from cares ca where ca.exercise_id = e.id) as care_count,
      e.created_at::text,
      e.updated_at::text
    from exercises e
    join users u on u.id = e.owner_id
  `;
}

export async function listExercises(params: URLSearchParams, authenticated: boolean) {
  const page = Math.max(1, Number(params.get('page') ?? 1));
  const perPage = Math.min(100, Math.max(1, Number(params.get('perPage') ?? 20)));
  const sport = params.get('sport');
  const user = params.get('user');
  const tag = params.get('tag');
  const offset = (page - 1) * perPage;

  const rows = await sql<ExerciseRow[]>`
    ${exerciseSelect()}
    where (${sport}::text is null or e.sport_key = ${sport})
      and (${user}::text is null or u.username = ${user})
      and (${tag}::text is null or ${tag} = any(e.tags))
    order by e.exercise_date desc, e.created_at desc
    limit ${perPage}
    offset ${offset}
  `;
  const totals = await sql<{ total: number }[]>`
    select count(*)::int as total
    from exercises e
    join users u on u.id = e.owner_id
    where (${sport}::text is null or e.sport_key = ${sport})
      and (${user}::text is null or u.username = ${user})
      and (${tag}::text is null or ${tag} = any(e.tags))
  `;
  const total = totals[0]?.total ?? 0;
  return { items: rows.map((r) => toListItem(r, authenticated)), total, page, perPage };
}

export async function getExercise(id: string, authenticated: boolean): Promise<Exercise | null> {
  const rows = await sql<ExerciseRow[]>`
    ${exerciseSelect()}
    where e.id = ${id}
    limit 1
  `;
  const row = rows[0];
  if (!row) return null;

  const commentRows = authenticated
    ? await sql<CommentRow[]>`
        select c.id::text, u.username, u.display_name, u.avatar_initials, u.avatar_color, c.body, c.created_at::text
        from comments c
        join users u on u.id = c.author_id
        where c.exercise_id = ${id}
        order by c.created_at asc
      `
    : [];

  return toExercise(row, commentRows.map(toComment), authenticated);
}

export async function createExercise(owner: DbUser, body: Partial<Exercise>): Promise<Exercise> {
  const created = await sql<{ id: string }[]>`
    insert into exercises (
      owner_id, sport_key, title, body_html, tags, exercise_date, duration_sec,
      distance_m, avg_hr, climb_m, feel_rating, details, gpx_points
    )
    values (
      ${owner.id}, ${body.sport ?? 'run'}, ${body.title ?? ''}, ${body.body ?? null},
      ${body.tags ?? []}, ${body.date ?? new Date().toISOString().slice(0, 10)},
      ${body.durationSec ?? 0}, ${body.distanceM ?? null}, ${body.avgHr ?? null},
      ${body.climbM ?? null}, ${body.feelRating ?? null},
      ${sql.json(body.details ?? {})},
      ${sql.json(normalizeGpxPoints(body.gpxPoints) ?? null)}
    )
    returning id::text
  `;
  const exercise = await getExercise(created[0].id, true);
  if (!exercise) throw new Error('created_exercise_not_found');
  return exercise;
}

export async function updateExercise(
  id: string,
  owner: DbUser,
  body: Partial<Exercise>,
): Promise<Exercise | 'forbidden' | null> {
  const existingRows = await sql<ExerciseUpdateRow[]>`
    select
      owner_id::text,
      sport_key,
      title,
      body_html,
      tags,
      exercise_date::text,
      duration_sec,
      distance_m,
      avg_hr,
      climb_m,
      feel_rating,
      details,
      gpx_points
    from exercises
    where id = ${id}
    limit 1
  `;
  const existing = existingRows[0];
  if (!existing) return null;
  if (existing.owner_id !== owner.id) return 'forbidden';

  const details = 'details' in body ? (body.details ?? {}) : existing.details;
  const gpxPoints =
    'gpxPoints' in body ? (normalizeGpxPoints(body.gpxPoints) ?? null) : existing.gpx_points;

  await sql`
    update exercises set
      sport_key = ${body.sport ?? existing.sport_key},
      title = ${body.title ?? existing.title},
      body_html = ${'body' in body ? (body.body ?? null) : existing.body_html},
      tags = ${body.tags ?? existing.tags},
      exercise_date = ${body.date ?? existing.exercise_date},
      duration_sec = ${body.durationSec ?? existing.duration_sec},
      distance_m = ${'distanceM' in body ? (body.distanceM ?? null) : existing.distance_m},
      avg_hr = ${'avgHr' in body ? (body.avgHr ?? null) : existing.avg_hr},
      climb_m = ${'climbM' in body ? (body.climbM ?? null) : existing.climb_m},
      feel_rating = ${'feelRating' in body ? (body.feelRating ?? null) : existing.feel_rating},
      details = ${sql.json(details)},
      gpx_points = ${sql.json(gpxPoints)},
      updated_at = now()
    where id = ${id}
  `;

  return getExercise(id, true);
}

export async function deleteExercise(
  id: string,
  owner: DbUser,
): Promise<'ok' | 'forbidden' | 'not_found'> {
  const existing = await sql<
    { owner_id: string }[]
  >`select owner_id::text from exercises where id = ${id}`;
  if (!existing[0]) return 'not_found';
  if (existing[0].owner_id !== owner.id) return 'forbidden';
  await sql`delete from exercises where id = ${id}`;
  return 'ok';
}

export async function addComment(
  exerciseId: string,
  author: DbUser,
  body: string,
): Promise<Comment | null> {
  const exerciseRows = await sql<{ owner_id: string }[]>`
    select owner_id::text from exercises where id = ${exerciseId}
  `;
  if (exerciseRows.length === 0) return null;
  const ownerId = exerciseRows[0].owner_id;
  const rows = await sql<CommentRow[]>`
    insert into comments (exercise_id, author_id, body)
    values (${exerciseId}, ${author.id}, ${body})
    returning id::text, ${author.username} as username, ${author.displayName} as display_name,
      ${author.avatarInitials} as avatar_initials, ${author.avatarColor} as avatar_color,
      body, created_at::text
  `;
  const comment = toComment(rows[0]);
  // Notify exercise owner via SSE (skip if author is owner)
  if (ownerId !== author.id) {
    emitToUser(ownerId, 'new_comment', { exerciseId });
  }
  return comment;
}

export async function deleteComment(
  exerciseId: string,
  commentId: string,
  user: DbUser,
): Promise<'ok' | 'forbidden' | 'not_found'> {
  const rows = await sql<{ author_id: string; owner_id: string }[]>`
    select c.author_id::text, e.owner_id::text
    from comments c
    join exercises e on e.id = c.exercise_id
    where c.exercise_id = ${exerciseId} and c.id = ${commentId}
  `;
  const row = rows[0];
  if (!row) return 'not_found';
  if (row.author_id !== user.id && row.owner_id !== user.id) return 'forbidden';
  await sql`delete from comments where id = ${commentId}`;
  return 'ok';
}
