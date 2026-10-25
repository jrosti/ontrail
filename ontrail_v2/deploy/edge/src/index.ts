import type { Env } from './env.js';
import { proxyToOrigin } from './proxy.js';
import { isOriginPath, WAKE_PATH, WAKE_STATUS_PATH } from './routes.js';
import { handleWake, handleWakeStatus } from './wake.js';

/** Sovelluksen reuna. Staattiset tiedostot vastataan ennen tätä; run_worker_first ohjaa dynaamiset polut tänne. */
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === WAKE_PATH) return handleWake(request, env, { waitUntil: (p) => ctx.waitUntil(p) });
    if (pathname === WAKE_STATUS_PATH) return handleWakeStatus(request, env);
    if (isOriginPath(pathname)) return proxyToOrigin(request, env.ORIGIN_URL);
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
