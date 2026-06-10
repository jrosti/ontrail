import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { useState } from 'react';
import { getSportSummary, getUser, listExercises } from '../api';
import { ExerciseCard } from '../components/exercise/ExerciseCard';
import { Avatar } from '../components/ui/Avatar';
import { Card } from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';
import { SportGlyph } from '../components/ui/SportGlyph';
import { I18N } from '../i18n';
import { sportName } from '../sports';
import { useStore } from '../store';

export function DiaryPage() {
  const { username } = useParams({ from: '/diary/$username' });
  const { lang } = useStore();
  const t = I18N[lang];
  const [sportFilter, setSportFilter] = useState<string | null>(null);

  const { data: user } = useQuery({
    queryKey: ['user', username],
    queryFn: () => getUser(username),
  });

  const { data: sportSummary } = useQuery({
    queryKey: ['sportSummary', username],
    queryFn: () => getSportSummary(username),
  });

  const userSports = (sportSummary ?? [])
    .sort((a, b) => b.sessionCount - a.sessionCount)
    .slice(0, 8)
    .map((s) => s.sport);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['exercises', 'user', username, sportFilter],
    queryFn: ({ pageParam = 1 }) =>
      listExercises({
        user: username,
        perPage: 50,
        page: pageParam as number,
        sport: sportFilter ?? undefined,
      }),
    getNextPageParam: (last) => (last.page * last.perPage < last.total ? last.page + 1 : undefined),
    initialPageParam: 1,
  });

  const allItems = data?.pages.flatMap((p) => p.items) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  return (
    <div className="ot-page">
      {user && (
        <Card style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 }}>
          <Avatar
            initials={user.avatarInitials}
            color={user.avatarColor}
            size={64}
            gravatarHash={user.gravatarHash}
          />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22 }}>
              {user.displayName}
            </div>
            <div style={{ color: 'var(--text-faint)', fontSize: 14, marginTop: 2 }}>
              @{user.username} · {total} {t.sessions}
            </div>
            {user.synopsis && (
              <div style={{ color: 'var(--text-dim)', fontSize: 14, marginTop: 4 }}>
                {user.synopsis}
              </div>
            )}
          </div>
        </Card>
      )}

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <button
          type="button"
          className={`ot-chip${sportFilter === null ? ' active' : ''}`}
          onClick={() => setSportFilter(null)}
        >
          {t.all}
        </button>
        {userSports.map((s) => (
          <button
            type="button"
            key={s}
            className={`ot-chip${sportFilter === s ? ' active' : ''}`}
            onClick={() => setSportFilter(s)}
            style={{ display: 'flex', alignItems: 'center', gap: 5 }}
          >
            <SportGlyph sport={s} size={13} />
            {sportName(s, lang)}
          </button>
        ))}
      </div>

      {isLoading && (
        <div style={{ color: 'var(--text-faint)', textAlign: 'center', padding: '40px 0' }}>…</div>
      )}

      {!isLoading && allItems.length === 0 && (
        <Card style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-faint)' }}>
          <Icon name="feed" size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
          <div>{t.noExercises}</div>
        </Card>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {allItems.map((ex) => (
          <ExerciseCard key={ex.id} exercise={ex} />
        ))}
      </div>

      {hasNextPage && (
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button
            type="button"
            className="ot-load-more"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? '…' : t.loadMore}
          </button>
        </div>
      )}
    </div>
  );
}
