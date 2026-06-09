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

export interface PublicProfile {
  username: string;
  displayName: string;
  avatarInitials: string;
  avatarColor: string;
  synopsis: string | null;
  resthr: number | null;
  maxhr: number | null;
  createdAt: string;
  exerciseCount: number;
  followerCount: number;
}

interface PublicProfileRow {
  username: string;
  display_name: string;
  avatar_initials: string;
  avatar_color: string;
  synopsis: string | null;
  resthr: number | null;
  maxhr: number | null;
  created_at: string;
  exercise_count: number;
}

export async function getPublicProfile(username: string): Promise<PublicProfile | null> {
  const rows = await sql<PublicProfileRow[]>`
    select
      u.username,
      u.display_name,
      u.avatar_initials,
      u.avatar_color,
      u.synopsis,
      u.resthr,
      u.maxhr,
      u.created_at::text,
      count(e.id)::int as exercise_count
    from users u
    left join exercises e on e.owner_id = u.id
    where u.username = ${username}
    group by u.id
    limit 1
  `;
  const row = rows[0];
  if (!row) return null;
  return {
    username: row.username,
    displayName: row.display_name,
    avatarInitials: row.avatar_initials,
    avatarColor: row.avatar_color,
    synopsis: row.synopsis,
    resthr: row.resthr,
    maxhr: row.maxhr,
    createdAt: row.created_at,
    exerciseCount: row.exercise_count,
    followerCount: 0,
  };
}

export interface ProfileUpdate {
  displayName?: string;
  synopsis?: string;
  resthr?: number | null;
  maxhr?: number | null;
  aerk?: number | null;
  anaerk?: number | null;
  goals?: string | null;
}

export async function updateUserProfile(
  userId: string,
  update: ProfileUpdate,
): Promise<DbUser | null> {
  // Build partial update — only set fields that are present in the update object
  const rows = await sql<UserRow[]>`
    update users set
      display_name = case when ${'displayName' in update}::bool then ${update.displayName ?? null} else display_name end,
      synopsis = case when ${'synopsis' in update}::bool then ${update.synopsis ?? null} else synopsis end,
      resthr = case when ${'resthr' in update}::bool then ${update.resthr ?? null} else resthr end,
      maxhr = case when ${'maxhr' in update}::bool then ${update.maxhr ?? null} else maxhr end,
      aerk = case when ${'aerk' in update}::bool then ${update.aerk ?? null} else aerk end,
      anaerk = case when ${'anaerk' in update}::bool then ${update.anaerk ?? null} else anaerk end,
      goals = case when ${'goals' in update}::bool then ${update.goals ?? null} else goals end,
      updated_at = now()
    where id = ${userId}
    returning id, hanko_subject, username, display_name, email, avatar_initials, avatar_color, synopsis, created_at::text
  `;
  return rows[0] ? toUser(rows[0]) : null;
}

export async function getExercisesForExport(userId: string) {
  // Return all exercises with comments for the given user
  const rows = await sql<
    {
      id: string;
      sport_key: string;
      title: string;
      body_html: string | null;
      tags: string[];
      exercise_date: string;
      duration_sec: number;
      distance_m: number | null;
      avg_hr: number | null;
      climb_m: number | null;
      feel_rating: string | null;
      details: Record<string, number>;
      gpx_points: unknown;
      created_at: string;
      updated_at: string;
    }[]
  >`
    select
      id::text,
      sport_key,
      title,
      body_html,
      tags,
      exercise_date::text,
      duration_sec,
      distance_m,
      avg_hr,
      climb_m,
      feel_rating,
      details,
      gpx_points,
      created_at::text,
      updated_at::text
    from exercises
    where owner_id = ${userId}
    order by exercise_date desc, created_at desc
  `;

  const result = [];
  for (const row of rows) {
    const comments = await sql<
      { id: string; username: string; body: string; created_at: string }[]
    >`
      select c.id::text, u.username, c.body, c.created_at::text
      from comments c
      join users u on u.id = c.author_id
      where c.exercise_id = ${row.id}
      order by c.created_at asc
    `;
    result.push({ ...row, comments });
  }
  return result;
}
