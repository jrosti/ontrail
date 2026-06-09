import { sql } from '../db/client';

export interface UnreadResult {
  commentCount: number;
  exerciseIds: string[];
}

export async function getUnread(userId: string): Promise<UnreadResult> {
  // Get last visit time for the user (null means we show all)
  const visitRows = await sql<{ last_visit: string }[]>`
    select last_visit::text from user_visit where user_id = ${userId}
  `;
  const lastVisit = visitRows[0]?.last_visit ?? null;

  // Find exercises where user is author or commenter, with new comments since last visit
  const rows = await sql<{ exercise_id: string; new_comment_count: number }[]>`
    select
      e.id::text as exercise_id,
      count(c.id)::int as new_comment_count
    from exercises e
    join comments c on c.exercise_id = e.id
    where
      (
        e.owner_id = ${userId}
        or exists (
          select 1 from comments c2
          where c2.exercise_id = e.id and c2.author_id = ${userId}
        )
      )
      and (${lastVisit}::timestamptz is null or c.created_at > ${lastVisit}::timestamptz)
      and c.author_id != ${userId}
    group by e.id
    having count(c.id) > 0
    order by max(c.created_at) desc
  `;

  const exerciseIds = rows.map((r) => r.exercise_id);
  const commentCount = rows.reduce((sum, r) => sum + r.new_comment_count, 0);

  return { commentCount, exerciseIds };
}

export async function markAllRead(userId: string): Promise<void> {
  await sql`
    insert into user_visit (user_id, last_visit)
    values (${userId}, now())
    on conflict (user_id) do update set last_visit = now()
  `;
}
