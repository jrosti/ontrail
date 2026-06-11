import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import {
  getMonthSummaries,
  getPersonalRecords,
  getSportSummary,
  getTagSummary,
  getTagSummaryByMonth,
  getTagSummaryByYear,
  getUser,
  getYearSummary,
  listExercises,
} from '../api';
import { Avatar } from '../components/ui/Avatar';
import { Card } from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';
import { SportGlyph } from '../components/ui/SportGlyph';
import { I18N } from '../i18n';
import { SPORTS, sportName } from '../sports';
import { useStore } from '../store';
import type {
  MonthSummary,
  PersonalRecord,
  SportSummary,
  TagSummary,
  TagSummaryMonth,
  YearSportSummary,
} from '../types';
import { fmtDistSummary, fmtDur, fmtPace, fmtPaceSport } from '../utils/format';

const NOW = new Date();
const CURRENT_YEAR = NOW.getFullYear();
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

type Tab = 'workouts' | 'sports' | 'tags' | 'records';
type Scope = 'all' | 'year' | 'month';

type SummaryRow = {
  key: string;
  label: string;
  sport?: string;
  sessionCount: number;
  totalDurationCs: number;
  totalDistanceM: number;
  totalClimbM: number;
  avgHr?: number;
  isTotal?: boolean;
};

function toSportRows(items: (SportSummary | YearSportSummary)[], lang: 'fi' | 'en'): SummaryRow[] {
  return items
    .map((r) => ({
      key: r.sport,
      label: sportName(r.sport, lang),
      sport: r.sport,
      sessionCount: r.sessionCount,
      totalDurationCs: r.totalDurationCs,
      totalDistanceM: r.totalDistanceM,
      totalClimbM: r.totalClimbM,
      avgHr: r.avgHr,
    }))
    .sort((a, b) => b.totalDurationCs - a.totalDurationCs);
}

function toTagRows(items: TagSummary[]): SummaryRow[] {
  return items
    .map((r) => ({
      key: r.tag,
      label: r.tag,
      sessionCount: r.sessionCount,
      totalDurationCs: r.totalDurationCs,
      totalDistanceM: r.totalDistanceM,
      totalClimbM: r.totalClimbM,
      avgHr: r.avgHr,
    }))
    .sort((a, b) => b.totalDurationCs - a.totalDurationCs);
}

function totalRow(rows: SummaryRow[], lang: 'fi' | 'en'): SummaryRow {
  return {
    key: 'TOTAL',
    label: lang === 'fi' ? 'YHTEENSÄ' : 'TOTAL',
    sessionCount: rows.reduce((s, r) => s + r.sessionCount, 0),
    totalDurationCs: rows.reduce((s, r) => s + r.totalDurationCs, 0),
    totalDistanceM: rows.reduce((s, r) => s + r.totalDistanceM, 0),
    totalClimbM: rows.reduce((s, r) => s + r.totalClimbM, 0),
    isTotal: true,
  };
}

function SummaryTable({
  rows,
  lang,
  showTotal,
}: {
  rows: SummaryRow[];
  lang: 'fi' | 'en';
  showTotal?: boolean;
}) {
  if (!rows.length)
    return <div style={{ color: 'var(--text-faint)', fontSize: 13, padding: '8px 0' }}>—</div>;
  const all = showTotal ? [...rows, totalRow(rows, lang)] : rows;
  return (
    <div className="ot-table ot-athlete-table">
      <div className="ot-tr ot-th">
        <span>{lang === 'fi' ? 'Laji / Avainsana' : 'Sport / Tag'}</span>
        <span>{lang === 'fi' ? 'Matka' : 'Distance'}</span>
        <span>{lang === 'fi' ? 'Tahti' : 'Pace'}</span>
        <span>{lang === 'fi' ? 'Aika' : 'Time'}</span>
        <span>{lang === 'fi' ? 'Syke' : 'HR'}</span>
        <span>{lang === 'fi' ? 'Nousu' : 'Climb'}</span>
        <span>{lang === 'fi' ? 'Kerrat' : 'Count'}</span>
      </div>
      {all.map((r) => (
        <div key={r.key} className={`ot-tr ot-td${r.isTotal ? ' ot-total-row' : ''}`}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {r.sport && !r.isTotal && (
              <>
                <span
                  className="ot-table-dot"
                  style={{ background: SPORTS[r.sport]?.color ?? 'var(--accent)' }}
                />
                <SportGlyph sport={r.sport} size={13} />
              </>
            )}
            {r.label}
          </span>
          <span>{fmtDistSummary(r.totalDistanceM, lang)}</span>
          <span style={{ fontVariantNumeric: 'tabular-nums', fontSize: 12 }}>
            {r.sport ? fmtPaceSport(r.totalDurationCs, r.totalDistanceM, r.sport, lang) : '—'}
          </span>
          <span>{fmtDur(r.totalDurationCs)}</span>
          <span>{r.avgHr ? `${r.avgHr} bpm` : '—'}</span>
          <span>{r.totalClimbM ? `${r.totalClimbM} m` : '—'}</span>
          <span style={{ fontWeight: 600 }}>{r.sessionCount}</span>
        </div>
      ))}
    </div>
  );
}

