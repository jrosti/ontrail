/** Minimal client for the Hanko admin API (`POST /users`), shared by the user scripts. */
import { hankoUsernameCandidates, withSuffix } from './hanko-username';

export const DEFAULT_HANKO_ADMIN_URL = process.env.HANKO_ADMIN_URL ?? 'http://localhost:8001';

export interface HankoUser {
  id: string;
  emails?: { address: string; is_primary?: boolean; is_verified?: boolean }[];
}

export type CreateAccountResult =
  | { ok: true; user: HankoUser }
  | {
      ok: false;
      reason: 'username_taken' | 'email_exists' | 'error';
      status: number;
      body: string;
    };

/**
 * Create a Hanko user. The admin route is `POST /users` (no `/admin` prefix) and takes the
 * `CreateUser` DTO. The email is created primary + verified so the person can request a login
 * passcode at once; a `username` reserves that name in Hanko, which enforces uniqueness.
 */
export async function createHankoAccount(
  input: { email?: string; username?: string },
  adminUrl: string = DEFAULT_HANKO_ADMIN_URL,
): Promise<CreateAccountResult> {
  let resp: Response;
  try {
    resp = await fetch(`${adminUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...(input.email
          ? { emails: [{ address: input.email, is_primary: true, is_verified: true }] }
          : {}),
        ...(input.username ? { username: input.username } : {}),
      }),
    });
  } catch (err) {
    return { ok: false, reason: 'error', status: 0, body: `Hanko admin API unreachable: ${err}` };
  }

  if (resp.ok) return { ok: true, user: (await resp.json()) as HankoUser };

  const body = await resp.text();
  if (resp.status === 409) {
    // Hanko words the conflict as "username already exists" or "email … already exists".
    return {
      ok: false,
      reason: /username/i.test(body) ? 'username_taken' : 'email_exists',
      status: 409,
      body,
    };
  }
  return { ok: false, reason: 'error', status: resp.status, body };
}

/**
 * Create the account with the first free username for this user: their candidates in order, then
 * numeric suffixes on the first candidate. Gives up on an email conflict or an unexpected error.
 */
export async function createHankoAccountForUser(
  user: { email: string; displayName: string; username: string },
  adminUrl: string = DEFAULT_HANKO_ADMIN_URL,
  maxSuffix = 50,
): Promise<
  (CreateAccountResult & { ok: true; username: string }) | (CreateAccountResult & { ok: false })
> {
  const candidates = hankoUsernameCandidates(user);
  const base = candidates[0] ?? 'user';
  const attempts = [...candidates];
  for (let n = 2; n <= maxSuffix; n++) attempts.push(withSuffix(base, n));

  let last: CreateAccountResult | undefined;
  for (const username of attempts) {
    const result = await createHankoAccount({ email: user.email, username }, adminUrl);
    if (result.ok) return { ...result, username };
    last = result;
    if (result.reason !== 'username_taken') return result;
  }
  return last as CreateAccountResult & { ok: false };
}
