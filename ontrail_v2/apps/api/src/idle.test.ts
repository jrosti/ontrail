import { describe, expect, test } from 'bun:test';
import { IdleTracker, isDirectLoopback, keepsAwake, withIdle } from './idle';

describe('idle', () => {
  test('tuomio syntyy graceMs:n jälkeen ja käyttö nollaa laskurin', () => {
    let now = 0;
    const t = new IdleTracker(1000, () => now);
    now = 999; expect(t.status().idle).toBe(false);
    now = 1000; expect(t.status().idle).toBe(true);
    t.touch(); expect(t.status().idle).toBe(false);
  });

  test('vain onnistunut oikea API-käyttö pitää hereillä', () => {
    expect(keepsAwake('POST', '/api/exercises', 201)).toBe(true);
    expect(keepsAwake('GET', '/api/health', 200)).toBe(false);
    expect(keepsAwake('GET', '/api/idle', 200)).toBe(false);
    expect(keepsAwake('GET', '/api/me', 401)).toBe(false);
    expect(keepsAwake('GET', '/wp-login.php', 404)).toBe(false);
  });

  test('/api/idle vastaa vain suoraan loopbackista', async () => {
    let now = 0;
    const tracker = new IdleTracker(1000, () => now);
    const h = withIdle(async () => new Response('ok'), tracker);
    const local = { requestIP: () => ({ address: '127.0.0.1' }) };
    const remote = { requestIP: () => ({ address: '203.0.113.5' }) };
    expect((await h(new Request('http://x/api/idle'), local)).status).toBe(200);
    expect((await h(new Request('http://x/api/idle'), remote)).status).toBe(404);
    expect((await h(new Request('http://x/api/idle', { headers: { 'x-forwarded-for': '1.2.3.4' } }), local)).status).toBe(404);
    now = 5000; expect(tracker.status().idle).toBe(true);
    await h(new Request('http://x/api/exercises'), local); // 200 → käyttöä
    expect(tracker.status().idle).toBe(false);
    expect(isDirectLoopback('::1', new Headers())).toBe(true);
  });
});
