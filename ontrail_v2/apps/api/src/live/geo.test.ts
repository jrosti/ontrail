import { describe, expect, test } from 'bun:test';
import { downsample, haversineM, localDate, parsePoints, pathDistanceM } from './geo';

const now = Date.parse('2026-06-20T10:00:00Z');
const good = { seq: 0, t: '2026-06-20T09:59:00Z', lat: 60.17, lon: 24.94 };

describe('haversineM', () => {
  test('one degree of latitude is about 111.2 km', () => {
    expect(haversineM({ lat: 60, lon: 24 }, { lat: 61, lon: 24 })).toBeCloseTo(111_195, -2);
  });

  test('identical points are zero apart', () => {
    expect(haversineM({ lat: 60, lon: 24 }, { lat: 60, lon: 24 })).toBe(0);
  });
});

describe('pathDistanceM', () => {
  const a = { lat: 60, lon: 24 };
  const b = { lat: 60.01, lon: 24 };
  const c = { lat: 60.02, lon: 24 };

  test('sums legs', () => {
    expect(pathDistanceM([a, b, c])).toBeCloseTo(haversineM(a, c), 3);
  });

  test('continues from the previous known point', () => {
    expect(pathDistanceM([b, c], a)).toBeCloseTo(haversineM(a, c), 3);
  });

  test('single point with no origin is zero', () => {
    expect(pathDistanceM([a])).toBe(0);
  });
});

describe('downsample', () => {
  const items = Array.from({ length: 101 }, (_, i) => i);

  test('keeps short tracks untouched', () => {
    expect(downsample(items, 200)).toBe(items);
  });

  test('thins evenly and keeps first and last', () => {
    const out = downsample(items, 11);
    expect(out).toHaveLength(11);
    expect(out[0]).toBe(0);
    expect(out[10]).toBe(100);
    expect(out[5]).toBe(50);
  });
});

describe('localDate', () => {
  test('uses the Helsinki calendar day, not UTC', () => {
    // 22:30 UTC in June is 01:30 the next day in Helsinki (UTC+3).
    expect(localDate(new Date('2026-06-19T22:30:00Z'))).toBe('2026-06-20');
  });
});

describe('parsePoints', () => {
  test('accepts a valid batch and normalizes the timestamp', () => {
    const result = parsePoints(
      [{ ...good, t: '2026-06-20T12:59:00+03:00', ele: 12.5, hr: 150 }],
      now,
    );
    expect(result).toEqual({
      ok: true,
      points: [
        { seq: 0, t: '2026-06-20T09:59:00.000Z', lat: 60.17, lon: 24.94, ele: 12.5, hr: 150 },
      ],
    });
  });

  test.each([
    ['not an array', {}, 'points_required'],
    ['empty batch', [], 'points_required'],
    ['negative seq', [{ ...good, seq: -1 }], 'invalid_point_0_seq'],
    ['fractional seq', [{ ...good, seq: 1.5 }], 'invalid_point_0_seq'],
    ['bad time', [{ ...good, t: 'yesterday-ish' }], 'invalid_point_0_t'],
    ['future time', [{ ...good, t: '2026-06-23T00:00:00Z' }], 'invalid_point_0_t'],
    ['latitude out of range', [{ ...good, lat: 91 }], 'invalid_point_0_lat'],
    ['longitude as string', [{ ...good, lon: '24.9' }], 'invalid_point_0_lon'],
    ['hr too low', [{ ...good, hr: 5 }], 'invalid_point_0_hr'],
    ['hr fractional', [{ ...good, hr: 150.5 }], 'invalid_point_0_hr'],
    ['ele not a number', [{ ...good, ele: 'high' }], 'invalid_point_0_ele'],
    ['second point bad', [good, { ...good, seq: 1, lat: Number.NaN }], 'invalid_point_1_lat'],
  ])('rejects %s', (_name, input, error) => {
    expect(parsePoints(input, now)).toEqual({ ok: false, error });
  });

  test('rejects oversized batches', () => {
    const big = Array.from({ length: 1001 }, (_, seq) => ({ ...good, seq }));
    expect(parsePoints(big, now)).toEqual({ ok: false, error: 'too_many_points' });
  });
});
