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
      avatarInitials: 'TR',
      avatarColor: 'oklch(60% .18 260)',
      createdAt: '2026-06-09T12:00:00.000Z',
    });
  });

  test('normalizes nullable database fields for clients', () => {
    expect(apiUser({ ...dbUser, email: null, synopsis: null })).toEqual(
      expect.objectContaining({
        email: '',
        synopsis: undefined,
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
    queueResult([]);
    queueResult([]);
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

    expect(queryValues[1]).toContain('aa_test_foo');
    expect(queryValues[2]).toEqual(
      expect.arrayContaining(['new-subject', 'aa_test_foo', 'Ää.Test+foo@example.test', 'AA']),
    );
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
    queueResult([{ ...userRow, display_name: 'Edited Runner', synopsis: null }]);

    await expect(
      updateUserProfile('user-id', { displayName: 'Edited Runner', synopsis: '' }),
    ).resolves.toEqual({
      ...dbUser,
      displayName: 'Edited Runner',
      synopsis: null,
    });

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
      duration_sec: 3600,
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
