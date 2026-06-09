import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { ExerciseCard } from '../components/exercise/ExerciseCard';
import { Avatar } from '../components/ui/Avatar';
import { Card } from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';
import { useStore } from '../store';
import { I18N } from '../i18n';
import { listExercises, getUser } from '../api';

export function DiaryPage() {
  const { username } = useParams({ from: '/diary/$username' });
  const { lang } = useStore();
  const t = I18N[lang];

  const { data: user } = useQuery({
    queryKey: ['user', username],
    queryFn: () => getUser(username),
  });

  const { data: exercises, isLoading } = useQuery({
    queryKey: ['exercises', 'user', username],
    queryFn: () => listExercises({ user: username, perPage: 50 }),
  });

  return (
    <div className="ot-page">
      {user && (
        <Card style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 }}>
          <Avatar initials={user.avatarInitials} color={user.avatarColor} size={64} />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22 }}>{user.displayName}</div>
            <div style={{ color: 'var(--text-faint)', fontSize: 14, marginTop: 2 }}>@{user.username}</div>
            {user.synopsis && <div style={{ color: 'var(--text-dim)', fontSize: 14, marginTop: 4 }}>{user.synopsis}</div>}
          </div>
        </Card>
      )}

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
    </div>
  );
}
