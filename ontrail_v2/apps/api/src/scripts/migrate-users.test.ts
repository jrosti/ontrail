import { afterEach, describe, expect, mock, test } from 'bun:test';

// The migrate-users module imports ../db/client at load time, which would open
// a real Postgres connection. Mock it so these unit tests stay hermetic.
mock.module('../db/client', () => ({
  sql: () => Promise.resolve([]),
}));

const { normalizeUsername, initials, createHankoUser } = await import('./migrate-users');

describe('normalizeUsername', () => {
  test('lowercases and keeps simple names', () => {
    expect(normalizeUsername('Kiiski')).toBe('kiiski');
  });

  test('strips diacritics and non-word characters', () => {
    expect(normalizeUsername('Jää Härkä')).toBe('jaa_harka');
  });

  test('collapses runs and trims leading/trailing separators', () => {
    expect(normalizeUsername('  --Foo..Bar--  ')).toBe('foo_bar');
  });

  test('falls back to "user" when nothing usable remains', () => {
    expect(normalizeUsername('???')).toBe('user');
  });

  test('truncates to 24 characters', () => {
    expect(normalizeUsername('a'.repeat(40)).length).toBe(24);
  });
});

describe('initials', () => {
  test('takes the first two characters uppercased', () => {
    expect(initials('Kiiski')).toBe('KI');
  });
});

describe('createHankoUser', () => {
  const originalFetch = globalThis.fetch;
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test('POSTs to /users with an emails array (primary + verified) and returns the id', async () => {
    let calledUrl = '';
    let calledInit: RequestInit | undefined;
    globalThis.fetch = (async (url: string, init?: RequestInit) => {
      calledUrl = url;
      calledInit = init;
      return new Response(JSON.stringify({ id: 'hanko-123' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }) as typeof fetch;

    const result = await createHankoUser('jari.rosti@gmail.com', 'http://admin.test:8001');

    // Endpoint: admin server has no /admin prefix.
    expect(calledUrl).toBe('http://admin.test:8001/users');
    expect(calledInit?.method).toBe('POST');

    // Body must be the CreateUser DTO shape, not a flat { email }.
    const body = JSON.parse(calledInit?.body as string);
    expect(body).toEqual({
      emails: [{ address: 'jari.rosti@gmail.com', is_primary: true, is_verified: true }],
    });

    expect(result?.id).toBe('hanko-123');
  });

  test('returns null on a non-2xx response', async () => {
    globalThis.fetch = (async () =>
      new Response('conflict', { status: 409 })) as unknown as typeof fetch;

    expect(await createHankoUser('dup@example.test', 'http://admin.test:8001')).toBeNull();
  });
});
