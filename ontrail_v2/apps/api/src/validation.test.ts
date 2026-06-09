import { describe, expect, test } from 'bun:test';
import { isUuid } from './validation';

describe('isUuid', () => {
  test('accepts RFC4122-style UUIDs', () => {
    expect(isUuid('8f544286-369a-4baf-b229-1c569da040c3')).toBe(true);
    expect(isUuid('8F544286-369A-4BAF-B229-1C569DA040C3')).toBe(true);
  });

  test('rejects malformed route ids before they reach Postgres casts', () => {
    expect(isUuid('test-id')).toBe(false);
    expect(isUuid('8f544286369a4bafb2291c569da040c3')).toBe(false);
    expect(isUuid('8f544286-369a-7baf-b229-1c569da040c3')).toBe(false);
  });
});
