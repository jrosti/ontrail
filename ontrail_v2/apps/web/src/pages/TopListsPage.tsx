import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { getLeaderboard, listSports } from '../api';
import { Avatar } from '../components/ui/Avatar';
import { Card } from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';
import { I18N } from '../i18n';
import { useStore } from '../store';
import type { LeaderboardEntry } from '../types';
import { fmtDistKm, fmtDur } from '../utils/format';

type Period = 'month' | 'year';
type SortKey = 'rank' | 'distance' | 'duration' | 'sessions';
type SortDir = 'asc' | 'desc';

function SortHeader({
  label,
  sortKey,
  current,
  dir,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  current: SortKey;
  dir: SortDir;
  onSort: (k: SortKey) => void;
}) {
  const active = current === sortKey;
  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      style={{
        background: 'none',
        border: 0,
        cursor: 'pointer',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        color: active ? 'var(--accent)' : 'var(--text-faint)',
        fontWeight: active ? 700 : 600,
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
      }}
    >
      {label}
      {active && (
        <Icon
          name="chevron"
          size={11}
          style={{ transform: dir === 'asc' ? 'rotate(-90deg)' : 'rotate(90deg)', opacity: 0.7 }}
        />
      )}
    </button>
  );
}

export function TopListsPage() {
  const { lang } = useStore();
  const t = I18N[lang];
  const [period, setPeriod] = useState<Period>('month');
  const [sport, setSport] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const { data: sports } = useQuery({ queryKey: ['sports'], queryFn: listSports });

  const { data: items, isLoading } = useQuery({
    queryKey: ['leaderboard', period, sport],
    queryFn: () => getLeaderboard(period, sport || undefined),
  });

  const sorted = useMemo(() => {
    const list = [...(items ?? [])];
    const mul = sortDir === 'asc' ? 1 : -1;
    list.sort((a, b) => {
      if (sortKey === 'distance') return (a.totalDistanceM - b.totalDistanceM) * mul;
      if (sortKey === 'duration') return (a.totalDurationSec - b.totalDurationSec) * mul;
      if (sortKey === 'sessions') return (a.sessionCount - b.sessionCount) * mul;
      return (a.rank - b.rank) * mul; // rank: asc = best first
    });
    return list;
  }, [items, sortKey, sortDir]);

  function handleSort(k: SortKey) {
    if (k === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(k);
      // default direction: rank/sessions = asc best; distance/duration = desc best
      setSortDir(k === 'rank' ? 'asc' : 'desc');
    }
  }

  const periodLabel =
    period === 'month'
      ? lang === 'fi'
        ? 'Tämä kuukausi'
        : 'This month'
      : lang === 'fi'
        ? 'Tämä vuosi'
        : 'This year';

  return (
    <div className="ot-page">
      <div className="ot-page-head">
        <div>
          <h1 className="ot-page-title">{lang === 'fi' ? 'Toplistat' : 'Top lists'}</h1>
          <div className="ot-page-sub">{periodLabel}</div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="ot-scope">
            {(['month', 'year'] as const).map((p) => (
              <button
                type="button"
                key={p}
                className={`ot-scope-btn${period === p ? ' active' : ''}`}
                onClick={() => setPeriod(p)}
              >
                {p === 'month' ? t.month : t.year}
              </button>
            ))}
          </div>
          <select
            className="ot-input"
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            style={{ width: 'auto', minWidth: 140, padding: '7px 10px', fontSize: 13 }}
          >
            <option value="">{lang === 'fi' ? 'Kaikki lajit' : 'All sports'}</option>
            {(sports ?? []).map((s) => (
              <option key={s.key} value={s.key}>
                {lang === 'fi' ? s.nameFi : s.nameEn}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && (
        <div style={{ color: 'var(--text-faint)', textAlign: 'center', padding: '40px 0' }}>…</div>
      )}

      {!isLoading && sorted.length === 0 && (
        <Card style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-faint)' }}>
          <Icon name="bolt" size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
          <div>{t.noExercises}</div>
        </Card>
      )}

      {!isLoading && sorted.length > 0 && (
        <Card style={{ overflow: 'hidden', padding: 0 }}>
          {/* Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '40px 1fr 100px 100px 70px',
              gap: 0,
              padding: '10px 16px',
              borderBottom: '1px solid var(--border)',
              background: 'var(--surface-2)',
            }}
          >
            <SortHeader
              label="#"
              sortKey="rank"
              current={sortKey}
              dir={sortDir}
              onSort={handleSort}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text-faint)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {lang === 'fi' ? 'Henkilö' : 'Athlete'}
            </span>
            <div style={{ textAlign: 'right' }}>
              <SortHeader
                label={lang === 'fi' ? 'Matka' : 'Dist.'}
                sortKey="distance"
                current={sortKey}
                dir={sortDir}
                onSort={handleSort}
              />
            </div>
            <div style={{ textAlign: 'right' }}>
              <SortHeader
                label={lang === 'fi' ? 'Aika' : 'Time'}
                sortKey="duration"
                current={sortKey}
                dir={sortDir}
                onSort={handleSort}
              />
            </div>
            <div style={{ textAlign: 'right' }}>
              <SortHeader
                label={lang === 'fi' ? 'Kertaa' : 'Sess.'}
                sortKey="sessions"
                current={sortKey}
                dir={sortDir}
                onSort={handleSort}
              />
            </div>
          </div>

          {/* Rows */}
          {sorted.map((entry, i) => (
            <TopListRow key={entry.userId} entry={entry} lang={lang} even={i % 2 === 1} />
          ))}
        </Card>
      )}
    </div>
  );
}

function TopListRow({
  entry,
  lang,
  even,
}: {
  entry: LeaderboardEntry;
  lang: 'fi' | 'en';
  even: boolean;
}) {
  return (
    <Link
      to="/user/$username"
      params={{ username: entry.username }}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      <div className={`ot-toplists-row${even ? ' even' : ''}`}>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 15,
            color: rankColor(entry.rank),
            textAlign: 'center',
          }}
        >
          {entry.rank <= 3 ? rankMedal(entry.rank) : entry.rank}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <Avatar initials={entry.avatarInitials} color={entry.avatarColor} size={32} />
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontWeight: 600,
                fontSize: 14,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {entry.displayName}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>@{entry.username}</div>
          </div>
        </div>

        <span style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontSize: 13 }}>
          {entry.totalDistanceM > 0 ? `${fmtDistKm(entry.totalDistanceM, lang)} km` : '—'}
        </span>
        <span style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontSize: 13 }}>
          {fmtDur(entry.totalDurationSec)}
        </span>
        <span style={{ textAlign: 'right', fontWeight: 600, fontSize: 14 }}>
          {entry.sessionCount}
        </span>
      </div>
    </Link>
  );
}

function rankColor(rank: number): string {
  if (rank === 1) return '#f5a623';
  if (rank === 2) return '#9b9b9b';
  if (rank === 3) return '#a05c3a';
  return 'var(--text-faint)';
}

function rankMedal(rank: number): string {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return String(rank);
}
