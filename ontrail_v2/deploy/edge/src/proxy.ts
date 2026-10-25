import { jsonResponse, type FetchLike } from './env.js';

/** Cloudflaren tilat, jotka tarkoittavat "alkupää ei vastaa" (sammutettu palvelin). */
const ORIGIN_DOWN = new Set([521, 522, 523]);
const CF_ERRORS = new Set([520, 524, 525, 526, 527, 530]);

export const HEALTH_PATH = '/api/health';
export const HEALTH_TIMEOUT_MS = 5_000;
/** Nukkuvaa palvelinta vasten luovutaan nopeasti (muuten Cloudflaren yhteyden aikakatkaisu kestää ~20 s ja sivu odottaa): kaikki API-lukukyselyt ja terveys. Raskaita GET-kyselyitä ei ole; otsakkeet tulevat nopeasti. */
export const failsFast = (method: string, pathname: string) => pathname === HEALTH_PATH || (method === 'GET' && pathname.startsWith('/api/'));
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
  let timer: ReturnType<typeof setTimeout> | undefined;
  let timeout: Promise<never> | undefined;
  if (failsFast(request.method, incoming.pathname)) {
    const ac = new AbortController();
    init.signal = ac.signal;
    // Kilpajuoksu eikä pelkkä signaali: palautus ei riipu siitä, kunnioittaako fetch-toteutus peruutusta. Ajastin päättyy, kun otsakkeet ovat tulleet (suoratoisto jatkuu).
    timeout = new Promise<never>((_, reject) => { timer = setTimeout(() => { ac.abort(); reject(new Error('timeout')); }, healthTimeoutMs); });
  }
  let response: Response;
  try {
    const attempt = fetchImpl(new Request(new Request(target.toString(), request), init));
    attempt.catch(() => {}); // peruttu yritys ei jää käsittelemättömäksi virheeksi
    response = await (timeout ? Promise.race([attempt, timeout]) : attempt);
  } catch { return asleepResponse(); }
  finally { if (timer) clearTimeout(timer); }
  if (ORIGIN_DOWN.has(response.status)) return asleepResponse();
  if (CF_ERRORS.has(response.status)) return jsonResponse({ error: 'origin-error', status: response.status }, 502);
  return response;
}
