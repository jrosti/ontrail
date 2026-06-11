export interface ApiConfig {
  port: number;
  databaseUrl: string;
  hankoUrl: string;
  jwtIssuer?: string;
}

export function loadConfig(env = process.env): ApiConfig {
  return {
    port: Number(env.PORT ?? 3002),
    databaseUrl: env.DATABASE_URL ?? 'postgres://hanko:hanko@localhost:5432/ontrail',
    hankoUrl: env.HANKO_URL ?? 'http://localhost:8000',
    jwtIssuer: env.HANKO_JWT_ISSUER,
  };
}
