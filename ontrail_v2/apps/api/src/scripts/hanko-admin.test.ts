import { afterEach, describe, expect, test } from 'bun:test';
import { createHankoAccount, createHankoAccountForUser } from './hanko-admin';

const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
});

interface Call {
  url: string;
  body: Record<string, unknown>;
}

/** Fake Hanko admin API: `taken` usernames and `emails` answer 409 like the real one. */
function fakeHanko(opts: { takenUsernames?: string[]; takenEmails?: string[] } = {}) {
  const calls: Call[] = [];
  globalThis.fetch = (async (url: string, init?: RequestInit) => {
    const body = JSON.parse(init?.body as string);
    calls.push({ url, body });
    const username = body.username as string | undefined;
    if (username && opts.takenUsernames?.some((t) => t.toLowerCase() === username.toLowerCase())) {
      return new Response(`failed to create username '${username}': username already exists`, {
        status: 409,
      });
    }
    if (body.emails?.[0] && opts.takenEmails?.includes(body.emails[0].address)) {
      return new Response('email address already exists', { status: 409 });
    }
    return Response.json({ id: `hanko-${calls.length}` });
  }) as unknown as typeof fetch;
  return calls;
}

describe('createHankoAccount', () => {
  test('sends the email (primary + verified) and the username', async () => {
    const calls = fakeHanko();

    const result = await createHankoAccount(
      { email: 'a@example.test', username: 'Pliish' },
      'http://admin.test:8001',
    );

    expect(result).toEqual({ ok: true, user: { id: 'hanko-1' } });
    expect(calls[0].url).toBe('http://admin.test:8001/users');
    expect(calls[0].body).toEqual({
      emails: [{ address: 'a@example.test', is_primary: true, is_verified: true }],
      username: 'Pliish',
    });
  });

  test('tells a username conflict apart from an email conflict', async () => {
    fakeHanko({ takenUsernames: ['taken'], takenEmails: ['dup@example.test'] });

    expect(await createHankoAccount({ email: 'a@example.test', username: 'taken' })).toMatchObject({
      ok: false,
      reason: 'username_taken',
      status: 409,
    });
    expect(await createHankoAccount({ email: 'dup@example.test', username: 'free' })).toMatchObject(
      { ok: false, reason: 'email_exists', status: 409 },
    );
  });

  test('reports an unreachable admin API as an error, not a throw', async () => {
    globalThis.fetch = (async () => {
      throw new Error('ECONNREFUSED');
    }) as unknown as typeof fetch;

    expect(await createHankoAccount({ email: 'a@example.test' })).toMatchObject({
      ok: false,
      reason: 'error',
      status: 0,
    });
  });
});

describe('createHankoAccountForUser', () => {
  const user = { email: 'a@example.test', displayName: 'Pekka Hämäläinen', username: 'pekka_h' };

  test('uses the first free candidate', async () => {
    const calls = fakeHanko();

    const result = await createHankoAccountForUser(user, 'http://admin.test:8001');

    expect(result).toMatchObject({ ok: true, username: 'pekka_h' });
    expect(calls).toHaveLength(1);
  });

  test('tries the next candidate name before falling back to numeric suffixes', async () => {
    const calls = fakeHanko({ takenUsernames: ['PEKKA_H'] });

    const result = await createHankoAccountForUser(user, 'http://admin.test:8001');

    // 'pekka_h' is taken (case-insensitively), so the transliterated display name is next.
    expect(result).toMatchObject({ ok: true, username: 'Pekka_Hamalainen' });
    expect(calls.map((c) => c.body.username)).toEqual(['pekka_h', 'Pekka_Hamalainen']);
  });

  test('falls back to numeric suffixes when the only name is taken', async () => {
    const single = { email: 'a@example.test', displayName: 'runner', username: 'runner' };
    const calls = fakeHanko({ takenUsernames: ['Runner', 'runner_2'] });

    const result = await createHankoAccountForUser(single, 'http://admin.test:8001');

    expect(result).toMatchObject({ ok: true, username: 'runner_3' });
    expect(calls.map((c) => c.body.username)).toEqual(['runner', 'runner_2', 'runner_3']);
  });

  test('stops at an email conflict instead of burning through usernames', async () => {
    const calls = fakeHanko({ takenEmails: ['a@example.test'] });

    const result = await createHankoAccountForUser(user, 'http://admin.test:8001');

    expect(result).toMatchObject({ ok: false, reason: 'email_exists' });
    expect(calls).toHaveLength(1);
  });
});
