import { spawn } from 'node:child_process';
import { createReadStream } from 'node:fs';
import { mkdir, readdir, readFile, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import postgres from 'postgres';
import { GenericContainer } from 'testcontainers';

const scriptDir = fileURLToPath(new URL('.', import.meta.url));
const webDir = resolve(scriptDir, '..');
const apiDir = resolve(webDir, '../api');
const migrationsDir = resolve(apiDir, 'migrations');
const distDir = resolve(webDir, 'dist');

const postgresUser = 'ontrail';
const postgresPassword = 'ontrail';
const postgresDb = 'ontrail_lighthouse';

const processes = new Set();
let container;
let sql;
let webServer;

function run(command, args, options = {}) {
  return new Promise((resolveRun, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: { ...process.env, ...options.env },
      stdio: options.stdio ?? 'inherit',
    });
    processes.add(child);
    child.on('error', reject);
    child.on('exit', (code, signal) => {
      processes.delete(child);
      if (code === 0) resolveRun();
      else reject(new Error(`${command} ${args.join(' ')} exited with ${code ?? signal}`));
    });
  });
}

function startProcess(command, args, options = {}) {
  const child = spawn(command, args, {
    cwd: options.cwd,
    env: { ...process.env, ...options.env },
    stdio: options.stdio ?? ['ignore', 'pipe', 'pipe'],
  });
  processes.add(child);
  child.stdout?.on('data', (chunk) =>
    process.stdout.write(`[${options.name ?? command}] ${chunk}`),
  );
  child.stderr?.on('data', (chunk) =>
    process.stderr.write(`[${options.name ?? command}] ${chunk}`),
  );
  child.on('exit', () => processes.delete(child));
  return child;
}

function freePort() {
  return new Promise((resolvePort, reject) => {
    const server = createServer();
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      server.close(() => resolvePort(address.port));
    });
    server.on('error', reject);
  });
}

