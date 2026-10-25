import type { AuthClaims } from '../auth/hanko';
import { claimEmail, claimUsername, claimVerifiedEmail } from '../auth/hanko';
import { sql } from '../db/client';
import { gravatarHash } from '../gravatar';
import type { ProfileUpdate } from '../profile';

export interface DbUser {
  id: string;
  hankoSubject: string | null;
  username: string;
  displayName: string;
  email: string | null;
  avatarInitials: string;
  avatarColor: string;
  synopsis: string | null;
  restHr: number | null;
  maxHr: number | null;
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
  resthr: number | null;
  maxhr: number | null;
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
    restHr: row.resthr ?? null,
    maxHr: row.maxhr ?? null,
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

/** A new Hanko account asked for a username that already belongs to another OnTrail user. */
export class UsernameTakenError extends Error {
  constructor(public readonly username: string) {
    super(`username_taken: ${username}`);
    this.name = 'UsernameTakenError';
  }
}

/** Is `username` (case-insensitively, diacritics folded) already used by a user other than `exceptId`? */
async function usernameBelongsToOther(username: string, exceptId: string | null): Promise<boolean> {
  const rows = await sql`
    select 1 from users
    where (lower(display_name) = ${username.toLowerCase()}
           or normalized_username = ${normalizeUsername(username)})
      and (${exceptId}::uuid is null or id <> ${exceptId}::uuid)
    limit 1
  `;
  return rows.length > 0;
}

/**
 * Make the shown name follow the Hanko username. `users.username` stays the stable URL key; the
 * name the user had before is kept in legacy_display_name (set once, never overwritten by renames).
 */
async function syncDisplayName(row: UserRow, hankoUsername: string | null): Promise<DbUser> {
  if (!hankoUsername || row.display_name === hankoUsername) return toUser(row);
  // Another user already has this name (Hanko only knows about Hanko accounts): keep the current one.
  if (await usernameBelongsToOther(hankoUsername, row.id)) return toUser(row);

  const synced = await sql<UserRow[]>`
    update users set
      legacy_display_name = coalesce(legacy_display_name, display_name),
      display_name = ${hankoUsername},
      updated_at = now()
    where id = ${row.id}
    returning id, hanko_subject, username, display_name, email, avatar_initials, avatar_color, synopsis, created_at::text, resthr, maxhr
  `;
  return toUser(synced[0]);
}

export async function findOrCreateUserFromClaims(claims: AuthClaims): Promise<DbUser> {
  // The display name is the Hanko username when there is one; otherwise (no claim yet) the stored
  // name, i.e. the user's old display name, stays in use.
  const hankoUsername = claimUsername(claims);

  const existing = await sql<UserRow[]>`
    select id, hanko_subject, username, display_name, email, avatar_initials, avatar_color, synopsis, created_at::text, resthr, maxhr
    from users
    where hanko_subject = ${claims.sub}
    limit 1
  `;
  if (existing[0]) return syncDisplayName(existing[0], hankoUsername);

  // First login of a Hanko account that has no OnTrail user yet. If a verified email matches
  // exactly one not-yet-linked OnTrail user (e.g. a migrated legacy account), this is that person:
  // link instead of creating a second, empty account. Ambiguous matches are left alone.
  const verifiedEmail = claimVerifiedEmail(claims);
  if (verifiedEmail) {
    const matches = await sql<UserRow[]>`
      select id, hanko_subject, username, display_name, email, avatar_initials, avatar_color, synopsis, created_at::text, resthr, maxhr
      from users
      where hanko_subject is null and lower(email) = ${verifiedEmail.toLowerCase()}
    `;
    if (matches.length === 1) {
      const linked = await sql<UserRow[]>`
        update users set hanko_subject = ${claims.sub}, updated_at = now()
        where id = ${matches[0].id} and hanko_subject is null
        returning id, hanko_subject, username, display_name, email, avatar_initials, avatar_color, synopsis, created_at::text, resthr, maxhr
      `;
      if (linked[0]) return syncDisplayName(linked[0], hankoUsername);
    }
  }

  // A brand-new user must not take a name that belongs to someone else.
  if (hankoUsername && (await usernameBelongsToOther(hankoUsername, null))) {
    throw new UsernameTakenError(hankoUsername);
  }

  const email = claimEmail(claims);
  const base = normalizeUsername(
    hankoUsername ?? email?.split('@')[0] ?? `user_${claims.sub.slice(0, 8)}`,
  );
  const username = await uniqueUsername(base);
  const created = await sql<UserRow[]>`
    insert into users (
      hanko_subject, username, normalized_username, email, display_name, avatar_initials, avatar_color
    )
    values (
      ${claims.sub}, ${username}, ${username}, ${email}, ${hankoUsername ?? username}, ${initials(username)}, ${'oklch(60% .18 260)'}
    )
    returning id, hanko_subject, username, display_name, email, avatar_initials, avatar_color, synopsis, created_at::text, resthr, maxhr
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
    restHr: user.restHr ?? undefined,
    maxHr: user.maxHr ?? undefined,
    avatarInitials: user.avatarInitials,
    avatarColor: user.avatarColor,
    gravatarHash: gravatarHash(user.email),
    createdAt: user.createdAt,
  };
}

export interface PublicProfile {
  username: string;
  displayName: string;
  avatarInitials: string;
  avatarColor: string;
  gravatarHash: string;
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
  email: string | null;
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
      u.email,
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
    gravatarHash: gravatarHash(row.email),
    synopsis: row.synopsis,
    resthr: row.resthr,
    maxhr: row.maxhr,
    createdAt: row.created_at,
    exerciseCount: row.exercise_count,
    followerCount: 0,
  };
}

export async function updateUserProfile(
  userId: string,
  update: ProfileUpdate,
): Promise<DbUser | null> {
  // Build partial update — only set fields that are present in the update object
  const rows = await sql<UserRow[]>`
    update users set
      synopsis = case when ${'synopsis' in update}::bool then ${update.synopsis ?? null} else synopsis end,
      resthr = case when ${'restHr' in update}::bool then ${update.restHr ?? null} else resthr end,
      maxhr = case when ${'maxHr' in update}::bool then ${update.maxHr ?? null} else maxhr end,
      aerk = case when ${'aerk' in update}::bool then ${update.aerk ?? null} else aerk end,
      anaerk = case when ${'anaerk' in update}::bool then ${update.anaerk ?? null} else anaerk end,
      goals = case when ${'goals' in update}::bool then ${update.goals ?? null} else goals end,
      updated_at = now()
    where id = ${userId}
    returning id, hanko_subject, username, display_name, email, avatar_initials, avatar_color, synopsis, created_at::text, resthr, maxhr
  `;
  return rows[0] ? toUser(rows[0]) : null;
}

export interface UserListItem {
  username: string;
  displayName: string;
  avatarInitials: string;
  avatarColor: string;
  synopsis: string | null;
  exerciseCount: number;
}

export async function listUsers(
  query: string,
  page: number,
  perPage: number,
): Promise<{ items: UserListItem[]; total: number }> {
  const offset = (page - 1) * perPage;
  const like = query ? `${query.toLowerCase()}%` : null;

  const rows = await sql<
    {
      username: string;
      display_name: string;
      avatar_initials: string;
      avatar_color: string;
      synopsis: string | null;
      exercise_count: number;
    }[]
  >`
    select
      u.username,
      u.display_name,
      u.avatar_initials,
      u.avatar_color,
      u.synopsis,
      count(e.id)::int as exercise_count
    from users u
    left join exercises e on e.owner_id = u.id
    where (${like}::text is null or u.normalized_username like ${like})
    group by u.id
    order by u.username asc
    limit ${perPage} offset ${offset}
  `;

  const totals = await sql<{ total: number }[]>`
    select count(*)::int as total from users
    where (${like}::text is null or normalized_username like ${like})
  `;

  return {
    items: rows.map((r) => ({
      username: r.username,
      displayName: r.display_name,
      avatarInitials: r.avatar_initials,
      avatarColor: r.avatar_color,
      synopsis: r.synopsis,
      exerciseCount: r.exercise_count,
    })),
    total: totals[0]?.total ?? 0,
  };
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
      duration_cs: number;
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
      duration_cs,
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
