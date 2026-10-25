import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { exportJWK, generateKeyPair, type JWK, SignJWT } from 'jose';
import postgres from 'postgres';
import { GenericContainer, type StartedTestContainer } from 'testcontainers';

const postgresUser = 'ontrail';
const postgresPassword = 'ontrail';
const postgresDb = 'ontrail_test';
const jwtKeyId = 'ontrail-integration-key';

let container: StartedTestContainer;
let jwksServer: ReturnType<typeof Bun.serve>;
let apiServer: ReturnType<typeof Bun.serve>;
let privateKey: CryptoKey;
let hankoIssuer: string;
let closeDb: typeof import('./db/client').closeDb;
let integrationReady = false;
let integrationSetupError: unknown;

async function applyMigrations(databaseUrl: string) {
  const sql = postgres(databaseUrl, { max: 1 });
  const migrationsDir = new URL('../migrations', import.meta.url).pathname;

  await sql`
    create table if not exists schema_migrations (
      id text primary key,
      applied_at timestamptz not null default now()
    )
  `;

  for (const file of readdirSync(migrationsDir)
    .filter((name) => name.endsWith('.sql'))
    .sort()) {
    const body = readFileSync(join(migrationsDir, file), 'utf8');
    await sql.begin(async (tx) => {
      await tx.unsafe(body);
      await tx`insert into schema_migrations (id) values (${file}) on conflict do nothing`;
    });
  }

  await sql.end({ timeout: 5 });
}

function startLocalServer(fetch: (req: Request) => Response | Promise<Response>): string {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const port = 20_000 + Math.floor(Math.random() * 20_000);
    try {
      const server = Bun.serve({ hostname: '127.0.0.1', port, fetch });
      if (!jwksServer) jwksServer = server;
      else apiServer = server;
      return server.url.href.replace(/\/$/, '');
    } catch (error) {
      if (attempt === 19) throw error;
    }
  }

  throw new Error('failed to start local test server');
}

async function startJwksServer(): Promise<string> {
  const keyPair = await generateKeyPair('RS256', { extractable: true });
  privateKey = keyPair.privateKey;
  const publicJwk = (await exportJWK(keyPair.publicKey)) as JWK & { kid: string; alg: string };
  publicJwk.kid = jwtKeyId;
  publicJwk.alg = 'RS256';

  const fetch = (req: Request) => {
    const url = new URL(req.url);
    if (url.pathname === '/.well-known/jwks.json') {
      return Response.json({ keys: [publicJwk] });
    }
    return new Response('not found', { status: 404 });
  };

  return startLocalServer(fetch);
}

async function tokenFor(subject: string, claims: Record<string, unknown> = {}): Promise<string> {
  return new SignJWT({ email: `${subject}@example.test`, ...claims })
    .setProtectedHeader({ alg: 'RS256', kid: jwtKeyId })
    .setIssuer(hankoIssuer)
    .setSubject(subject)
    .setIssuedAt()
    .setExpirationTime('10m')
    .sign(privateKey);
}

async function authHeaders(
  subject: string,
  headers: HeadersInit = {},
  claims: Record<string, unknown> = {},
): Promise<HeadersInit> {
  return {
    ...headers,
    authorization: `Bearer ${await tokenFor(subject, claims)}`,
  };
}

async function request(path: string, init: RequestInit = {}) {
  return fetch(`${apiServer.url.href.replace(/\/$/, '')}${path}`, init);
}

async function jsonResponse<T = Record<string, unknown>>(response: Response): Promise<T> {
  return response.json() as Promise<T>;
}

beforeAll(async () => {
  try {
    hankoIssuer = await startJwksServer();
    container = await new GenericContainer('postgres:18')
      .withEnvironment({
        POSTGRES_USER: postgresUser,
        POSTGRES_PASSWORD: postgresPassword,
        POSTGRES_DB: postgresDb,
      })
      .withExposedPorts(5432)
      .start();

    const databaseUrl = `postgres://${postgresUser}:${postgresPassword}@${container.getHost()}:${container.getMappedPort(5432)}/${postgresDb}`;
    process.env.DATABASE_URL = databaseUrl;
    process.env.HANKO_URL = hankoIssuer;
    process.env.HANKO_JWT_ISSUER = hankoIssuer;

    await applyMigrations(databaseUrl);

    const { handleRequest } = await import('./server');
    ({ closeDb } = await import('./db/client'));
    const { ensureSportsSeeded } = await import('./repositories/sports');
    await ensureSportsSeeded();
    startLocalServer(handleRequest);
    integrationReady = true;
  } catch (error) {
    integrationSetupError = error;
    if (process.env.CI) throw error;
  }
}, 120_000);

