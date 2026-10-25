import { describe, expect, mock, test } from 'bun:test';

// The script imports ../db/client at load time, which would open a Postgres connection.
mock.module('../db/client', () => ({ sql: () => Promise.resolve([]) }));

const { provisionHankoUsers } = await import('./provision-hanko-users');

const users = [
  { id: 'u1', username: 'pekka_h', displayName: 'Pekka Hämäläinen', email: 'pekka@example.test' },
  { id: 'u2', username: 'Jörö', displayName: 'Jörö', email: 'joro@example.test' },
  { id: 'u3', username: 'dup', displayName: 'dup', email: 'pekka@example.test' },
];

describe('provisionHankoUsers', () => {
  test('dry run reports the planned username and creates nothing', async () => {
    const create = mock(async () => {
      throw new Error('must not be called');
    });
    const link = mock(async () => {});

    const outcomes = await provisionHankoUsers(users, { dryRun: true, create, link });

    expect(outcomes.map((o) => [o.username, o.status, o.hankoUsername])).toEqual([
      ['pekka_h', 'would_create', 'pekka_h'],
      ['Jörö', 'would_create', 'Joro'],
      ['dup', 'would_create', 'dup'],
    ]);
    expect(create).not.toHaveBeenCalled();
    expect(link).not.toHaveBeenCalled();
  });

  test('creates accounts, links them, and reports conflicts and errors per user', async () => {
    const linked: [string, string][] = [];
    const create = mock(async (user: { id: string }) => {
      if (user.id === 'u1')
        return { ok: true as const, user: { id: 'hanko-1' }, username: 'pekka_h' };
      if (user.id === 'u2') {
        return { ok: false as const, reason: 'error' as const, status: 500, body: 'boom' };
      }
      return { ok: false as const, reason: 'email_exists' as const, status: 409, body: 'exists' };
    });

    const outcomes = await provisionHankoUsers(users, {
      dryRun: false,
      create,
      link: async (id, subject) => {
        linked.push([id, subject]);
      },
    });

    expect(outcomes).toEqual([
      {
        id: 'u1',
        username: 'pekka_h',
        status: 'created',
        hankoUsername: 'pekka_h',
        hankoSubject: 'hanko-1',
      },
      { id: 'u2', username: 'Jörö', status: 'error', detail: '500: boom' },
      { id: 'u3', username: 'dup', status: 'email_exists', detail: '409: exists' },
    ]);
    // Only the account that was actually created is linked to its OnTrail user.
    expect(linked).toEqual([['u1', 'hanko-1']]);
  });
});
