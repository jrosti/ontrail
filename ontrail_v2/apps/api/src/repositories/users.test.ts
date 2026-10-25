import { beforeEach, describe, expect, mock, test } from 'bun:test';
import type { DbUser } from './users';

const queuedResults: unknown[][] = [];
const queries: string[] = [];
const queryValues: unknown[][] = [];

function queueResult(rows: unknown[]) {
  queuedResults.push(rows);
}

function sql(strings: TemplateStringsArray, ...values: unknown[]) {
  queries.push(strings.join('?'));
  queryValues.push(values);
  return Promise.resolve(queuedResults.shift() ?? []);
}

mock.module('../db/client', () => ({
  sql,
}));

const {
  apiUser,
  findOrCreateUserFromClaims,
  getExercisesForExport,
  getPublicProfile,
  listUsers,
  updateUserProfile,
  UsernameTakenError,
} = await import('./users');

const dbUser: DbUser = {
  id: '8f544286-369a-4baf-b229-1c569da040c3',
  hankoSubject: 'hanko-user',
  username: 'trail_runner',
  displayName: 'Trail Runner',
  email: 'runner@example.test',
  avatarInitials: 'TR',
  avatarColor: 'oklch(60% .18 260)',
  synopsis: 'Runs trails',
  restHr: 45,
  maxHr: 188,
  createdAt: '2026-06-09T12:00:00.000Z',
};

const userRow = {
  id: dbUser.id,
  hanko_subject: dbUser.hankoSubject,
  username: dbUser.username,
  display_name: dbUser.displayName,
  email: dbUser.email,
  avatar_initials: dbUser.avatarInitials,
  avatar_color: dbUser.avatarColor,
  synopsis: dbUser.synopsis,
  resthr: dbUser.restHr,
  maxhr: dbUser.maxHr,
  created_at: dbUser.createdAt,
};

beforeEach(() => {
  queuedResults.length = 0;
  queries.length = 0;
  queryValues.length = 0;
});

describe('apiUser', () => {
  test('maps database users to the public API contract', () => {
    expect(apiUser(dbUser)).toEqual({
      id: '8f544286-369a-4baf-b229-1c569da040c3',
      username: 'trail_runner',
      displayName: 'Trail Runner',
      email: 'runner@example.test',
      synopsis: 'Runs trails',
      restHr: 45,
      maxHr: 188,
      avatarInitials: 'TR',
      avatarColor: 'oklch(60% .18 260)',
      gravatarHash: expect.stringMatching(/^[0-9a-f]{32}$/),
      createdAt: '2026-06-09T12:00:00.000Z',
    });
  });

  test('normalizes nullable database fields for clients', () => {
    expect(apiUser({ ...dbUser, email: null, synopsis: null })).toEqual(
      expect.objectContaining({
        email: '',
        synopsis: undefined,
        restHr: 45,
      }),
    );
  });
});

describe('findOrCreateUserFromClaims', () => {
  test('returns an existing user for a Hanko subject', async () => {
    queueResult([userRow]);

    await expect(findOrCreateUserFromClaims({ sub: 'hanko-user' })).resolves.toEqual(dbUser);
    expect(queries).toHaveLength(1);
  });

  test('creates normalized usernames from Hanko email claims', async () => {
    queueResult([]); // by subject
    queueResult([]); // unlinked user with this email
    queueResult([]); // username free?
    queueResult([
      {
        ...userRow,
        hanko_subject: 'new-subject',
        username: 'aa_test_foo',
        display_name: 'aa_test_foo',
        email: 'Ää.Test+foo@example.test',
        avatar_initials: 'AA',
      },
    ]);

    await expect(
      findOrCreateUserFromClaims({ sub: 'new-subject', email: 'Ää.Test+foo@example.test' }),
    ).resolves.toEqual({
      ...dbUser,
      hankoSubject: 'new-subject',
      username: 'aa_test_foo',
      displayName: 'aa_test_foo',
      email: 'Ää.Test+foo@example.test',
      avatarInitials: 'AA',
    });

    expect(queryValues[2]).toContain('aa_test_foo');
    expect(queryValues[3]).toEqual(
      expect.arrayContaining(['new-subject', 'aa_test_foo', 'Ää.Test+foo@example.test', 'AA']),
    );
  });
});

