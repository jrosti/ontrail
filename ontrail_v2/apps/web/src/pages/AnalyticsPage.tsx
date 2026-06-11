import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import type React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  getAthleteProfile,
  getMonthSummaries,
  getSportSummary,
  getWeekSummaries,
  getYearSummary,
  listExercises,
} from '../api';
import { ActivityCalendar, Donut, LineChart } from '../components/charts/Charts';
import { Card } from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';
import { Metric } from '../components/ui/Metric';
import { SportGlyph } from '../components/ui/SportGlyph';
import { I18N } from '../i18n';
import { SPORTS, sportName } from '../sports';
import { useStore } from '../store';
import type { MonthSummary, SportSummary, WeekSummary, YearSportSummary } from '../types';
import { fmtDistKm, fmtDur, fmtInt } from '../utils/format';

const NOW = new Date();
const CURRENT_YEAR = NOW.getFullYear();
const CURRENT_MONTH = NOW.getMonth() + 1;
const MONTH_NAMES_FI = [
  'Tammikuu',
  'Helmikuu',
  'Maaliskuu',
  'Huhtikuu',
  'Toukokuu',
  'Kesäkuu',
  'Heinäkuu',
  'Elokuu',
  'Syyskuu',
  'Lokakuu',
  'Marraskuu',
  'Joulukuu',
];
const MONTH_NAMES_EN = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const MONTH_SHORT_FI = [
  'Tam',
  'Hel',
  'Maa',
  'Huh',
  'Tou',
  'Kes',
  'Hei',
  'Elo',
  'Syy',
  'Lok',
  'Mar',
  'Jou',
];
const MONTH_SHORT_EN = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

type Scope = 'all' | 'year' | 'month' | 'week';

