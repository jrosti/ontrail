import { verifyHankoRequest } from './auth/hanko';
import { loadConfig } from './config';
import { closeDb, sql } from './db/client';
import { forbidden, handleError, json, methodNotAllowed, notFound, unauthorized } from './http';
import {
  addComment,
  createExercise,
  deleteComment,
  deleteExercise,
  getExercise,
  listExercises,
  updateExercise,
} from './repositories/exercises';
import {
  createGroup,
  getGroupByName,
  joinGroup,
  leaveGroup,
  listGroups,
} from './repositories/groups';
import { ensureSportsSeeded, listSports } from './repositories/sports';
import {
  getSportSummary,
  getSportSummaryByYear,
  getSummaryByMonth,
  getSummaryByWeek,
} from './repositories/summaries';
import { getUnread, markAllRead } from './repositories/unread';
import {
  apiUser,
  type DbUser,
  findOrCreateUserFromClaims,
  getExercisesForExport,
  getPublicProfile,
  updateUserProfile,
} from './repositories/users';
import { emitToUser, registerSseClient } from './sse';

// Re-export emitToUser so it can be used from exercises repo (kept here for clarity)
export { emitToUser };

const config = loadConfig();

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

async function optionalUser(req: Request): Promise<DbUser | null> {
  const claims = await verifyHankoRequest(req).catch(() => null);
  return claims ? findOrCreateUserFromClaims(claims) : null;
}

async function requireUser(req: Request): Promise<DbUser | Response> {
  const user = await optionalUser(req);
  return user ?? unauthorized();
}

// ── Search helper ────────────────────────────────────────────────────────────

