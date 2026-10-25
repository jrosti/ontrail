import { describe, expect, test } from 'bun:test';
import {
  hankoUsernameCandidates,
  isHankoUsername,
  toHankoUsername,
  withSuffix,
} from './hanko-username';

describe('isHankoUsername', () => {
  test.each([
    ['pekka_h', true],
    ['Svante_K', true],
    ['ab', true],
    ['a', false],
    ['x'.repeat(33), false],
    ['Pekka Hämäläinen', false],
    ['Jörö', false],
    ['with-dash', false],
    ['', false],
  ])('%p -> %p', (name, valid) => {
    expect(isHankoUsername(name)).toBe(valid);
  });
});

describe('toHankoUsername', () => {
  test('folds Finnish letters and keeps case', () => {
    expect(toHankoUsername('Jörö')).toBe('Joro');
    expect(toHankoUsername('Pekka Hämäläinen')).toBe('Pekka_Hamalainen');
  });

  test('collapses separators, trims them and respects the maximum length', () => {
    expect(toHankoUsername('  --Foo..Bar--  ')).toBe('Foo_Bar');
    expect(toHankoUsername('a'.repeat(40))).toHaveLength(32);
  });

  test('falls back to "user" when nothing usable remains', () => {
    expect(toHankoUsername('???')).toBe('user');
    expect(toHankoUsername('x')).toBe('user');
  });
});

describe('hankoUsernameCandidates', () => {
  test('prefers a display name Hanko accepts as is', () => {
    expect(hankoUsernameCandidates({ displayName: 'Pliish', username: 'pliish_old' })).toEqual([
      'Pliish',
      'pliish_old',
    ]);
  });

  test('uses the OnTrail username when the display name is not a valid Hanko name', () => {
    expect(
      hankoUsernameCandidates({ displayName: 'Pekka Hämäläinen', username: 'pekka_h' })[0],
    ).toBe('pekka_h');
  });

  test('transliterates when neither is valid', () => {
    expect(hankoUsernameCandidates({ displayName: 'Jörö', username: 'Jörö' })).toEqual(['Joro']);
  });

  test('has no duplicates', () => {
    expect(hankoUsernameCandidates({ displayName: 'runner', username: 'runner' })).toEqual([
      'runner',
    ]);
  });
});

describe('withSuffix', () => {
  test('appends a counter and still fits the maximum length', () => {
    expect(withSuffix('runner', 2)).toBe('runner_2');
    expect(withSuffix('a'.repeat(32), 12)).toHaveLength(32);
    expect(withSuffix('a'.repeat(32), 12).endsWith('_12')).toBe(true);
  });
});
