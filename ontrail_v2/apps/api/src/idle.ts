// Autostop: palvelin ei sammuta itseään. Juurin omistama ajastin (deploy/server/autostop.sh) lukee tuomion paikallisesta
// GET /api/idle -osoitteesta ja ajaa poweroffin. Sama malli kuin Punakynässä ja shortdeck.pokerissa.
export class IdleTracker {
  private last: number;
  constructor(private graceMs: number, private now: () => number = Date.now) { this.last = now(); }
  touch() { this.last = this.now(); }
  status() {
    const idleForMs = this.now() - this.last;
    const idle = idleForMs >= this.graceMs;
    return { idle, idleForMs, graceMs: this.graceMs, reason: idle ? 'no-activity' : null };
  }
}

/** Pyynnöt, jotka eivät ole käyttäjän toimintaa (terveystarkistus, joutilaisuuskysely). */
export const isPassive = (method: string, path: string) => method === 'GET' && (path === '/api/health' || path === '/api/idle');

/** Onnistunut oikea käyttö pitää palvelimen hereillä; virheet (botit, 401, 404) eivät. */
export const keepsAwake = (method: string, path: string, status: number) => status < 400 && path.startsWith('/api/') && !isPassive(method, path);

/** Vain suoraan palvelimelta tehdyt pyynnöt: loopback ilman välityspalvelimen otsakkeita (nginx asettaa ne jokaiselle pyynnölle). */
export function isDirectLoopback(remote: string | undefined, headers: Headers): boolean {
  const loop = remote === '127.0.0.1' || remote === '::1' || remote === '::ffff:127.0.0.1';
  return loop && !headers.get('x-forwarded-for') && !headers.get('x-real-ip');
}

interface IpServer { requestIP(req: Request): { address: string } | null }

/** Kääri HTTP-käsittelijä: vastaa GET /api/idle (vain loopback) ja nollaa joutilaisuus onnistuneista pyynnöistä. */
export function withIdle(handler: (req: Request) => Promise<Response>, tracker: IdleTracker) {
  return async (req: Request, server?: IpServer): Promise<Response> => {
    const path = new URL(req.url).pathname;
    if (req.method === 'GET' && path === '/api/idle') {
      if (!isDirectLoopback(server?.requestIP(req)?.address, req.headers)) return new Response('{"error":"not-found"}', { status: 404, headers: { 'content-type': 'application/json' } });
      return Response.json(tracker.status());
    }
    const res = await handler(req);
    if (keepsAwake(req.method, path, res.status)) tracker.touch();
    return res;
  };
}
