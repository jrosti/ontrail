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
import { getSportSummary, getYearSummary, getMonthSummaries, getWeekSummaries } from '../api';
import type { YearSportSummary, MonthSummary, WeekSummary, SportSummary } from '../types';

const NOW = new Date();
const CURRENT_YEAR = NOW.getFullYear();
const CURRENT_MONTH = NOW.getMonth() + 1;
const MONTH_NAMES_FI = ['Tammikuu','Helmikuu','Maaliskuu','Huhtikuu','Toukokuu','Kesäkuu','Heinäkuu','Elokuu','Syyskuu','Lokakuu','Marraskuu','Joulukuu'];
const MONTH_NAMES_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTH_SHORT_FI = ['Tam','Hel','Maa','Huh','Tou','Kes','Hei','Elo','Syy','Lok','Mar','Jou'];
const MONTH_SHORT_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function fmtDur(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h > 0) return `${h}h ${m}min`;
  return m > 0 ? `${m}min` : '—';
}

type Scope = 'all' | 'year' | 'month' | 'week';

function PeriodNav({ label, onPrev, onNext }: { label: string; onPrev: () => void; onNext: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <button className="ot-iconbtn" onClick={onPrev}>
        <Icon name="chevron" size={16} style={{ transform: 'rotate(180deg)' }} />
      </button>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, minWidth: 90, textAlign: 'center' }}>{label}</span>
      <button className="ot-iconbtn" onClick={onNext} disabled={false}>
        <Icon name="chevron" size={16} />
      </button>
    </div>
  );
}

