export interface RateLimiter { limit(options: { key: string }): Promise<{ success: boolean }>; }

export interface Env {
  /** Staattinen asiakaspaketti (../dist). */
  ASSETS: Fetcher;
  /** Alkupään osoite, esim. https://punakyna-origin.axorion.fi */
  ORIGIN_URL: string;
  /** UpCloud API -tunnus (rajattu aliasiakas). Salaisuus. */
  UPCLOUD_API_TOKEN?: string;
  /** Palvelimen UUID. Salaisuus. */
  UPCLOUD_SERVER_UUID?: string;
  /** Turnstile-salaisuus /wake-reitille. Salaisuus. */
  TURNSTILE_SECRET_KEY?: string;
  WAKE_LIMITER?: RateLimiter;
}

export type FetchLike = (request: Request) => Promise<Response>;

export function jsonResponse(body: unknown, status: number, headers: HeadersInit = {}): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers } });
}
