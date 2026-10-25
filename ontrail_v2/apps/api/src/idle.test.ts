import { describe, expect, test } from 'bun:test';
import { hasCredentials, IdleTracker, isDirectLoopback, keepsAwake, withIdle } from './idle';

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

  test('taustakysely ja kirjautumaton lukeminen eivät pidä hereillä', () => {
    expect(keepsAwake('GET', '/api/unread', 200, true)).toBe(false); // välilehden minuuttikysely
    expect(keepsAwake('GET', '/api/exercises', 200, false)).toBe(false); // botti / vieras
    expect(keepsAwake('GET', '/api/exercises', 200, true)).toBe(true);
    expect(keepsAwake('POST', '/api/exercises', 201, false)).toBe(true); // kirjoittaminen on aina käyttöä (validointi tapahtuu API:ssa)
    expect(hasCredentials(new Headers({ authorization: 'Bearer x' }))).toBe(true);
    expect(hasCredentials(new Headers({ cookie: 'theme=dark; hanko=abc' }))).toBe(true);
    expect(hasCredentials(new Headers({ cookie: 'theme=dark' }))).toBe(false);
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
    await h(new Request('http://x/api/exercises', { headers: { authorization: 'Bearer t' } }), local); // 200 + tunnistettu → käyttöä
    expect(tracker.status().idle).toBe(false);
    expect(isDirectLoopback('::1', new Headers())).toBe(true);
  });
});
