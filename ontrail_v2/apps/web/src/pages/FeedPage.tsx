import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef, useState } from 'react';
import { listExercises, listGroups } from '../api';
import { ExerciseCard } from '../components/exercise/ExerciseCard';
import { Avatar } from '../components/ui/Avatar';
import { Card } from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';
import { I18N } from '../i18n';
import type { FeedSearch } from '../router';
import { useStore } from '../store';
import { parseDistance, parseDuration } from '../utils/format';

export function FeedPage() {
  const { lang, currentUser } = useStore();
  const t = I18N[lang];
  const search = useSearch({ from: '/feed' });
  const nav = useNavigate();
  const parentRef = useRef<HTMLDivElement>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['exercises', search],
    queryFn: ({ pageParam = 1 }) =>
      listExercises({
        page: pageParam as number,
        perPage: 20,
        tag: search.tag,
        sports: search.sports?.join(','),
        user: search.user,
        group: search.group,
        minDistM: search.minDistM,
        maxDistM: search.maxDistM,
        minDurSec: search.minDurSec,
        maxDurSec: search.maxDurSec,
        minHr: search.minHr,
        maxHr: search.maxHr,
        dateFrom: search.dateFrom,
        dateTo: search.dateTo,
        sortBy: search.sortBy,
        sortDir: search.sortDir,
      }),
    getNextPageParam: (last) => (last.page * last.perPage < last.total ? last.page + 1 : undefined),
    initialPageParam: 1,
  });

  const allItems = data?.pages.flatMap((p) => p.items) ?? [];

  const virtualizer = useVirtualizer({
    count: allItems.length + (hasNextPage ? 1 : 0),
    getScrollElement: () => parentRef.current,
    estimateSize: () => 300,
    overscan: 3,
  });

  const hasFilters = !!(
    search.tag ||
    (search.sports?.length ?? 0) > 0 ||
    search.user ||
    search.group ||
    search.minDistM ||
    search.maxDistM ||
    search.minDurSec ||
    search.maxDurSec ||
    search.minHr ||
    search.maxHr ||
    search.dateFrom ||
    search.dateTo ||
    search.sortBy ||
    search.sortDir
  );

  const clearFilters = () => nav({ to: '/feed', search: {} });

  return (
    <div className="ot-grid-3">
      <aside className="ot-col-left">
        <ProfileSidebar />
      </aside>

      <main className="ot-col-mid" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Composer />

        {/* Active filter chips */}
        {hasFilters && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {search.group && (
              <FilterChip
                label={search.group}
                onRemove={() => nav({ to: '/feed', search: { ...search, group: undefined } })}
              />
            )}
            {search.user && (
              <FilterChip
                label={`@${search.user}`}
                onRemove={() => nav({ to: '/feed', search: { ...search, user: undefined } })}
              />
            )}
            {(search.sports ?? []).map((s) => (
              <FilterChip
                key={s}
                label={s}
                onRemove={() =>
                  nav({
                    to: '/feed',
                    search: {
                      ...search,
                      sports: search.sports?.filter((x) => x !== s) || undefined,
                    },
                  })
                }
              />
            ))}
            {search.tag && (
              <FilterChip
                label={`#${search.tag}`}
                onRemove={() => nav({ to: '/feed', search: { ...search, tag: undefined } })}
              />
            )}
            {(search.minDistM || search.maxDistM) && (
              <FilterChip
                label={`${(search.minDistM ?? 0) / 1000}–${search.maxDistM ? search.maxDistM / 1000 : '∞'} km`}
                onRemove={() =>
                  nav({
                    to: '/feed',
                    search: { ...search, minDistM: undefined, maxDistM: undefined },
                  })
                }
              />
            )}
            {(search.minDurSec || search.maxDurSec) && (
              <FilterChip
                label={`${Math.round((search.minDurSec ?? 0) / 60)}–${search.maxDurSec ? Math.round(search.maxDurSec / 60) : '∞'} min`}
                onRemove={() =>
                  nav({
                    to: '/feed',
                    search: { ...search, minDurSec: undefined, maxDurSec: undefined },
                  })
                }
              />
            )}
            {(search.minHr || search.maxHr) && (
              <FilterChip
                label={`${search.minHr ?? 0}–${search.maxHr ?? '∞'} bpm`}
                onRemove={() =>
                  nav({ to: '/feed', search: { ...search, minHr: undefined, maxHr: undefined } })
                }
              />
            )}
            {(search.dateFrom || search.dateTo) && (
              <FilterChip
                label={`${search.dateFrom ?? '…'}–${search.dateTo ?? '…'}`}
                onRemove={() =>
                  nav({
                    to: '/feed',
                    search: { ...search, dateFrom: undefined, dateTo: undefined },
                  })
                }
              />
            )}
            {search.sortBy && (
              <FilterChip
                label={`sort: ${search.sortBy} ${search.sortDir ?? 'desc'}`}
                onRemove={() =>
                  nav({ to: '/feed', search: { ...search, sortBy: undefined, sortDir: undefined } })
                }
              />
            )}
            <button
              type="button"
              onClick={clearFilters}
              style={{
                fontSize: 12,
                color: 'var(--text-faint)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                marginLeft: 4,
              }}
            >
              {lang === 'fi' ? 'Tyhjennä' : 'Clear all'}
            </button>
          </div>
        )}

        {/* Filter toggle */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            type="button"
            className={`ot-iconbtn${filterOpen ? ' active' : ''}`}
            style={{
              width: 'auto',
              padding: '0 12px',
              fontSize: 13,
              fontWeight: 600,
              display: 'flex',
              gap: 6,
              alignItems: 'center',
              height: 34,
              borderRadius: 8,
            }}
            onClick={() => setFilterOpen((o) => !o)}
          >
            <Icon name="analytics" size={15} />
            {lang === 'fi' ? 'Suodattimet' : 'Filters'}
            {hasFilters && <span className="ot-filter-badge" />}
          </button>
        </div>

        {filterOpen && <FilterPanel search={search} lang={lang} />}

        {isLoading && <LoadingSkeleton />}

        <div ref={parentRef} style={{ position: 'relative' }}>
          <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
            {virtualizer.getVirtualItems().map((vItem) => {
              const ex = allItems[vItem.index];
              if (!ex) {
                if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                return (
                  <div
                    key="load-more"
                    style={{
                      transform: `translateY(${vItem.start}px)`,
                      position: 'absolute',
                      width: '100%',
                      paddingBottom: 18,
                    }}
                  >
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '20px 0',
                        color: 'var(--text-faint)',
                        fontSize: 13,
                      }}
                    >
                      {isFetchingNextPage ? '…' : t.loadMore}
                    </div>
                  </div>
                );
              }
              return (
                <div
                  key={ex.id}
                  style={{
                    transform: `translateY(${vItem.start}px)`,
                    position: 'absolute',
                    width: '100%',
                    paddingBottom: 18,
                  }}
                  ref={virtualizer.measureElement}
                  data-index={vItem.index}
                >
                  <ExerciseCard exercise={ex} groupFilter={search.group} />
                </div>
              );
            })}
          </div>
        </div>

        {!isLoading && allItems.length === 0 && (
          <Card style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-faint)' }}>
            <Icon name="feed" size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            <div>{t.noExercises}</div>
            {currentUser && (
              <Link
                to="/log"
                style={{
                  color: 'var(--accent)',
                  marginTop: 12,
                  display: 'inline-block',
                  fontWeight: 600,
                }}
              >
                {t.logTitle}
              </Link>
            )}
          </Card>
        )}
      </main>

      <aside className="ot-col-right">
        <RightRail />
      </aside>
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="ot-filter-chip">
      {label}
      <button type="button" onClick={onRemove} aria-label="remove filter">
        <Icon name="close" size={11} stroke={2.4} />
      </button>
    </span>
  );
}

