import { describe, expect, test } from 'bun:test';
import { claimEmail, getBearerToken, verifyHankoRequest } from './hanko';

describe('getBearerToken', () => {
  test('reads bearer authorization headers', () => {
    const req = new Request('http://test.local', {
      headers: { authorization: 'Bearer abc.def.ghi' },
    });

    expect(getBearerToken(req)).toBe('abc.def.ghi');
  });

  test('reads the Hanko session cookie', () => {
    const req = new Request('http://test.local', {
      headers: { cookie: 'theme=dark; hanko=encoded%20token; other=value' },
    });

    expect(getBearerToken(req)).toBe('encoded token');
  });

  test('prefers bearer headers over cookies', () => {
    const req = new Request('http://test.local', {
      headers: {
        authorization: 'Bearer header-token',
        cookie: 'hanko=cookie-token',
      },
    });

    expect(getBearerToken(req)).toBe('header-token');
  });

  test('returns null when no supported token exists', () => {
    expect(getBearerToken(new Request('http://test.local'))).toBeNull();
  });
});

describe('claimEmail', () => {
  test('reads string email claims', () => {
    expect(claimEmail({ sub: 'user-id', email: 'user@example.test' })).toBe('user@example.test');
  });

  test('reads structured Hanko email claims', () => {
    expect(
      claimEmail({
        sub: 'user-id',
        email: { address: 'primary@example.test', is_primary: true, is_verified: true },
      }),
    ).toBe('primary@example.test');
  });

  test('returns null when claims do not contain an email address', () => {
    expect(claimEmail({ sub: 'user-id' })).toBeNull();
    expect(claimEmail({ sub: 'user-id', email: {} })).toBeNull();
  });
});

describe('verifyHankoRequest', () => {
  test('returns null when a request does not carry a Hanko token', async () => {
    await expect(verifyHankoRequest(new Request('http://test.local'))).resolves.toBeNull();
  });
});
