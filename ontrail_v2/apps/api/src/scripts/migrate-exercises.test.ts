import { describe, expect, mock, test } from 'bun:test';

mock.module('../db/client', () => ({
  sql: () => Promise.resolve([]),
}));

const { coerceLong, coerceDate, normalizeAvgHr, buildDetails, buildExerciseRow, SPORT_OVERRIDES } =
  await import('./migrate-exercises');

const sportMap = new Map([
  ['Juoksu', 'run'],
  ['Rullaluistelu', 'rullaluistelu'],
]);

function doc(over: Record<string, unknown> = {}) {
  return {
    _id: { $oid: '56df2a8f9932f876bac5abdb' },
    user: 'Jörö',
    sport: 'Juoksu',
    title: 'Run',
    body: '<p>hi</p>',
    tags: ['easy'],
    duration: { $numberLong: '354000' },
    distance: { $numberLong: '10000' },
    avghr: 150,
    creationDate: { $date: '2016-03-08T10:00:00.000Z' },
    lastModifiedDate: { $date: '2016-03-08T20:40:37.478Z' },
    ...over,
    // biome-ignore lint/suspicious/noExplicitAny: test helper
  } as any;
}

describe('coerceLong', () => {
  test('handles $numberLong, int, null, undefined', () => {
    expect(coerceLong({ $numberLong: '354000' })).toBe(354000);
    expect(coerceLong(260)).toBe(260);
    expect(coerceLong(null)).toBeNull();
    expect(coerceLong(undefined)).toBeNull();
  });
});

describe('coerceDate', () => {
  test('parses {$date} and bare strings', () => {
    expect(coerceDate({ $date: '2016-03-08T10:00:00.000Z' })?.toISOString()).toBe(
      '2016-03-08T10:00:00.000Z',
    );
    expect(coerceDate('1997-08-19T00:00:00.000Z')?.getUTCFullYear()).toBe(1997);
    expect(coerceDate(null)).toBeNull();
  });
});

describe('normalizeAvgHr', () => {
  test('tri-state: 0 and >230 and null -> null, valid passes through', () => {
    expect(normalizeAvgHr(150)).toBe(150);
    expect(normalizeAvgHr(0)).toBeNull();
    expect(normalizeAvgHr(231)).toBeNull();
    expect(normalizeAvgHr(null)).toBeNull();
    expect(normalizeAvgHr({ $numberLong: '180' })).toBe(180);
  });
});

describe('buildDetails', () => {
  test('only includes present fields', () => {
    expect(buildDetails(doc({ detailRepeats: 10, detailVolume: { $numberLong: '500' } }))).toEqual({
      repeats: 10,
      volume: 500,
    });
    expect(buildDetails(doc())).toEqual({});
  });
});

describe('buildExerciseRow', () => {
  test('maps a typical doc', () => {
    const row = buildExerciseRow(doc(), 'owner-1', sportMap);
    expect(row.sport_key).toBe('run');
    expect(row.duration_cs).toBe(354000); // centiseconds, stored verbatim
    expect(row.distance_m).toBe(10000);
    expect(row.avg_hr).toBe(150);
    expect(row.exercise_date).toBe('2016-03-08');
    expect(row.created_at).toBe('2016-03-08T10:00:00.000Z');
    expect(row.updated_at).toBe('2016-03-08T20:40:37.478Z');
    expect(row.body_markdown).toBeNull();
    expect(row.tags).toEqual(['easy']);
  });

  test('null duration -> 0; null distance -> null; avghr 0 -> null', () => {
    const row = buildExerciseRow(doc({ duration: null, distance: null, avghr: 0 }), 'o', sportMap);
    expect(row.duration_cs).toBe(0);
    expect(row.distance_m).toBeNull();
    expect(row.avg_hr).toBeNull();
  });

  test('empty title falls back to sport name; empty body -> null', () => {
    const row = buildExerciseRow(doc({ title: '  ', body: '' }), 'o', sportMap);
    expect(row.title).toBe('Juoksu');
    expect(row.body_html).toBeNull();
  });

  test('detailElevation -> climb_m; repeats/volume -> details', () => {
    const row = buildExerciseRow(
      doc({ detailElevation: 120, detailRepeats: 5, detailVolume: 200 }),
      'o',
      sportMap,
    );
    expect(row.climb_m).toBe(120);
    expect(row.details).toEqual({ repeats: 5, volume: 200 });
  });

  test('Lepo override maps to muu-merkinta', () => {
    expect(SPORT_OVERRIDES.Lepo).toBe('muu-merkinta');
    const row = buildExerciseRow(doc({ sport: 'Lepo' }), 'o', sportMap);
    expect(row.sport_key).toBe('muu-merkinta');
  });

  test('preserves legitimately backdated historical dates (1997)', () => {
    const row = buildExerciseRow(
      doc({ creationDate: { $date: '1997-08-19T00:00:00.000Z' }, lastModifiedDate: null }),
      'o',
      sportMap,
    );
    expect(row.exercise_date).toBe('1997-08-19');
    expect(row.updated_at).toBe(row.created_at); // falls back to creationDate
  });

  test('throws on an unmapped sport', () => {
    expect(() => buildExerciseRow(doc({ sport: 'Quidditch' }), 'o', sportMap)).toThrow(
      /unmapped sport/,
    );
  });
});
