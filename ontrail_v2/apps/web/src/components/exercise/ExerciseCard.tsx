import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import type React from 'react';
import { useState } from 'react';
import { addCare, removeCare } from '../../api';
import { I18N } from '../../i18n';
import { SPORTS } from '../../sports';
import { useStore } from '../../store';
import type { Care, ExerciseListItem } from '../../types';
import {
  calcPace,
  durShort,
  fmtDistKm,
  fmtPace,
  fmtSpeed,
  relDay,
  stripHtml,
} from '../../utils/format';
import { downsample } from '../../utils/gpx';
import { LeafletMap } from '../charts/LeafletMap';
import { RichViewer } from '../editor/RichViewer';
import { Avatar } from '../ui/Avatar';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { Metric } from '../ui/Metric';
import { SportBadge } from '../ui/SportBadge';
import { CareAvatars, EmojiPicker } from './CareUI';

interface ExerciseCardProps {
  exercise: ExerciseListItem;
  layout?: 'cards' | 'compact';
  groupFilter?: string;
}

export function ExerciseCard({ exercise: ex, layout = 'cards', groupFilter }: ExerciseCardProps) {
  const { lang, currentUser } = useStore();
  const t = I18N[lang];
  const compact = layout === 'compact';
  const sport = SPORTS[ex.sport];
  const color = sport?.color ?? 'var(--accent)';
  const qc = useQueryClient();

  const myUsername = currentUser?.username;
  const [localCares, setLocalCares] = useState<Care[]>(ex.cares);
  const myCare = localCares.find((c) => c.authorUsername === myUsername);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [bodyExpanded, setBodyExpanded] = useState(false);

  const bodyText = ex.body ? stripHtml(ex.body) : '';
  // Show the expand toggle only when the preview would actually be clipped.
  const bodyClipped = bodyText.length > 140;

  const careMut = useMutation({
    mutationFn: (emoji: string | null) =>
      emoji === null ? removeCare(ex.id) : addCare(ex.id, emoji),
    onSuccess: (data) => {
      setLocalCares(data.cares);
      setPickerOpen(false);
      qc.invalidateQueries({ queryKey: ['exercises'] });
      qc.invalidateQueries({ queryKey: ['exercise', ex.id] });
    },
  });

  const handleCareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (myCare) {
      careMut.mutate(null);
    } else {
      setPickerOpen((v) => !v);
    }
  };

  const handleEmojiPick = (emoji: string) => {
    careMut.mutate(emoji);
  };

  const careCount = localCares.length;
  const liked = Boolean(myCare);

  const km = ex.distanceM ? ex.distanceM / 1000 : 0;
  const pace = ex.distanceM ? calcPace(ex.durationCs, ex.distanceM) : 0;
  const showSpeed = sport?.metric === 'speed';
  const showDistance = sport?.metric !== 'reps';
  const paceVal = showSpeed
    ? fmtSpeed(ex.distanceM ?? 0, ex.durationCs, lang)
    : pace
      ? fmtPace(pace)
      : '—';
  const paceUnit = showSpeed ? t.kmh : t.minkm;

  const metricRow = (
    <div className="ot-metric-row">
      {showDistance && km > 0 && (
        <Metric value={fmtDistKm(ex.distanceM ?? 0, lang)} unit="km" label={t.distance} />
      )}
      <Metric value={durShort(ex.durationCs)} label={t.time} />
      {sport?.metric !== 'time' && sport?.metric !== 'reps' && (
        <Metric value={paceVal} unit={paceUnit} label={t.pace} accent />
      )}
      {ex.avgHr && <Metric value={ex.avgHr} unit={t.bpm} label={t.avgHr} />}
    </div>
  );

  const caresRow = (
    <div className="ot-cares-row">
      <div className="ot-care-btn-wrap">
        <button
          type="button"
          className={`ot-act${liked ? ' liked' : ''}`}
          onClick={handleCareClick}
          aria-pressed={liked}
          aria-label={liked ? `Poista kehusi (${myCare?.emoji})` : 'Kehui'}
        >
          <span className="ot-act-emoji">{myCare?.emoji ?? '❤️'}</span>
          <span>{careCount}</span>
        </button>
        {pickerOpen && (
          <EmojiPicker onPick={handleEmojiPick} onClose={() => setPickerOpen(false)} />
        )}
      </div>
      <CareAvatars cares={localCares} />
    </div>
  );

  const actions = (
    <div className="ot-actions" style={{ gap: compact ? 14 : 22 }}>
      {caresRow}
      <Link
        to="/exercise/$id"
        params={{ id: ex.id }}
        onClick={(e) => e.stopPropagation()}
        className="ot-act"
      >
        <Icon name="comment" size={18} />
        <span>
          {ex.commentCount}
          {compact ? '' : ` ${t.comments}`}
        </span>
      </Link>
    </div>
  );

  if (compact) {
    return (
      <Card hover style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Link
          to="/exercise/$id"
          params={{ id: ex.id }}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <Avatar
              initials={ex.ownerInitials}
              color={ex.ownerColor}
              size={38}
              gravatarHash={ex.ownerGravatarHash}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600 }}>{ex.title}</div>
              <div style={{ color: 'var(--text-faint)', fontSize: 12.5, marginTop: 2 }}>
                {ex.ownerDisplayName} · {relDay(ex.date, lang)}
              </div>
            </div>
            <SportBadge sport={ex.sport} lang={lang} size="sm" />
          </div>
        </Link>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: 12,
          }}
        >
          {metricRow}
          {actions}
        </div>
      </Card>
    );
  }

  return (
    <Card style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="ot-card-head">
        <Avatar
          initials={ex.ownerInitials}
          color={ex.ownerColor}
          size={44}
          gravatarHash={ex.ownerGravatarHash}
        />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Link
              to="/user/$username"
              params={{ username: ex.ownerUsername }}
              search={{ tab: undefined }}
              style={{ fontWeight: 600, color: 'var(--text)' }}
            >
              {ex.ownerDisplayName}
            </Link>
            <span style={{ color: 'var(--text-faint)', fontSize: 13 }}>
              · {relDay(ex.date, lang)}
            </span>
            {groupFilter && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--accent)',
                  background: 'color-mix(in oklab, var(--accent) 12%, transparent)',
                  borderRadius: 6,
                  padding: '2px 7px',
                }}
              >
                {groupFilter}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
            <SportBadge sport={ex.sport} lang={lang} size="sm" />
          </div>
        </div>
      </div>

      <Link
        to="/exercise/$id"
        params={{ id: ex.id }}
        className="ot-card-title"
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          fontSize: 'clamp(17px, 2.4vw, 21px)',
        }}
      >
        {ex.title}
      </Link>

      {bodyText && (
        <div className="ot-card-body">
          {bodyExpanded ? (
            <RichViewer html={ex.body ?? ''} className="ot-card-body-full" />
          ) : (
            <p className={`ot-card-body-preview${bodyClipped ? ' clipped' : ''}`}>{bodyText}</p>
          )}
          {bodyClipped && (
            <button
              type="button"
              className="ot-card-body-toggle"
              onClick={() => setBodyExpanded((v) => !v)}
            >
              {bodyExpanded ? t.showLess : t.showMore}
            </button>
          )}
        </div>
      )}

      {metricRow}

      {km > 0 &&
        ex.gpxPoints &&
        ex.gpxPoints.length >= 2 &&
        !['gym', 'floor'].includes(ex.sport) && (
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
          {ex.tags.map((tag) => (
            <Link key={tag} to="/feed" search={{ tag }} className="ot-tag">
              #{tag}
            </Link>
          ))}
        </div>
      )}

      <div className="ot-card-foot">{actions}</div>
    </Card>
  );
}
