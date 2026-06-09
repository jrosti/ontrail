import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';
import { SportGlyph } from '../components/ui/SportGlyph';
import { useStore } from '../store';
import { I18N } from '../i18n';
import { SPORTS, sportName } from '../sports';

export function CalendarPage() {
  const { lang } = useStore();
  const t = I18N[lang];
  const [year, setYear] = useState(new Date().getFullYear());
  const monthNamesFi = ['Tammikuu', 'Helmikuu', 'Maaliskuu', 'Huhtikuu', 'Toukokuu', 'Kesäkuu', 'Heinäkuu', 'Elokuu', 'Syyskuu', 'Lokakuu', 'Marraskuu', 'Joulukuu'];
  const monthNamesEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dows = lang === 'fi' ? ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su'] : ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  const now = new Date();
  const currentMonth = now.getMonth();

  // Show last 3 months
  const months = Array.from({ length: 3 }, (_, idx) => {
    const m = (currentMonth - idx + 12) % 12;
    const y = currentMonth - idx < 0 ? year - 1 : year;
    const first = new Date(y, m, 1);
    const startDow = (first.getDay() + 6) % 7;
    const days = new Date(y, m + 1, 0).getDate();
    const weeks: { days: (null | { d: number; acts: { sport: string; km: number }[] })[]; km: number; wk: number }[] = [];
    let week: (null | { d: number; acts: { sport: string; km: number }[] })[] = new Array(startDow).fill(null);
    let weekKm = 0;
    for (let d = 1; d <= days; d++) {
      const acts = Math.random() < 0.45 ? [{ sport: ['run', 'bike', 'orient', 'gym'][Math.floor(Math.random() * 4)], km: +(3 + Math.random() * 12).toFixed(1) }] : [];
      weekKm += acts.reduce((s, a) => s + a.km, 0);
      week.push({ d, acts });
      if (week.length === 7) {
        weeks.push({ days: week, km: weekKm, wk: Math.ceil(d / 7) + idx * 4 });
        week = []; weekKm = 0;
      }
    }
    if (week.length) { while (week.length < 7) week.push(null); weeks.push({ days: week, km: weekKm, wk: weeks.length + 1 }); }
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
                                <SportGlyph sport={a.sport} size={11} />{a.km}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  <span className="ot-cal-total">{w.km > 0 ? `${w.km.toFixed(0)} km` : ''}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
