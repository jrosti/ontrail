import type { Comment, Exercise, ExerciseListItem } from '../../../web/src/types';
import { sql } from '../db/client';
import { gravatarHash } from '../gravatar';
import { emitToUser } from '../sse';
import type { DbUser } from './users';

interface ExerciseRow {
  id: string;
  owner_username: string;
  owner_display_name: string;
  owner_initials: string;
  owner_color: string;
  owner_email: string | null;
  sport_key: string;
  title: string;
  body_html: string | null;
  tags: string[];
  exercise_date: string;
  duration_cs: number;
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
  duration_cs: number;
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
  author_email: string | null;
  body: string;
  created_at: string;
}

interface CareRow {
  author_id: string;
  username: string;
  avatar_initials: string;
  avatar_color: string;
  author_email: string | null;
  emoji: string;
}

const ANON_BODY = 'Rekisteröidy nähdäksesi harjoitukset';

function toCare(row: CareRow): import('../../../web/src/types').Care {
  return {
    authorId: row.author_id,
    authorUsername: row.username,
    avatarInitials: row.avatar_initials,
    avatarColor: row.avatar_color,
    gravatarHash: gravatarHash(row.author_email),
    emoji: row.emoji,
  };
}

function toListItem(row: ExerciseRow, cares: CareRow[], authenticated: boolean): ExerciseListItem {
  return {
    id: row.id,
    ownerUsername: row.owner_username,
    ownerDisplayName: row.owner_display_name,
    ownerInitials: row.owner_initials,
    ownerColor: row.owner_color,
    ownerGravatarHash: gravatarHash(row.owner_email),
    sport: row.sport_key,
    title: row.title,
    // Body included for the feed preview; hidden from anonymous viewers.
    body: authenticated ? (row.body_html ?? undefined) : undefined,
    tags: row.tags,
    date: row.exercise_date,
    durationCs: row.duration_cs,
    distanceM: row.distance_m ?? undefined,
    avgHr: row.avg_hr ?? undefined,
    climbM: row.climb_m ?? undefined,
    gpxPoints: authenticated ? (row.gpx_points ?? undefined) : undefined,
    commentCount: authenticated ? row.comment_count : 0,
    careCount: row.care_count,
    cares: cares.map(toCare),
  };
}

function toComment(row: CommentRow): Comment {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    avatarInitials: row.avatar_initials,
    avatarColor: row.avatar_color,
    gravatarHash: gravatarHash(row.author_email),
    body: row.body,
    createdAt: row.created_at,
  };
}