function PeriodPicker({
  scope,
  year,
  month,
  week,
  onYear,
  onMonth,
  onWeek,
  lang,
  years,
}: {
  scope: Scope;
  year: number;
  month: number;
  week: number;
  onYear: (y: number) => void;
  onMonth: (m: number) => void;
  onWeek: (w: number) => void;
  lang: string;
  years: number[];
}) {
  const [open, setOpen] = useState(false);
  const [pickYear, setPickYear] = useState(year);
  const ref = useRef<HTMLDivElement>(null);
  const monthNames = lang === 'fi' ? MONTH_NAMES_FI : MONTH_NAMES_EN;
  const monthShort = lang === 'fi' ? MONTH_SHORT_FI : MONTH_SHORT_EN;

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useEffect(() => {
    setPickYear(year);
  }, [year]);

  let label: string;
  if (scope === 'all') label = lang === 'fi' ? 'Kaikki ajat' : 'All time';
  else if (scope === 'year') label = String(year);
  else if (scope === 'month') label = `${monthNames[month - 1]} ${year}`;
  else label = `${lang === 'fi' ? 'Vk' : 'Wk'} ${week} / ${year}`;

  const numWeeks = (y: number) => {
    const dec28 = new Date(y, 11, 28);
    const tmp = new Date(dec28);
    tmp.setDate(tmp.getDate() + 3 - ((tmp.getDay() + 6) % 7));
    const w1 = new Date(tmp.getFullYear(), 0, 4);
    return (
      1 + Math.round(((tmp.getTime() - w1.getTime()) / 86400000 - 3 + ((w1.getDay() + 6) % 7)) / 7)
    );
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button type="button" className="ot-period-btn" onClick={() => setOpen((o) => !o)}>
        <span>{label}</span>
        <Icon
          name="chevron"
          size={14}
          style={{
            marginLeft: 4,
            opacity: 0.5,
            transform: open ? 'rotate(-90deg)' : 'rotate(90deg)',
            transition: 'transform .15s',
          }}
        />
      </button>

      {open && (
        <div className="ot-picker-panel">
          {/* Year row */}
          <div className="ot-picker-year-nav">
            <button
              type="button"
              className="ot-iconbtn"
              style={{ width: 28, height: 28 }}
              onClick={() => setPickYear((y) => y - 1)}
            >
              <Icon name="chevron" size={13} style={{ transform: 'rotate(180deg)' }} />
            </button>
            <span className="ot-picker-year-label">{pickYear}</span>
            <button
              type="button"
              className="ot-iconbtn"
              style={{ width: 28, height: 28 }}
              onClick={() => setPickYear((y) => y + 1)}
            >
              <Icon name="chevron" size={13} />
            </button>
          </div>

          {(scope === 'year' || scope === 'all') && (
            <div className="ot-picker-year-grid">
              {years.map((y) => (
                <button
                  type="button"
                  key={y}
                  className={`ot-picker-cell${y === year ? ' selected' : ''}`}
                  onClick={() => {
                    onYear(y);
                    setOpen(false);
                  }}
                >
                  {y}
                </button>
              ))}
            </div>
          )}

          {scope === 'month' && (
            <div className="ot-picker-month-grid">
              {monthShort.map((name, i) => (
                <button
                  type="button"
                  key={name}
                  className={`ot-picker-cell${pickYear === year && i + 1 === month ? ' selected' : ''}`}
                  onClick={() => {
                    onYear(pickYear);
                    onMonth(i + 1);
                    setOpen(false);
                  }}
                >
                  {name}
                </button>
              ))}
            </div>
          )}

          {scope === 'week' && (
            <div className="ot-picker-week-grid">
              {Array.from({ length: numWeeks(pickYear) }, (_, i) => i + 1).map((w) => (
                <button
                  type="button"
                  key={w}
                  className={
                    'ot-picker-cell ot-picker-cell-sm' +
                    (pickYear === year && w === week ? ' selected' : '')
                  }
                  onClick={() => {
                    onYear(pickYear);
                    onWeek(w);
                    setOpen(false);
                  }}
                >
                  {lang === 'fi' ? `Vk${w}` : `W${w}`}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function AnalyticsPage({ username: propUsername }: { username?: string } = {}) {
  const { lang, currentUser } = useStore();
  const t = I18N[lang];
  // When a username is passed (viewing another athlete) use their profile;
  // otherwise show the logged-in user's own analytics.
  const isOwn = !propUsername;
  const [scope, setScope] = useState<Scope>('year');
  const [year, setYear] = useState(CURRENT_YEAR);
  const [month, setMonth] = useState(CURRENT_MONTH);
  const [week, setWeek] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
    const w1 = new Date(d.getFullYear(), 0, 4);
    return (
      1 + Math.round(((d.getTime() - w1.getTime()) / 86400000 - 3 + ((w1.getDay() + 6) % 7)) / 7)
    );
  });
  const username = propUsername ?? currentUser?.username ?? '';
  const monthShort = lang === 'fi' ? MONTH_SHORT_FI : MONTH_SHORT_EN;
  const [sportSortCol, setSportSortCol] = useState<SportSortCol>('sessions');
  const [sportSortDir, setSportSortDir] = useState<SortDir3>('desc');

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

  // Per-day exercise data for the activity calendar heatmap + HR zones — scoped
  // to the displayed year so the full year is covered (not just the latest 100).
  const { data: calExercises } = useQuery({
    queryKey: ['cal-exercises', username, year],
    queryFn: () =>
      listExercises({
        user: username,
        perPage: 1000,
        dateFrom: `${year}-01-01`,
        dateTo: `${year}-12-31`,
        sortBy: 'date',
      }),
    enabled: !!username,
    staleTime: 5 * 60_000,
  });

  // Athlete profile gives the first active year so the picker can span the
  // user's full history (legacy data goes back to the 1990s), not just 12 years.
  const { data: athlete } = useQuery({
    queryKey: ['athleteProfile', username],
    queryFn: () => getAthleteProfile(username),
    enabled: !!username,
    staleTime: 5 * 60_000,
  });
  const years = useMemo(() => {
    // Always offer at least the 12 most recent years, extending back to firstYear.
    const start = Math.min(athlete?.firstYear ?? CURRENT_YEAR, CURRENT_YEAR - 11);
    return Array.from({ length: CURRENT_YEAR - start + 1 }, (_, i) => CURRENT_YEAR - i);
  }, [athlete?.firstYear]);

  // HR profile + name of the viewed athlete (their profile, falling back to the
  // logged-in user only when viewing one's own analytics).
  const targetRestHr = athlete?.restHr ?? (isOwn ? currentUser?.restHr : undefined);
  const targetMaxHr = athlete?.maxHr ?? (isOwn ? currentUser?.maxHr : undefined);
  const targetName =
    athlete?.displayName ?? (isOwn ? currentUser?.displayName : undefined) ?? username;

  const nav = useNavigate();

  if (!currentUser)
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-faint)' }}>
        <Icon name="analytics" size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
        <div style={{ fontSize: 18, fontWeight: 600 }}>{t.login}</div>
      </div>
    );

  // Derive items for current scope
  let items: (YearSportSummary | SportSummary)[];
  if (scope === 'all') {
    items = allItems ?? [];
  } else if (scope === 'month') {
    // aggregate monthSummaries filtered to selected month
    const byMonth = (monthSummaries ?? []).filter((m) => m.month === month);
    items = aggregateMonthToSport(byMonth);
  } else if (scope === 'week') {
    const byWeek = (weekSummaries ?? []).filter((w) => w.week === week);
    items = aggregateWeekToSport(byWeek);
  } else {
    items = yearItems ?? [];
  }

  const sortedItems =
    sportSortDir === 'none'
      ? items
      : [...items].sort((a, b) => {
          let cmp = 0;
          if (sportSortCol === 'name')
            cmp = sportName(a.sport, lang).localeCompare(sportName(b.sport, lang));
          else if (sportSortCol === 'distance')
            cmp = (a.totalDistanceM ?? 0) - (b.totalDistanceM ?? 0);
          else if (sportSortCol === 'time') cmp = a.totalDurationCs - b.totalDurationCs;
          else if (sportSortCol === 'hr') cmp = (a.avgHr ?? 0) - (b.avgHr ?? 0);
          else if (sportSortCol === 'climb') cmp = (a.totalClimbM ?? 0) - (b.totalClimbM ?? 0);
          else cmp = a.sessionCount - b.sessionCount;
          return sportSortDir === 'asc' ? cmp : -cmp;
        });

  const cycleSortDir = (col: SportSortCol) => {
    if (sportSortCol !== col) {
      setSportSortCol(col);
      setSportSortDir(col === 'name' ? 'asc' : 'desc');
    } else {
      setSportSortDir((prev) => {
        if (col === 'name') return prev === 'asc' ? 'desc' : prev === 'desc' ? 'none' : 'asc';
        return prev === 'desc' ? 'asc' : prev === 'asc' ? 'none' : 'desc';
      });
    }
  };

  const totalDurationCs = items.reduce((s, r) => s + r.totalDurationCs, 0);
  const totalDistanceM = items.reduce((s, r) => s + r.totalDistanceM, 0);
  const totalSessions = items.reduce((s, r) => s + r.sessionCount, 0);
  const totalClimbM = items.reduce((s, r) => s + r.totalClimbM, 0);

  const kmTotal = totalDistanceM > 0 ? fmtDistKm(totalDistanceM, lang, 0) : '—';
  const hrTotal = totalDurationCs > 0 ? fmtDur(totalDurationCs) : '—';

  const sportDonut = [...items]
    .map((sp) => ({
      label: sportName(sp.sport, lang),
      color: SPORTS[sp.sport]?.color ?? 'var(--accent)',
      value: sp.sessionCount,
    }))
    .sort((a, b) => b.value - a.value);

  // Trend chart data
  let trendData: number[];
  let trendLabels: string[];
  let trendTitle: string = t.distanceTrend;

  if (scope === 'year' || scope === 'all') {
    const monthMap: Record<number, number> = {};
    for (const m of monthSummaries ?? []) {
      monthMap[m.month] = (monthMap[m.month] ?? 0) + m.totalDistanceM;
    }
    trendData = Array.from({ length: 12 }, (_, i) => (monthMap[i + 1] ?? 0) / 1000);
    trendLabels = monthShort;
  } else if (scope === 'month') {
    // weekly bars within the month: weeks that contain days of this month
    const weeksInMonth = getWeeksInMonth(year, month);
    const weekMap: Record<number, number> = {};
    for (const w of weekSummaries ?? []) {
      weekMap[w.week] = (weekMap[w.week] ?? 0) + w.totalDistanceM;
    }
    trendData = weeksInMonth.map((wk) => (weekMap[wk] ?? 0) / 1000);
    trendLabels = weeksInMonth.map((wk) => `${lang === 'fi' ? 'Vk' : 'W'}${wk}`);
    trendTitle = lang === 'fi' ? 'Etäisyys viikottain' : 'Distance by week';
  } else {
    trendData = [];
    trendLabels = [];
  }

  // Day-keyed duration map for activity calendar
  const byDate = new Map<string, number>();
  for (const ex of calExercises?.items ?? []) {
    const d = ex.date.slice(0, 10);
    byDate.set(d, (byDate.get(d) ?? 0) + ex.durationCs);
  }

  const hasHrProfile = !!(targetRestHr || targetMaxHr);

  // Karvonen 5-zone boundaries (% of HRR)
  const ZONE_PCT = [0.5, 0.6, 0.7, 0.8, 0.9, 1.0] as const;
  const ZONE_COLORS = ['#60a5fa', '#34d399', '#fbbf24', '#f97316', '#ef4444'];
  const ZONE_NAMES_FI = ['Z1 Palautus', 'Z2 Aerobinen', 'Z3 Tempo', 'Z4 Kynnys', 'Z5 Maksimi'];
  const ZONE_NAMES_EN = ['Z1 Recovery', 'Z2 Aerobic', 'Z3 Tempo', 'Z4 Threshold', 'Z5 Max'];

  const hrZoneData = (() => {
    const restHr = targetRestHr ?? 60;
    const maxHr = targetMaxHr ?? 190;
    const hrr = maxHr - restHr;
    const bounds = ZONE_PCT.map((p) => Math.round(restHr + hrr * p));

    // Filter calExercises to scope date range
    const now = new Date();
    let fromDate = '';
    let toDate = '';
    if (scope === 'year') {
      fromDate = `${year}-01-01`;
      toDate = `${year}-12-31`;
    } else if (scope === 'month') {
      fromDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      toDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    } else if (scope === 'week') {
      const d = new Date(now);
      d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
      fromDate = d.toISOString().slice(0, 10);
      toDate = now.toISOString().slice(0, 10);
    }

    const zoneSec = [0, 0, 0, 0, 0];
    for (const ex of calExercises?.items ?? []) {
      if (!ex.avgHr) continue;
      const d = ex.date.slice(0, 10);
      if (fromDate && d < fromDate) continue;
      if (toDate && d > toDate) continue;
      const hr = ex.avgHr;
      let zone = 0;
      for (let i = 0; i < bounds.length - 1; i++) {
        if (hr >= bounds[i]) zone = i;
      }
      zoneSec[zone] += ex.durationCs;
    }
    const total = zoneSec.reduce((a, b) => a + b, 0);
    return { zoneSec, total, bounds };
  })();

  return (
    <div className="ot-page">
      <div className="ot-page-head">
        <div>
          <h1 className="ot-page-title">{t.analytics}</h1>
          <div className="ot-page-sub">{targetName}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
          <div className="ot-scope">
            {(['all', 'year', 'month', 'week'] as const).map((k) => (
              <button
                type="button"
                key={k}
                className={`ot-scope-btn${scope === k ? ' active' : ''}`}
                onClick={() => setScope(k)}
              >
                {t[k]}
              </button>
            ))}
          </div>
          <PeriodPicker
            scope={scope}
            year={year}
            month={month}
            week={week}
            onYear={setYear}
            onMonth={setMonth}
            onWeek={setWeek}
            lang={lang}
            years={years}
          />
        </div>
      </div>

      <div className="ot-summary-row">
        <Metric value={kmTotal} unit="km" label={t.distance} big />
        <Metric value={hrTotal} label={t.duration} big />
        <Metric value={totalSessions > 0 ? totalSessions : '—'} label={t.sessions} big />
        <Metric
          value={totalClimbM > 0 ? fmtInt(totalClimbM, lang) : '—'}
          unit="m"
          label={t.climb}
          big
        />
      </div>

      <div className="ot-analytics-grid">
        <Panel span={4} title={t.sportBreakdown}>
          {sportDonut.length > 0 ? (
            <div style={{ display: 'flex', gap: 22, alignItems: 'center', flexWrap: 'wrap' }}>
              <Donut
                data={sportDonut}
                size={170}
                thickness={24}
                centerLabel={totalSessions}
                centerSub={t.sessions}
              />
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1, minWidth: 120 }}
              >
                {sportDonut.map((d) => (
                  <div key={d.label} className="ot-legend-row">
                    <span className="ot-legend-dot" style={{ background: d.color }} />
                    <span className="ot-legend-label">{d.label}</span>
                    <span className="ot-legend-val">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--text-faint)', fontSize: 13 }}>{t.noExercises}</div>
          )}
        </Panel>

        <Panel span={8} title={trendTitle}>
          {trendData.some((v) => v > 0) ? (
            <LineChart
              height={210}
              series={[{ data: trendData, color: 'var(--accent)' }]}
              xTicks={trendLabels}
              yFmt={(v) => Math.round(v).toString()}
            />
          ) : (
            <div style={{ color: 'var(--text-faint)', fontSize: 13 }}>{t.noExercises}</div>
          )}
        </Panel>

        <Panel span={5} title={t.hrZones}>
          {!hasHrProfile ? (
            <div style={{ color: 'var(--text-faint)', fontSize: 13 }}>
              {lang === 'fi'
                ? 'Syketiedot saatavilla kun lisäät HR-profiilin asetuksissa'
                : 'HR zones available after setting up your HR profile in settings'}
            </div>
          ) : hrZoneData.total === 0 ? (
            <div style={{ color: 'var(--text-faint)', fontSize: 13 }}>{t.noExercises}</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 11, color: 'var(--text-faint)', display: 'flex', gap: 16 }}>
                <span>
                  {lang === 'fi' ? 'Lepo' : 'Rest'}: {targetRestHr ?? '—'} bpm
                </span>
                <span>
                  {lang === 'fi' ? 'Maksimi' : 'Max'}: {targetMaxHr ?? '—'} bpm
                </span>
              </div>
              {hrZoneData.zoneSec.map((sec, i) => {
                const zoneNames = lang === 'fi' ? ZONE_NAMES_FI : ZONE_NAMES_EN;
                const pct = hrZoneData.total > 0 ? (sec / hrZoneData.total) * 100 : 0;
                return (
                  <div key={zoneNames[i]}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 12,
                        marginBottom: 3,
                      }}
                    >
                      <span style={{ fontWeight: 600, color: ZONE_COLORS[i] }}>{zoneNames[i]}</span>
                      <span style={{ color: 'var(--text-faint)' }}>
                        {sec > 0 ? fmtDur(sec) : '—'}
                        {pct > 0 ? ` · ${Math.round(pct)}%` : ''}
                      </span>
                    </div>
                    <div
                      style={{
                        height: 8,
                        borderRadius: 4,
                        background: 'var(--surface-2)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${pct}%`,
                          background: ZONE_COLORS[i],
                          borderRadius: 4,
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
              <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 4 }}>
                {lang === 'fi'
                  ? `Yhteensä HR-datalla: ${fmtDur(hrZoneData.total)}`
                  : `Total with HR data: ${fmtDur(hrZoneData.total)}`}
              </div>
            </div>
          )}
        </Panel>

        {scope !== 'week' && (
          <Panel
            span={7}
            title={lang === 'fi' ? 'Treenikalenteri' : 'Training calendar'}
            sub={String(year)}
          >
            <ActivityCalendar
              year={year}
              byDate={byDate}
              lang={lang}
              onDayClick={(date) => nav({ to: '/feed', search: { dateFrom: date, dateTo: date } })}
            />
          </Panel>
        )}

        {items.length > 0 && (
          <Panel span={12} title={t.sportSummary}>
            <div className="ot-table">
              <div className="ot-tr ot-th">
                <SportSortHeader
                  col="name"
                  active={sportSortCol}
                  dir={sportSortDir}
                  onClick={cycleSortDir}
                >
                  {lang === 'fi' ? 'Laji' : 'Sport'}
                </SportSortHeader>
                <SportSortHeader
                  col="distance"
                  active={sportSortCol}
                  dir={sportSortDir}
                  onClick={cycleSortDir}
                >
                  {t.distance}
                </SportSortHeader>
                <SportSortHeader
                  col="time"
                  active={sportSortCol}
                  dir={sportSortDir}
                  onClick={cycleSortDir}
                >
                  {t.time}
                </SportSortHeader>
                <SportSortHeader
                  col="hr"
                  active={sportSortCol}
                  dir={sportSortDir}
                  onClick={cycleSortDir}
                >
                  {t.hr}
                </SportSortHeader>
                <SportSortHeader
                  col="climb"
                  active={sportSortCol}
                  dir={sportSortDir}
                  onClick={cycleSortDir}
                >
                  {t.climb}
                </SportSortHeader>
                <SportSortHeader
                  col="sessions"
                  active={sportSortCol}
                  dir={sportSortDir}
                  onClick={cycleSortDir}
                >
                  {lang === 'fi' ? 'Kerrat' : 'Sessions'}
                </SportSortHeader>
              </div>
              {sortedItems.map((r) => (
                <div key={r.sport} className="ot-tr ot-td">
                  <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <span
                      className="ot-table-dot"
                      style={{ background: SPORTS[r.sport]?.color ?? 'var(--accent)' }}
                    />
                    <SportGlyph sport={r.sport} size={14} />
                    {sportName(r.sport, lang)}
                  </span>
                  <span>{r.totalDistanceM ? `${fmtDistKm(r.totalDistanceM, lang)} km` : '—'}</span>
                  <span>{r.totalDurationCs ? fmtDur(r.totalDurationCs) : '—'}</span>
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
      existing.totalDurationCs += r.totalDurationCs;
      existing.totalClimbM += r.totalClimbM;
    } else {
      map.set(r.sport, {
        year: r.year,
        sport: r.sport,
        sessionCount: r.sessionCount,
        totalDistanceM: r.totalDistanceM,
        totalDurationCs: r.totalDurationCs,
        totalClimbM: r.totalClimbM,
        totalKcal: 0,
        avgHr: r.avgHr,
      });
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
      existing.totalDurationCs += r.totalDurationCs;
      existing.totalClimbM += r.totalClimbM;
    } else {
      map.set(r.sport, {
        year: r.year,
        sport: r.sport,
        sessionCount: r.sessionCount,
        totalDistanceM: r.totalDistanceM,
        totalDurationCs: r.totalDurationCs,
        totalClimbM: r.totalClimbM,
        totalKcal: 0,
        avgHr: r.avgHr,
      });
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
    const wk =
      1 + Math.round(((tmp.getTime() - w1.getTime()) / 86400000 - 3 + ((w1.getDay() + 6) % 7)) / 7);
    weeks.add(wk);
  }
  return [...weeks].sort((a, b) => a - b);
}

function Panel({
  title,
  sub,
  children,
  span,
}: {
  title: string;
  sub?: string;
  children: React.ReactNode;
  span?: number;
}) {
  return (
    <Card
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        gridColumn: span ? `span ${span}` : 'auto',
      }}
    >
      <div>
        <h4 className="ot-panel-title">{title}</h4>
        {sub && <div className="ot-panel-sub">{sub}</div>}
      </div>
      {children}
    </Card>
  );
}

type SportSortCol = 'name' | 'distance' | 'time' | 'hr' | 'climb' | 'sessions';
type SortDir3 = 'asc' | 'desc' | 'none';

function SportSortHeader({
  col,
  active,
  dir,
  onClick,
  children,
}: {
  col: SportSortCol;
  active: SportSortCol;
  dir: SortDir3;
  onClick: (col: SportSortCol) => void;
  children: React.ReactNode;
}) {
  const isActive = active === col && dir !== 'none';
  const chevron = isActive ? (dir === 'asc' ? '↑' : '↓') : '';
  return (
    <button
      type="button"
      onClick={() => onClick(col)}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        font: 'inherit',
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        fontWeight: 700,
        color: isActive ? 'var(--accent)' : 'var(--text-faint)',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
      <span style={{ fontSize: 10, opacity: isActive ? 1 : 0.3, minWidth: 8 }}>
        {chevron || '↕'}
      </span>
    </button>
  );
}
