import { useInfiniteQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import { Link, useSearch } from '@tanstack/react-router';
import { ExerciseCard } from '../components/exercise/ExerciseCard';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Icon } from '../components/ui/Icon';
import { useStore } from '../store';
import { I18N } from '../i18n';
import { listExercises } from '../api';

export function FeedPage() {
  const { lang, currentUser } = useStore();
  const t = I18N[lang];
  const search = useSearch({ from: '/feed' });
  const parentRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['exercises', search],
    queryFn: ({ pageParam = 1 }) =>
      listExercises({ page: pageParam as number, perPage: 20, tag: search.tag, sport: search.sport, user: search.user }),
    getNextPageParam: (last) => last.page * last.perPage < last.total ? last.page + 1 : undefined,
    initialPageParam: 1,
  });

  const allItems = data?.pages.flatMap(p => p.items) ?? [];

  const virtualizer = useVirtualizer({
    count: allItems.length + (hasNextPage ? 1 : 0),
    getScrollElement: () => parentRef.current,
    estimateSize: () => 300,
    overscan: 3,
  });

  return (
    <div className="ot-grid-3">
      <aside className="ot-col-left">
        <ProfileSidebar />
      </aside>

      <main className="ot-col-mid" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Composer />

        {search.tag && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--text-faint)', fontSize: 13 }}>#{search.tag}</span>
            <Link to="/feed" search={{}} style={{ fontSize: 12, color: 'var(--accent)' }}>× {t.all}</Link>
          </div>
        )}

        {isLoading && <LoadingSkeleton />}

        <div ref={parentRef} style={{ position: 'relative' }}>
          <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
            {virtualizer.getVirtualItems().map(vItem => {
              const ex = allItems[vItem.index];
              if (!ex) {
                if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                return (
                  <div key="load-more" style={{ transform: `translateY(${vItem.start}px)`, position: 'absolute', width: '100%', paddingBottom: 18 }}>
                    <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-faint)', fontSize: 13 }}>
                      {isFetchingNextPage ? '…' : t.loadMore}
                    </div>
                  </div>
                );
              }
              return (
                <div key={ex.id} style={{ transform: `translateY(${vItem.start}px)`, position: 'absolute', width: '100%', paddingBottom: 18 }}
                  ref={virtualizer.measureElement} data-index={vItem.index}>
                  <ExerciseCard exercise={ex} />
                </div>
              );
            })}
          </div>
        </div>

        {!isLoading && allItems.length === 0 && (
          <Card style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-faint)' }}>
            <Icon name="feed" size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            <div>{t.noExercises}</div>
            {currentUser && (
              <Link to="/log" search={{}} style={{ color: 'var(--accent)', marginTop: 12, display: 'inline-block', fontWeight: 600 }}>
                {t.logTitle}
              </Link>
            )}
          </Card>
        )}
      </main>

      <aside className="ot-col-right">
        <RightRail />
      </aside>
    </div>
  );
}

function Composer() {
  const { lang, currentUser } = useStore();
  const t = I18N[lang];
  return (
    <Card style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {currentUser && <Avatar initials={currentUser.avatarInitials} color={currentUser.avatarColor} size={40} />}
      <Link to="/log" search={{}} className="ot-composer-input" style={{ display: 'flex', alignItems: 'center' }}>
        {t.composer}
      </Link>
      <Link to="/log" search={{}} className="ot-composer-go" aria-label={t.composer}>
        <Icon name="plus" size={18} stroke={2.4} />
      </Link>
    </Card>
  );
}

function ProfileSidebar() {
  const { lang, currentUser } = useStore();
  const t = I18N[lang];
  if (!currentUser) return (
    <Card style={{ textAlign: 'center', padding: '24px 18px' }}>
      <Icon name="user" size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
      <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600, display: 'block' }}>{t.login}</Link>
    </Card>
  );
  return (
    <Card pad={false} style={{ overflow: 'hidden', position: 'sticky', top: 'calc(var(--nav-h) + 18px)' }}>
      <div className="ot-profile-cover">
        <Avatar initials={currentUser.avatarInitials} color={currentUser.avatarColor} size={64} ring />
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 20, color: '#fff', lineHeight: 1.1 }}>
            {currentUser.displayName}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 2 }}>@{currentUser.username}</div>
        </div>
      </div>
      <div className="ot-profile-nav">
        <Link to="/feed" search={{}} className="ot-pnav"
          activeProps={{ className: 'ot-pnav active' }} inactiveProps={{ className: 'ot-pnav' }}>
          <Icon name="feed" size={17} /><span>{t.activities}</span>
        </Link>
        <Link to="/analytics" className="ot-pnav"
          activeProps={{ className: 'ot-pnav active' }} inactiveProps={{ className: 'ot-pnav' }}>
          <Icon name="analytics" size={17} /><span>{t.analytics}</span>
        </Link>
        <Link to="/calendar" className="ot-pnav"
          activeProps={{ className: 'ot-pnav active' }} inactiveProps={{ className: 'ot-pnav' }}>
          <Icon name="calendar" size={17} /><span>{t.calendar}</span>
        </Link>
        <Link to="/diary/$username" params={{ username: currentUser.username }} className="ot-pnav">
          <Icon name="user" size={17} /><span>{t.myDiary}</span>
        </Link>
      </div>
    </Card>
  );
}

function RightRail() {
  const { lang } = useStore();
  const t = I18N[lang];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, position: 'sticky', top: 'calc(var(--nav-h) + 18px)' }}>
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="ot-rail-hd">
          <Icon name="bolt" size={16} stroke={2.2} style={{ color: 'var(--accent)' }} />
          {t.thisWeek}
        </div>
        <div style={{ color: 'var(--text-faint)', fontSize: 13 }}>
          {t.noExercises}
        </div>
      </Card>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ height: 200, borderRadius: 'var(--radius)', background: 'var(--surface-2)', animation: 'pulse 1.5s infinite' }} />
      ))}
    </div>
  );
}
