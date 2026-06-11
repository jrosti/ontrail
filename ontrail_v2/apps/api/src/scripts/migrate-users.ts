/**
 * Legacy user migration script.
 *
 * Usage:
 *   MONGO_USERS_JSON=/path/to/users.json bun run src/scripts/migrate-users.ts
 *
 * Env vars:
 *   MONGO_USERS_JSON  - path to JSON file exported from MongoDB onuser collection
 *   HANKO_ADMIN_URL   - Hanko admin API base URL (default: http://localhost:8001)
 *   DATABASE_URL      - PostgreSQL connection string
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

interface HankoUser {
  id: string;
  email: string;
}

function normalizeUsername(input: string): string {
  const normalized = input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 24);
  return normalized || 'user';
}

function initials(username: string): string {
  return username.slice(0, 2).toUpperCase();
}

async function createHankoUser(email: string): Promise<HankoUser | null> {
  try {
    const resp = await fetch(`${HANKO_ADMIN_URL}/admin/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
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

async function activateHankoUser(hankoId: string): Promise<void> {
  try {
    const resp = await fetch(`${HANKO_ADMIN_URL}/admin/users/${hankoId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'active' }),
    });
    if (!resp.ok) {
      console.warn(`  Hanko activate failed (${resp.status})`);
    }
  } catch {
    // non-fatal
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
        await activateHankoUser(hankoUser.id);
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

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
