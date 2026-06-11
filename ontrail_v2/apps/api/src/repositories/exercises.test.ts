import { beforeEach, describe, expect, mock, test } from 'bun:test';
import type { DbUser } from './users';

const queuedResults: unknown[][] = [];
const queries: string[] = [];
const queryValues: unknown[][] = [];
const emitted: Array<{ userId: string; event: string; payload: unknown }> = [];

function queueResult(rows: unknown[]) {
  queuedResults.push(rows);
}

function sql(strings: TemplateStringsArray, ...values: unknown[]) {
  const query = strings.join('?');
  if (values.length === 0 || /^\s*(where|\?\s+asc|\?\s+desc)/i.test(query)) {
    return { query, values };
  }
  queries.push(query);
  queryValues.push(values);
  return Promise.resolve(queuedResults.shift() ?? []);
}

sql.json = (value: unknown) => ({ json: value });

mock.module('../db/client', () => ({ sql }));
mock.module('../sse', () => ({
  emitToUser: (userId: string, event: string, payload: unknown) => {
    emitted.push({ userId, event, payload });
  },
}));

const {
  addComment,
  createExercise,
  deleteComment,
  deleteExercise,
  getExercise,
  listExercises,
  updateExercise,
} = await import('./exercises');

const owner: DbUser = {
  id: 'owner-id',
  hankoSubject: 'hanko-owner',
  username: 'runner',
  displayName: 'Trail Runner',
  email: 'runner@example.test',
  avatarInitials: 'TR',
  avatarColor: 'oklch(60% .18 260)',
  synopsis: null,
  createdAt: '2026-06-09T12:00:00.000Z',
};

const otherUser: DbUser = {
  ...owner,
  id: 'other-id',
  hankoSubject: 'hanko-other',
  username: 'friend',
  displayName: 'Friend Runner',
  avatarInitials: 'FR',
};

const exerciseRow = {
  id: 'exercise-id',
  owner_username: 'runner',
  owner_display_name: 'Trail Runner',
  owner_initials: 'TR',
  owner_color: 'oklch(60% .18 260)',
  sport_key: 'Juoksu',
  title: 'Morning run',
  body_html: '<p>Easy</p>',
  tags: ['base', 'trail'],
  exercise_date: '2026-06-09',
  duration_sec: 3600,
  distance_m: 10000,
  avg_hr: 140,
  climb_m: 120,
  feel_rating: 'easy',
  details: { cadence: 86 },
  gpx_points: [
    { lat: 60.1699, lon: 24.9384, ele: 10 },
    { lat: 60.1709, lon: 24.9484, ele: 20 },
  ],
  comment_count: 2,
  care_count: 3,
  created_at: '2026-06-09T12:00:00.000Z',
  updated_at: '2026-06-09T12:30:00.000Z',
};

const commentRow = {
  id: 'comment-id',
  username: 'friend',
  display_name: 'Friend Runner',
  avatar_initials: 'FR',
  avatar_color: 'oklch(70% .15 180)',
  author_email: null,
  body: 'Nice work',
  created_at: '2026-06-09T13:00:00.000Z',
};

const updateRow = {
  owner_id: 'owner-id',
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
  details: { cadence: 86 },
  gpx_points: [{ lat: 60.1699, lon: 24.9384 }],
};

beforeEach(() => {
  queuedResults.length = 0;
  queries.length = 0;
  queryValues.length = 0;
  emitted.length = 0;
});

describe('exercise repository reads', () => {
  test('lists exercises with filters, pagination, and authenticated-only fields', async () => {
    queueResult([exerciseRow]);
    queueResult([{ total: 1 }]);

    const params = new URLSearchParams({
      page: '2',
      perPage: '10',
      sport: 'Juoksu',
      user: 'runner',
      tag: 'trail',
      group: 'trail-crew',
      minDistM: '5000',
      maxDistM: '20000',
      minDurSec: '1200',
      maxDurSec: '7200',
      minHr: '120',
      maxHr: '170',
      dateFrom: '2026-06-01',
      dateTo: '2026-06-30',
      sortBy: 'distance',
      sortDir: 'asc',
    });

    await expect(listExercises(params, true)).resolves.toEqual({
      items: [
        expect.objectContaining({
          id: 'exercise-id',
          ownerUsername: 'runner',
          sport: 'Juoksu',
          commentCount: 2,
          careCount: 3,
          gpxPoints: exerciseRow.gpx_points,
        }),
      ],
      total: 1,
      page: 2,
      perPage: 10,
    });

    expect(queryValues[0]).toEqual(expect.arrayContaining([10, 10]));
  });

  test('hides comments and route data from anonymous list and detail reads', async () => {
    queueResult([exerciseRow]);
    queueResult([{ total: 1 }]);
    const listed = await listExercises(new URLSearchParams(), false);

    expect(listed.items[0]).toEqual(
      expect.objectContaining({ commentCount: 0, gpxPoints: undefined }),
    );

    queueResult([exerciseRow]);
    await expect(getExercise('exercise-id', false)).resolves.toEqual(
      expect.objectContaining({
        body: 'Rekisteröidy nähdäksesi harjoitukset',
        comments: [],
        details: {},
        feelRating: undefined,
        gpxPoints: undefined,
      }),
    );
  });

  test('loads authenticated exercise details with mapped comments', async () => {
    queueResult([exerciseRow]);
    queueResult([commentRow]);

    await expect(getExercise('exercise-id', true)).resolves.toEqual(
      expect.objectContaining({
        id: 'exercise-id',
        body: '<p>Easy</p>',
        details: { cadence: 86 },
        feelRating: 'easy',
        comments: [
          {
            id: 'comment-id',
            username: 'friend',
            displayName: 'Friend Runner',
            avatarInitials: 'FR',
            avatarColor: 'oklch(70% .15 180)',
            gravatarHash: '',
            body: 'Nice work',
            createdAt: '2026-06-09T13:00:00.000Z',
          },
        ],
      }),
    );

    queueResult([]);
    await expect(getExercise('missing', true)).resolves.toBeNull();
  });
});

