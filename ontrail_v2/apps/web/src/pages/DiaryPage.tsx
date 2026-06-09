import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { ExerciseCard } from '../components/exercise/ExerciseCard';
import { Avatar } from '../components/ui/Avatar';
import { Card } from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';
import { SportGlyph } from '../components/ui/SportGlyph';
import { useStore } from '../store';
import { I18N } from '../i18n';
import { sportName } from '../sports';
import { listExercises, getUser } from '../api';

const TOP_SPORTS = ['run', 'bike', 'ski', 'walk', 'orient', 'gym'];

export function DiaryPage() {
  const { username } = useParams({ from: '/diary/$username' });
  const { lang } = useStore();
  const t = I18N[lang];
  const [sportFilter, setSportFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { data: user } = useQuery({
    queryKey: ['user', username],
    queryFn: () => getUser(username),
  });

  const { data: exercises, isLoading } = useQuery({
    queryKey: ['exercises', 'user', username, sportFilter, page],
    queryFn: () => listExercises({ user: username, perPage: 50, page, sport: sportFilter ?? undefined }),
  });

  const total = exercises?.total ?? 0;
  const loaded = (exercises?.items.length ?? 0) + (page - 1) * 50;
  const hasMore = loaded < total;

  return (
    <div className="ot-page">
      {user && (
        <Card style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 }}>
          <Avatar initials={user.avatarInitials} color={user.avatarColor} size={64} />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22 }}>{user.displayName}</div>
            <div style={{ color: 'var(--text-faint)', fontSize: 14, marginTop: 2 }}>
              @{user.username} · {total} {t.sessions}
            </div>
            {user.synopsis && <div style={{ color: 'var(--text-dim)', fontSize: 14, marginTop: 4 }}>{user.synopsis}</div>}
          </div>
        </Card>
      )}

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <button
          className={'ot-chip' + (sportFilter === null ? ' active' : '')}
          onClick={() => { setSportFilter(null); setPage(1); }}
        >
          {t.all}
        </button>
        {TOP_SPORTS.map(s => (
          <button
            key={s}
            className={'ot-chip' + (sportFilter === s ? ' active' : '')}
            onClick={() => { setSportFilter(s); setPage(1); }}
            style={{ display: 'flex', alignItems: 'center', gap: 5 }}
          >
            <SportGlyph sport={s} size={13} />
            {sportName(s, lang)}
          </button>
        ))}
      </div>

      {isLoading && <div style={{ color: 'var(--text-faint)', textAlign: 'center', padding: '40px 0' }}>…</div>}

      {!isLoading && exercises?.items.length === 0 && (
        <Card style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-faint)' }}>
          <Icon name="feed" size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
          <div>{t.noExercises}</div>
        </Card>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {exercises?.items.map(ex => (
          <ExerciseCard key={ex.id} exercise={ex} />
        ))}
      </div>

      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button className="ot-load-more" onClick={() => setPage(p => p + 1)}>
            {t.loadMore}
          </button>
        </div>
      )}
    </div>
  );
}
