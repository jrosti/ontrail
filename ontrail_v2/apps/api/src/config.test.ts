import { describe, expect, test } from 'bun:test';
import { loadConfig } from './config';

describe('loadConfig', () => {
  test('uses stable local defaults', () => {
    expect(loadConfig({})).toEqual({
      port: 3002,
      databaseUrl: 'postgres://hanko:hanko@localhost:5432/ontrail',
      hankoUrl: 'http://localhost:8000',
      jwtIssuer: undefined,
    });
  });

  test('reads overrides from the environment', () => {
    expect(
      loadConfig({
        PORT: '4000',
        DATABASE_URL: 'postgres://example/db',
        HANKO_URL: 'https://auth.example.test',
        HANKO_JWT_ISSUER: 'issuer',
      }),
    ).toEqual({
      port: 4000,
      databaseUrl: 'postgres://example/db',
      hankoUrl: 'https://auth.example.test',
      jwtIssuer: 'issuer',
    });
  });
});