describe('exercise repository writes', () => {
  test('creates exercises with normalized GPX points and reloads the created row', async () => {
    queueResult([{ id: 'exercise-id' }]);
    queueResult([exerciseRow]);
    queueResult([]);

    await expect(
      createExercise(owner, {
        sport: 'Juoksu',
        title: 'Created',
        durationSec: 1800,
        details: { cadence: 90 },
        gpxPoints: [
          { lat: 60.1, lon: 24.9, ele: 10 },
          { lat: 91, lon: 24.9 },
          { lat: 60.2, lon: 25, ele: Number.NaN },
        ],
      }),
    ).resolves.toEqual(expect.objectContaining({ id: 'exercise-id' }));

    const jsonValues = queryValues[0].filter(
      (value): value is { json: unknown } =>
        value !== null && typeof value === 'object' && 'json' in value,
    );
    expect(jsonValues).toContainEqual({ json: { cadence: 90 } });
    expect(jsonValues).toContainEqual({
      json: [
        { lat: 60.1, lon: 24.9, ele: 10 },
        { lat: 60.2, lon: 25 },
      ],
    });
  });

  test('requires ownership for updates and preserves omitted fields', async () => {
    queueResult([]);
    await expect(updateExercise('missing', owner, { title: 'Nope' })).resolves.toBeNull();

    queueResult([{ ...updateRow, owner_id: 'someone-else' }]);
    await expect(updateExercise('exercise-id', owner, { title: 'Nope' })).resolves.toBe(
      'forbidden',
    );

    queueResult([updateRow]);
    queueResult([]);
    queueResult([{ ...exerciseRow, title: 'Edited', distance_m: null, gpx_points: null }]);
    queueResult([]);

    await expect(
      updateExercise('exercise-id', owner, {
        title: 'Edited',
        distanceM: undefined,
        gpxPoints: [{ lat: 100, lon: 25 }],
      }),
    ).resolves.toEqual(expect.objectContaining({ title: 'Edited', distanceM: undefined }));

    const updateValues = queryValues.find((values) =>
      values.some((value) => value !== null && typeof value === 'object' && 'json' in value),
    );
    expect(updateValues).toEqual(expect.arrayContaining([{ json: [] }]));
  });

  test('deletes only owned exercises', async () => {
    queueResult([]);
    await expect(deleteExercise('missing', owner)).resolves.toBe('not_found');

    queueResult([{ owner_id: 'other-id' }]);
    await expect(deleteExercise('exercise-id', owner)).resolves.toBe('forbidden');

    queueResult([{ owner_id: 'owner-id' }]);
    queueResult([]);
    await expect(deleteExercise('exercise-id', owner)).resolves.toBe('ok');
  });
});

describe('exercise comments', () => {
  test('adds comments and emits unread notifications for non-owner authors', async () => {
    queueResult([{ owner_id: 'owner-id' }]);
    queueResult([commentRow]);

    await expect(addComment('exercise-id', otherUser, 'Nice work')).resolves.toEqual({
      id: 'comment-id',
      username: 'friend',
      displayName: 'Friend Runner',
      avatarInitials: 'FR',
      avatarColor: 'oklch(70% .15 180)',
      gravatarHash: '',
      body: 'Nice work',
      createdAt: '2026-06-09T13:00:00.000Z',
    });
    expect(emitted).toEqual([
      { userId: 'owner-id', event: 'new_comment', payload: { exerciseId: 'exercise-id' } },
    ]);

    emitted.length = 0;
    queueResult([{ owner_id: 'owner-id' }]);
    queueResult([{ ...commentRow, username: 'runner' }]);
    await addComment('exercise-id', owner, 'Owner note');
    expect(emitted).toEqual([]);

    queueResult([]);
    await expect(addComment('missing', owner, 'Nope')).resolves.toBeNull();
  });

  test('deletes comments for the author or exercise owner only', async () => {
    queueResult([]);
    await expect(deleteComment('exercise-id', 'missing', owner)).resolves.toBe('not_found');

    queueResult([{ author_id: 'other-id', owner_id: 'owner-id' }]);
    queueResult([]);
    await expect(deleteComment('exercise-id', 'comment-id', owner)).resolves.toBe('ok');

    queueResult([{ author_id: 'other-id', owner_id: 'owner-id' }]);
    queueResult([]);
    await expect(deleteComment('exercise-id', 'comment-id', otherUser)).resolves.toBe('ok');

    queueResult([{ author_id: 'other-id', owner_id: 'owner-id' }]);
    await expect(
      deleteComment('exercise-id', 'comment-id', { ...owner, id: 'stranger-id' }),
    ).resolves.toBe('forbidden');
  });
});