async function searchExercises(params: URLSearchParams) {
  const q = (params.get('q') ?? '').trim();
  const page = Math.max(1, Number(params.get('page') ?? 1));
  const perPage = Math.min(100, Math.max(1, Number(params.get('perPage') ?? 20)));
  const offset = (page - 1) * perPage;

  if (!q) return { items: [], total: 0, page, perPage };

  // Check if search_vec column exists
  const hasSearchVec = await sql<{ exists: boolean }[]>`
    select exists(
      select 1 from information_schema.columns
      where table_name = 'exercises' and column_name = 'search_vec'
    ) as exists
  `;

  interface ExerciseSearchRow {
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

  interface ExerciseListItemResult {
    id: string;
    ownerUsername: string;
    ownerDisplayName: string;
    ownerInitials: string;
    ownerColor: string;
    sport: string;
    title: string;
    tags: string[];
    date: string;
    durationSec: number;
    distanceM?: number;
    avgHr?: number;
    climbM?: number;
    gpxPoints?: { lat: number; lon: number; ele?: number }[];
    commentCount: number;
    careCount: number;
  }

  function toListItem(row: ExerciseSearchRow): ExerciseListItemResult {
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
      gpxPoints: row.gpx_points ?? undefined,
      commentCount: row.comment_count,
      careCount: row.care_count,
    };
  }

  const selectBase = sql`
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

  let rows: ExerciseSearchRow[];
  let total: number;

  if (hasSearchVec[0]?.exists) {
    rows = await sql<ExerciseSearchRow[]>`
      ${selectBase}
      where e.search_vec @@ websearch_to_tsquery('finnish', ${q})
      order by ts_rank(e.search_vec, websearch_to_tsquery('finnish', ${q})) desc
      limit ${perPage} offset ${offset}
    `;
    const totals = await sql<{ total: number }[]>`
      select count(*)::int as total from exercises e
      where e.search_vec @@ websearch_to_tsquery('finnish', ${q})
    `;
    total = totals[0]?.total ?? 0;
  } else {
    const like = `%${q}%`;
    rows = await sql<ExerciseSearchRow[]>`
      ${selectBase}
      where e.title ilike ${like}
      order by e.exercise_date desc
      limit ${perPage} offset ${offset}
    `;
    const totals = await sql<{ total: number }[]>`
      select count(*)::int as total from exercises e where e.title ilike ${like}
    `;
    total = totals[0]?.total ?? 0;
  }

  return { items: rows.map(toListItem), total, page, perPage };
}

// ── Router ───────────────────────────────────────────────────────────────────

async function route(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;

  if (req.method === 'OPTIONS') return new Response(null, { status: 204 });

  // ── Health ────────────────────────────────────────────────────────────────
  if (path === '/api/health') {
    if (req.method !== 'GET') return methodNotAllowed();
    const result = await sql<{ ok: number }[]>`select 1 as ok`;
    return json({ ok: result[0]?.ok === 1, service: 'ontrail-api' });
  }

  // ── Sports ────────────────────────────────────────────────────────────────
  if (path === '/api/sports') {
    if (req.method !== 'GET') return methodNotAllowed();
    const items = await listSports();
    return json({ items, total: items.length });
  }

  // ── Me ────────────────────────────────────────────────────────────────────
  if (path === '/api/me') {
    if (req.method !== 'GET') return methodNotAllowed();
    const user = await requireUser(req);
    if (user instanceof Response) return user;
    return json(apiUser(user));
  }

  // ── Exercises ─────────────────────────────────────────────────────────────
  if (path === '/api/exercises') {
    if (req.method === 'GET') return json(await listExercises(url.searchParams));
    if (req.method === 'POST') {
      const user = await requireUser(req);
      if (user instanceof Response) return user;
      return json(await createExercise(user, await req.json()), { status: 201 });
    }
    return methodNotAllowed();
  }

  const exerciseMatch = path.match(/^\/api\/exercises\/([^/]+)$/);
  if (exerciseMatch) {
    const id = exerciseMatch[1];
    if (!isUuid(id)) return notFound();
    if (req.method === 'GET') {
      const user = await optionalUser(req);
      const exercise = await getExercise(id, Boolean(user));
      return exercise ? json(exercise) : notFound();
    }
    if (req.method === 'PATCH' || req.method === 'PUT') {
      const user = await requireUser(req);
      if (user instanceof Response) return user;
      const result = await updateExercise(id, user, await req.json());
      if (result === 'forbidden') return forbidden();
      return result ? json(result) : notFound();
    }
    if (req.method === 'DELETE') {
      const user = await requireUser(req);
      if (user instanceof Response) return user;
      const result = await deleteExercise(id, user);
      if (result === 'forbidden') return forbidden();
      if (result === 'not_found') return notFound();
      return json({ ok: true });
    }
    return methodNotAllowed();
  }

  const commentsMatch = path.match(/^\/api\/exercises\/([^/]+)\/comments$/);
  if (commentsMatch) {
    if (!isUuid(commentsMatch[1])) return notFound();
    if (req.method !== 'POST') return methodNotAllowed();
    const user = await requireUser(req);
    if (user instanceof Response) return user;
    const body = (await req.json()) as { body?: string };
    if (!body.body?.trim()) return json({ error: 'body_required' }, { status: 400 });
    const comment = await addComment(commentsMatch[1], user, body.body.trim());
    return comment ? json(comment, { status: 201 }) : notFound();
  }

  const deleteCommentMatch = path.match(/^\/api\/exercises\/([^/]+)\/comments\/([^/]+)$/);
  if (deleteCommentMatch) {
    if (!isUuid(deleteCommentMatch[1]) || !isUuid(deleteCommentMatch[2])) return notFound();
    if (req.method !== 'DELETE') return methodNotAllowed();
    const user = await requireUser(req);
    if (user instanceof Response) return user;
    const result = await deleteComment(deleteCommentMatch[1], deleteCommentMatch[2], user);
    if (result === 'forbidden') return forbidden();
    if (result === 'not_found') return notFound();
    return json({ ok: true });
  }

  // ── Cares ─────────────────────────────────────────────────────────────────
  const caresMatch = path.match(/^\/api\/exercises\/([^/]+)\/cares$/);
  if (caresMatch) {
    const exerciseId = caresMatch[1];
    if (!isUuid(exerciseId)) return notFound();
    if (req.method !== 'POST') return methodNotAllowed();
    const user = await requireUser(req);
    if (user instanceof Response) return user;

    // Check if exercise exists
    const ex = await sql`select 1 from exercises where id = ${exerciseId}`;
    if (ex.length === 0) return notFound();

    // Toggle care
    const existing = await sql<{ author_id: string }[]>`
      select author_id::text from cares where exercise_id = ${exerciseId} and author_id = ${user.id}
    `;
    if (existing[0]) {
      await sql`delete from cares where exercise_id = ${exerciseId} and author_id = ${user.id}`;
    } else {
      await sql`
        insert into cares (exercise_id, author_id) values (${exerciseId}, ${user.id})
        on conflict do nothing
      `;
    }
    const careCountRows = await sql<{ count: number }[]>`
      select count(*)::int as count from cares where exercise_id = ${exerciseId}
    `;
    return json({ careCount: careCountRows[0]?.count ?? 0, cared: !existing[0] });
  }

  // ── User profile ──────────────────────────────────────────────────────────
  if (path === '/api/users/me') {
    if (req.method !== 'PATCH') return methodNotAllowed();
    const user = await requireUser(req);
    if (user instanceof Response) return user;
    const body = (await req.json()) as {
      displayName?: string;
      synopsis?: string;
      resthr?: number | null;
      maxhr?: number | null;
      aerk?: number | null;
      anaerk?: number | null;
      goals?: string | null;
    };
    const updated = await updateUserProfile(user.id, body);
    return updated ? json(apiUser(updated)) : notFound();
  }

  const userProfileMatch = path.match(/^\/api\/users\/([^/]+)$/);
  if (userProfileMatch) {
    const username = userProfileMatch[1];
    if (req.method !== 'GET') return methodNotAllowed();
    const profile = await getPublicProfile(username);
    return profile ? json(profile) : notFound();
  }

  // ── User summaries ────────────────────────────────────────────────────────
  const summaryAllTimeMatch = path.match(/^\/api\/users\/([^/]+)\/summary$/);
  if (summaryAllTimeMatch) {
    if (req.method !== 'GET') return methodNotAllowed();
    const items = await getSportSummary(summaryAllTimeMatch[1]);
    return json({ items });
  }

  const summaryYearByWeekMatch = path.match(/^\/api\/users\/([^/]+)\/summary\/(\d{4})\/by\/week$/);
  if (summaryYearByWeekMatch) {
    if (req.method !== 'GET') return methodNotAllowed();
    const items = await getSummaryByWeek(
      summaryYearByWeekMatch[1],
      Number(summaryYearByWeekMatch[2]),
    );
    return json({ items });
  }

  const summaryYearByMonthMatch = path.match(
    /^\/api\/users\/([^/]+)\/summary\/(\d{4})\/by\/month$/,
  );
  if (summaryYearByMonthMatch) {
    if (req.method !== 'GET') return methodNotAllowed();
    const items = await getSummaryByMonth(
      summaryYearByMonthMatch[1],
      Number(summaryYearByMonthMatch[2]),
    );
    return json({ items });
  }

  const summaryYearMatch = path.match(/^\/api\/users\/([^/]+)\/summary\/(\d{4})$/);
  if (summaryYearMatch) {
    if (req.method !== 'GET') return methodNotAllowed();
    const items = await getSportSummaryByYear(summaryYearMatch[1], Number(summaryYearMatch[2]));
    return json({ items });
  }

  // ── Groups ────────────────────────────────────────────────────────────────
  if (path === '/api/groups') {
    if (req.method === 'GET') {
      const items = await listGroups();
      return json({ items });
    }
    if (req.method === 'POST') {
      const user = await requireUser(req);
      if (user instanceof Response) return user;
      const body = (await req.json()) as { name?: string; description?: string };
      if (!body.name?.trim()) return json({ error: 'name_required' }, { status: 400 });
      const result = await createGroup(body.name.trim(), body.description?.trim() ?? null);
      if (result === 'conflict') return json({ error: 'name_taken' }, { status: 409 });
      return json(result, { status: 201 });
    }
    return methodNotAllowed();
  }

  const groupJoinMatch = path.match(/^\/api\/groups\/([^/]+)\/join$/);
  if (groupJoinMatch) {
    if (req.method !== 'POST') return methodNotAllowed();
    const user = await requireUser(req);
    if (user instanceof Response) return user;
    const result = await joinGroup(groupJoinMatch[1], user.id);
    return result === 'not_found' ? notFound() : json({ ok: true });
  }

  const groupLeaveMatch = path.match(/^\/api\/groups\/([^/]+)\/leave$/);
  if (groupLeaveMatch) {
    if (req.method !== 'POST') return methodNotAllowed();
    const user = await requireUser(req);
    if (user instanceof Response) return user;
    const result = await leaveGroup(groupLeaveMatch[1], user.id);
    return result === 'not_found' ? notFound() : json({ ok: true });
  }

  const groupDetailMatch = path.match(/^\/api\/groups\/([^/]+)$/);
  if (groupDetailMatch) {
    if (req.method !== 'GET') return methodNotAllowed();
    const result = await getGroupByName(groupDetailMatch[1]);
    return result ? json(result) : notFound();
  }

  // ── Search ────────────────────────────────────────────────────────────────
  if (path === '/api/search') {
    if (req.method !== 'GET') return methodNotAllowed();
    return json(await searchExercises(url.searchParams));
  }

  // ── Unread ────────────────────────────────────────────────────────────────
  if (path === '/api/unread') {
    if (req.method !== 'GET') return methodNotAllowed();
    const user = await requireUser(req);
    if (user instanceof Response) return user;
    return json(await getUnread(user.id));
  }

  if (path === '/api/unread/mark-all-read') {
    if (req.method !== 'POST') return methodNotAllowed();
    const user = await requireUser(req);
    if (user instanceof Response) return user;
    await markAllRead(user.id);
    return json({ ok: true });
  }

  // ── Export ────────────────────────────────────────────────────────────────
  if (path === '/api/export') {
    if (req.method !== 'GET') return methodNotAllowed();
    const user = await requireUser(req);
    if (user instanceof Response) return user;
    const exercises = await getExercisesForExport(user.id);
    return json(exercises);
  }

  // ── SSE ───────────────────────────────────────────────────────────────────
  if (path === '/api/sse') {
    if (req.method !== 'GET') return methodNotAllowed();
    const user = await requireUser(req);
    if (user instanceof Response) return user;

    let unregister: (() => void) | undefined;
    let pingInterval: ReturnType<typeof setInterval> | undefined;

    const stream = new ReadableStream({
      start(controller) {
        const encode = (s: string) => new TextEncoder().encode(s);

        const sseController = {
          enqueue: (data: string) => controller.enqueue(encode(data)),
          close: () => controller.close(),
        };

        unregister = registerSseClient(user.id, sseController);

        // Send initial ping
        controller.enqueue(encode('event: ping\ndata: {}\n\n'));

        // Keep-alive ping every 30s
        pingInterval = setInterval(() => {
          try {
            controller.enqueue(encode('event: ping\ndata: {}\n\n'));
          } catch {
            if (pingInterval) clearInterval(pingInterval);
            unregister?.();
          }
        }, 30_000);
      },
      cancel() {
        if (pingInterval) clearInterval(pingInterval);
        unregister?.();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  }

  return notFound();
}

await ensureSportsSeeded();

const server = Bun.serve({
  port: config.port,
  async fetch(req) {
    try {
      return await route(req);
    } catch (error) {
      return handleError(error);
    }
  },
});

console.log(`OnTrail API listening on http://localhost:${server.port}`);

async function shutdown() {
  await closeDb();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
