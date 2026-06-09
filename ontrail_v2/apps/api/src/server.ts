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
import { ensureSportsSeeded, listSports } from './repositories/sports';
import { apiUser, type DbUser, findOrCreateUserFromClaims } from './repositories/users';

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

async function route(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;

  if (req.method === 'OPTIONS') return new Response(null, { status: 204 });

  if (path === '/api/health') {
    if (req.method !== 'GET') return methodNotAllowed();
    const result = await sql<{ ok: number }[]>`select 1 as ok`;
    return json({ ok: result[0]?.ok === 1, service: 'ontrail-api' });
  }

  if (path === '/api/sports') {
    if (req.method !== 'GET') return methodNotAllowed();
    const items = await listSports();
    return json({ items, total: items.length });
  }

  if (path === '/api/me') {
    if (req.method !== 'GET') return methodNotAllowed();
    const user = await requireUser(req);
    if (user instanceof Response) return user;
    return json(apiUser(user));
  }

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
