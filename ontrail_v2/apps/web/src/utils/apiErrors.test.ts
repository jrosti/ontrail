import { describe, expect, test } from 'bun:test';
import { usernameTakenFrom } from './apiErrors';

const axiosError = (status: number, data: unknown) => ({ response: { status, data } });

describe('usernameTakenFrom', () => {
  test('returns the taken username from a 409 username_taken response', () => {
    expect(
      usernameTakenFrom(axiosError(409, { error: 'username_taken', username: 'Pekka_H' })),
    ).toBe('Pekka_H');
  });

  test('still recognises the error when the username is missing', () => {
    expect(usernameTakenFrom(axiosError(409, { error: 'username_taken' }))).toBe('');
  });

  test.each([
    ['another 409', axiosError(409, { error: 'session_not_active' })],
    ['a 500', axiosError(500, { error: 'username_taken' })],
    ['a network error', new Error('Network Error')],
    ['null', null],
    ['undefined', undefined],
  ])('returns null for %s', (_name, error) => {
    expect(usernameTakenFrom(error)).toBeNull();
  });
});
