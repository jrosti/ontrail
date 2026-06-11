import { createRemoteJWKSet, type JWTPayload, jwtVerify } from 'jose';
import { loadConfig } from '../config';

export interface AuthClaims extends JWTPayload {
  sub: string;
  email?: string | { address?: string; is_primary?: boolean; is_verified?: boolean };
}

const config = loadConfig();
const jwks = createRemoteJWKSet(new URL('/.well-known/jwks.json', config.hankoUrl));

export function getBearerToken(req: Request): string | null {
  const auth = req.headers.get('authorization');
  if (auth?.toLowerCase().startsWith('bearer ')) return auth.slice(7).trim();

  const cookie = req.headers.get('cookie');
  const token = cookie
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('hanko='))
    ?.slice('hanko='.length);

  return token ? decodeURIComponent(token) : null;
}

export async function verifyHankoRequest(req: Request): Promise<AuthClaims | null> {
  const token = getBearerToken(req);
  if (!token) return null;

  const { payload } = await jwtVerify(token, jwks, {
    issuer: config.jwtIssuer,
  });

  if (!payload.sub) return null;
  return payload as AuthClaims;
}

export function claimEmail(claims: AuthClaims): string | null {
  if (typeof claims.email === 'string') return claims.email;
  if (claims.email?.address) return claims.email.address;
  return null;
}
