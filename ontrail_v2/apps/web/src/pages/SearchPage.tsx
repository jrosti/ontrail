import { useQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import { ExerciseCard } from '../components/exercise/ExerciseCard';
import { Card } from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';
import { useStore } from '../store';
import { I18N } from '../i18n';
import { search } from '../api';

export function SearchPage() {
  const { lang } = useStore();
  const t = I18N[lang];
  const s = useSearch({ from: '/search' });
  const q = s.q ?? '';

  const { data, isLoading } = useQuery({
    queryKey: ['search', q],
    queryFn: () => search(q),
    enabled: !!q,
  });

  return (
    <div className="ot-page">
      <div className="ot-page-head">
        <div>
          <h1 className="ot-page-title">{t.search}</h1>
          {q && <div className="ot-page-sub">"{q}"</div>}
        </div>
      </div>

      {isLoading && (
        <div style={{ color: 'var(--text-faint)', textAlign: 'center', padding: '40px 0' }}>…</div>
      )}

      {!isLoading && data?.items.length === 0 && (
        <Card style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-faint)' }}>
          <Icon name="search" size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
          <div>{t.noExercises}</div>
        </Card>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {data?.items.map((ex) => (
          <ExerciseCard key={ex.id} exercise={ex} />
        ))}
      </div>
    </div>
  );
}
