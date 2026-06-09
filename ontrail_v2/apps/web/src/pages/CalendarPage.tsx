import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';
import { SportGlyph } from '../components/ui/SportGlyph';
import { useStore } from '../store';
import { I18N } from '../i18n';
import { SPORTS, sportName } from '../sports';
import { listExercises, getWeekSummaries } from '../api';
import type { ExerciseListItem } from '../types';

function fmtDuration(sec: number): string {
  if (!sec) return '';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h > 0) return `${h}h ${m}min`;
  return `${m}min`;
}

function isoWeek(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
}

export function CalendarPage() {
  const { lang, currentUser } = useStore();
  const t = I18N[lang];
  const [year, setYear] = useState(new Date().getFullYear());
  const monthNamesFi = ['Tammikuu', 'Helmikuu', 'Maaliskuu', 'Huhtikuu', 'Toukokuu', 'Kesäkuu', 'Heinäkuu', 'Elokuu', 'Syyskuu', 'Lokakuu', 'Marraskuu', 'Joulukuu'];
  const monthNamesEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dows = lang === 'fi' ? ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su'] : ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  const username = currentUser?.username ?? '';

  const { data: exercisesData } = useQuery({
    queryKey: ['exercises', 'calendar', username, year],
    queryFn: () => listExercises({ user: username, perPage: 500 }),
    enabled: !!username,
  });

  const { data: weekSummaries } = useQuery({
    queryKey: ['weekSummaries', username, year],
    queryFn: () => getWeekSummaries(username, year),
    enabled: !!username,
  });

  const exercisesByDate = useMemo(() => {
    const map = new Map<string, ExerciseListItem[]>();
    for (const ex of (exercisesData?.items ?? [])) {
      const key = ex.date.slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(ex);
    }
    return map;
  }, [exercisesData]);

  const weekDurationMap = useMemo(() => {
    const map: Record<number, number> = {};
    for (const w of (weekSummaries ?? [])) {
      map[w.week] = (map[w.week] ?? 0) + w.totalDurationSec;
    }
    return map;
  }, [weekSummaries]);

  const now = new Date();
  const currentMonth = now.getMonth();

  const months = Array.from({ length: 3 }, (_, idx) => {
    const rawM = currentMonth - idx;
    const m = ((rawM % 12) + 12) % 12;
    const y = rawM < 0 ? year - 1 : year;
    const first = new Date(y, m, 1);
    const startDow = (first.getDay() + 6) % 7;
    const days = new Date(y, m + 1, 0).getDate();

    type WeekRow = { days: (null | { d: number; date: string; acts: ExerciseListItem[] })[]; wk: number; totalSec: number };
    const weeks: WeekRow[] = [];
    let week: WeekRow['days'] = new Array(startDow).fill(null);
    let weekTotalSec = 0;
    let weekNum = 0;

    for (let d = 1; d <= days; d++) {
      const dateObj = new Date(y, m, d);
      const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const acts = exercisesByDate.get(dateStr) ?? [];
      const dayDur = acts.reduce((s, a) => s + a.durationSec, 0);
      weekTotalSec += dayDur;
      weekNum = isoWeek(dateObj);
      week.push({ d, date: dateStr, acts });
      if (week.length === 7) {
        const wkNum = weekNum;
        weeks.push({ days: week, wk: wkNum, totalSec: weekDurationMap[wkNum] ?? weekTotalSec });
        week = [];
        weekTotalSec = 0;
      }
    }
    if (week.length) {
      while (week.length < 7) week.push(null);
      weeks.push({ days: week, wk: weekNum, totalSec: weekDurationMap[weekNum] ?? weekTotalSec });
    }
    return { name: (lang === 'fi' ? monthNamesFi : monthNamesEn)[m], weeks };
  }).reverse();

  return (
    <div className="ot-page">
      <div className="ot-page-head">
        <div>
          <h1 className="ot-page-title">{t.weeks}</h1>
          <div className="ot-page-sub">{year}</div>
        </div>
        <div className="ot-cal-nav">
          <button className="ot-iconbtn" onClick={() => setYear(y => y - 1)}>
            <Icon name="chevron" size={18} style={{ transform: 'rotate(180deg)' }} />
          </button>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18 }}>{year}</span>
          <button className="ot-iconbtn" onClick={() => setYear(y => y + 1)}>
            <Icon name="chevron" size={18} />
          </button>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        {months.map((mo, mi) => (
          <Card key={mi} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h3 className="ot-cal-month">{mo.name}</h3>
            <div className="ot-cal-grid">
              <div className="ot-cal-row ot-cal-dow">
                <span>{t.week.slice(0, 2)}</span>
                {dows.map(d => <span key={d}>{d}</span>)}
                <span>{t.total}</span>
              </div>
              {mo.weeks.map((w, wi) => (
                <div key={wi} className="ot-cal-row">
                  <span className="ot-cal-wk">{w.wk}</span>
                  {w.days.map((day, di) => (
                    <div key={di} className={'ot-cal-cell' + (day ? '' : ' empty')}>
                      {day && (
                        <>
                          <span className="ot-cal-d">{day.d}</span>
                          <div className="ot-cal-acts">
                            {day.acts.map((a, ai) => (
                              <span key={ai} className="ot-cal-act"
                                style={{
                                  background: `color-mix(in oklab, ${SPORTS[a.sport]?.color ?? 'var(--accent)'} 18%, transparent)`,
                                  color: SPORTS[a.sport]?.color ?? 'var(--accent)',
                                }}
                                title={sportName(a.sport, lang)}>
                                <SportGlyph sport={a.sport} size={11} />
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  <span className="ot-cal-total">{w.totalSec > 0 ? fmtDuration(w.totalSec) : ''}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
