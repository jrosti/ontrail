import { beforeEach, describe, expect, mock, test } from 'bun:test';

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

mock.module('../db/client', () => ({ sql }));

const { getUnread, markAllRead } = await import('./unread');

beforeEach(() => {
  queuedResults.length = 0;
  queries.length = 0;
  queryValues.length = 0;
});

describe('unread repository', () => {
  test('aggregates unread comments by exercise', async () => {
    queueResult([
      { exercise_id: 'first', new_comment_count: 2 },
      { exercise_id: 'second', new_comment_count: 1 },
    ]);

    await expect(getUnread('user-id')).resolves.toEqual({
      exerciseIds: ['first', 'second'],
      commentCount: 3,
    });
  });

  test('marks all comments read with an upsert', async () => {
    queueResult([]);

    await expect(markAllRead('user-id')).resolves.toBeUndefined();
    expect(queries[0]).toContain('insert into user_visit');
    expect(queryValues[0]).toEqual(['user-id']);
  });
});