export function AnalyticsPage() {
  const { lang, currentUser } = useStore();
  const t = I18N[lang];
  const [scope, setScope] = useState<Scope>('year');
  const [year, setYear] = useState(CURRENT_YEAR);
  const [month, setMonth] = useState(CURRENT_MONTH);
  const [week, setWeek] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
    const w1 = new Date(d.getFullYear(), 0, 4);
    return 1 + Math.round(((d.getTime() - w1.getTime()) / 86400000 - 3 + ((w1.getDay() + 6) % 7)) / 7);
  });
  const username = currentUser?.username ?? '';
  const monthNames = lang === 'fi' ? MONTH_NAMES_FI : MONTH_NAMES_EN;
  const monthShort = lang === 'fi' ? MONTH_SHORT_FI : MONTH_SHORT_EN;

  const { data: allItems } = useQuery({
    queryKey: ['sportSummaryAll', username],
    queryFn: () => getSportSummary(username),
    enabled: !!username && scope === 'all',
  });

  const { data: yearItems } = useQuery({
    queryKey: ['yearSummary', username, year],
    queryFn: () => getYearSummary(username, year),
    enabled: !!username && scope !== 'all',
  });

  const { data: monthSummaries } = useQuery({
    queryKey: ['monthSummaries', username, year],
    queryFn: () => getMonthSummaries(username, year),
    enabled: !!username && scope !== 'all',
  });

  const { data: weekSummaries } = useQuery({
    queryKey: ['weekSummaries', username, year],
    queryFn: () => getWeekSummaries(username, year),
    enabled: !!username && scope !== 'all',
  });

  if (!currentUser) return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-faint)' }}>
      <Icon name="analytics" size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
      <div style={{ fontSize: 18, fontWeight: 600 }}>{t.login}</div>
    </div>
  );

  function prevPeriod() {
    if (scope === 'year' || scope === 'all') { setYear(y => y - 1); }
    else if (scope === 'month') {
      if (month === 1) { setMonth(12); setYear(y => y - 1); }
      else setMonth(m => m - 1);
    } else {
      if (week === 1) { setWeek(52); setYear(y => y - 1); }
      else setWeek(w => w - 1);
    }
  }
  function nextPeriod() {
    if (scope === 'year' || scope === 'all') { setYear(y => y + 1); }
    else if (scope === 'month') {
      if (month === 12) { setMonth(1); setYear(y => y + 1); }
      else setMonth(m => m + 1);
    } else {
      if (week === 52) { setWeek(1); setYear(y => y + 1); }
      else setWeek(w => w + 1);
    }
  }

  function periodLabel() {
    if (scope === 'all') return lang === 'fi' ? 'Kaikki ajat' : 'All time';
    if (scope === 'year') return String(year);
    if (scope === 'month') return `${monthNames[month - 1]} ${year}`;
    return `${lang === 'fi' ? 'Vk' : 'Wk'} ${week} / ${year}`;
  }

  // Derive items for current scope
  let items: (YearSportSummary | SportSummary)[];
  if (scope === 'all') {
    items = allItems ?? [];
  } else if (scope === 'month') {
    // aggregate monthSummaries filtered to selected month
    const byMonth = (monthSummaries ?? []).filter(m => m.month === month);
    items = aggregateMonthToSport(byMonth);
  } else if (scope === 'week') {
    const byWeek = (weekSummaries ?? []).filter(w => w.week === week);
    items = aggregateWeekToSport(byWeek);
  } else {
    items = yearItems ?? [];
  }

  const totalDurationSec = items.reduce((s, r) => s + r.totalDurationSec, 0);
  const totalDistanceM = items.reduce((s, r) => s + r.totalDistanceM, 0);
  const totalSessions = items.reduce((s, r) => s + r.sessionCount, 0);
  const totalClimbM = items.reduce((s, r) => s + r.totalClimbM, 0);

  const kmTotal = totalDistanceM > 0 ? (totalDistanceM / 1000).toFixed(0) : '—';
  const hrTotal = totalDurationSec > 0 ? fmtDur(totalDurationSec) : '—';

  const sportDonut = [...items].map(sp => ({
    label: sportName(sp.sport, lang),
    color: SPORTS[sp.sport]?.color ?? 'var(--accent)',
    value: sp.sessionCount,
  })).sort((a, b) => b.value - a.value);

  // Trend chart data
  let trendData: number[] = [];
  let trendLabels: string[] = [];
  let trendTitle: string = t.distanceTrend;

  if (scope === 'year' || scope === 'all') {
    const monthMap: Record<number, number> = {};
    for (const m of (monthSummaries ?? [])) {
      monthMap[m.month] = (monthMap[m.month] ?? 0) + m.totalDistanceM;
    }
    trendData = Array.from({ length: 12 }, (_, i) => (monthMap[i + 1] ?? 0) / 1000);
    trendLabels = monthShort;
  } else if (scope === 'month') {
    // weekly bars within the month: weeks that contain days of this month
    const weeksInMonth = getWeeksInMonth(year, month);
    const weekMap: Record<number, number> = {};
    for (const w of (weekSummaries ?? [])) {
      weekMap[w.week] = (weekMap[w.week] ?? 0) + w.totalDistanceM;
    }
    trendData = weeksInMonth.map(wk => (weekMap[wk] ?? 0) / 1000);
    trendLabels = weeksInMonth.map(wk => `${lang === 'fi' ? 'Vk' : 'W'}${wk}`);
    trendTitle = lang === 'fi' ? 'Etäisyys viikottain' : 'Distance by week';
  } else {
    // week scope: nothing meaningful for trend
    trendData = [];
    trendLabels = [];
  }

  // Heatmap (always week-based for year)
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
          <div className="ot-page-sub">{currentUser.displayName}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
          <div className="ot-scope">
            {(['all', 'year', 'month', 'week'] as const).map(k => (
              <button key={k} className={'ot-scope-btn' + (scope === k ? ' active' : '')} onClick={() => setScope(k)}>
                {t[k]}
              </button>
            ))}
          </div>
          <PeriodNav label={periodLabel()} onPrev={prevPeriod} onNext={nextPeriod} />
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

        <Panel span={8} title={trendTitle}>
          {trendData.some(v => v > 0) ? (
            <LineChart height={210}
              series={[{ data: trendData, color: 'var(--accent)' }]}
              xTicks={trendLabels} yFmt={v => Math.round(v).toString()} />
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

        {scope !== 'week' && (
          <Panel span={7} title={t.consistency} sub={lang === 'fi' ? '26 viikkoa' : 'Last 26 weeks'}>
            <Heatmap weeks={hm} />
          </Panel>
        )}

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
                  <span>{r.totalDurationSec ? fmtDur(r.totalDurationSec) : '—'}</span>
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

function aggregateMonthToSport(rows: MonthSummary[]): YearSportSummary[] {
  const map = new Map<string, YearSportSummary>();
  for (const r of rows) {
    const existing = map.get(r.sport);
    if (existing) {
      existing.sessionCount += r.sessionCount;
      existing.totalDistanceM += r.totalDistanceM;
      existing.totalDurationSec += r.totalDurationSec;
      existing.totalClimbM += r.totalClimbM;
    } else {
      map.set(r.sport, { year: r.year, sport: r.sport, sessionCount: r.sessionCount, totalDistanceM: r.totalDistanceM, totalDurationSec: r.totalDurationSec, totalClimbM: r.totalClimbM, totalKcal: 0, avgHr: r.avgHr });
    }
  }
  return [...map.values()].sort((a, b) => b.sessionCount - a.sessionCount);
}

function aggregateWeekToSport(rows: WeekSummary[]): YearSportSummary[] {
  const map = new Map<string, YearSportSummary>();
  for (const r of rows) {
    const existing = map.get(r.sport);
    if (existing) {
      existing.sessionCount += r.sessionCount;
      existing.totalDistanceM += r.totalDistanceM;
      existing.totalDurationSec += r.totalDurationSec;
      existing.totalClimbM += r.totalClimbM;
    } else {
      map.set(r.sport, { year: r.year, sport: r.sport, sessionCount: r.sessionCount, totalDistanceM: r.totalDistanceM, totalDurationSec: r.totalDurationSec, totalClimbM: r.totalClimbM, totalKcal: 0, avgHr: r.avgHr });
    }
  }
  return [...map.values()].sort((a, b) => b.sessionCount - a.sessionCount);
}

function getWeeksInMonth(year: number, month: number): number[] {
  const weeks = new Set<number>();
  const days = new Date(year, month, 0).getDate();
  for (let d = 1; d <= days; d++) {
    const date = new Date(year, month - 1, d);
    const tmp = new Date(date);
    tmp.setHours(0, 0, 0, 0);
    tmp.setDate(tmp.getDate() + 3 - ((tmp.getDay() + 6) % 7));
    const w1 = new Date(tmp.getFullYear(), 0, 4);
    const wk = 1 + Math.round(((tmp.getTime() - w1.getTime()) / 86400000 - 3 + ((w1.getDay() + 6) % 7)) / 7);
    weeks.add(wk);
  }
  return [...weeks].sort((a, b) => a - b);
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
