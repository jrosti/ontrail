/**
 * Legacy user migration script: MongoDB `onuser` -> Postgres `users` + Hanko.
 *
 * For each input doc it upserts a `users` row (profile flattened, scrypt
 * `passwordHash` carried verbatim as a bridge), creates a verified Hanko
 * account for the email, and records the mapping in `migration_users`.
 * Idempotent: re-running skips users already in `migration_users`.
 *
 * Export the source from the running Mongo with `--jsonArray` (the script
 * expects a JSON array, and Mongo 3.2 emits `_id` as `{"$oid": ...}`, matching
 * MongoUser._id below). One user:
 *   docker exec ontrailmongo mongoexport --db ontrail --collection onuser \
 *     --query '{"_id":{"$oid":"<hex>"}}' --jsonArray 2>/dev/null > users.json
 * All users: drop the --query.
 *
 * Usage:
 *   MONGO_USERS_JSON=/path/to/users.json bun run src/scripts/migrate-users.ts
 *
 * Env vars:
 *   MONGO_USERS_JSON  - path to JSON file exported from MongoDB onuser collection
 *   HANKO_ADMIN_URL   - Hanko admin API base URL (default: http://localhost:8001)
 *   DATABASE_URL      - PostgreSQL connection string
 *
 * Known data hazards for the bulk run (not yet handled here):
 *   - Duplicate emails: several legacy accounts can share one email (e.g. test
 *     accounts). Hanko enforces a unique email, so only one can be created per
 *     address; the rest get a 409 and are recorded with state 'pending'. Pick
 *     the canonical account before bulk-running, or dedupe upstream.
 *   - Mixed numeric encoding: some docs store profile.resthr/maxhr as extended
 *     JSON ({"$numberLong":"42"}) rather than a plain number; those need
 *     coercion before they hit the integer columns.
 */

import { readFileSync } from 'node:fs';
import { sql } from '../db/client';

const HANKO_ADMIN_URL = process.env.HANKO_ADMIN_URL ?? 'http://localhost:8001';

interface MongoUser {
  _id: { $oid: string };
  username: string;
  email?: string;
  passwordHash?: string;
  profile?: {
    displayName?: string;
    synopsis?: string;
    resthr?: number;
    maxhr?: number;
    aerk?: number;
    anaerk?: number;
    goals?: string;
  };
}

export interface HankoUser {
  id: string;
  emails?: { address: string; is_primary?: boolean; is_verified?: boolean }[];
}

export function normalizeUsername(input: string): string {
  const normalized = input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 24);
  return normalized || 'user';
}

export function initials(username: string): string {
  return username.slice(0, 2).toUpperCase();
}

/**
 * Create a Hanko user for the given email via the admin API.
 *
 * Hanko's admin user-create route is `POST /users` (the admin server is
 * already rooted at the admin port, there is no `/admin` path prefix), and the
 * body is a `CreateUser` DTO carrying an `emails` array — not a flat `email`.
 * We mark the migrated email primary + verified so the user can immediately
 * request a login passcode without a separate verification step. This Hanko
 * build has no user "status" concept, so no activation call is needed.
 */
