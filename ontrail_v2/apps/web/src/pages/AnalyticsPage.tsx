import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';
import { Metric } from '../components/ui/Metric';
import { Donut, HRZonesBar, Heatmap, LineChart, ZONE_COLORS } from '../components/charts/Charts';
import { SportGlyph } from '../components/ui/SportGlyph';
import { useStore } from '../store';
import { I18N } from '../i18n';
import { SPORTS, sportName } from '../sports';
import { getYearSummary, getMonthSummaries } from '../api';

export function AnalyticsPage() {
  const { lang, currentUser } = useStore();
  const t = I18N[lang];
  const [scope, setScope] = useState<'all' | 'year' | 'month' | 'week'>('year');
  const year = new Date().getFullYear();
  const username = currentUser?.username ?? '';

  const { data: yearSummary } = useQuery({
    queryKey: ['yearSummary', username, year],
    queryFn: () => getYearSummary(username, year),
    enabled: !!username,
  });

  const { data: monthSummaries } = useQuery({
    queryKey: ['monthSummaries', username, year],
    queryFn: () => getMonthSummaries(username, year),
    enabled: !!username,
  });

  if (!currentUser) return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-faint)' }}>
      <Icon name="analytics" size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
      <div style={{ fontSize: 18, fontWeight: 600 }}>{t.login}</div>
    </div>
  );

  const s = yearSummary;
  const kmTotal = s ? (s.totalDistanceM / 1000).toFixed(0) : '—';
  const hrTotal = s ? `${Math.floor(s.totalDurationSec / 3600)} h` : '—';
  const sportDonut = (s?.sports ?? []).map(sp => ({
    label: sportName(sp.sport, lang),
    color: SPORTS[sp.sport]?.color ?? 'var(--accent)',
    value: sp.sessions,
  })).sort((a, b) => b.value - a.value);

  const monthKm = (monthSummaries ?? []).map((m) => m.totalDistanceM / 1000);
  const monthLabels = ['Tam', 'Hel', 'Maa', 'Huh', 'Tou', 'Kes', 'Hei', 'Elo', 'Syy', 'Lok', 'Mar', 'Jou'];

  const hrZones = [
    { z: 1, label: 'Z1', pct: 14, name: { fi: 'Palauttava', en: 'Recovery' } },
    { z: 2, label: 'Z2', pct: 38, name: { fi: 'Peruskestävyys', en: 'Endurance' } },
    { z: 3, label: 'Z3', pct: 26, name: { fi: 'Vauhtikestävyys', en: 'Tempo' } },
    { z: 4, label: 'Z4', pct: 16, name: { fi: 'Maksimikestävyys', en: 'Threshold' } },
    { z: 5, label: 'Z5', pct: 6, name: { fi: 'Maksimi', en: 'Anaerobic' } },
  ];

  // placeholder heatmap
  const hm = Array.from({ length: 26 }, () => Array.from({ length: 7 }, () => Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 100)));

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
        <Metric value={s?.sessions ?? '—'} label={t.sessions} big />
        <Metric value={s?.totalClimbM ? s.totalClimbM.toLocaleString() : '—'} unit="m" label={t.climb} big />
      </div>

      <div className="ot-analytics-grid">
        <Panel span={4} title={t.sportBreakdown}>
          {sportDonut.length > 0 ? (
            <div style={{ display: 'flex', gap: 22, alignItems: 'center', flexWrap: 'wrap' }}>
              <Donut data={sportDonut} size={170} thickness={24} centerLabel={s?.sessions} centerSub={t.sessions} />
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
          {monthKm.length > 0 ? (
            <LineChart height={210}
              series={[{ data: monthKm, color: 'var(--accent)' }]}
              xTicks={monthLabels} yFmt={v => Math.round(v).toString()} />
          ) : <div style={{ color: 'var(--text-faint)', fontSize: 13 }}>{t.noExercises}</div>}
        </Panel>

        <Panel span={5} title={t.hrZones} sub={lang === 'fi' ? 'Ajan jakauma' : 'Time distribution'}>
          <HRZonesBar zones={hrZones} height={18} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 4 }}>
            {hrZones.map(z => (
              <div key={z.z} className="ot-zone-row">
                <span className="ot-zone-dot" style={{ background: ZONE_COLORS[z.z - 1] }} />
                <span className="ot-zone-name">{z.label} · {z.name[lang]}</span>
                <span className="ot-zone-pct">{z.pct}%</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel span={7} title={t.consistency} sub={lang === 'fi' ? '26 viikkoa' : 'Last 26 weeks'}>
          <Heatmap weeks={hm} />
        </Panel>

        {s?.sports && s.sports.length > 0 && (
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
              {s.sports.map((r, i) => (
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
                  <span style={{ fontWeight: 600 }}>{r.sessions}</span>
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