afterAll(async () => {
  await closeDb?.();
  apiServer?.stop(true);
  await container?.stop();
  jwksServer?.stop(true);
});

describe('API integration', () => {
  function skipIfIntegrationUnavailable() {
    if (!integrationReady) {
      console.warn(
        `Skipping API integration test: ${
          integrationSetupError instanceof Error
            ? integrationSetupError.message
            : 'Testcontainers is unavailable'
        }`,
      );
      return true;
    }
    return false;
  }

  test('reports health against the container database', async () => {
    if (skipIfIntegrationUnavailable()) return;

    const response = await request('/api/health');

    expect(response.status).toBe(200);
    await expect(jsonResponse(response)).resolves.toEqual({
      ok: true,
      service: 'ontrail-api',
    });
  });

  test('decodes non-ASCII usernames in path params (summary)', async () => {
    if (skipIfIntegrationUnavailable()) return;

    // Finnish names contain ö/ä/å; the URL arrives percent-encoded and must be
    // decoded before the username is matched against stored rows.
    const { sql } = await import('./db/client');
    const username = 'Tëörö';
    const [u] = await sql<{ id: string }[]>`
      insert into users (username, normalized_username, display_name, avatar_initials, avatar_color)
      values (${username}, ${'teoro'}, ${username}, ${'TÖ'}, ${'oklch(60% .18 260)'})
      returning id::text
    `;
    await sql`
      insert into exercises (owner_id, sport_key, title, exercise_date, duration_cs)
      values (${u.id}, 'run', 'Testilenkki', '2022-05-01', 360000)
    `;

    const response = await request(`/api/users/${encodeURIComponent(username)}/summary`);
    const body = await jsonResponse<{ items: { sport: string; totalDurationCs: number }[] }>(
      response,
    );
    expect(body.items.length).toBeGreaterThan(0);
    expect(body.items.some((i) => i.sport === 'run' && i.totalDurationCs === 360000)).toBe(true);
  });

  test('lists seeded sports from PostgreSQL', async () => {
    if (skipIfIntegrationUnavailable()) return;

    const response = await request('/api/sports');
    const body = await jsonResponse<{ items: { key: string; nameFi: string }[]; total: number }>(
      response,
    );

    expect(response.status).toBe(200);
    expect(body.total).toBeGreaterThan(60);
    expect(body.items).toContainEqual(expect.objectContaining({ key: 'run', nameFi: 'Juoksu' }));
  });

  test('creates the current user from Hanko claims', async () => {
    if (skipIfIntegrationUnavailable()) return;

    const response = await request('/api/me', {
      headers: await authHeaders('alice-subject'),
    });
    const body = await jsonResponse<{ username: string; email: string }>(response);

    expect(response.status).toBe(200);
    expect(body.username).toBe('alice_subject');
    expect(body.email).toBe('alice-subject@example.test');
  });

  test('requires authentication for exercise creation', async () => {
    if (skipIfIntegrationUnavailable()) return;

    const response = await request('/api/exercises', {
      method: 'POST',
      body: JSON.stringify({ title: 'Anonymous run', sport: 'run', durationCs: 1800 }),
    });

    expect(response.status).toBe(401);
    await expect(jsonResponse(response)).resolves.toEqual({ error: 'unauthorized' });
  });

  test('creates exercises and hides comments from anonymous readers', async () => {
    if (skipIfIntegrationUnavailable()) return;

    const createdResponse = await request('/api/exercises', {
      method: 'POST',
      headers: await authHeaders('alice-subject'),
      body: JSON.stringify({
        sport: 'run',
        title: 'Morning trail',
        body: '<p>Easy base run</p>',
        tags: ['base', 'forest'],
        date: '2026-06-09',
        durationCs: 3600,
        distanceM: 10500,
        climbM: 120,
        gpxPoints: [
          { lat: 60.1699, lon: 24.9384, ele: 10 },
          { lat: 60.1709, lon: 24.9484, ele: 18 },
        ],
      }),
    });
    const created = await jsonResponse<{ id: string; distanceM: number; durationCs: number }>(
      createdResponse,
    );

    expect(createdResponse.status).toBe(201);
    expect(created.distanceM).toBe(10500);
    expect(created.durationCs).toBe(3600);

    const commentResponse = await request(`/api/exercises/${created.id}/comments`, {
      method: 'POST',
      headers: await authHeaders('bob-subject'),
      body: JSON.stringify({ body: 'Nice one' }),
    });
    expect(commentResponse.status).toBe(201);

    const anonymousResponse = await request(`/api/exercises/${created.id}`);
    const anonymous = await jsonResponse<{
      body: string;
      comments: unknown[];
      commentCount: number;
    }>(anonymousResponse);

    expect(anonymousResponse.status).toBe(200);
    expect(anonymous.body).toBe('Rekisteröidy nähdäksesi harjoitukset');
    expect(anonymous.comments).toEqual([]);
    expect(anonymous.commentCount).toBe(0);

    const authenticatedResponse = await request(`/api/exercises/${created.id}`, {
      headers: await authHeaders('alice-subject'),
    });
    const authenticated = await jsonResponse<{
      body: string;
      comments: { body: string; username: string }[];
      commentCount: number;
    }>(authenticatedResponse);

    expect(authenticated.body).toBe('<p>Easy base run</p>');
    expect(authenticated.commentCount).toBe(1);
    expect(authenticated.comments).toContainEqual(
      expect.objectContaining({ body: 'Nice one', username: 'bob_subject' }),
    );
  });

  test('ties destructive exercise edits to the JWT owner', async () => {
    if (skipIfIntegrationUnavailable()) return;

    const createdResponse = await request('/api/exercises', {
      method: 'POST',
      headers: await authHeaders('owner-subject'),
      body: JSON.stringify({
        sport: 'run',
        title: 'Owner run',
        date: '2026-06-10',
        durationCs: 2400,
      }),
    });
    const created = await jsonResponse<{ id: string }>(createdResponse);

    const forbiddenResponse = await request(`/api/exercises/${created.id}`, {
      method: 'PATCH',
      headers: await authHeaders('other-subject'),
      body: JSON.stringify({ title: 'Hijacked' }),
    });
    expect(forbiddenResponse.status).toBe(403);

    const ownerResponse = await request(`/api/exercises/${created.id}`, {
      method: 'PATCH',
      headers: await authHeaders('owner-subject'),
      body: JSON.stringify({ title: 'Owner edited', distanceM: null }),
    });
    const ownerEdit = await jsonResponse<{ title: string; distanceM?: number }>(ownerResponse);

    expect(ownerResponse.status).toBe(200);
    expect(ownerEdit.title).toBe('Owner edited');
    expect(ownerEdit.distanceM).toBeUndefined();
  });
});