function MonthAccordion({
  year,
  monthRows,
  lang,
  showTotals,
  isTag,
}: {
  year: number;
  monthRows: (MonthSummary | TagSummaryMonth)[];
  lang: 'fi' | 'en';
  showTotals?: boolean;
  isTag?: boolean;
}) {
  const [open, setOpen] = useState<number | null>(NOW.getMonth() + 1);
  const monthNames = lang === 'fi' ? MONTH_NAMES_FI : MONTH_NAMES_EN;

  const byMonth: Record<number, SummaryRow[]> = {};
  for (const r of monthRows) {
    if (!byMonth[r.month]) byMonth[r.month] = [];
    byMonth[r.month].push({
      key: isTag ? (r as TagSummaryMonth).tag : (r as MonthSummary).sport,
      label: isTag ? (r as TagSummaryMonth).tag : sportName((r as MonthSummary).sport, lang),
      sport: isTag ? undefined : (r as MonthSummary).sport,
      sessionCount: r.sessionCount,
      totalDurationCs: r.totalDurationCs,
      totalDistanceM: r.totalDistanceM,
      totalClimbM: r.totalClimbM,
      avgHr: r.avgHr,
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {Array.from({ length: 12 }, (_, i) => 12 - i).map((m) => {
        const rows = (byMonth[m] ?? []).sort((a, b) => b.totalDurationCs - a.totalDurationCs);
        if (!rows.length) return null;
        const isOpen = open === m;
        const tot = rows.reduce((s, r) => s + r.totalDurationCs, 0);
        const dist = rows.reduce((s, r) => s + r.totalDistanceM, 0);
        const cnt = rows.reduce((s, r) => s + r.sessionCount, 0);
        return (
          <div key={m}>
            <button
              type="button"
              className="ot-month-header"
              onClick={() => setOpen(isOpen ? null : m)}
            >
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                {monthNames[m - 1]} {year}
              </span>
              <span style={{ color: 'var(--text-faint)', fontSize: 13, display: 'flex', gap: 16 }}>
                <span>
                  {cnt} {lang === 'fi' ? 'kertaa' : 'sessions'}
                </span>
                {dist > 0 && <span>{fmtDistSummary(dist, lang)}</span>}
                <span>{fmtDur(tot)}</span>
              </span>
              <Icon
                name="chevron"
                size={14}
                style={{
                  marginLeft: 'auto',
                  transform: isOpen ? 'rotate(-90deg)' : 'rotate(90deg)',
                  transition: 'transform .15s',
                  opacity: 0.4,
                }}
              />
            </button>
            {isOpen && (
              <div style={{ paddingTop: 4 }}>
                <SummaryTable rows={rows} lang={lang} showTotal={showTotals} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function AthletePage({ username, initialTab }: { username: string; initialTab?: Tab }) {
  const { lang, currentUser } = useStore();
  const t = I18N[lang];
  const [tab, setTab] = useState<Tab>(initialTab ?? 'workouts');
  const [scope, setScope] = useState<Scope>('all');
  const [year, setYear] = useState(CURRENT_YEAR);

  const { data: user } = useQuery({
    queryKey: ['user', username],
    queryFn: () => getUser(username),
    enabled: !!username,
  });

  // Workouts tab
  const { data: exercisesData } = useQuery({
    queryKey: ['exercises', username, 50],
    queryFn: () => listExercises({ user: username, perPage: 50 }),
    enabled: tab === 'workouts' && !!username,
  });

  // Sport summary
  const { data: allSports } = useQuery({
    queryKey: ['sportSummaryAll', username],
    queryFn: () => getSportSummary(username),
    enabled: tab === 'sports' && scope === 'all' && !!username,
  });
  const { data: yearSports } = useQuery({
    queryKey: ['yearSummary', username, year],
    queryFn: () => getYearSummary(username, year),
    enabled: tab === 'sports' && scope !== 'all' && !!username,
  });
  const { data: monthSports } = useQuery({
    queryKey: ['monthSummaries', username, year],
    queryFn: () => getMonthSummaries(username, year),
    enabled: tab === 'sports' && scope === 'month' && !!username,
  });

  // Tag summary
  const { data: allTags } = useQuery({
    queryKey: ['tagSummaryAll', username],
    queryFn: () => getTagSummary(username),
    enabled: tab === 'tags' && scope === 'all' && !!username,
  });
  const { data: yearTags } = useQuery({
    queryKey: ['tagSummaryYear', username, year],
    queryFn: () => getTagSummaryByYear(username, year),
    enabled: tab === 'tags' && scope !== 'all' && !!username,
  });
  const { data: monthTags } = useQuery({
    queryKey: ['tagSummaryMonth', username, year],
    queryFn: () => getTagSummaryByMonth(username, year),
    enabled: tab === 'tags' && scope === 'month' && !!username,
  });

  const { data: records } = useQuery({
    queryKey: ['personalRecords', username],
    queryFn: () => getPersonalRecords(username),
    enabled: tab === 'records' && !!username,
  });

  if (!user)
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-faint)' }}>
        <div style={{ fontSize: 14 }}>…</div>
      </div>
    );

  // Derive sport summary rows for current scope
  const sportRows: SummaryRow[] =
    scope === 'all'
      ? toSportRows(allSports ?? [], lang)
      : scope === 'year'
        ? toSportRows(yearSports ?? [], lang)
        : [];

  const tagRows: SummaryRow[] =
    scope === 'all'
      ? toTagRows(allTags ?? [])
      : scope === 'year'
        ? toTagRows((yearTags ?? []).map((t) => ({ ...t })))
        : [];

  const isOwnProfile = currentUser?.username === username;

  return (
    <div className="ot-page">
      {/* Header */}
      <Card style={{ display: 'flex', gap: 18, alignItems: 'center', marginBottom: 4 }}>
        <Avatar
          initials={user.avatarInitials}
          color={user.avatarColor}
          size={56}
          gravatarHash={user.gravatarHash}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ margin: 0, fontSize: 22 }}>{user.displayName || user.username}</h2>
          <div style={{ color: 'var(--text-faint)', fontSize: 13 }}>@{user.username}</div>
          {user.synopsis && (
            <div style={{ fontSize: 14, marginTop: 4, color: 'var(--text-dim)' }}>
              {user.synopsis}
            </div>
          )}
        </div>
        {isOwnProfile && (
          <Link to="/profile" className="ot-iconbtn" aria-label={t.editProfile}>
            <Icon name="edit" size={18} />
          </Link>
        )}
      </Card>

      {/* Tab bar */}
      <div className="ot-scope" style={{ marginBottom: 16 }}>
        {(['workouts', 'sports', 'tags', 'records'] as const).map((k) => (
          <button
            type="button"
            key={k}
            className={`ot-scope-btn${tab === k ? ' active' : ''}`}
            onClick={() => setTab(k)}
          >
            {k === 'workouts'
              ? lang === 'fi'
                ? 'Harjoitukset'
                : 'Workouts'
              : k === 'sports'
                ? t.sportSummary
                : k === 'tags'
                  ? t.keywords
                  : t.records}
          </button>
        ))}
      </div>

      {/* Workouts tab */}
      {tab === 'workouts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {(exercisesData?.items ?? []).map((ex) => (
            <Link key={ex.id} to="/exercise/$id" params={{ id: ex.id }}>
              <Card hover style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: `color-mix(in oklab, ${SPORTS[ex.sport]?.color ?? 'var(--accent)'} 15%, transparent)`,
                    flexShrink: 0,
                  }}
                >
                  <SportGlyph sport={ex.sport} size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{ex.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 2 }}>
                    {ex.date.slice(0, 10)} · {sportName(ex.sport, lang)}
                    {ex.durationCs ? ` · ${fmtDur(ex.durationCs)}` : ''}
                    {ex.distanceM ? ` · ${fmtDistSummary(ex.distanceM, lang)}` : ''}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
          {(exercisesData?.items?.length ?? 0) === 0 && (
            <div
              style={{
                textAlign: 'center',
                color: 'var(--text-faint)',
                padding: '40px 0',
                fontSize: 14,
              }}
            >
              {t.noExercises}
            </div>
          )}
        </div>
      )}

      {/* Sports / Tags tab shared scope bar */}
      {(tab === 'sports' || tab === 'tags') && (
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 16,
              flexWrap: 'wrap',
            }}
          >
            <div className="ot-scope">
              {(['all', 'year', 'month'] as const).map((k) => (
                <button
                  type="button"
                  key={k}
                  className={`ot-scope-btn${scope === k ? ' active' : ''}`}
                  onClick={() => setScope(k)}
                >
                  {k === 'all' ? t.all : k === 'year' ? t.year : t.month}
                </button>
              ))}
            </div>
            {scope !== 'all' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button
                  type="button"
                  className="ot-iconbtn"
                  style={{ width: 32, height: 32 }}
                  onClick={() => setYear((y) => y - 1)}
                >
                  <Icon name="chevron" size={14} style={{ transform: 'rotate(180deg)' }} />
                </button>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: 15,
                    minWidth: 44,
                    textAlign: 'center',
                  }}
                >
                  {year}
                </span>
                <button
                  type="button"
                  className="ot-iconbtn"
                  style={{ width: 32, height: 32 }}
                  onClick={() => setYear((y) => y + 1)}
                >
                  <Icon name="chevron" size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Sports summary */}
          {tab === 'sports' && (
            <Card>
              {scope === 'month' ? (
                <MonthAccordion year={year} monthRows={monthSports ?? []} lang={lang} showTotals />
              ) : (
                <SummaryTable rows={sportRows} lang={lang} showTotal />
              )}
            </Card>
          )}

          {/* Tag summary */}
          {tab === 'tags' && (
            <Card>
              {scope === 'month' ? (
                <MonthAccordion
                  year={year}
                  monthRows={(monthTags ?? []) as TagSummaryMonth[]}
                  lang={lang}
                  isTag
                />
              ) : (
                <SummaryTable rows={tagRows} lang={lang} />
              )}
            </Card>
          )}
        </>
      )}

      {/* Records tab */}
      {tab === 'records' && <RecordsGrid records={records ?? []} lang={lang} />}
    </div>
  );
}

