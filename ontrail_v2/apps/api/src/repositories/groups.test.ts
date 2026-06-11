import { beforeEach, describe, expect, mock, test } from 'bun:test';

const queuedResults: unknown[][] = [];
const queries: string[] = [];
const queryValues: unknown[][] = [];
let nextError: unknown;

function queueResult(rows: unknown[]) {
  queuedResults.push(rows);
}

function sql(strings: TemplateStringsArray, ...values: unknown[]) {
  const query = strings.join('?');
  if (/^\s*(false|exists\()/i.test(query)) return { query, values };
  queries.push(query);
  queryValues.push(values);
  if (nextError) {
    const error = nextError;
    nextError = undefined;
    return Promise.reject(error);
  }
  return Promise.resolve(queuedResults.shift() ?? []);
}

mock.module('../db/client', () => ({ sql }));

const { createGroup, getGroupByName, joinGroup, leaveGroup, listGroups } = await import('./groups');

const groupRow = {
  id: 'group-id',
  name: 'Trail Crew',
  normalized_name: 'trail-crew',
  description: 'Runs trails',
  member_count: 2,
  created_at: '2026-06-10T10:00:00.000Z',
  is_member: true,
};

beforeEach(() => {
  queuedResults.length = 0;
  queries.length = 0;
  queryValues.length = 0;
  nextError = undefined;
});

describe('group repository', () => {
  test('lists groups with membership state', async () => {
    queueResult([groupRow]);

    await expect(listGroups('user-id')).resolves.toEqual([
      {
        id: 'group-id',
        name: 'Trail Crew',
        normalizedName: 'trail-crew',
        description: 'Runs trails',
        memberCount: 2,
        isMember: true,
        createdAt: '2026-06-10T10:00:00.000Z',
      },
    ]);
  });

  test('returns group details with mapped members', async () => {
    queueResult([groupRow]);
    queueResult([
      {
        username: 'runner',
        display_name: 'Runner',
        avatar_initials: 'RU',
        avatar_color: 'red',
      },
    ]);

    await expect(getGroupByName('trail-crew')).resolves.toEqual({
      group: expect.objectContaining({ id: 'group-id', normalizedName: 'trail-crew' }),
      members: [
        {
          username: 'runner',
          displayName: 'Runner',
          avatarInitials: 'RU',
          avatarColor: 'red',
        },
      ],
    });

    queueResult([]);
    await expect(getGroupByName('missing')).resolves.toBeNull();
  });

  test('creates normalized groups and joins the creator', async () => {
    queueResult([{ ...groupRow, member_count: 0, is_member: false }]);
    queueResult([]);

    await expect(createGroup('Trail Crew!!!', 'Runs trails', 'user-id')).resolves.toEqual({
      id: 'group-id',
      name: 'Trail Crew',
      normalizedName: 'trail-crew',
      description: 'Runs trails',
      memberCount: 1,
      isMember: true,
      createdAt: '2026-06-10T10:00:00.000Z',
    });

    expect(queryValues[0]).toEqual(expect.arrayContaining(['Trail Crew!!!', 'trail-crew']));
    expect(queries).toHaveLength(2);
  });

  test('returns conflict for duplicate group names', async () => {
    nextError = { code: '23505' };

    await expect(createGroup('Trail Crew', null)).resolves.toBe('conflict');
  });

  test('joins and leaves existing groups', async () => {
    queueResult([{ id: 'group-id' }]);
    queueResult([]);
    await expect(joinGroup('trail-crew', 'user-id')).resolves.toBe('ok');

    queueResult([{ id: 'group-id' }]);
    queueResult([]);
    await expect(leaveGroup('trail-crew', 'user-id')).resolves.toBe('ok');

    queueResult([]);
    await expect(joinGroup('missing', 'user-id')).resolves.toBe('not_found');

    queueResult([]);
    await expect(leaveGroup('missing', 'user-id')).resolves.toBe('not_found');
  });
});