describe('findOrCreateUserFromClaims with a Hanko username', () => {
  test('uses the Hanko username as username and display name for new users', async () => {
    queueResult([]); // by subject
    queueResult([]); // unlinked user with this email
    queueResult([]); // name belongs to another user?
    queueResult([]); // username free?
    queueResult([
      { ...userRow, hanko_subject: 'new-subject', username: 'pliish', display_name: 'Pliish' },
    ]);

    await findOrCreateUserFromClaims({
      sub: 'new-subject',
      email: 'someone@example.test',
      username: ' Pliish ',
    });

    // URL key is the normalized username, the shown name keeps Hanko's spelling.
    expect(queryValues[3]).toContain('pliish');
    expect(queryValues[4]).toEqual(expect.arrayContaining(['pliish', 'Pliish']));
  });

  test('syncs the display name when the Hanko username changed, keeping the URL key', async () => {
    queueResult([userRow]);
    queueResult([]); // nobody else has the new name
    queueResult([{ ...userRow, display_name: 'new_name' }]);

    const user = await findOrCreateUserFromClaims({ sub: 'hanko-user', username: 'new_name' });

    expect(user.displayName).toBe('new_name');
    expect(user.username).toBe('trail_runner');
    // The previous name is preserved once, and the URL key is untouched.
    expect(queries[2]).toContain(
      'legacy_display_name = coalesce(legacy_display_name, display_name)',
    );
    expect(queries[2]).not.toContain(' username =');
  });

  test('does not write when the display name already matches', async () => {
    queueResult([userRow]);

    await findOrCreateUserFromClaims({ sub: 'hanko-user', username: 'Trail Runner' });

    expect(queries).toHaveLength(1);
  });

  test('keeps the current name when another user already has the new Hanko username', async () => {
    queueResult([userRow]);
    queueResult([{ '?column?': 1 }]); // taken by someone else

    const user = await findOrCreateUserFromClaims({ sub: 'hanko-user', username: 'taken_name' });

    expect(user.displayName).toBe('Trail Runner');
    expect(queries).toHaveLength(2);
  });

  test('refuses a new Hanko user whose username belongs to another user', async () => {
    queueResult([]); // by subject
    queueResult([]); // unlinked user with this email
    queueResult([{ '?column?': 1 }]); // name belongs to another user

    await expect(
      findOrCreateUserFromClaims({
        sub: 'squatter',
        email: 'squatter@example.test',
        username: 'Pekka_H',
      }),
    ).rejects.toBeInstanceOf(UsernameTakenError);

    // Nothing was inserted.
    expect(queries.some((q) => q.includes('insert into users'))).toBe(false);
    // Case-insensitive and diacritic-folded comparison values are sent to the database.
    expect(queryValues[2]).toEqual(expect.arrayContaining(['pekka_h']));
  });
});

describe('findOrCreateUserFromClaims email linking', () => {
  const unlinked = { ...userRow, hanko_subject: null };

  test('links a verified email to the single unlinked user instead of creating a new one', async () => {
    queueResult([]); // by subject
    queueResult([unlinked]); // the unlinked legacy user with this email
    queueResult([{ ...unlinked, hanko_subject: 'new-subject' }]); // link

    const user = await findOrCreateUserFromClaims({
      sub: 'new-subject',
      email: { address: 'Runner@Example.test', is_verified: true },
    });

    expect(user.id).toBe(dbUser.id);
    expect(user.hankoSubject).toBe('new-subject');
    expect(queries[1]).toContain('hanko_subject is null');
    expect(queryValues[1]).toContain('runner@example.test');
    expect(queries.some((q) => q.includes('insert into users'))).toBe(false);
  });

  test('applies the Hanko username to a linked user and keeps the old name', async () => {
    queueResult([]); // by subject
    queueResult([unlinked]);
    queueResult([{ ...unlinked, hanko_subject: 'new-subject' }]);
    queueResult([]); // nobody else has the name
    queueResult([{ ...unlinked, hanko_subject: 'new-subject', display_name: 'pliish' }]);

    const user = await findOrCreateUserFromClaims({
      sub: 'new-subject',
      email: { address: 'runner@example.test', is_verified: true },
      username: 'pliish',
    });

    expect(user.displayName).toBe('pliish');
    expect(queries[4]).toContain(
      'legacy_display_name = coalesce(legacy_display_name, display_name)',
    );
  });

  test('does not guess between several users sharing the email', async () => {
    queueResult([]); // by subject
    queueResult([unlinked, { ...unlinked, id: 'other' }]); // ambiguous
    queueResult([]); // username free?
    queueResult([{ ...userRow, hanko_subject: 'new-subject' }]);

    await findOrCreateUserFromClaims({
      sub: 'new-subject',
      email: { address: 'runner@example.test', is_verified: true },
    });

    expect(queries.some((q) => q.includes('insert into users'))).toBe(true);
    expect(queries.some((q) => q.includes('update users set hanko_subject'))).toBe(false);
  });

  test('ignores an email Hanko has not verified', async () => {
    queueResult([]); // by subject
    queueResult([]); // username free?
    queueResult([{ ...userRow, hanko_subject: 'new-subject' }]);

    await findOrCreateUserFromClaims({
      sub: 'new-subject',
      email: { address: 'runner@example.test', is_verified: false },
    });

    // by subject, uniqueness, insert: no email lookup at all.
    expect(queries).toHaveLength(3);
    expect(queries.some((q) => q.includes('lower(email)'))).toBe(false);
  });
});

