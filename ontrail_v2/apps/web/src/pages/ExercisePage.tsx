import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Icon } from '../components/ui/Icon';
import { SportBadge } from '../components/ui/SportBadge';
import { LeafletMap } from '../components/charts/LeafletMap';
import { useStore } from '../store';
import { I18N } from '../i18n';
import { SPORTS } from '../sports';
import { getExercise, addComment, deleteExercise, addCare, removeCare } from '../api';
import { durShort, fmtDistKm, calcPace, fmtSpeed, fmtPace, relDay } from '../utils/format';
import type { Comment } from '../types';

export function ExercisePage() {
  const { id } = useParams({ from: '/exercise/$id' });
  const { lang, currentUser } = useStore();
  const t = I18N[lang];
  const nav = useNavigate();
  const qc = useQueryClient();

  const { data: ex, isLoading } = useQuery({
    queryKey: ['exercise', id],
    queryFn: () => getExercise(id),
  });

  const [commentText, setCommentText] = useState('');
  const [liked, setLiked] = useState(false);

  const commentMut = useMutation({
    mutationFn: () => addComment(id, commentText),
    onSuccess: () => {
      setCommentText('');
      qc.invalidateQueries({ queryKey: ['exercise', id] });
    },
  });

  const deleteMut = useMutation({
    mutationFn: () => deleteExercise(id),
    onSuccess: () => nav({ to: '/feed', search: {} }),
  });

  const careMut = useMutation({
    mutationFn: () => (liked ? removeCare(id) : addCare(id)),
    onMutate: () => setLiked((v) => !v),
    onError: () => setLiked((v) => !v),
  });

  if (isLoading)
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-faint)' }}>…</div>
    );
  if (!ex)
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-faint)' }}>
        Not found
      </div>
    );

  const sport = SPORTS[ex.sport];
  const color = sport?.color ?? 'var(--accent)';
  const km = ex.distanceM ? ex.distanceM / 1000 : 0;
  const pace = ex.distanceM ? calcPace(ex.durationSec, ex.distanceM) : 0;
  const showSpeed = sport?.metric === 'speed';
  const paceVal = showSpeed
    ? fmtSpeed(ex.distanceM!, ex.durationSec, lang)
    : pace
      ? fmtPace(pace)
      : '—';
  const paceUnit = showSpeed ? t.kmh : t.minkm;
  const cares = ex.careCount + (liked ? 1 : 0);
  const isOwner = currentUser?.username === ex.ownerUsername;

  return (
    <div className="ot-detail-wrap">
      <div className="ot-detail-hero">
        <button className="ot-back" onClick={() => nav({ to: '/feed', search: {} })}>
          <Icon name="chevron" size={18} style={{ transform: 'rotate(180deg)' }} />
          {t.back}
        </button>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginTop: 16,
            flexWrap: 'wrap',
          }}
        >
          <SportBadge sport={ex.sport} lang={lang} />
          <span
            style={{ color: 'var(--text-faint)', fontSize: 13, fontFamily: 'var(--font-mono)' }}
          >
            {new Date(ex.date).toLocaleDateString(lang === 'fi' ? 'fi-FI' : 'en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </span>
          {isOwner && (
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <button
                className="ot-iconbtn"
                onClick={() => nav({ to: '/log', search: { id: ex.id } })}
                title={t.editExercise}
              >
                <Icon name="edit" size={16} />
              </button>
              <button
                className="ot-iconbtn"
                onClick={() => {
                  if (confirm(t.confirmDelete)) deleteMut.mutate();
                }}
                title={t.deleteExercise}
                style={{ color: 'oklch(0.66 0.20 28)' }}
              >
                <Icon name="trash" size={16} />
              </button>
            </div>
          )}
        </div>
        <h1 className="ot-detail-title">{ex.title}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar initials={ex.ownerInitials} color={ex.ownerColor} size={32} />
          <span style={{ fontWeight: 600 }}>{ex.ownerDisplayName}</span>
          <span style={{ color: 'var(--text-faint)' }}>@{ex.ownerUsername}</span>
          <span style={{ color: 'var(--text-faint)', fontSize: 13 }}>
            · {relDay(ex.date, lang)}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Card
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'clamp(18px, 4vw, 40px)',
            alignItems: 'center',
          }}
        >
          {km > 0 && (
            <StatPill
              icon="route"
              label={t.distance}
              value={fmtDistKm(ex.distanceM!, lang)}
              unit="km"
            />
          )}
          <StatPill icon="clock" label={t.time} value={durShort(ex.durationSec)} />
          {sport?.metric !== 'time' && sport?.metric !== 'reps' && (
            <StatPill icon="bolt" label={t.pace} value={paceVal} unit={paceUnit} accent />
          )}
          {ex.avgHr && <StatPill icon="heart" label={t.avgHr} value={ex.avgHr} unit={t.bpm} />}
          {ex.climbM && <StatPill icon="arrowUp" label={t.climb} value={ex.climbM} unit="m" />}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
            <button className={'ot-act' + (liked ? ' liked' : '')} onClick={() => careMut.mutate()}>
              <Icon name={liked ? 'heart-f' : 'heart'} size={18} />
              <span>{cares}</span>
            </button>
          </div>
        </Card>

        {km > 0 &&
          ex.gpxPoints &&
          ex.gpxPoints.length >= 2 &&
          !['gym', 'floor'].includes(ex.sport) && (
            <Card pad={false} style={{ overflow: 'hidden', borderRadius: 'var(--radius)' }}>
              <LeafletMap points={ex.gpxPoints} height={340} accent={color} rounded={0} />
            </Card>
          )}

        {ex.body && (
          <Card style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="ot-detail-desc" dangerouslySetInnerHTML={{ __html: ex.body }} />
            {ex.tags.length > 0 && (
              <div className="ot-tags">
                {ex.tags.map((tag) => (
                  <span key={tag} className="ot-tag">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </Card>
        )}

        <Card style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h4 className="ot-panel-title">
            {lang === 'fi' ? 'Kommentit' : 'Comments'} · {ex.commentCount}
          </h4>
          {ex.comments.length === 0 && (
            <div style={{ color: 'var(--text-faint)', fontSize: 13 }}>{t.noComments}</div>
          )}
          {ex.comments.map((c: Comment) => (
            <div key={c.id} style={{ display: 'flex', gap: 12 }}>
              <Avatar initials={c.avatarInitials} color={c.avatarColor} size={36} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                  <b style={{ fontSize: 14 }}>{c.displayName}</b>
                  <span
                    style={{
                      color: 'var(--text-faint)',
                      fontSize: 12,
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {relDay(c.createdAt, lang)}
                  </span>
                </div>
                <p
                  style={{
                    margin: '4px 0 0',
                    color: 'var(--text-dim)',
                    fontSize: 14,
                    lineHeight: 1.5,
                  }}
                >
                  {c.body}
                </p>
              </div>
            </div>
          ))}
          {currentUser && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Avatar
                initials={currentUser.avatarInitials}
                color={currentUser.avatarColor}
                size={36}
              />
              <input
                className="ot-comment-input"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && commentText.trim()) commentMut.mutate();
                }}
                placeholder={t.commentPlaceholder}
              />
              <button
                className="ot-comment-send"
                disabled={!commentText.trim()}
                onClick={() => commentMut.mutate()}
              >
                <Icon name="forward" size={18} />
              </button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function StatPill({
  icon,
  value,
  unit,
  label,
  accent,
}: {
  icon: string;
  value: string | number;
  unit?: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="ot-statpill">
      <div className="ot-statpill-top">
        <Icon name={icon} size={15} stroke={2} style={{ color: 'var(--text-faint)' }} />
        <span className="ot-statpill-label">{label}</span>
      </div>
      <div className="ot-statpill-v" style={{ color: accent ? 'var(--accent)' : 'var(--text)' }}>
        {value}
        {unit && <span className="ot-statpill-u">{unit}</span>}
      </div>
    </div>
  );
}
