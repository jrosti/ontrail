import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Avatar } from '../ui/Avatar';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { Metric } from '../ui/Metric';
import { SportBadge } from '../ui/SportBadge';
import { LeafletMap } from '../charts/LeafletMap';
import { useStore } from '../../store';
import { I18N } from '../../i18n';
import { SPORTS } from '../../sports';
import { durShort, fmtDistanceKm, calcPace, calcSpeed, fmtPace, relDay } from '../../utils/format';
import { downsample } from '../../utils/gpx';
import type { ExerciseListItem } from '../../types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addCare, removeCare } from '../../api';

interface ExerciseCardProps {
  exercise: ExerciseListItem;
  layout?: 'cards' | 'compact';
}

export function ExerciseCard({ exercise: ex, layout = 'cards' }: ExerciseCardProps) {
  const { lang } = useStore();
  const t = I18N[lang];
  const compact = layout === 'compact';
  const sport = SPORTS[ex.sport];
  const color = sport?.color ?? 'var(--accent)';
  const qc = useQueryClient();

  const [liked, setLiked] = useState(false);
  const cares = ex.careCount + (liked ? 1 : 0);

  const careMut = useMutation({
    mutationFn: () => liked ? removeCare(ex.id) : addCare(ex.id),
    onMutate: () => setLiked(v => !v),
    onError: () => setLiked(v => !v),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['exercises'] }),
  });

  const km = ex.distanceM ? ex.distanceM / 1000 : 0;
  const pace = ex.distanceM ? calcPace(ex.durationSec, ex.distanceM) : 0;
  const speed = ex.distanceM ? calcSpeed(ex.durationSec, ex.distanceM) : 0;
  const showSpeed = sport?.metric === 'speed';
  const showDistance = sport?.metric !== 'reps';
  const paceVal = showSpeed ? speed.toFixed(1) : (pace ? fmtPace(pace) : '—');
  const paceUnit = showSpeed ? t.kmh : t.minkm;

  const metricRow = (
    <div className="ot-metric-row">
      {showDistance && km > 0 && <Metric value={fmtDistanceKm(ex.distanceM!)} unit="km" label={t.distance} />}
      <Metric value={durShort(ex.durationSec)} label={t.time} />
      {sport?.metric !== 'time' && sport?.metric !== 'reps' && <Metric value={paceVal} unit={paceUnit} label={t.pace} accent />}
      {ex.avgHr && <Metric value={ex.avgHr} unit={t.bpm} label={t.avgHr} />}
    </div>
  );

  const actions = (
    <div className="ot-actions" style={{ gap: compact ? 14 : 22 }}>
      <button className={'ot-act' + (liked ? ' liked' : '')}
        onClick={e => { e.preventDefault(); e.stopPropagation(); careMut.mutate(); }}>
        <Icon name={liked ? 'heart-f' : 'heart'} size={18} /><span>{cares}</span>
      </button>
      <Link to="/exercise/$id" params={{ id: ex.id }} onClick={e => e.stopPropagation()}
        className="ot-act">
        <Icon name="comment" size={18} /><span>{ex.commentCount}{compact ? '' : ` ${t.comments}`}</span>
      </Link>
    </div>
  );

  if (compact) {
    return (
      <Card hover>
        <Link to="/exercise/$id" params={{ id: ex.id }} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <Avatar initials={ex.ownerInitials} color={ex.ownerColor} size={38} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600 }}>{ex.title}</div>
              <div style={{ color: 'var(--text-faint)', fontSize: 12.5, marginTop: 2 }}>
                {ex.ownerDisplayName} · {relDay(ex.date, lang)}
              </div>
            </div>
            <SportBadge sport={ex.sport} lang={lang} size="sm" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 }}>
            {metricRow}{actions}
          </div>
        </Link>
      </Card>
    );
  }

  return (
    <Card style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="ot-card-head">
        <Avatar initials={ex.ownerInitials} color={ex.ownerColor} size={44} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Link to="/diary/$username" params={{ username: ex.ownerUsername }}
              style={{ fontWeight: 600, color: 'var(--text)' }}>
              {ex.ownerDisplayName}
            </Link>
            <span style={{ color: 'var(--text-faint)', fontSize: 13 }}>· {relDay(ex.date, lang)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
            <SportBadge sport={ex.sport} lang={lang} size="sm" />
          </div>
        </div>
      </div>

      <Link to="/exercise/$id" params={{ id: ex.id }}
        className="ot-card-title" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(17px, 2.4vw, 21px)' }}>
        {ex.title}
      </Link>

      {metricRow}

      {km > 0 && ex.gpxPoints && ex.gpxPoints.length >= 2 && !['gym', 'floor'].includes(ex.sport) && (
        <Link to="/exercise/$id" params={{ id: ex.id }} style={{ display: 'block' }}>
          <LeafletMap
            points={downsample(ex.gpxPoints, 200)}
            height={200}
            accent={color}
            style={{ pointerEvents: 'none' }}
          />
        </Link>
      )}

      {ex.tags.length > 0 && (
        <div className="ot-tags">
          {ex.tags.map(tag => (
            <Link key={tag} to="/feed" search={{ tag }} className="ot-tag">#{tag}</Link>
          ))}
        </div>
      )}

      <div className="ot-card-foot">{actions}</div>
    </Card>
  );
}