function RecordsGrid({ records, lang }: { records: PersonalRecord[]; lang: 'fi' | 'en' }) {
  const t = I18N[lang];
  if (records.length === 0) {
    return (
      <div
        style={{ textAlign: 'center', color: 'var(--text-faint)', padding: '40px 0', fontSize: 14 }}
      >
        {t.noExercises}
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {records.map((rec) => {
        const sport = SPORTS[rec.sport];
        const color = sport?.color ?? 'var(--accent)';
        const rows: { label: string; value: string; id?: string }[] = [];
        if (rec.bestDistanceM)
          rows.push({
            label: t.distance,
            value: fmtDistSummary(rec.bestDistanceM, lang),
            id: rec.bestDistanceExerciseId,
          });
        if (rec.bestDurationCs)
          rows.push({
            label: t.time,
            value: fmtDur(rec.bestDurationCs),
            id: rec.bestDurationExerciseId,
          });
        if (rec.bestPace) {
          const minPerKm = 6000 / rec.bestPace; // pace stored as dist_m/dur_sec*360
          rows.push({ label: t.pace, value: fmtPace(minPerKm), id: rec.bestPaceExerciseId });
        }
        if (rec.peakAvgHr) rows.push({ label: t.avgHr, value: `${rec.peakAvgHr} bpm` });
        if (rows.length === 0) return null;
        return (
          <Card key={rec.sport} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  flexShrink: 0,
                  background: `color-mix(in oklab, ${color} 15%, transparent)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SportGlyph sport={rec.sport} size={16} />
              </div>
              <span style={{ fontWeight: 600, fontSize: 15 }}>{sportName(rec.sport, lang)}</span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: 8,
              }}
            >
              {rows.map((r) =>
                r.id ? (
                  <Link
                    key={r.label}
                    to="/exercise/$id"
                    params={{ id: r.id }}
                    style={{ textDecoration: 'none' }}
                  >
                    <div
                      style={{
                        background: 'var(--surface-2)',
                        borderRadius: 8,
                        padding: '8px 12px',
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          color: 'var(--text-faint)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {r.label}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontWeight: 700,
                          fontSize: 18,
                          letterSpacing: '-0.02em',
                          marginTop: 2,
                        }}
                      >
                        {r.value}
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div
                    key={r.label}
                    style={{
                      background: 'var(--surface-2)',
                      borderRadius: 8,
                      padding: '8px 12px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        color: 'var(--text-faint)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {r.label}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        fontSize: 18,
                        letterSpacing: '-0.02em',
                        marginTop: 2,
                      }}
                    >
                      {r.value}
                    </div>
                  </div>
                ),
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