function toExercise(
  row: ExerciseRow,
  cares: CareRow[],
  comments: Comment[],
  authenticated: boolean,
): Exercise {
  return {
    ...toListItem(row, cares, authenticated),
    body: authenticated ? (row.body_html ?? undefined) : ANON_BODY,
    gpxPoints: authenticated ? (row.gpx_points ?? undefined) : undefined,
    feelRating: authenticated ? (row.feel_rating ?? undefined) : undefined,
    details: authenticated ? row.details : {},
    comments: authenticated ? comments : [],
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
      u.email as owner_email,
      e.sport_key,
      e.title,
      e.body_html,
      e.tags,
      e.exercise_date::text,
      e.duration_cs,
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
  const singleSport = params.get('sport');
  const multiSports = params.get('sports'); // comma-separated, e.g. "juoksu,hiihto"
  const sportList = multiSports
    ? multiSports.split(',').filter(Boolean)
    : singleSport
      ? [singleSport]
      : null;
  const user = params.get('user');
  const tag = params.get('tag');
  const group = params.get('group'); // normalized group name
  const minDistM = params.get('minDistM') ? Number(params.get('minDistM')) : null;
  const maxDistM = params.get('maxDistM') ? Number(params.get('maxDistM')) : null;
  const minDurCs = params.get('minDurCs') ? Number(params.get('minDurCs')) : null;
  const maxDurCs = params.get('maxDurCs') ? Number(params.get('maxDurCs')) : null;
  const minHr = params.get('minHr') ? Number(params.get('minHr')) : null;
  const maxHr = params.get('maxHr') ? Number(params.get('maxHr')) : null;
  const dateFrom = params.get('dateFrom'); // YYYY-MM-DD
  const dateTo = params.get('dateTo');
  const sortBy = params.get('sortBy') ?? 'date'; // date | distance | duration | hr
  const sortDir = (params.get('sortDir') ?? 'desc') === 'asc' ? 'asc' : 'desc';
  const offset = (page - 1) * perPage;

  const sortCol =
    sortBy === 'distance'
      ? sql`e.distance_m`
      : sortBy === 'duration'
        ? sql`e.duration_cs`
        : sortBy === 'hr'
          ? sql`e.avg_hr`
          : sql`e.exercise_date`;

  const orderClause =
    sortDir === 'asc'
      ? sql`${sortCol} asc nulls last, e.created_at asc`
      : sql`${sortCol} desc nulls last, e.created_at desc`;

  const whereClause = sql`
    where (${sportList}::text[] is null or e.sport_key = any(${sportList}::text[]))
      and (${user}::text is null or u.username = ${user})
      and (${tag}::text is null or ${tag} = any(e.tags))
      and (${group}::text is null or u.id in (
        select gm.user_id from group_members gm
        join groups g on g.id = gm.group_id
        where g.normalized_name = ${group}
      ))
      and (${minDistM}::float8 is null or e.distance_m >= ${minDistM})
      and (${maxDistM}::float8 is null or e.distance_m <= ${maxDistM})
      and (${minDurCs}::float8 is null or e.duration_cs >= ${minDurCs})
      and (${maxDurCs}::float8 is null or e.duration_cs <= ${maxDurCs})
      and (${minHr}::float8 is null or e.avg_hr >= ${minHr})
      and (${maxHr}::float8 is null or e.avg_hr <= ${maxHr})
      and (${dateFrom}::text is null or e.exercise_date >= ${dateFrom}::date)
      and (${dateTo}::text is null or e.exercise_date <= ${dateTo}::date)
  `;

  const rows = await sql<ExerciseRow[]>`
    ${exerciseSelect()}
    ${whereClause}
    order by ${orderClause}
    limit ${perPage}
    offset ${offset}
  `;
  const totals = await sql<{ total: number }[]>`
    select count(*)::int as total
    from exercises e
    join users u on u.id = e.owner_id
    ${whereClause}
  `;
  const total = totals[0]?.total ?? 0;
  const exerciseIds = rows.map((r) => r.id);
  const careRows =
    exerciseIds.length > 0
      ? await sql<(CareRow & { exercise_id: string })[]>`
          select ca.exercise_id::text, ca.author_id::text, u.username, u.avatar_initials, u.avatar_color, u.email as author_email, ca.emoji
          from cares ca
          join users u on u.id = ca.author_id
          where ca.exercise_id = any(${exerciseIds}::uuid[])
          order by ca.created_at asc
        `
      : [];
  const caresByExercise = new Map<string, CareRow[]>();
  for (const cr of careRows) {
    const list = caresByExercise.get(cr.exercise_id) ?? [];
    list.push(cr);
    caresByExercise.set(cr.exercise_id, list);
  }
  return {
    items: rows.map((r) => toListItem(r, caresByExercise.get(r.id) ?? [], authenticated)),
    total,
    page,
    perPage,
  };
}

export async function getExercise(id: string, authenticated: boolean): Promise<Exercise | null> {
  const rows = await sql<ExerciseRow[]>`
    ${exerciseSelect()}
    where e.id = ${id}
    limit 1
  `;
  const row = rows[0];
  if (!row) return null;

  const [commentRows, careRows] = await Promise.all([
    authenticated
      ? sql<CommentRow[]>`
          select c.id::text, u.username, u.display_name, u.avatar_initials, u.avatar_color, u.email as author_email, c.body, c.created_at::text
          from comments c
          join users u on u.id = c.author_id
          where c.exercise_id = ${id}
          order by c.created_at asc
        `
      : [],
    sql<CareRow[]>`
      select ca.author_id::text, u.username, u.avatar_initials, u.avatar_color, u.email as author_email, ca.emoji
      from cares ca
      join users u on u.id = ca.author_id
      where ca.exercise_id = ${id}
      order by ca.created_at asc
    `,
  ]);

  return toExercise(row, careRows, commentRows.map(toComment), authenticated);
}

export async function createExercise(owner: DbUser, body: Partial<Exercise>): Promise<Exercise> {
  const created = await sql<{ id: string }[]>`
    insert into exercises (
      owner_id, sport_key, title, body_html, tags, exercise_date, duration_cs,
      distance_m, avg_hr, climb_m, feel_rating, details, gpx_points
    )
    values (
      ${owner.id}, ${body.sport ?? 'run'}, ${body.title ?? ''}, ${body.body ?? null},
      ${body.tags ?? []}, ${body.date ?? new Date().toISOString().slice(0, 10)},
      ${body.durationCs ?? 0}, ${body.distanceM ?? null}, ${body.avgHr ?? null},
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
      duration_cs,
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
      duration_cs = ${body.durationCs ?? existing.duration_cs},
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
