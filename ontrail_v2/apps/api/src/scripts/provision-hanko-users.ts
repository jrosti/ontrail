/**
 * Provision Hanko accounts for users already in the OnTrail database.
 *
 * For every `users` row that has an email but no `hanko_subject`, create a Hanko account with the
 * email (primary + verified, so the person can request a login passcode right away) AND a username
 * already set. Hanko enforces unique usernames, so provisioning also reserves every existing name:
 * nobody can register a name an OnTrail user already has. On the first login the API shows the
 * Hanko username as the display name and keeps the old one in `users.legacy_display_name`.
 *
 * The Hanko username is the user's display name if Hanko accepts it as is, otherwise their OnTrail
 * username, otherwise a transliterated form ("Jörö" -> "Joro"); a taken name gets `_2`, `_3`, ….
 * Idempotent: users that already have a `hanko_subject` are skipped, so it can be re-run.
 *
 * Usage:
 *   bun run src/scripts/provision-hanko-users.ts --dry-run   # list what would be created
 *   bun run src/scripts/provision-hanko-users.ts             # create the accounts
 *
 * Env vars:
 *   HANKO_ADMIN_URL - Hanko admin API base URL (default: http://localhost:8001)
 *   DATABASE_URL    - PostgreSQL connection string
 *
 * Not handled here: users without an email cannot log in through Hanko and are only reported, and
 * accounts sharing an email beyond the first get `email_exists` (see
 * docs/migration/duplicate-email-policy.md: merge them first).
 */

import { sql } from '../db/client';
import {
  type CreateAccountResult,
  createHankoAccountForUser,
  DEFAULT_HANKO_ADMIN_URL,
} from './hanko-admin';
import { hankoUsernameCandidates } from './hanko-username';

export interface ProvisionCandidate {
  id: string;
  username: string;
  displayName: string;
  email: string;
}

export type ProvisionStatus = 'created' | 'would_create' | 'email_exists' | 'error';

export interface ProvisionOutcome {
  id: string;
  username: string;
  status: ProvisionStatus;
  hankoUsername?: string;
  hankoSubject?: string;
  detail?: string;
}

export interface ProvisionDeps {
  dryRun: boolean;
  create?: (
    user: ProvisionCandidate,
  ) => Promise<
    (CreateAccountResult & { ok: true; username: string }) | (CreateAccountResult & { ok: false })
  >;
  /** Persist the new Hanko subject on the OnTrail user. */
  link: (userId: string, hankoSubject: string) => Promise<void>;
}

export async function provisionHankoUsers(
  users: ProvisionCandidate[],
  deps: ProvisionDeps,
): Promise<ProvisionOutcome[]> {
  const create = deps.create ?? ((user) => createHankoAccountForUser(user));
  const outcomes: ProvisionOutcome[] = [];

  for (const user of users) {
    const base = { id: user.id, username: user.username };

    if (deps.dryRun) {
      // Only the first choice: a taken name is only discovered by Hanko at creation time.
      outcomes.push({
        ...base,
        status: 'would_create',
        hankoUsername: hankoUsernameCandidates(user)[0],
      });
      continue;
    }

    const result = await create(user);
    if (!result.ok) {
      outcomes.push({
        ...base,
        status: result.reason === 'email_exists' ? 'email_exists' : 'error',
        detail: `${result.status}: ${result.body}`,
      });
      continue;
    }

    await deps.link(user.id, result.user.id);
    outcomes.push({
      ...base,
      status: 'created',
      hankoUsername: result.username,
      hankoSubject: result.user.id,
    });
  }
  return outcomes;
}

async function loadCandidates(): Promise<{ users: ProvisionCandidate[]; withoutEmail: number }> {
  const rows = await sql<
    { id: string; username: string; display_name: string; email: string | null }[]
  >`
    select id::text, username, display_name, email
    from users
    where hanko_subject is null and username <> 'nobody'
    order by created_at, username
  `;
  const users: ProvisionCandidate[] = [];
  let withoutEmail = 0;
  for (const row of rows) {
    if (!row.email?.trim()) {
      withoutEmail++;
      continue;
    }
    users.push({
      id: row.id,
      username: row.username,
      displayName: row.display_name,
      email: row.email.trim(),
    });
  }
  return { users, withoutEmail };
}

export async function linkUser(userId: string, hankoSubject: string): Promise<void> {
  await sql`update users set hanko_subject = ${hankoSubject} where id = ${userId} and hanko_subject is null`;
  // Keep the migration bookkeeping (if this user came from the Mongo import) in step.
  await sql`
    update migration_users
    set hanko_subject = ${hankoSubject}, state = 'invited', invited_at = coalesce(invited_at, now())
    where ontrail_user_id = ${userId} and hanko_subject is null and state <> 'merged'
  `;
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const { users, withoutEmail } = await loadCandidates();
  console.log(
    `${dryRun ? 'DRY RUN: ' : ''}provisioning ${users.length} users via ${DEFAULT_HANKO_ADMIN_URL}`,
  );

  const outcomes = await provisionHankoUsers(users, { dryRun, link: linkUser });
  for (const o of outcomes) {
    const name = o.hankoUsername ? ` -> ${o.hankoUsername}` : '';
    console.log(
      `  ${o.status.padEnd(12)} ${o.username}${name}${o.detail ? `  (${o.detail})` : ''}`,
    );
  }

  const count = (s: ProvisionStatus) => outcomes.filter((o) => o.status === s).length;
  console.log('\n=== Provisioning summary ===');
  console.log(
    `  ${dryRun ? 'would create' : 'created'}:      ${count(dryRun ? 'would_create' : 'created')}`,
  );
  console.log(`  email exists:   ${count('email_exists')}`);
  console.log(`  errors:         ${count('error')}`);
  console.log(`  no email (skipped, cannot log in via Hanko): ${withoutEmail}`);

  await sql.end({ timeout: 5 });
  if (count('error') > 0) process.exit(1);
}

if (import.meta.main) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
