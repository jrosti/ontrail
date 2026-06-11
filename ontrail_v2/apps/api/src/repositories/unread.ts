import { sql } from '../db/client';

export interface UnreadResult {
  commentCount: number;
  exerciseIds: string[];
}

export async function getUnread(userId: string): Promise<UnreadResult> {
  const rows = await sql<{ exercise_id: string; new_comment_count: number }[]>`
    select exercise_id::text, new_comment_count
    from v_unread_comments
    where watcher_id = ${userId}
    order by latest_comment_at desc
  `;
  return {
    exerciseIds: rows.map((r) => r.exercise_id),
    commentCount: rows.reduce((sum, r) => sum + r.new_comment_count, 0),
  };
}

export async function markAllRead(userId: string): Promise<void> {
  await sql`
    insert into user_visit (user_id, last_visit)
    values (${userId}, now())
    on conflict (user_id) do update set last_visit = now()
  `;
}
