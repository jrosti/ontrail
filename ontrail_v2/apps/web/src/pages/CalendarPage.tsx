import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getWeekSummaries, listExercises } from '../api';
import { Card } from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';
import { SportGlyph } from '../components/ui/SportGlyph';
import { I18N } from '../i18n';
import { SPORTS } from '../sports';
import { useStore } from '../store';
import type { ExerciseListItem, WeekSummary } from '../types';
import { fmtDist, fmtDurLabel } from '../utils/format';

const NOW = new Date();
const CURRENT_YEAR = NOW.getFullYear();
const CURRENT_MONTH = NOW.getMonth(); // 0-indexed

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

function isoWeek(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
  );
}

// Encode a month as a single integer for easy comparison: year*12 + month0
function monthIndex(year: number, month0: number) {
  return year * 12 + month0;
}
function fromMonthIndex(idx: number): [number, number] {
  return [Math.floor(idx / 12), idx % 12];
}

function buildMonthGrid(
  year: number,
  month0: number,
  exercisesByDate: Map<string, ExerciseListItem[]>,
  weekDurationMap: Record<number, number>,
) {
  const first = new Date(year, month0, 1);
  const startDow = (first.getDay() + 6) % 7; // Mon=0
  const days = new Date(year, month0 + 1, 0).getDate();

  type WeekRow = {
    days: (null | { d: number; date: string; acts: ExerciseListItem[] })[];
    wk: number;
    totalSec: number;
  };
  const weeks: WeekRow[] = [];
  let week: WeekRow['days'] = new Array(startDow).fill(null);
  let weekTotalSec = 0;
  let weekNum = 0;

  for (let d = 1; d <= days; d++) {
    const dateObj = new Date(year, month0, d);
    const dateStr = `${year}-${String(month0 + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const acts = exercisesByDate.get(dateStr) ?? [];
    const dayDur = acts.reduce((s, a) => s + a.durationSec, 0);
    weekTotalSec += dayDur;
    weekNum = isoWeek(dateObj);
    week.push({ d, date: dateStr, acts });
    if (week.length === 7) {
      weeks.push({ days: week, wk: weekNum, totalSec: weekDurationMap[weekNum] ?? weekTotalSec });
      week = [];
      weekTotalSec = 0;
    }
  }
  if (week.length) {
    while (week.length < 7) week.push(null);
    weeks.push({ days: week, wk: weekNum, totalSec: weekDurationMap[weekNum] ?? weekTotalSec });
  }
  return weeks;
}

// One month card — fetches its own exercises
function MonthCard({
  year,
  month0,
  lang,
  weekDurationMap,
  dows,
}: {
  year: number;
  month0: number;
  lang: 'fi' | 'en';
  weekDurationMap: Record<number, number>;
  dows: string[];
}) {
  const username = useStore((s) => s.currentUser?.username ?? '');
  const monthKey = `${year}-${String(month0 + 1).padStart(2, '0')}`;

  const { data } = useQuery({
    queryKey: ['cal-exercises', username],
    queryFn: () => listExercises({ user: username, perPage: 500 }),
    enabled: !!username,
    staleTime: 5 * 60_000,
  });

  const exercisesByDate = useMemo(() => {
    const map = new Map<string, ExerciseListItem[]>();
    for (const ex of data?.items ?? []) {
      const key = ex.date.slice(0, 10);
      if (!key.startsWith(monthKey)) continue;
      if (!map.has(key)) map.set(key, []);
      map.get(key)?.push(ex);
    }
    return map;
  }, [data, monthKey]);

  const weeks = useMemo(
    () => buildMonthGrid(year, month0, exercisesByDate, weekDurationMap),
    [year, month0, exercisesByDate, weekDurationMap],
  );

  const names = lang === 'fi' ? MONTH_NAMES_FI : MONTH_NAMES_EN;

  return (
    <Card style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <h3 className="ot-cal-month">
        {names[month0]}{' '}
        <span style={{ color: 'var(--text-faint)', fontSize: 16, fontWeight: 400 }}>{year}</span>
      </h3>
      <div className="ot-cal-grid">
        <div className="ot-cal-row ot-cal-dow">
          <span>{lang === 'fi' ? 'Vk' : 'Wk'}</span>
          {dows.map((d) => (
            <span key={d}>{d}</span>
          ))}
          <span>{lang === 'fi' ? 'Yht.' : 'Tot.'}</span>
        </div>
        {weeks.map((w) => (
          <div key={w.wk} className="ot-cal-row">
            <span className="ot-cal-wk">{w.wk}</span>
            {w.days.map((day, di) => (
              <div
                key={day ? day.date : `empty-${di}`}
                className={`ot-cal-cell${day ? '' : ' empty'}`}
              >
                {day && (
                  <>
                    <span className="ot-cal-d">{day.d}</span>
                    <div className="ot-cal-acts">
                      {day.acts.map((a) => (
                        <Link
                          key={a.id}
                          to="/exercise/$id"
                          params={{ id: a.id }}
                          className="ot-cal-act"
                          style={{
                            background: `color-mix(in oklab, ${SPORTS[a.sport]?.color ?? 'var(--accent)'} 18%, transparent)`,
                            color: SPORTS[a.sport]?.color ?? 'var(--accent)',
                          }}
                          title={a.title}
                        >
                          <SportGlyph sport={a.sport} size={11} />
                          {a.distanceM ? (
                            <span>{fmtDist(a.distanceM, lang)}</span>
                          ) : a.durationSec ? (
                            <span>{fmtDurLabel(a.durationSec)}</span>
                          ) : null}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
            <span className="ot-cal-total">{w.totalSec > 0 ? fmtDurLabel(w.totalSec) : ''}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function CalendarPage() {
  const { lang, currentUser } = useStore();
  const t = I18N[lang];
  const dows =
    lang === 'fi'
      ? ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su']
      : ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const username = currentUser?.username ?? '';

  // The "anchor" year: determines which month to start from
  const [year, setYear] = useState(CURRENT_YEAR);

  // The topmost month index shown (newest, at top)
  const topMI = useMemo(() => {
    if (year === CURRENT_YEAR) return monthIndex(CURRENT_YEAR, CURRENT_MONTH);
    return monthIndex(year, 11); // December of selected past year
  }, [year]);

  // How many months are currently visible (grows as user scrolls down)
  const [visibleCount, setVisibleCount] = useState(3);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset to 3 when year changes; setVisibleCount is stable
  useEffect(() => {
    setVisibleCount(3);
  }, [year]);

  // Build the list of [year, month0] pairs to render, newest first
  const monthSlots = useMemo(() => {
    return Array.from({ length: visibleCount }, (_, i) => fromMonthIndex(topMI - i));
  }, [topMI, visibleCount]);

  // Week summaries for the selected year (for week totals)
  const { data: weekSummaries } = useQuery<WeekSummary[]>({
    queryKey: ['weekSummaries', username, year],
    queryFn: () => getWeekSummaries(username, year),
    enabled: !!username,
  });

  // Also fetch week summaries for the previous year if we scroll into it
  const prevYear = year - 1;
  const needsPrevYear = monthSlots.some(([y]) => y === prevYear);
  const { data: prevWeekSummaries } = useQuery<WeekSummary[]>({
    queryKey: ['weekSummaries', username, prevYear],
    queryFn: () => getWeekSummaries(username, prevYear),
    enabled: !!username && needsPrevYear,
  });

  const weekDurationMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const w of weekSummaries ?? []) {
      map[`${w.year}-${w.week}`] = (map[`${w.year}-${w.week}`] ?? 0) + w.totalDurationSec;
    }
    for (const w of prevWeekSummaries ?? []) {
      map[`${w.year}-${w.week}`] = (map[`${w.year}-${w.week}`] ?? 0) + w.totalDurationSec;
    }
    return map;
  }, [weekSummaries, prevWeekSummaries]);

  // Build a per-year week map for each rendered month
  const weekMapForYear = useCallback(
    (y: number): Record<number, number> => {
      const out: Record<number, number> = {};
      for (const [key, val] of Object.entries(weekDurationMap)) {
        const [ky, kw] = key.split('-').map(Number);
        if (ky === y) out[kw] = val;
      }
      return out;
    },
    [weekDurationMap],
  );

  // Infinite scroll sentinel
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setVisibleCount((n) => n + 3);
      },
      { rootMargin: '200px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Prevent navigating to a future year
  const handleNextYear = () => {
    if (year < CURRENT_YEAR) setYear((y) => y + 1);
  };
  const handlePrevYear = () => setYear((y) => y - 1);

  return (
    <div className="ot-page">
      <div className="ot-page-head">
        <div>
          <h1 className="ot-page-title">{t.weeks}</h1>
        </div>
        <div className="ot-cal-nav">
          <button type="button" className="ot-iconbtn" onClick={handlePrevYear}>
            <Icon name="chevron" size={18} style={{ transform: 'rotate(180deg)' }} />
          </button>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18 }}>
            {year}
          </span>
          <button
            type="button"
            className="ot-iconbtn"
            onClick={handleNextYear}
            disabled={year >= CURRENT_YEAR}
            style={{ opacity: year >= CURRENT_YEAR ? 0.3 : 1 }}
          >
            <Icon name="chevron" size={18} />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        {monthSlots.map(([y, m]) => (
          <MonthCard
            key={`${y}-${m}`}
            year={y}
            month0={m}
            lang={lang}
            weekDurationMap={weekMapForYear(y)}
            dows={dows}
          />
        ))}
        <div ref={sentinelRef} style={{ height: 1 }} />
      </div>
    </div>
  );
}
