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

async function tokenFor(subject: string): Promise<string> {
  return new SignJWT({ email: `${subject}@example.test` })
    .setProtectedHeader({ alg: 'RS256', kid: jwtKeyId })
    .setIssuer(hankoIssuer)
    .setSubject(subject)
    .setIssuedAt()
    .setExpirationTime('10m')
    .sign(privateKey);
}

async function authHeaders(subject: string, headers: HeadersInit = {}): Promise<HeadersInit> {
  return {
    ...headers,
    authorization: `Bearer ${await tokenFor(subject)}`,
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