function FilterPanel({ search, lang }: { search: FeedSearch; lang: 'fi' | 'en' }) {
  const nav = useNavigate();
  const t = I18N[lang];

  const { data: groups } = useQuery({ queryKey: ['groups'], queryFn: listGroups });

  const [distMin, setDistMin] = useState(search.minDistM ? String(search.minDistM / 1000) : '');
  const [distMax, setDistMax] = useState(search.maxDistM ? String(search.maxDistM / 1000) : '');
  const [durMin, setDurMin] = useState(
    search.minDurSec ? String(Math.round(search.minDurSec / 60)) : '',
  );
  const [durMax, setDurMax] = useState(
    search.maxDurSec ? String(Math.round(search.maxDurSec / 60)) : '',
  );
  const [hrMin, setHrMin] = useState(search.minHr ? String(search.minHr) : '');
  const [hrMax, setHrMax] = useState(search.maxHr ? String(search.maxHr) : '');
  const [dateFrom, setDateFrom] = useState(search.dateFrom ?? '');
  const [dateTo, setDateTo] = useState(search.dateTo ?? '');
  const [sortBy, setSortBy] = useState<FeedSearch['sortBy']>(search.sortBy ?? 'date');
  const [sortDir, setSortDir] = useState<FeedSearch['sortDir']>(search.sortDir ?? 'desc');

  const apply = () => {
    const updates: Partial<FeedSearch> = {
      minDistM: distMin ? parseDistance(`${distMin}km`) || undefined : undefined,
      maxDistM: distMax ? parseDistance(`${distMax}km`) || undefined : undefined,
      minDurSec: durMin ? parseDuration(`${durMin}min`) || undefined : undefined,
      maxDurSec: durMax ? parseDuration(`${durMax}min`) || undefined : undefined,
      minHr: hrMin ? Number(hrMin) || undefined : undefined,
      maxHr: hrMax ? Number(hrMax) || undefined : undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      sortBy: sortBy !== 'date' ? sortBy : undefined,
      sortDir: sortDir !== 'desc' ? sortDir : undefined,
    };
    nav({ to: '/feed', search: { ...search, ...updates } });
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-faint)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    display: 'block',
    marginBottom: 5,
  };

  return (
    <Card style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: 20 }}>
      {/* Sport multi-select */}
      {(allSports?.length ?? 0) > 0 && (
        <div>
          <span style={labelStyle}>{lang === 'fi' ? 'Laji' : 'Sport'}</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {(allSports ?? []).map((s) => {
              const active = selectedSports.includes(s.key);
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => toggleSport(s.key)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 20,
                    border: '1px solid',
                    borderColor: active ? 'var(--accent)' : 'var(--border)',
                    background: active
                      ? 'color-mix(in oklab, var(--accent) 15%, transparent)'
                      : 'transparent',
                    color: active ? 'var(--accent)' : 'var(--text)',
                    fontSize: 12,
                    cursor: 'pointer',
                    fontWeight: active ? 600 : 400,
                    transition: 'all .1s',
                  }}
                >
                  {sportName(s.key, lang)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 18,
        }}
      >
        {/* Group filter */}
        {(groups?.length ?? 0) > 0 && (
          <div>
            <label htmlFor="filter-group" style={labelStyle}>
              {lang === 'fi' ? 'Ryhmä' : 'Group'}
            </label>
            <select
              id="filter-group"
              className="ot-input"
              value={search.group ?? ''}
              onChange={(e) =>
                nav({ to: '/feed', search: { ...search, group: e.target.value || undefined } })
              }
            >
              <option value="">{lang === 'fi' ? 'Kaikki' : 'All'}</option>
              {(groups ?? []).map((g) => (
                <option key={g.normalizedName} value={g.normalizedName}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Distance range */}
        <div>
          <label htmlFor="filter-dist-min" style={labelStyle}>
            {lang === 'fi' ? 'Matka (km)' : 'Distance (km)'}
          </label>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input
              id="filter-dist-min"
              className="ot-input"
              placeholder="min"
              value={distMin}
              onChange={(e) => setDistMin(e.target.value)}
              inputMode="decimal"
              style={{ width: '100%' }}
            />
            <span style={{ color: 'var(--text-faint)', fontSize: 12 }}>–</span>
            <input
              className="ot-input"
              placeholder="max"
              value={distMax}
              onChange={(e) => setDistMax(e.target.value)}
              inputMode="decimal"
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Duration range */}
        <div>
          <label htmlFor="filter-dur-min" style={labelStyle}>
            {lang === 'fi' ? 'Kesto (min)' : 'Duration (min)'}
          </label>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input
              id="filter-dur-min"
              className="ot-input"
              placeholder="min"
              value={durMin}
              onChange={(e) => setDurMin(e.target.value)}
              inputMode="numeric"
              style={{ width: '100%' }}
            />
            <span style={{ color: 'var(--text-faint)', fontSize: 12 }}>–</span>
            <input
              className="ot-input"
              placeholder="max"
              value={durMax}
              onChange={(e) => setDurMax(e.target.value)}
              inputMode="numeric"
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* HR range */}
        <div>
          <label htmlFor="filter-hr-min" style={labelStyle}>
            {lang === 'fi' ? 'Syke (bpm)' : 'Heart rate (bpm)'}
          </label>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input
              id="filter-hr-min"
              className="ot-input"
              placeholder="min"
              value={hrMin}
              onChange={(e) => setHrMin(e.target.value)}
              inputMode="numeric"
              style={{ width: '100%' }}
            />
            <span style={{ color: 'var(--text-faint)', fontSize: 12 }}>–</span>
            <input
              className="ot-input"
              placeholder="max"
              value={hrMax}
              onChange={(e) => setHrMax(e.target.value)}
              inputMode="numeric"
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Date range */}
        <div>
          <label htmlFor="filter-date-from" style={labelStyle}>
            {lang === 'fi' ? 'Päivämäärä' : 'Date range'}
          </label>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              id="filter-date-from"
              className="ot-input"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              style={{ flex: 1, minWidth: 120 }}
            />
            <span style={{ color: 'var(--text-faint)', fontSize: 12 }}>–</span>
            <input
              className="ot-input"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              style={{ flex: 1, minWidth: 120 }}
            />
          </div>
        </div>

        {/* Sort */}
        <div>
          <label htmlFor="filter-sort-by" style={labelStyle}>
            {lang === 'fi' ? 'Järjestys' : 'Sort by'}
          </label>
          <div style={{ display: 'flex', gap: 6 }}>
            <select
              id="filter-sort-by"
              className="ot-input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as FeedSearch['sortBy'])}
              style={{ flex: 1 }}
            >
              <option value="date">{lang === 'fi' ? 'Päivämäärä' : 'Date'}</option>
              <option value="distance">{lang === 'fi' ? 'Matka' : 'Distance'}</option>
              <option value="duration">{lang === 'fi' ? 'Kesto' : 'Duration'}</option>
              <option value="hr">{lang === 'fi' ? 'Syke' : 'Heart rate'}</option>
            </select>
            <select
              className="ot-input"
              value={sortDir}
              onChange={(e) => setSortDir(e.target.value as FeedSearch['sortDir'])}
              style={{ flex: 1 }}
            >
              <option value="desc">{lang === 'fi' ? 'Laskeva' : 'Descending'}</option>
              <option value="asc">{lang === 'fi' ? 'Nouseva' : 'Ascending'}</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button type="button" className="ot-rec-btn" onClick={apply}>
          {t.search.split(' ')[0]}
        </button>
        <button
          type="button"
          className="ot-iconbtn"
          style={{ width: 'auto', padding: '0 14px', fontSize: 13 }}
          onClick={() => nav({ to: '/feed', search: {} })}
        >
          {lang === 'fi' ? 'Tyhjennä' : 'Clear'}
        </button>
      </div>
    </Card>
  );
}

function Composer() {
  const { lang, currentUser } = useStore();
  const t = I18N[lang];
  return (
    <Card style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {currentUser && (
        <Avatar initials={currentUser.avatarInitials} color={currentUser.avatarColor} size={40} />
      )}
      <Link
        to="/log"
        className="ot-composer-input"
        style={{ display: 'flex', alignItems: 'center' }}
      >
        {t.composer}
      </Link>
      <Link to="/log" className="ot-composer-go" aria-label={t.composer}>
        <Icon name="plus" size={18} stroke={2.4} />
      </Link>
    </Card>
  );
}

function ProfileSidebar() {
  const { lang, currentUser } = useStore();
  const t = I18N[lang];
  if (!currentUser)
    return (
      <Card style={{ textAlign: 'center', padding: '24px 18px' }}>
        <Icon name="user" size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
        <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600, display: 'block' }}>
          {t.login}
        </Link>
      </Card>
    );
  return (
    <Card
      pad={false}
      style={{ overflow: 'hidden', position: 'sticky', top: 'calc(var(--nav-h) + 18px)' }}
    >
      <div className="ot-profile-cover">
        <Avatar
          initials={currentUser.avatarInitials}
          color={currentUser.avatarColor}
          size={64}
          ring
        />
        <div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 20,
              color: '#fff',
              lineHeight: 1.1,
            }}
          >
            {currentUser.displayName}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 2 }}>
            @{currentUser.username}
          </div>
        </div>
      </div>
      <div className="ot-profile-nav">
        <Link
          to="/feed"
          search={{}}
          className="ot-pnav"
          activeProps={{ className: 'ot-pnav active' }}
          inactiveProps={{ className: 'ot-pnav' }}
        >
          <Icon name="feed" size={17} />
          <span>{t.activities}</span>
        </Link>
        <Link
          to="/analytics"
          className="ot-pnav"
          activeProps={{ className: 'ot-pnav active' }}
          inactiveProps={{ className: 'ot-pnav' }}
        >
          <Icon name="analytics" size={17} />
          <span>{t.analytics}</span>
        </Link>
        <Link
          to="/calendar"
          className="ot-pnav"
          activeProps={{ className: 'ot-pnav active' }}
          inactiveProps={{ className: 'ot-pnav' }}
        >
          <Icon name="calendar" size={17} />
          <span>{t.calendar}</span>
        </Link>
        <Link to="/diary/$username" params={{ username: currentUser.username }} className="ot-pnav">
          <Icon name="user" size={17} />
          <span>{t.myDiary}</span>
        </Link>
        <Link
          to="/toplists"
          className="ot-pnav"
          activeProps={{ className: 'ot-pnav active' }}
          inactiveProps={{ className: 'ot-pnav' }}
        >
          <Icon name="bolt" size={17} />
          <span>{lang === 'fi' ? 'Toplistat' : 'Top lists'}</span>
        </Link>
      </div>
    </Card>
  );
}

function RightRail() {
  const { lang } = useStore();
  const t = I18N[lang];
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        position: 'sticky',
        top: 'calc(var(--nav-h) + 18px)',
      }}
    >
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="ot-rail-hd">
          <Icon name="bolt" size={16} stroke={2.2} style={{ color: 'var(--accent)' }} />
          {t.thisWeek}
        </div>
        <div style={{ color: 'var(--text-faint)', fontSize: 13 }}>{t.noExercises}</div>
      </Card>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            height: 200,
            borderRadius: 'var(--radius)',
            background: 'var(--surface-2)',
            animation: 'pulse 1.5s infinite',
          }}
        />
      ))}
    </div>
  );
}
