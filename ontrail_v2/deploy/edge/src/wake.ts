import { jsonResponse, type Env, type FetchLike } from './env.js';
import { HEALTH_PATH, HEALTH_TIMEOUT_MS } from './proxy.js';

/**
 * Nukkuvan palvelimen herätys.
 *   GET  /wake/status → { state, originHealthy }
 *   POST /wake { turnstileToken } → 202 { state }
 * Väärinkäytön yläraja: Turnstile + IP-kohtainen rajoitin; pahimmillaan joku pitää palvelimen päällä.
 */
const UPCLOUD_API = 'https://api.upcloud.com/1.3';
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const STATUS_CACHE_MS = 10_000;

interface WakeDeps { fetchImpl?: FetchLike; now?: () => number; waitUntil?: (p: Promise<unknown>) => void }
type Configured = Env & { UPCLOUD_API_TOKEN: string; UPCLOUD_SERVER_UUID: string };

let cachedState: { state: string; at: number } | null = null;
export const resetWakeStateCacheForTests = () => { cachedState = null; };

const configured = (env: Env): env is Configured => Boolean(env.UPCLOUD_API_TOKEN && env.UPCLOUD_SERVER_UUID);

const upcloud = (env: Configured, suffix: string, method: 'GET' | 'POST') =>
  new Request(`${UPCLOUD_API}/server/${env.UPCLOUD_SERVER_UUID}${suffix}`, {
    method, headers: { Authorization: `Bearer ${env.UPCLOUD_API_TOKEN}`, Accept: 'application/json' },
  });

async function readState(env: Configured, fetchImpl: FetchLike, now: () => number, useCache: boolean): Promise<string> {
  if (useCache && cachedState && now() - cachedState.at < STATUS_CACHE_MS) return cachedState.state;
  const r = await fetchImpl(upcloud(env, '', 'GET'));
  if (!r.ok) {
    console.error(`UpCloud server lookup failed: HTTP ${r.status} ${(await r.text().catch(() => '')).slice(0, 300)}`);
    throw new Error(`UpCloud server lookup failed: ${r.status}`);
  }
  const body = (await r.json()) as { server?: { state?: unknown } };
  const state = typeof body.server?.state === 'string' ? body.server.state : 'unknown';
  cachedState = { state, at: now() };
  return state;
}

async function answersOk(env: Env, fetchImpl: FetchLike, path: string): Promise<boolean> {
  try {
    const r = await fetchImpl(new Request(new URL(path, env.ORIGIN_URL).toString(), { signal: AbortSignal.timeout(HEALTH_TIMEOUT_MS) }));
    return r.ok;
  } catch { return false; }
}

/** Terve = sovellus JA Hanko vastaavat (muuten kirjautuminen epäonnistuu heti heräämisen jälkeen). */
const originHealthy = async (env: Env, fetchImpl: FetchLike) =>
  (await Promise.all([answersOk(env, fetchImpl, HEALTH_PATH), answersOk(env, fetchImpl, '/hanko/.well-known/jwks.json')])).every(Boolean);

export async function handleWakeStatus(request: Request, env: Env, deps: WakeDeps = {}): Promise<Response> {
  if (request.method !== 'GET') return jsonResponse({ error: 'method-not-allowed' }, 405, { Allow: 'GET' });
  if (!configured(env)) return jsonResponse({ error: 'wake-not-configured' }, 501);
  const fetchImpl = deps.fetchImpl ?? fetch, now = deps.now ?? Date.now;
  try {
    const [state, healthy] = await Promise.all([readState(env, fetchImpl, now, true), originHealthy(env, fetchImpl)]);
    return jsonResponse({ state, originHealthy: healthy }, 200);
  } catch (e) {
    console.error(`wake/status: ${(e as Error).message}`);
    return jsonResponse({ error: 'upcloud-unavailable' }, 502);
  }
}

async function verifyTurnstile(secret: string, token: string, ip: string | null, fetchImpl: FetchLike): Promise<boolean> {
  const form = new FormData();
  form.set('secret', secret); form.set('response', token);
  if (ip) form.set('remoteip', ip);
  const r = await fetchImpl(new Request(TURNSTILE_VERIFY_URL, { method: 'POST', body: form }));
  if (!r.ok) return false;
  return ((await r.json()) as { success?: unknown }).success === true;
}

export async function handleWake(request: Request, env: Env, deps: WakeDeps = {}): Promise<Response> {
  if (request.method !== 'POST') return jsonResponse({ error: 'method-not-allowed' }, 405, { Allow: 'POST' });
  if (!configured(env) || !env.TURNSTILE_SECRET_KEY) return jsonResponse({ error: 'wake-not-configured' }, 501);
  const fetchImpl = deps.fetchImpl ?? fetch, now = deps.now ?? Date.now;

  let token: unknown;
  try { token = ((await request.json()) as { turnstileToken?: unknown }).turnstileToken; } catch { token = undefined; }
  if (typeof token !== 'string' || !token) return jsonResponse({ error: 'turnstile-token-required' }, 400);

  const ip = request.headers.get('CF-Connecting-IP');
  if (env.WAKE_LIMITER) {
    const { success } = await env.WAKE_LIMITER.limit({ key: ip ?? 'unknown' });
    if (!success) return jsonResponse({ error: 'rate-limited' }, 429, { 'Retry-After': '60' });
  }
  if (!(await verifyTurnstile(env.TURNSTILE_SECRET_KEY, token, ip, fetchImpl))) return jsonResponse({ error: 'turnstile-failed' }, 403);

  try {
    const before = await readState(env, fetchImpl, now, false);
    if (before === 'started') return jsonResponse({ state: before }, 202);
    const starting = fetchImpl(upcloud(env, '/start', 'POST')).then(async (s) => {
      if (!s.ok) console.error(`UpCloud start failed: HTTP ${s.status} ${(await s.text().catch(() => '')).slice(0, 300)}`);
      return s;
    });
    if (deps.waitUntil) {
      deps.waitUntil(starting.catch((e) => console.error(`UpCloud start failed: ${(e as Error).message}`)));
      cachedState = null;
      return jsonResponse({ state: 'starting' }, 202);
    }
    const start = await starting;
    const after = start.ok ? 'started' : await readState(env, fetchImpl, now, false);
    if (after === 'started' || after === 'maintenance') { cachedState = { state: after, at: now() }; return jsonResponse({ state: after }, 202); }
    return jsonResponse({ error: 'start-failed', state: after }, 502);
  } catch {
    return jsonResponse({ error: 'upcloud-unavailable' }, 502);
  }
}
