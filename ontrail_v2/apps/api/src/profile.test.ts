import { describe, expect, test } from 'bun:test';
import { parseProfileUpdate } from './profile';

describe('parseProfileUpdate', () => {
  test('accepts the editable fields and null to clear heart rates', () => {
    expect(parseProfileUpdate({ synopsis: 'Runs', restHr: 42, maxHr: null, goals: null })).toEqual({
      ok: true,
      value: { synopsis: 'Runs', restHr: 42, maxHr: null, goals: null },
    });
  });

  test('only copies keys that were sent', () => {
    expect(parseProfileUpdate({ restHr: 50 })).toEqual({ ok: true, value: { restHr: 50 } });
    expect(parseProfileUpdate({})).toEqual({ ok: true, value: {} });
  });

  test('drops the display name: it is the Hanko username and not editable', () => {
    expect(parseProfileUpdate({ displayName: 'Hacker', synopsis: 'x' })).toEqual({
      ok: true,
      value: { synopsis: 'x' },
    });
  });

  test.each([
    ['null body', null, 'invalid_body'],
    ['array body', [], 'invalid_body'],
    ['non-string synopsis', { synopsis: 5 }, 'invalid_synopsis'],
    ['overlong synopsis', { synopsis: 'x'.repeat(2001) }, 'invalid_synopsis'],
    ['numeric goals', { goals: 3 }, 'invalid_goals'],
    ['rest hr as string', { restHr: '40' }, 'invalid_rest_hr'],
    ['rest hr too low', { restHr: 10 }, 'invalid_rest_hr'],
    ['rest hr too high', { restHr: 121 }, 'invalid_rest_hr'],
    ['fractional rest hr', { restHr: 40.5 }, 'invalid_rest_hr'],
    ['max hr too low', { maxHr: 99 }, 'invalid_max_hr'],
    ['max hr too high', { maxHr: 221 }, 'invalid_max_hr'],
    ['bad aerk', { aerk: 300 }, 'invalid_aerk'],
    ['bad anaerk', { anaerk: 'x' }, 'invalid_anaerk'],
    ['rest above max', { restHr: 120, maxHr: 110 }, 'rest_hr_above_max_hr'],
    ['rest equals max', { restHr: 100, maxHr: 100 }, 'rest_hr_above_max_hr'],
  ])('rejects %s', (_name, input, error) => {
    expect(parseProfileUpdate(input)).toEqual({ ok: false, error });
  });
});
