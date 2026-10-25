import { describe, expect, test } from 'bun:test';
import { parseFinish } from './finish';

describe('parseFinish', () => {
  test('accepts a missing or empty body', () => {
    expect(parseFinish(null)).toEqual({ ok: true, value: {} });
    expect(parseFinish({})).toEqual({ ok: true, value: {} });
  });

  test('accepts and trims all optional fields', () => {
    expect(
      parseFinish({
        title: '  Long run ',
        body: '<p>hi</p>',
        tags: [' pitkä '],
        feelRating: 'ok',
        durationCs: 90_000,
        distanceM: 21_097,
        avgHr: 150,
        date: '2026-06-20',
      }),
    ).toEqual({
      ok: true,
      value: {
        title: 'Long run',
        body: '<p>hi</p>',
        tags: ['pitkä'],
        feelRating: 'ok',
        durationCs: 90_000,
        distanceM: 21_097,
        avgHr: 150,
        date: '2026-06-20',
      },
    });
  });

  test.each([
    ['array body', [], 'invalid_body'],
    ['long title', { title: 'x'.repeat(201) }, 'invalid_title'],
    ['non-string tag', { tags: [1] }, 'invalid_tags'],
    ['blank tag', { tags: [' '] }, 'invalid_tags'],
    ['too many tags', { tags: Array(21).fill('a') }, 'invalid_tags'],
    ['bad feel rating', { feelRating: 'meh' }, 'invalid_feel_rating'],
    ['negative duration', { durationCs: -1 }, 'invalid_duration'],
    ['fractional duration', { durationCs: 1.5 }, 'invalid_duration'],
    ['huge distance', { distanceM: 99_999_999 }, 'invalid_distance'],
    ['implausible hr', { avgHr: 10 }, 'invalid_avg_hr'],
    ['malformed date', { date: '20.6.2026' }, 'invalid_date'],
    ['impossible date', { date: '2026-13-45' }, 'invalid_date'],
  ])('rejects %s', (_name, input, error) => {
    expect(parseFinish(input)).toEqual({ ok: false, error });
  });
});