async function waitFor(url, label) {
  const started = Date.now();
  let lastError;
  while (Date.now() - started < 60_000) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
      lastError = new Error(`${label} returned ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolveWait) => setTimeout(resolveWait, 1_000));
  }
  throw new Error(`Timed out waiting for ${label}: ${lastError?.message ?? 'unknown error'}`);
}

async function applyMigrations(databaseUrl) {
  sql = postgres(databaseUrl, { max: 1 });

  await sql`
    create table if not exists schema_migrations (
      id text primary key,
      applied_at timestamptz not null default now()
    )
  `;

  for (const file of (await readdir(migrationsDir))
    .filter((name) => name.endsWith('.sql'))
    .sort()) {
    const existing = await sql`select id from schema_migrations where id = ${file}`;
    if (existing.length > 0) continue;

    const body = await readFile(join(migrationsDir, file), 'utf8');
    await sql.begin(async (tx) => {
      await tx.unsafe(body);
      await tx`insert into schema_migrations (id) values (${file})`;
    });
    console.log(`applied ${file}`);
  }
}

async function seedData() {
  const userId = 'f8ec5019-2f36-42e4-be81-3f4afbb4b100';
  await sql`
    insert into users (
      id, hanko_subject, username, normalized_username, email, display_name,
      avatar_initials, avatar_color, synopsis
    )
    values (
      ${userId}, 'lighthouse-user', 'lighthouse', 'lighthouse',
      'lighthouse@example.test', 'Lighthouse Runner', 'LR', '#2563eb',
      'CI-local Lighthouse fixture'
    )
    on conflict (id) do nothing
  `;

  await sql`
    insert into exercises (
      owner_id, sport_key, title, body_html, tags, exercise_date, duration_sec,
      distance_m, avg_hr, climb_m, feel_rating, details, gpx_points
    )
    values
      (
        ${userId}, 'run', 'CI-local trail run', '<p>Seeded by Lighthouse stack.</p>',
        array['ci', 'lighthouse'], current_date, 3720, 10200, 148, 115, 'ok',
        '{}',
        '[{"lat":60.1699,"lon":24.9384,"ele":8},{"lat":60.1721,"lon":24.9512,"ele":24}]'::jsonb
      ),
      (
        ${userId}, 'bike', 'CI-local ride', '<p>API-backed fixture exercise.</p>',
        array['ci'], current_date - interval '1 day', 5400, 28500, 136, 220, 'easy',
        '{}',
        null
      )
    on conflict do nothing
  `;
}

function contentType(path) {
  const type = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
  }[extname(path)];
  return type ?? 'application/octet-stream';
}

async function startWebServer(apiBaseUrl) {
  await mkdir(distDir, { recursive: true });

  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? '/', 'http://127.0.0.1');
      if (url.pathname.startsWith('/api/')) {
        const body = req.method === 'GET' || req.method === 'HEAD' ? undefined : req;
        const response = await fetch(`${apiBaseUrl}${url.pathname}${url.search}`, {
          method: req.method,
          headers: req.headers,
          body,
          duplex: body ? 'half' : undefined,
        });
        res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
        if (response.body) {
          for await (const chunk of response.body) res.write(chunk);
        }
        res.end();
        return;
      }

      const requestedPath = decodeURIComponent(url.pathname.replace(/^\/+/, ''));
      const candidate = resolve(distDir, requestedPath || 'index.html');
      const filePath = candidate.startsWith(distDir) ? candidate : join(distDir, 'index.html');
      const finalPath = (await stat(filePath).catch(() => null))?.isFile()
        ? filePath
        : join(distDir, 'index.html');

      res.writeHead(200, { 'content-type': contentType(finalPath) });
      createReadStream(finalPath).pipe(res);
    } catch (error) {
      res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
      res.end(error instanceof Error ? error.message : 'internal error');
    }
  });

  await new Promise((resolveListen) => server.listen(0, '127.0.0.1', resolveListen));
  webServer = server;
  const address = server.address();
  return `http://127.0.0.1:${address.port}`;
}

async function cleanup() {
  for (const child of processes) child.kill('SIGTERM');
  await Promise.allSettled([
    sql?.end({ timeout: 5 }),
    new Promise((resolveClose) => webServer?.close(resolveClose)),
    container?.stop(),
  ]);
}

async function main() {
  const apiPort = await freePort();
  const apiBaseUrl = `http://127.0.0.1:${apiPort}`;

  container = await new GenericContainer('postgres:18')
    .withEnvironment({
      POSTGRES_USER: postgresUser,
      POSTGRES_PASSWORD: postgresPassword,
      POSTGRES_DB: postgresDb,
    })
    .withExposedPorts(5432)
    .start();

  const databaseUrl = `postgres://${postgresUser}:${postgresPassword}@${container.getHost()}:${container.getMappedPort(
    5432,
  )}/${postgresDb}`;

  await applyMigrations(databaseUrl);

  const api = startProcess('bun', ['src/server.ts'], {
    cwd: apiDir,
    name: 'api',
    env: {
      DATABASE_URL: databaseUrl,
      HANKO_URL: 'http://127.0.0.1:65535',
      HANKO_JWT_ISSUER: 'http://127.0.0.1:65535',
      PORT: String(apiPort),
    },
  });
  api.on('exit', (code, signal) => {
    if (code !== null && code !== 0) console.error(`API exited early with ${code}`);
    if (signal) console.error(`API exited early from ${signal}`);
  });

  await waitFor(`${apiBaseUrl}/api/health`, 'API health');
  await seedData();

  await run('pnpm', ['run', 'build'], {
    cwd: webDir,
    env: {
      VITE_API_URL: '/api',
      VITE_HANKO_URL: 'http://127.0.0.1:65535',
    },
  });

  const webBaseUrl = await startWebServer(apiBaseUrl);
  await waitFor(`${webBaseUrl}/feed`, 'web app');

  await run('node', ['scripts/lighthouse-report.mjs'], {
    cwd: webDir,
    env: {
      LIGHTHOUSE_BASE_URL: webBaseUrl,
      LIGHTHOUSE_PATHS: process.env.LIGHTHOUSE_PATHS ?? '/feed',
      LIGHTHOUSE_OUT_DIR: process.env.LIGHTHOUSE_OUT_DIR ?? 'reports/lighthouse',
      LIGHTHOUSE_MIN_SCORE: process.env.LIGHTHOUSE_MIN_SCORE ?? '0.9',
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(cleanup);
