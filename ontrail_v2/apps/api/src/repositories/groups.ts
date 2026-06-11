import { sql } from '../db/client';

export interface DbGroup {
  id: string;
  name: string;
  normalizedName: string;
  description: string | null;
  memberCount: number;
  isMember: boolean;
  createdAt: string;
}

export interface GroupMember {
  username: string;
  displayName: string;
  avatarInitials: string;
  avatarColor: string;
}

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

interface GroupRow {
  id: string;
  name: string;
  normalized_name: string;
  description: string | null;
  member_count: number;
  created_at: string;
  is_member: boolean;
}

interface MemberRow {
  username: string;
  display_name: string;
  avatar_initials: string;
  avatar_color: string;
}

function toGroup(row: GroupRow): DbGroup {
  return {
    id: row.id,
    name: row.name,
    normalizedName: row.normalized_name,
    description: row.description,
    memberCount: row.member_count,
    isMember: row.is_member ?? false,
    createdAt: row.created_at,
  };
}

export async function listGroups(userId?: string): Promise<DbGroup[]> {
  const rows = await sql<GroupRow[]>`
    select
      g.id::text,
      g.name,
      g.normalized_name,
      g.description,
      count(gm.user_id)::int as member_count,
      g.created_at::text,
      ${userId ? sql`exists(select 1 from group_members m2 where m2.group_id = g.id and m2.user_id = ${userId})` : sql`false`} as is_member
    from groups g
    left join group_members gm on gm.group_id = g.id
    group by g.id
    order by g.name asc
  `;
  return rows.map(toGroup);
}

export async function getGroupByName(
  normalizedName: string,
): Promise<{ group: DbGroup; members: GroupMember[] } | null> {
  const rows = await sql<GroupRow[]>`
    select
      g.id::text,
      g.name,
      g.normalized_name,
      g.description,
      count(gm.user_id)::int as member_count,
      g.created_at::text
    from groups g
    left join group_members gm on gm.group_id = g.id
    where g.normalized_name = ${normalizedName}
    group by g.id
    limit 1
  `;
  const groupRow = rows[0];
  if (!groupRow) return null;

  const memberRows = await sql<MemberRow[]>`
    select u.username, u.display_name, u.avatar_initials, u.avatar_color
    from group_members gm
    join users u on u.id = gm.user_id
    where gm.group_id = ${groupRow.id}
    order by gm.joined_at asc
  `;

  const members: GroupMember[] = memberRows.map((r) => ({
    username: r.username,
    displayName: r.display_name,
    avatarInitials: r.avatar_initials,
    avatarColor: r.avatar_color,
  }));

  return { group: toGroup(groupRow), members };
}

export async function createGroup(
  name: string,
  description: string | null,
  creatorId?: string,
): Promise<DbGroup | 'conflict'> {
  const normalized = normalizeName(name);
  try {
    const rows = await sql<GroupRow[]>`
      insert into groups (name, normalized_name, description)
      values (${name}, ${normalized}, ${description})
      returning
        id::text,
        name,
        normalized_name,
        description,
        0::int as member_count,
        created_at::text,
        false as is_member
    `;
    const group = rows[0];
    if (creatorId) {
      await sql`
        insert into group_members (group_id, user_id)
        values (${group.id}, ${creatorId})
        on conflict do nothing
      `;
      group.member_count = 1;
      group.is_member = true;
    }
    return toGroup(group);
  } catch (err: unknown) {
    const pg = err as { code?: string };
    if (pg.code === '23505') return 'conflict';
    throw err;
  }
}

export async function joinGroup(
  normalizedName: string,
  userId: string,
): Promise<'ok' | 'not_found'> {
  const groups = await sql<{ id: string }[]>`
    select id::text from groups where normalized_name = ${normalizedName}
  `;
  const group = groups[0];
  if (!group) return 'not_found';
  await sql`
    insert into group_members (group_id, user_id)
    values (${group.id}, ${userId})
    on conflict do nothing
  `;
  return 'ok';
}

export async function leaveGroup(
  normalizedName: string,
  userId: string,
): Promise<'ok' | 'not_found'> {
  const groups = await sql<{ id: string }[]>`
    select id::text from groups where normalized_name = ${normalizedName}
  `;
  const group = groups[0];
  if (!group) return 'not_found';
  await sql`
    delete from group_members where group_id = ${group.id} and user_id = ${userId}
  `;
  return 'ok';
}
