import type { AuthClaims } from '../auth/hanko';
import { claimEmail } from '../auth/hanko';
import { sql } from '../db/client';

export interface DbUser {
  id: string;
  hankoSubject: string | null;
  username: string;
  displayName: string;
  email: string | null;
  avatarInitials: string;
  avatarColor: string;
  synopsis: string | null;
  createdAt: string;
}

interface UserRow {
  id: string;
  hanko_subject: string | null;
  username: string;
  display_name: string;
  email: string | null;
  avatar_initials: string;
  avatar_color: string;
  synopsis: string | null;
  created_at: string;
}

function toUser(row: UserRow): DbUser {
  return {
    id: row.id,
    hankoSubject: row.hanko_subject,
    username: row.username,
    displayName: row.display_name,
    email: row.email,
    avatarInitials: row.avatar_initials,
    avatarColor: row.avatar_color,
    synopsis: row.synopsis,
    createdAt: row.created_at,
  };
}

function normalizeUsername(input: string): string {
  const normalized = input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 24);
  return normalized || 'user';
}

function initials(username: string): string {
  return username.slice(0, 2).toUpperCase();
}

async function uniqueUsername(base: string): Promise<string> {
  let candidate = base;
  for (let i = 2; i < 1000; i++) {
    const exists = await sql`select 1 from users where normalized_username = ${candidate}`;
    if (exists.length === 0) return candidate;
    candidate = `${base}_${i}`;
  }
  return `${base}_${crypto.randomUUID().slice(0, 8)}`;
}

export async function findOrCreateUserFromClaims(claims: AuthClaims): Promise<DbUser> {
  const existing = await sql<UserRow[]>`
    select id, hanko_subject, username, display_name, email, avatar_initials, avatar_color, synopsis, created_at::text
    from users
    where hanko_subject = ${claims.sub}
    limit 1
  `;
  if (existing[0]) return toUser(existing[0]);

  const email = claimEmail(claims);
  const base = normalizeUsername(email?.split('@')[0] ?? `user_${claims.sub.slice(0, 8)}`);
  const username = await uniqueUsername(base);
  const created = await sql<UserRow[]>`
    insert into users (
      hanko_subject, username, normalized_username, email, display_name, avatar_initials, avatar_color
    )
    values (
      ${claims.sub}, ${username}, ${username}, ${email}, ${username}, ${initials(username)}, ${'oklch(60% .18 260)'}
    )
    returning id, hanko_subject, username, display_name, email, avatar_initials, avatar_color, synopsis, created_at::text
  `;

  return toUser(created[0]);
}

export function apiUser(user: DbUser) {
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    email: user.email ?? '',
    synopsis: user.synopsis ?? undefined,
    avatarInitials: user.avatarInitials,
    avatarColor: user.avatarColor,
    createdAt: user.createdAt,
  };
}