describe('profile queries', () => {
  test('maps public profiles and returns null for missing users', async () => {
    queueResult([
      {
        username: 'trail_runner',
        display_name: 'Trail Runner',
        avatar_initials: 'TR',
        avatar_color: 'oklch(60% .18 260)',
        email: 'runner@example.test',
        synopsis: 'Runs trails',
        resthr: 45,
        maxhr: 190,
        created_at: '2026-06-09T12:00:00.000Z',
        exercise_count: 12,
      },
    ]);
    await expect(getPublicProfile('trail_runner')).resolves.toEqual({
      username: 'trail_runner',
      displayName: 'Trail Runner',
      avatarInitials: 'TR',
      avatarColor: 'oklch(60% .18 260)',
      gravatarHash: expect.stringMatching(/^[0-9a-f]{32}$/),
      synopsis: 'Runs trails',
      resthr: 45,
      maxhr: 190,
      createdAt: '2026-06-09T12:00:00.000Z',
      exerciseCount: 12,
      followerCount: 0,
    });

    queueResult([]);
    await expect(getPublicProfile('missing')).resolves.toBeNull();
  });

  test('updates profiles and returns null when no row changed', async () => {
    queueResult([{ ...userRow, synopsis: null, resthr: 50, maxhr: null }]);

    await expect(
      updateUserProfile('user-id', { synopsis: '', restHr: 50, maxHr: null }),
    ).resolves.toEqual({ ...dbUser, synopsis: null, restHr: 50, maxHr: null });

    // restHr/maxHr are mapped to the lowercase columns and the display name is never written.
    expect(queries[0]).toContain('resthr = case when');
    expect(queries[0]).not.toContain('display_name =');
    expect(queryValues[0]).toEqual(expect.arrayContaining([true, 50]));

    queueResult([]);
    await expect(updateUserProfile('missing-id', { goals: 'Race more' })).resolves.toBeNull();
  });
});

describe('listUsers', () => {
  test('maps paginated users and total counts', async () => {
    queueResult([
      {
        username: 'trail_runner',
        display_name: 'Trail Runner',
        avatar_initials: 'TR',
        avatar_color: 'oklch(60% .18 260)',
        synopsis: null,
        exercise_count: 7,
      },
    ]);
    queueResult([{ total: 1 }]);

    await expect(listUsers('trail', 2, 25)).resolves.toEqual({
      items: [
        {
          username: 'trail_runner',
          displayName: 'Trail Runner',
          avatarInitials: 'TR',
          avatarColor: 'oklch(60% .18 260)',
          synopsis: null,
          exerciseCount: 7,
        },
      ],
      total: 1,
    });

    expect(queryValues[0]).toEqual(expect.arrayContaining(['trail%', 25, 25]));
  });
});

describe('getExercisesForExport', () => {
  test('returns exercises with embedded exported comments', async () => {
    const exerciseRow = {
      id: 'exercise-id',
      sport_key: 'Juoksu',
      title: 'Morning run',
      body_html: '<p>Easy</p>',
      tags: ['base'],
      exercise_date: '2026-06-09',
      duration_cs: 3600,
      distance_m: 10000,
      avg_hr: 140,
      climb_m: 120,
      feel_rating: 'easy',
      details: {},
      gpx_points: null,
      created_at: '2026-06-09T12:00:00.000Z',
      updated_at: '2026-06-09T12:00:00.000Z',
    };
    const commentRows = [
      {
        id: 'comment-id',
        username: 'friend',
        body: 'Nice',
        created_at: '2026-06-09T12:30:00.000Z',
      },
    ];
    queueResult([exerciseRow]);
    queueResult(commentRows);

    const exported = (await getExercisesForExport('user-id')) as unknown as Array<
      typeof exerciseRow & { comments: typeof commentRows }
    >;

    expect(exported).toHaveLength(1);
    expect(exported[0]).toEqual({
      ...exerciseRow,
      comments: commentRows,
    });
  });
});