describe('live tracking integration', () => {
  interface Session {
    id: string;
    shareToken: string;
    status: string;
    distanceM: number;
    exerciseId: string | null;
    pointCount: number;
  }

  const skip = () => !integrationReady;
  const base = new Date('2026-06-20T09:00:00Z').getTime();
  // 0.001° of latitude is ~111 m, so three points are ~222 m apart end to end.
  const track = (from: number, count: number, hr?: number) =>
    Array.from({ length: count }, (_, i) => ({
      seq: from + i,
      t: new Date(base + (from + i) * 5000).toISOString(),
      lat: 60 + (from + i) * 0.001,
      lon: 24.9,
      ele: 10 + (from + i),
      ...(hr ? { hr: hr + i } : {}),
    }));

  async function post(path: string, subject: string, body?: unknown) {
    return request(path, {
      method: 'POST',
      headers: await authHeaders(subject, { 'content-type': 'application/json' }),
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  }

  async function start(subject: string, body: unknown = { sport: 'run', title: 'Long run' }) {
    const response = await post('/api/live', subject, body);
    return { response, session: await jsonResponse<Session>(response) };
  }

  test('requires authentication to start and rejects unknown sports', async () => {
    if (skip()) return;

    expect((await request('/api/live', { method: 'POST' })).status).toBe(401);
    const bad = await post('/api/live', 'live-badsport', { sport: 'no-such-sport' });
    expect(bad.status).toBe(400);
  });

  test('allows one active session per user and resumes it via /active', async () => {
    if (skip()) return;

    const first = await start('live-one');
    expect(first.response.status).toBe(201);
    expect(first.session.shareToken).toMatch(/^[A-Za-z0-9_-]{22}$/);
    expect(first.session.status).toBe('active');

    const second = await start('live-one');
    expect(second.response.status).toBe(409);
    const conflict = await jsonResponse<{ error: string; session: Session }>(
      await post('/api/live', 'live-one', {}),
    );
    expect(conflict.error).toBe('active_session_exists');
    expect(conflict.session.id).toBe(first.session.id);

    const active = await request('/api/live/active', {
      headers: await authHeaders('live-one'),
    });
    expect((await jsonResponse<Session>(active)).id).toBe(first.session.id);
    expect(
      (await request('/api/live/active', { headers: await authHeaders('live-none') })).status,
    ).toBe(404);
  });

  test('accepts point batches idempotently and serves them publicly', async () => {
    if (skip()) return;

    const { session } = await start('live-points');
    const url = `/api/live/${session.id}/points`;

    const first = await jsonResponse<{
      accepted: number;
      duplicates: number;
      distanceM: number;
      lastHr: number;
    }>(await post(url, 'live-points', { points: track(0, 3, 150) }));
    expect(first.accepted).toBe(3);
    expect(first.duplicates).toBe(0);
    expect(first.distanceM).toBeGreaterThan(220);
    expect(first.distanceM).toBeLessThan(225);
    expect(first.lastHr).toBe(152);

    // A retried batch changes nothing.
    const retry = await jsonResponse<{ accepted: number; duplicates: number; distanceM: number }>(
      await post(url, 'live-points', { points: track(0, 3, 150) }),
    );
    expect(retry).toMatchObject({ accepted: 0, duplicates: 3, distanceM: first.distanceM });

    // A later batch continues from the previous tail, not from its own first point.
    const next = await jsonResponse<{ distanceM: number; pointCount: number }>(
      await post(url, 'live-points', { points: track(3, 2) }),
    );
    expect(next.pointCount).toBe(5);
    expect(next.distanceM).toBeGreaterThan(444);
    expect(next.distanceM).toBeLessThan(448);

    // Public view: no auth, no internal ids or e-mail, incremental via ?after.
    const publicResponse = await request(`/api/live/${session.shareToken}`);
    const view = await jsonResponse<Record<string, unknown> & { points: { seq: number }[] }>(
      publicResponse,
    );
    expect(publicResponse.status).toBe(200);
    expect(view.status).toBe('active');
    expect(view.points.map((p) => p.seq)).toEqual([0, 1, 2, 3, 4]);
    expect(view.avgHr).toBe(151);
    expect(JSON.stringify(view)).not.toContain(session.id);
    expect(JSON.stringify(view)).not.toContain('@example.test');

    // An absurd cursor must not reach the 32-bit seq column.
    expect((await request(`/api/live/${session.shareToken}?after=99999999999`)).status).toBe(200);

    const incremental = await jsonResponse<{ points: { seq: number }[] }>(
      await request(`/api/live/${session.shareToken}?after=2`),
    );
    expect(incremental.points.map((p) => p.seq)).toEqual([3, 4]);
  });

  test('rejects invalid batches and other users', async () => {
    if (skip()) return;

    const { session } = await start('live-owner');
    const url = `/api/live/${session.id}/points`;

    const bad = await post(url, 'live-owner', { points: [{ ...track(0, 1)[0], lat: 120 }] });
    expect(bad.status).toBe(400);
    expect((await jsonResponse<{ error: string }>(bad)).error).toBe('invalid_point_0_lat');
    expect((await post(url, 'live-owner', { points: [] })).status).toBe(400);

    expect((await post(url, 'live-intruder', { points: track(0, 1) })).status).toBe(403);
    expect((await request(url, { method: 'POST', body: '{}' })).status).toBe(401);
    expect(
      (await post(`/api/live/${crypto.randomUUID()}/points`, 'live-owner', { points: track(0, 1) }))
        .status,
    ).toBe(404);
    expect(
      (
        await request(`/api/live/${session.id}`, {
          method: 'DELETE',
          headers: await authHeaders('live-intruder'),
        })
      ).status,
    ).toBe(403);
  });

  test('streams new points to anonymous viewers over SSE', async () => {
    if (skip()) return;

    const { session } = await start('live-sse');
    const controller = new AbortController();
    const stream = await fetch(
      `${apiServer.url.href.replace(/\/$/, '')}/api/live/${session.shareToken}/stream`,
      {
        signal: controller.signal,
      },
    );
    expect(stream.status).toBe(200);
    expect(stream.headers.get('content-type')).toContain('text/event-stream');

    const reader = stream.body?.getReader();
    if (!reader) throw new Error('no stream body');
    const decoder = new TextDecoder();
    let received = '';
    const readUntil = async (needle: string) => {
      const deadline = Date.now() + 5000;
      while (!received.includes(needle) && Date.now() < deadline) {
        const { value, done } = await reader.read();
        if (done) break;
        received += decoder.decode(value);
      }
    };

    await readUntil('event: ping');
    await post(`/api/live/${session.id}/points`, 'live-sse', { points: track(0, 2, 140) });
    await readUntil('event: points');
    controller.abort();

    expect(received).toContain('event: points');
    const data = received.split('event: points\ndata: ')[1]?.split('\n')[0] ?? '{}';
    const event = JSON.parse(data) as {
      points: { seq: number }[];
      lastHr: number;
      pointCount: number;
    };
    expect(event.points.map((p) => p.seq)).toEqual([0, 1]);
    expect(event.lastHr).toBe(141);
    expect(event.pointCount).toBe(2);
  });

  test('finishing turns the session into an exercise, idempotently', async () => {
    if (skip()) return;

    const { session } = await start('live-finish', { sport: 'run', title: 'Sunday long run' });
    await post(`/api/live/${session.id}/points`, 'live-finish', { points: track(0, 4, 140) });

    const finishUrl = `/api/live/${session.id}/finish`;
    const finished = await post(finishUrl, 'live-finish', { durationCs: 90_000, tags: ['pitkä'] });
    expect(finished.status).toBe(200);
    const body = await jsonResponse<{
      session: Session;
      exercise: {
        id: string;
        sport: string;
        title: string;
        date: string;
        durationCs: number;
        distanceM: number;
        avgHr: number;
        tags: string[];
        gpxPoints: { lat: number; lon: number; ele?: number }[];
      };
    }>(finished);
    expect(body.session.status).toBe('finished');
    expect(body.session.exerciseId).toBe(body.exercise.id);
    expect(body.exercise).toMatchObject({
      sport: 'run',
      title: 'Sunday long run',
      date: '2026-06-20',
      durationCs: 90_000,
      avgHr: 142,
      tags: ['pitkä'],
    });
    // 3 legs of ~111 m, recomputed exactly from the stored track.
    expect(body.exercise.distanceM).toBeGreaterThan(332);
    expect(body.exercise.distanceM).toBeLessThan(336);
    expect(body.exercise.gpxPoints).toHaveLength(4);

    // Replaying finish returns the same exercise instead of creating a duplicate.
    const replay = await jsonResponse<{ exercise: { id: string } }>(
      await post(finishUrl, 'live-finish'),
    );
    expect(replay.exercise.id).toBe(body.exercise.id);

    // The public view now points at the finished exercise; uploads are refused.
    const view = await jsonResponse<{ status: string; exerciseId: string }>(
      await request(`/api/live/${session.shareToken}`),
    );
    expect(view).toMatchObject({ status: 'finished', exerciseId: body.exercise.id });
    expect(
      (await post(`/api/live/${session.id}/points`, 'live-finish', { points: track(9, 1) })).status,
    ).toBe(409);

    // Finishing frees the user to start another session.
    expect((await start('live-finish')).response.status).toBe(201);
  });

  test('finish derives duration and falls back sensibly with no track', async () => {
    if (skip()) return;

    const { session } = await start('live-derive');
    await post(`/api/live/${session.id}/points`, 'live-derive', { points: track(0, 3) });
    const derived = await jsonResponse<{ exercise: { durationCs: number; avgHr?: number } }>(
      await post(`/api/live/${session.id}/finish`, 'live-derive'),
    );
    // Two 5 s gaps between first and last point = 10 s = 1000 cs; no hr samples sent.
    expect(derived.exercise.durationCs).toBe(1000);
    expect(derived.exercise.avgHr).toBeUndefined();

    const empty = await start('live-empty');
    const noTrack = await jsonResponse<{ exercise: { distanceM?: number; gpxPoints?: unknown[] } }>(
      await post(`/api/live/${empty.session.id}/finish`, 'live-empty', { distanceM: 5000 }),
    );
    expect(noTrack.exercise.distanceM).toBe(5000);
    expect(noTrack.exercise.gpxPoints ?? []).toHaveLength(0);

    const invalid = await start('live-invalid');
    const rejected = await post(`/api/live/${invalid.session.id}/finish`, 'live-invalid', {
      feelRating: 'meh',
    });
    expect(rejected.status).toBe(400);
  });

  test('discarding removes the public page and frees the user', async () => {
    if (skip()) return;

    const { session } = await start('live-discard');
    await post(`/api/live/${session.id}/points`, 'live-discard', { points: track(0, 2) });

    const discarded = await request(`/api/live/${session.id}`, {
      method: 'DELETE',
      headers: await authHeaders('live-discard'),
    });
    expect(discarded.status).toBe(200);
    expect((await request(`/api/live/${session.shareToken}`)).status).toBe(404);
    expect((await post(`/api/live/${session.id}/finish`, 'live-discard')).status).toBe(409);
    expect((await start('live-discard')).response.status).toBe(201);
  });

  test('malformed or unknown share tokens are 404', async () => {
    if (skip()) return;

    expect((await request('/api/live/short')).status).toBe(404);
    expect((await request(`/api/live/${'A'.repeat(22)}`)).status).toBe(404);
    expect((await request(`/api/live/${'A'.repeat(22)}/stream`)).status).toBe(404);
  });
});

describe('profile integration', () => {
  interface Me {
    username: string;
    displayName: string;
    synopsis?: string;
    restHr?: number;
    maxHr?: number;
  }

  const skip = () => !integrationReady;

  async function me(subject: string, claims: Record<string, unknown> = {}) {
    const response = await request('/api/me', { headers: await authHeaders(subject, {}, claims) });
    return jsonResponse<Me>(response);
  }

  async function patch(subject: string, body: unknown, claims: Record<string, unknown> = {}) {
    return request('/api/users/me', {
      method: 'PATCH',
      headers: await authHeaders(subject, { 'content-type': 'application/json' }, claims),
      body: JSON.stringify(body),
    });
  }

  test('saves synopsis and heart rates, and /api/me returns them', async () => {
    if (skip()) return;

    const response = await patch('profile-save', {
      synopsis: 'Trail runner',
      restHr: 44,
      maxHr: 187,
    });
    expect(response.status).toBe(200);
    expect(await jsonResponse<Me>(response)).toMatchObject({
      synopsis: 'Trail runner',
      restHr: 44,
      maxHr: 187,
    });

    // The profile form is prefilled from /api/me after a reload.
    expect(await me('profile-save')).toMatchObject({
      synopsis: 'Trail runner',
      restHr: 44,
      maxHr: 187,
    });

    // null clears a heart rate; omitted fields are left alone.
    const cleared = await jsonResponse<Me>(await patch('profile-save', { maxHr: null }));
    expect(cleared.maxHr).toBeUndefined();
    expect(cleared.restHr).toBe(44);
    expect(cleared.synopsis).toBe('Trail runner');
  });

  test('rejects invalid values and unauthenticated requests', async () => {
    if (skip()) return;

    const bad = await patch('profile-bad', { restHr: 'forty' });
    expect(bad.status).toBe(400);
    expect((await jsonResponse<{ error: string }>(bad)).error).toBe('invalid_rest_hr');
    expect((await patch('profile-bad', { restHr: 130, maxHr: 120 })).status).toBe(400);
    expect((await request('/api/users/me', { method: 'PATCH', body: '{}' })).status).toBe(401);
  });

  test('the display name is the Hanko username and cannot be edited', async () => {
    if (skip()) return;

    const claims = { username: 'Pliish' };
    const created = await me('profile-name', claims);
    expect(created).toMatchObject({ username: 'pliish', displayName: 'Pliish' });

    const attempt = await patch(
      'profile-name',
      { displayName: 'Somebody Else', synopsis: 'hi' },
      claims,
    );
    expect(attempt.status).toBe(200);
    expect((await jsonResponse<Me>(attempt)).displayName).toBe('Pliish');

    // Renaming in Hanko changes the shown name on the next login but not the URL key.
    expect(await me('profile-name', { username: 'Pliish_2' })).toMatchObject({
      username: 'pliish',
      displayName: 'Pliish_2',
    });
  });

  test('keeps the old display name and shows it only until a Hanko username exists', async () => {
    if (skip()) return;

    const { sql } = await import('./db/client');
    await sql`
      insert into users (hanko_subject, username, normalized_username, email, display_name, avatar_initials, avatar_color)
      values ('profile-old', 'pekka_old', 'pekka_old', 'pekka@example.test', 'Pekka Hämäläinen', 'PH', '#f39c12')
    `;
    const stored = async () =>
      (
        await sql<{ display_name: string; legacy_display_name: string | null }[]>`
          select display_name, legacy_display_name from users where hanko_subject = 'profile-old'
        `
      )[0];

    // No Hanko username yet: the old display name is what is shown.
    expect(await me('profile-old')).toMatchObject({ displayName: 'Pekka Hämäläinen' });
    expect(await stored()).toEqual({ display_name: 'Pekka Hämäläinen', legacy_display_name: null });

    // Once a Hanko username exists it takes over, and the old name is preserved.
    expect(await me('profile-old', { username: 'pekka_h' })).toMatchObject({
      username: 'pekka_old',
      displayName: 'pekka_h',
    });
    expect(await stored()).toEqual({
      display_name: 'pekka_h',
      legacy_display_name: 'Pekka Hämäläinen',
    });

    // Renaming in Hanko later never overwrites the preserved old name.
    await me('profile-old', { username: 'pekka_h2' });
    expect(await stored()).toEqual({
      display_name: 'pekka_h2',
      legacy_display_name: 'Pekka Hämäläinen',
    });
  });

  test('sessions without a username claim keep the stored display name', async () => {
    if (skip()) return;

    await me('profile-legacy', { username: 'Keeper' });
    expect(await me('profile-legacy')).toMatchObject({ displayName: 'Keeper' });
  });
});

describe('Hanko provisioning and username protection integration', () => {
  const skip = () => !integrationReady;

  async function db() {
    return (await import('./db/client')).sql;
  }

  async function insertLegacyUser(fields: {
    username: string;
    displayName: string;
    email: string | null;
  }) {
    const sql = await db();
    await sql`
      insert into users (username, normalized_username, email, display_name, avatar_initials, avatar_color)
      values (${fields.username}, ${fields.username.toLowerCase()}, ${fields.email}, ${fields.displayName}, 'XX', '#336699')
    `;
  }

  test('refuses a new Hanko user whose username belongs to an existing user', async () => {
    if (skip()) return;

    await insertLegacyUser({ username: 'pekka_guard', displayName: 'Pekka Guard', email: null });

    // Same name, different case: a different Hanko account trying to register it.
    const squatterHeaders = await authHeaders('squatter-subject', {}, { username: 'Pekka_Guard' });
    const response = await request('/api/me', { headers: squatterHeaders });
    expect(response.status).toBe(409);
    expect(await jsonResponse<{ error: string }>(response)).toMatchObject({
      error: 'username_taken',
    });

    // No user was created for the squatter, and public endpoints still work for them as anonymous.
    const sql = await db();
    const rows = await sql`select 1 from users where hanko_subject = 'squatter-subject'`;
    expect(rows).toHaveLength(0);
    expect((await request('/api/exercises', { headers: squatterHeaders })).status).toBe(200);
  });

  test('links a verified email to the existing user instead of creating a second account', async () => {
    if (skip()) return;

    // tokenFor() issues email `<subject>@example.test`.
    await insertLegacyUser({
      username: 'link_me',
      displayName: 'Link Me',
      email: 'Linkme-subject@example.test',
    });

    const me = await jsonResponse<{ username: string; displayName: string }>(
      await request('/api/me', { headers: await authHeaders('linkme-subject') }),
    );
    expect(me).toMatchObject({ username: 'link_me', displayName: 'Link Me' });

    const sql = await db();
    const rows = await sql<{ hanko_subject: string }[]>`
      select hanko_subject from users where lower(email) = 'linkme-subject@example.test'
    `;
    expect(rows.map((r) => r.hanko_subject)).toEqual(['linkme-subject']);
  });

  test('provisions Hanko accounts with names set, then the first login shows them', async () => {
    if (skip()) return;

    await insertLegacyUser({
      username: 'Jörö',
      displayName: 'Jari Rösti',
      email: 'joro-prov@example.test',
    });
    await insertLegacyUser({
      username: 'Joro',
      displayName: 'Joro',
      email: 'joro2-prov@example.test',
    });

    // Fake Hanko admin API with Hanko's uniqueness rules (usernames are case-insensitive).
    const names = new Set<string>();
    const created: { email: string; username: string; id: string }[] = [];
    const admin = Bun.serve({
      hostname: '127.0.0.1',
      port: 0,
      async fetch(req) {
        const body = (await req.json()) as { emails: { address: string }[]; username: string };
        if (names.has(body.username.toLowerCase())) {
          return new Response('username already exists', { status: 409 });
        }
        names.add(body.username.toLowerCase());
        const id = `prov-${created.length + 1}`;
        created.push({ email: body.emails[0].address, username: body.username, id });
        return Response.json({ id });
      },
    });

    try {
      const sql = await db();
      const { provisionHankoUsers, linkUser } = await import('./scripts/provision-hanko-users');
      const { createHankoAccountForUser } = await import('./scripts/hanko-admin');
      const rows = await sql<
        { id: string; username: string; display_name: string; email: string }[]
      >`
        select id::text, username, display_name, email from users
        where hanko_subject is null and email in ('joro-prov@example.test', 'joro2-prov@example.test')
        order by username
      `;
      const outcomes = await provisionHankoUsers(
        rows.map((r) => ({
          id: r.id,
          username: r.username,
          displayName: r.display_name,
          email: r.email,
        })),
        {
          dryRun: false,
          create: (user) => createHankoAccountForUser(user, `http://127.0.0.1:${admin.port}`),
          link: linkUser,
        },
      );

      // The user literally named "Joro" gets that name. "Jörö" would also become "Joro", but it is
      // now reserved in Hanko (case-insensitively), so their next candidate, from the display name
      // "Jari Rösti", is used instead.
      expect(outcomes.map((o) => o.status)).toEqual(['created', 'created']);
      expect(created.map((c) => c.username).sort()).toEqual(['Jari_Rosti', 'Joro']);

      // The accounts are linked, so the user's first login finds them by Hanko subject.
      const linked = await sql<{ username: string; hanko_subject: string }[]>`
        select username, hanko_subject from users where email = 'joro-prov@example.test'
      `;
      expect(linked).toHaveLength(1);
      const hankoUsername = created.find((c) => c.email === 'joro-prov@example.test')?.username;
      const me = await jsonResponse<{ username: string; displayName: string }>(
        await request('/api/me', {
          headers: await authHeaders(linked[0].hanko_subject, {}, { username: hankoUsername }),
        }),
      );
      expect(me.username).toBe('Jörö');
      expect(me.displayName).toBe(hankoUsername as string);

      // The previous display name is preserved.
      const stored = await sql<{ legacy_display_name: string | null }[]>`
        select legacy_display_name from users where username = 'Jörö'
      `;
      expect(stored[0].legacy_display_name).toBe('Jari Rösti');
    } finally {
      admin.stop(true);
    }
  });
});