export async function createHankoUser(
  email: string,
  adminUrl: string = HANKO_ADMIN_URL,
): Promise<HankoUser | null> {
  try {
    const resp = await fetch(`${adminUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emails: [{ address: email, is_primary: true, is_verified: true }],
      }),
    });
    if (!resp.ok) {
      const body = await resp.text();
      console.warn(`  Hanko create failed (${resp.status}): ${body}`);
      return null;
    }
    return (await resp.json()) as HankoUser;
  } catch (err) {
    console.warn(`  Hanko admin API unreachable: ${err}`);
    return null;
  }
}

async function main() {
  const mongoUsersPath = process.env.MONGO_USERS_JSON;
  if (!mongoUsersPath) {
    console.error('MONGO_USERS_JSON env var is required');
    process.exit(1);
  }

  const raw = readFileSync(mongoUsersPath, 'utf8');
  const mongoUsers: MongoUser[] = JSON.parse(raw);

  let skipped = 0;
  let alreadyMigrated = 0;
  let invited = 0;
  let failed = 0;

  for (const mu of mongoUsers) {
    const username = mu.username ?? '';
    if (!username || username === 'nobody') {
      skipped++;
      continue;
    }

    // Idempotency: check if already in migration_users
    const existing = await sql<{ state: string }[]>`
      select state from migration_users where legacy_username = ${username}
    `;
    if (existing[0]) {
      console.log(`  skip (${existing[0].state}): ${username}`);
      alreadyMigrated++;
      continue;
    }

    console.log(`migrating: ${username}`);

    const legacyObjectId = mu._id.$oid ?? null;
    const email = mu.email ?? null;
    const profile = mu.profile ?? {};
    const normalizedName = normalizeUsername(username);

    // Upsert into users table
    const userRows = await sql<{ id: string }[]>`
      insert into users (
        username, normalized_username, email, display_name,
        avatar_initials, avatar_color, synopsis,
        legacy_object_id, resthr, maxhr, aerk, anaerk, goals, password_hash
      )
      values (
        ${username}, ${normalizedName}, ${email},
        ${profile.displayName ?? username},
        ${initials(username)}, ${'oklch(60% .18 260)'},
        ${profile.synopsis ?? null},
        ${legacyObjectId}, ${profile.resthr ?? null}, ${profile.maxhr ?? null},
        ${profile.aerk ?? null}, ${profile.anaerk ?? null},
        ${profile.goals ?? null}, ${mu.passwordHash ?? null}
      )
      on conflict (username) do update set
        email = coalesce(excluded.email, users.email),
        legacy_object_id = coalesce(excluded.legacy_object_id, users.legacy_object_id),
        resthr = coalesce(excluded.resthr, users.resthr),
        maxhr = coalesce(excluded.maxhr, users.maxhr),
        aerk = coalesce(excluded.aerk, users.aerk),
        anaerk = coalesce(excluded.anaerk, users.anaerk),
        goals = coalesce(excluded.goals, users.goals),
        password_hash = coalesce(excluded.password_hash, users.password_hash)
      returning id::text
    `;
    const ontrailUserId = userRows[0]?.id;
    if (!ontrailUserId) {
      console.warn(`  failed to upsert user: ${username}`);
      failed++;
      continue;
    }

    // Create Hanko user if email is available
    let hankoSubject: string | null = null;
    if (email) {
      const hankoUser = await createHankoUser(email);
      if (hankoUser) {
        hankoSubject = hankoUser.id;
        // Store hanko_subject on users row
        await sql`
          update users set hanko_subject = ${hankoSubject}
          where id = ${ontrailUserId} and hanko_subject is null
        `;
        console.log(`  hanko user created: ${hankoUser.id}`);
      }
    }

    // Insert into migration_users
    await sql`
      insert into migration_users (
        legacy_username, legacy_email, legacy_password_hash,
        legacy_object_id, hanko_subject, ontrail_user_id,
        state, invited_at
      )
      values (
        ${username}, ${email}, ${mu.passwordHash ?? null},
        ${legacyObjectId}, ${hankoSubject},
        ${ontrailUserId},
        ${hankoSubject ? 'invited' : 'pending'},
        ${hankoSubject ? new Date().toISOString() : null}
      )
    `;

    invited++;
    console.log(`  done: ${username} → ${ontrailUserId}`);
  }

  console.log('\n=== Migration summary ===');
  console.log(`  total input:       ${mongoUsers.length}`);
  console.log(`  skipped (nobody):  ${skipped}`);
  console.log(`  already migrated:  ${alreadyMigrated}`);
  console.log(`  invited:           ${invited}`);
  console.log(`  failed:            ${failed}`);

  await sql.end({ timeout: 5 });
}

if (import.meta.main) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
