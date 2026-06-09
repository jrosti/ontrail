import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';
import { Metric } from '../components/ui/Metric';
import { Donut, Heatmap, LineChart } from '../components/charts/Charts';
import { SportGlyph } from '../components/ui/SportGlyph';
import { useStore } from '../store';
import { I18N } from '../i18n';
import { SPORTS, sportName } from '../sports';
import { getYearSummary, getMonthSummaries, getWeekSummaries } from '../api';
import type { YearSportSummary } from '../types';

export function AnalyticsPage() {
  const { lang, currentUser } = useStore();
  const t = I18N[lang];
  const [scope, setScope] = useState<'all' | 'year' | 'month' | 'week'>('year');
  const year = new Date().getFullYear();
  const username = currentUser?.username ?? '';

  const { data: yearItems } = useQuery({
    queryKey: ['yearSummary', username, year],
    queryFn: () => getYearSummary(username, year),
    enabled: !!username,
  });

  const { data: monthSummaries } = useQuery({
    queryKey: ['monthSummaries', username, year],
    queryFn: () => getMonthSummaries(username, year),
    enabled: !!username,
  });

  const { data: weekSummaries } = useQuery({
    queryKey: ['weekSummaries', username, year],
    queryFn: () => getWeekSummaries(username, year),
    enabled: !!username,
  });

  if (!currentUser) return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-faint)' }}>
      <Icon name="analytics" size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
      <div style={{ fontSize: 18, fontWeight: 600 }}>{t.login}</div>
    </div>
  );

  const items: YearSportSummary[] = yearItems ?? [];
  const totalDurationSec = items.reduce((s, r) => s + r.totalDurationSec, 0);
  const totalDistanceM = items.reduce((s, r) => s + r.totalDistanceM, 0);
  const totalSessions = items.reduce((s, r) => s + r.sessionCount, 0);
  const totalClimbM = items.reduce((s, r) => s + r.totalClimbM, 0);

  const kmTotal = totalDistanceM > 0 ? (totalDistanceM / 1000).toFixed(0) : '—';
  const hrTotal = totalDurationSec > 0 ? `${Math.floor(totalDurationSec / 3600)} h` : '—';

  const sportDonut = items.map(sp => ({
    label: sportName(sp.sport, lang),
    color: SPORTS[sp.sport]?.color ?? 'var(--accent)',
    value: sp.sessionCount,
  })).sort((a, b) => b.value - a.value);

  const monthMap: Record<number, number> = {};
  for (const m of (monthSummaries ?? [])) {
    monthMap[m.month] = (monthMap[m.month] ?? 0) + m.totalDistanceM;
  }
  const monthKm = Array.from({ length: 12 }, (_, i) => (monthMap[i + 1] ?? 0) / 1000);
  const monthLabels = ['Tam', 'Hel', 'Maa', 'Huh', 'Tou', 'Kes', 'Hei', 'Elo', 'Syy', 'Lok', 'Mar', 'Jou'];

  const weekMap: Record<number, number> = {};
  for (const w of (weekSummaries ?? [])) {
    weekMap[w.week] = (weekMap[w.week] ?? 0) + w.totalDurationSec;
  }
  const hm = Array.from({ length: 26 }, (_, i) => {
    const val = weekMap[i + 1] ?? 0;
    return Array.from({ length: 7 }, () => val > 0 ? Math.min(100, Math.round(val / 3600 * 10)) : 0);
  });

  const hasHrProfile = !!(currentUser.restHr || currentUser.maxHr);

  return (
    <div className="ot-page">
      <div className="ot-page-head">
        <div>
          <h1 className="ot-page-title">{t.analytics}</h1>
          <div className="ot-page-sub">{currentUser.displayName} · {year}</div>
        </div>
        <div className="ot-scope">
          {(['all', 'year', 'month', 'week'] as const).map(k => (
            <button key={k} className={'ot-scope-btn' + (scope === k ? ' active' : '')} onClick={() => setScope(k)}>
              {t[k]}
            </button>
          ))}
        </div>
      </div>

      <div className="ot-summary-row">
        <Metric value={kmTotal} unit="km" label={t.distance} big />
        <Metric value={hrTotal} label={t.duration} big />
        <Metric value={totalSessions > 0 ? totalSessions : '—'} label={t.sessions} big />
        <Metric value={totalClimbM > 0 ? totalClimbM.toLocaleString() : '—'} unit="m" label={t.climb} big />
      </div>

      <div className="ot-analytics-grid">
        <Panel span={4} title={t.sportBreakdown}>
          {sportDonut.length > 0 ? (
            <div style={{ display: 'flex', gap: 22, alignItems: 'center', flexWrap: 'wrap' }}>
              <Donut data={sportDonut} size={170} thickness={24} centerLabel={totalSessions} centerSub={t.sessions} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1, minWidth: 120 }}>
                {sportDonut.map(d => (
                  <div key={d.label} className="ot-legend-row">
                    <span className="ot-legend-dot" style={{ background: d.color }} />
                    <span className="ot-legend-label">{d.label}</span>
                    <span className="ot-legend-val">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : <div style={{ color: 'var(--text-faint)', fontSize: 13 }}>{t.noExercises}</div>}
        </Panel>

        <Panel span={8} title={t.distanceTrend}>
          {monthKm.some(v => v > 0) ? (
            <LineChart height={210}
              series={[{ data: monthKm, color: 'var(--accent)' }]}
              xTicks={monthLabels} yFmt={v => Math.round(v).toString()} />
          ) : <div style={{ color: 'var(--text-faint)', fontSize: 13 }}>{t.noExercises}</div>}
        </Panel>

        <Panel span={5} title={t.hrZones}>
          {hasHrProfile ? (
            <div style={{ color: 'var(--text-faint)', fontSize: 13 }}>
              {lang === 'fi' ? 'Sykealuedata lasketaan harjoituksista.' : 'HR zone data calculated from workouts.'}
            </div>
          ) : (
            <div style={{ color: 'var(--text-faint)', fontSize: 13 }}>
              {lang === 'fi'
                ? 'Syketiedot saatavilla kun lisäät HR-profiilin'
                : 'HR data available after setting up your HR profile'}
            </div>
          )}
        </Panel>

        <Panel span={7} title={t.consistency} sub={lang === 'fi' ? '26 viikkoa' : 'Last 26 weeks'}>
          <Heatmap weeks={hm} />
        </Panel>

        {items.length > 0 && (
          <Panel span={12} title={t.sportSummary}>
            <div className="ot-table">
              <div className="ot-tr ot-th">
                <span>{lang === 'fi' ? 'Laji' : 'Sport'}</span>
                <span>{t.distance}</span>
                <span>{t.time}</span>
                <span>{t.hr}</span>
                <span>{t.climb}</span>
                <span>{lang === 'fi' ? 'Kerrat' : 'Sessions'}</span>
              </div>
              {items.map((r, i) => (
                <div key={i} className="ot-tr ot-td">
                  <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <span className="ot-table-dot" style={{ background: SPORTS[r.sport]?.color ?? 'var(--accent)' }} />
                    <SportGlyph sport={r.sport} size={14} />
                    {sportName(r.sport, lang)}
                  </span>
                  <span>{r.totalDistanceM ? `${(r.totalDistanceM / 1000).toFixed(1)} km` : '—'}</span>
                  <span>{r.totalDurationSec ? `${Math.floor(r.totalDurationSec / 3600)} h` : '—'}</span>
                  <span>{r.avgHr ?? '—'}</span>
                  <span>{r.totalClimbM ? `${r.totalClimbM} m` : '—'}</span>
                  <span style={{ fontWeight: 600 }}>{r.sessionCount}</span>
                </div>
              ))}
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}

function Panel({ title, sub, children, span }: { title: string; sub?: string; children: React.ReactNode; span?: number }) {
  return (
    <Card style={{ display: 'flex', flexDirection: 'column', gap: 14, gridColumn: span ? `span ${span}` : 'auto' }}>
      <div>
        <h4 className="ot-panel-title">{title}</h4>
        {sub && <div className="ot-panel-sub">{sub}</div>}
      </div>
      {children}
    </Card>
  );
}
