/** Mitkä polut menevät alkupäähän (sama lista kuin wrangler.template.jsonc:n run_worker_first). Muut ovat staattista käyttöliittymää. */
export const ORIGIN_PATH_PATTERNS = ['/api/*', '/hanko/*'] as const;
export const WAKE_PATH = '/wake';
export const WAKE_STATUS_PATH = '/wake/status';
export const WAKE_PATHS = [WAKE_PATH, WAKE_STATUS_PATH] as const;

function matches(pathname: string, pattern: string): boolean {
  return pattern.endsWith('/*') ? pathname.startsWith(pattern.slice(0, -1)) : pathname === pattern;
}
export const isOriginPath = (pathname: string) => ORIGIN_PATH_PATTERNS.some((p) => matches(pathname, p));
