import { describe, expect, test } from 'bun:test';
import { ALL_SPORTS, SPORTS, sportName } from './sports';

describe('sport catalog', () => {
  test('contains the full supported catalog with unique keys', () => {
    const keys = ALL_SPORTS.map((sport) => sport.key);

    expect(ALL_SPORTS.length).toBe(69);
    expect(new Set(keys).size).toBe(ALL_SPORTS.length);
    expect(SPORTS.run.nameFi).toBe('Juoksu');
    expect(SPORTS.ski.nameFi).toBe('Hiihto');
  });

  test('resolves localized names with key fallback', () => {
    expect(sportName('run', 'fi')).toBe('Juoksu');
    expect(sportName('run', 'en')).toBe('Running');
    expect(sportName('unknown', 'fi')).toBe('unknown');
  });
});
