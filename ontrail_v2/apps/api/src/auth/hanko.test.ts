import { describe, expect, test } from 'bun:test';
import { getBearerToken } from './hanko';

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
