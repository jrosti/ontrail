import { jsonResponse, type FetchLike } from './env.js';

/** Cloudflaren tilat, jotka tarkoittavat "alkupää ei vastaa" (sammutettu palvelin). */
const ORIGIN_DOWN = new Set([521, 522, 523]);
const CF_ERRORS = new Set([520, 524, 525, 526, 527, 530]);

export const HEALTH_PATH = '/api/health';
export const HEALTH_TIMEOUT_MS = 5_000;
export const ASLEEP_BODY = { asleep: true } as const;
export const asleepResponse = () => jsonResponse(ASLEEP_BODY, 503, { 'Retry-After': '10' });

/**
 * Välittää pyynnön alkupäähän sellaisenaan (uudelleenohjauksia ei seurata: OAuth ja Hanko tarvitsevat ne selaimelle).
 * Sammutettu palvelin näkyy asiakkaalle muodossa 503 {asleep:true}, jonka Asleep-näkymä tunnistaa.
 */
export async function proxyToOrigin(request: Request, originUrl: string, fetchImpl: FetchLike = fetch, healthTimeoutMs = HEALTH_TIMEOUT_MS): Promise<Response> {
  const incoming = new URL(request.url);
  const target = new URL(incoming.pathname + incoming.search, originUrl);
  const init: RequestInit = { redirect: 'manual' };
  if (incoming.pathname === HEALTH_PATH) init.signal = AbortSignal.timeout(healthTimeoutMs);
  let response: Response;
  try { response = await fetchImpl(new Request(new Request(target.toString(), request), init)); }
  catch { return asleepResponse(); }
  if (ORIGIN_DOWN.has(response.status)) return asleepResponse();
  if (CF_ERRORS.has(response.status)) return jsonResponse({ error: 'origin-error', status: response.status }, 502);
  return response;
}
