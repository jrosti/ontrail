import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createExercise, getExercise, getUserTags, listSports, updateExercise } from '../api';
import { RichEditor } from '../components/editor/RichEditor';
import { GpxDropzone } from '../components/exercise/GpxDropzone';
import { Card } from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';
import { SportGlyph } from '../components/ui/SportGlyph';
import { I18N } from '../i18n';
import { ALL_SPORTS, SPORTS } from '../sports';
import { useStore } from '../store';
import type { Sport } from '../types';
import {
  calcPace,
  calcSpeed,
  fmtDistKm,
  fmtDurLabel,
  fmtPace,
  parseDistance,
  parseDuration,
} from '../utils/format';
import type { GpxResult } from '../utils/gpx';

function formatDurationInput(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.round(sec % 60);
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${m}:${String(s).padStart(2, '0')}`;
}

function formatDistanceInput(meters?: number): string {
  return meters ? (meters / 1000).toFixed(2) : '';
}

export function LogPage() {
  const { lang, favoriteSports, rememberSport, currentUser } = useStore();
  const t = I18N[lang];
  const nav = useNavigate();
  const qc = useQueryClient();

  // check for edit mode
  const searchParams = new URLSearchParams(window.location.search);
  const editId = searchParams.get('id');

  const { data: existing } = useQuery({
    queryKey: ['exercise', editId],
    queryFn: () => getExercise(editId ?? ''),
    enabled: !!editId,
  });

  const { data: apiSports } = useQuery({
    queryKey: ['sports'],
    queryFn: listSports,
  });

  const [sport, setSport] = useState(existing?.sport ?? 'run');
  const [form, setForm] = useState({
    title: existing?.title ?? '',
    duration: '',
    distance: '',
    hr: existing?.avgHr?.toString() ?? '',
    reps: '',
    volume: '',
    climb: existing?.climbM?.toString() ?? '',
    feel: existing?.feelRating ?? 'ok',
    date: existing?.date?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
    tags: existing?.tags ?? ([] as string[]),
    desc: '',
    descHtml: existing?.body ?? '',
  });
  const [tagDraft, setTagDraft] = useState('');
  const [tagSuggestOpen, setTagSuggestOpen] = useState(false);

  const { data: userTags = [] } = useQuery({
    queryKey: ['userTags', currentUser?.username],
    queryFn: () => getUserTags(currentUser!.username),
    enabled: !!currentUser?.username,
    staleTime: 5 * 60_000,
  });

  const tagSuggestions = tagDraft.trim()
    ? userTags.filter(
        (t) => t.toLowerCase().startsWith(tagDraft.trim().toLowerCase()) && !form.tags.includes(t),
      )
    : [];

  const [editorMode, setEditorMode] = useState<'wysiwyg' | 'markdown'>('wysiwyg');
  const [gpxResult, setGpxResult] = useState<GpxResult | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [sportQuery, setSportQuery] = useState('');

  const titleInputRef = useRef<HTMLInputElement>(null);
  const sportSearchRef = useRef<HTMLInputElement>(null);

  // Focus title input on mount
  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  // Focus sport search input when picker opens
  useEffect(() => {
    if (pickerOpen) {
      sportSearchRef.current?.focus();
    }
  }, [pickerOpen]);

  const sports = apiSports?.length ? apiSports : ALL_SPORTS;
  const sportsByKey = useMemo(() => Object.fromEntries(sports.map((s) => [s.key, s])), [sports]);
  const selectedSport = sportsByKey[sport] ?? SPORTS[sport];
  const favoriteSportOptions = favoriteSports
    .map((key) => sportsByKey[key] ?? SPORTS[key])
    .filter((s): s is Sport => Boolean(s))
    .slice(0, 10);
  const filteredSports = sports.filter((s) => {
    const q = sportQuery.trim().toLocaleLowerCase();
    if (!q) return true;
    return s.nameFi.toLocaleLowerCase().includes(q) || s.nameEn.toLocaleLowerCase().includes(q);
  });

  const chooseSport = (key: string) => {
    setSport(key);
    rememberSport(key);
    setPickerOpen(false);
    setSportQuery('');
  };

  useEffect(() => {
    if (!existing) return;
    setSport(existing.sport);
    setForm({
      title: existing.title,
      duration: formatDurationInput(existing.durationSec),
      distance: formatDistanceInput(existing.distanceM),
      hr: existing.avgHr?.toString() ?? '',
      reps: existing.details?.reps?.toString() ?? '',
      volume: existing.details?.volume ? String(existing.details.volume / 1000) : '',
      climb: existing.climbM?.toString() ?? '',
      feel: existing.feelRating ?? 'ok',
      date: existing.date.slice(0, 10),
      tags: existing.tags,
      desc: existing.body ?? '',
      descHtml: existing.body ?? '',
    });
  }, [existing]);

  const onGpxLoaded = (result: GpxResult) => {
    setGpxResult(result);
    // Prefill form fields from GPS data — only overwrite if still empty
    const updates: Partial<typeof form> = {};
    if (!form.title && result.name) updates.title = result.name;
    if (!form.distance && result.distanceM > 0)
      updates.distance = (result.distanceM / 1000).toFixed(2);
    if (!form.duration && result.durationSec && result.durationSec > 0) {
      const h = Math.floor(result.durationSec / 3600);
      const m = Math.floor((result.durationSec % 3600) / 60);
      const s = result.durationSec % 60;
      updates.duration =
        h > 0
          ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
          : `${m}:${String(s).padStart(2, '0')}`;
    }
    if (!form.climb && result.elevationGainM > 0)
      updates.climb = String(Math.round(result.elevationGainM));
    if (result.startTime) updates.date = result.startTime.slice(0, 10);
    setForm((f) => ({ ...f, ...updates }));
  };

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const meta = selectedSport ?? SPORTS[sport];
  const sec = parseDuration(form.duration);
  const distM = parseDistance(form.distance);
  const effectiveSec = sec || existing?.durationSec || 0;
  const effectiveDistM = distM || existing?.distanceM || 0;
  const km = effectiveDistM / 1000;
  const pace = effectiveDistM > 0 && effectiveSec > 0 ? calcPace(effectiveSec, effectiveDistM) : 0;
  const speed =
    effectiveDistM > 0 && effectiveSec > 0 ? calcSpeed(effectiveSec, effectiveDistM) : 0;
  const isReps = meta?.metric === 'reps';
  const isSpeed = meta?.metric === 'speed';
  const canSave = form.title.trim() && effectiveSec > 0;

  const addTag = () => {
    const v = tagDraft.trim().replace(/^#/, '');
    if (v && !form.tags.includes(v)) set('tags', [...form.tags, v]);
    setTagDraft('');
  };

  const saveMut = useMutation({
    mutationFn: () => {
      rememberSport(sport);
      const payload = {
        sport,
        title: form.title,
        durationSec: effectiveSec,
        distanceM: effectiveDistM || undefined,
        avgHr: form.hr ? +form.hr : undefined,
        climbM: form.climb ? +form.climb : undefined,
        feelRating: form.feel as 'easy' | 'ok' | 'hard',
        tags: form.tags,
        body: form.descHtml,
        date: form.date,
        details: isReps ? { reps: +form.reps, volume: +form.volume * 1000 } : undefined,
        gpxPoints: gpxResult
          ? gpxResult.points.map((p) => ({ lat: p.lat, lon: p.lon, ele: p.ele }))
          : existing?.gpxPoints,
      };
      return editId ? updateExercise(editId, payload) : createExercise(payload);
    },
    onSuccess: (ex) => {
      qc.invalidateQueries({ queryKey: ['exercise', ex.id] });
      qc.invalidateQueries({ queryKey: ['exercises'] });
      nav({ to: '/exercise/$id', params: { id: ex.id } });
    },
  });

  const paceDisplay = isSpeed ? (speed ? speed.toFixed(1) : '—') : pace ? fmtPace(pace) : '—';
  const paceUnitDisplay = isSpeed ? t.kmh : t.minkm;

  return (
    <div className="ot-log">
      <div className="ot-log-head">
        <button type="button" className="ot-back" onClick={() => nav({ to: '/feed', search: {} })}>
          <Icon name="chevron" size={18} style={{ transform: 'rotate(180deg)' }} />
          {t.back}
        </button>
        <h1 className="ot-page-title" style={{ marginTop: 12 }}>
          {editId ? t.editExercise : t.logTitle}
        </h1>
        <p className="ot-page-sub">{t.logSub}</p>
      </div>

      <div className="ot-log-grid">
        <form
          id="ot-log-form"
          className="ot-log-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (canSave) saveMut.mutate();
          }}
        >
          <Card style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <input
              ref={titleInputRef}
              className="ot-log-title"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder={t.titlePh}
            />

            <div>
              <span className="ot-field-label" style={{ marginBottom: 10, display: 'block' }}>
                {t.sportField}
              </span>
              <div className="ot-sport-pick">
                {favoriteSportOptions.map((s) => (
                  <button
                    type="button"
                    key={s.key}
                    className={`ot-sport-chip${sport === s.key ? ' active' : ''}`}
                    onClick={() => chooseSport(s.key)}
                    style={
                      sport === s.key ? ({ '--chip': s.color } as React.CSSProperties) : undefined
                    }
                  >
                    <SportGlyph sport={s.key} size={17} />
                    {lang === 'fi' ? s.nameFi : s.nameEn}
                  </button>
                ))}
                <button
                  type="button"
                  className="ot-sport-chip"
                  onClick={() => setPickerOpen(true)}
                  style={
                    { '--chip': selectedSport?.color ?? 'var(--accent)' } as React.CSSProperties
                  }
                >
                  <Icon name="plus" size={17} />
                  {t.moreSports}
                </button>
              </div>
            </div>

            <div className="ot-field-row">
              <label className="ot-field">
                <span className="ot-field-label">
                  {t.durationField} <em className="ot-field-badge">{t.req}</em>
                </span>
                <input
                  className="ot-input"
                  value={form.duration}
                  onChange={(e) => set('duration', e.target.value)}
                  placeholder="0:00:00"
                  inputMode="numeric"
                />
                <span className="ot-field-hint">{t.durationPh}</span>
              </label>
              {!isReps && (
                <label className="ot-field">
                  <span className="ot-field-label">
                    {t.distanceField} <em className="ot-field-badge">{t.opt}</em>
                  </span>
                  <div className="ot-input-unit">
                    <input
                      value={form.distance}
                      onChange={(e) => set('distance', e.target.value)}
                      placeholder="0,00"
                      inputMode="decimal"
                    />
                    <span>km</span>
                  </div>
                </label>
              )}
              {isReps && (
                <label className="ot-field">
                  <span className="ot-field-label">
                    {t.repsField} <em className="ot-field-badge">{t.opt}</em>
                  </span>
                  <input
                    className="ot-input"
                    value={form.reps}
                    onChange={(e) => set('reps', e.target.value)}
                    placeholder="0"
                    inputMode="numeric"
                  />
                </label>
              )}
            </div>

            <div className="ot-field-row">
              <label className="ot-field">
                <span className="ot-field-label">
                  {t.avgHrField} <em className="ot-field-badge">{t.opt}</em>
                </span>
                <div className="ot-input-unit">
                  <input
                    value={form.hr}
                    onChange={(e) => set('hr', e.target.value)}
                    placeholder="0"
                    inputMode="numeric"
                  />
                  <span>{t.bpm}</span>
                </div>
              </label>
              {isReps ? (
                <label className="ot-field">
                  <span className="ot-field-label">
                    {t.volumeField} <em className="ot-field-badge">{t.opt}</em>
                  </span>
                  <div className="ot-input-unit">
                    <input
                      value={form.volume}
                      onChange={(e) => set('volume', e.target.value)}
                      placeholder="0"
                      inputMode="numeric"
                    />
                    <span>kg</span>
                  </div>
                </label>
              ) : (
                <label className="ot-field">
                  <span className="ot-field-label">
                    {t.paceField} <em className="ot-field-badge">{t.autoCalc}</em>
                  </span>
                  <div className="ot-input-unit ot-computed">
                    <input readOnly value={paceDisplay} />
                    <span>{paceUnitDisplay}</span>
                  </div>
                </label>
              )}
            </div>

            <div className="ot-field-row">
              <label className="ot-field">
                <span className="ot-field-label">
                  {t.climbField} <em className="ot-field-badge">{t.opt}</em>
                </span>
                <div className="ot-input-unit">
                  <input
                    value={form.climb}
                    onChange={(e) => set('climb', e.target.value)}
                    placeholder="0"
                    inputMode="numeric"
                  />
                  <span>m</span>
                </div>
              </label>
              <label className="ot-field">
                <span className="ot-field-label">{t.dateField}</span>
                <input
                  className="ot-input"
                  type="date"
                  value={form.date}
                  onChange={(e) => set('date', e.target.value)}
                />
              </label>
            </div>

            <div>
              <span className="ot-field-label" style={{ marginBottom: 10, display: 'block' }}>
                {t.intensityField}
              </span>
              <div className="ot-feel">
                {(
                  [
                    ['feelEasy', 'easy'],
                    ['feelOk', 'ok'],
                    ['feelHard', 'hard'],
                  ] as const
                ).map(([lbl, v], i) => (
                  <button
                    type="button"
                    key={v}
                    className={`ot-feel-btn${form.feel === v ? ' active' : ''}`}
                    onClick={() => set('feel', v)}
                  >
                    <span className="ot-feel-dots">
                      {Array.from({ length: 3 }).map((_, j) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: static 3-dot decoration
                        <i key={j} className={j <= i ? 'on' : ''} />
                      ))}
                    </span>
                    {t[lbl]}
                  </button>
                ))}
              </div>
            </div>

            <label className="ot-field">
              <span className="ot-field-label">
                {t.keywords} <em className="ot-field-badge">{t.opt}</em>
              </span>
              <div style={{ position: 'relative' }}>
                <div className="ot-tag-input">
                  {form.tags.map((tag) => (
                    <span key={tag} className="ot-tag-chip">
                      #{tag}
                      <button
                        type="button"
                        onClick={() =>
                          set(
                            'tags',
                            form.tags.filter((x) => x !== tag),
                          )
                        }
                      >
                        <Icon name="close" size={12} stroke={2.4} />
                      </button>
                    </span>
                  ))}
                  <input
                    value={tagDraft}
                    onChange={(e) => {
                      setTagDraft(e.target.value);
                      setTagSuggestOpen(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (tagSuggestions.length > 0 && tagSuggestOpen) {
                          set('tags', [...form.tags, tagSuggestions[0]]);
                          setTagDraft('');
                          setTagSuggestOpen(false);
                        } else {
                          addTag();
                          setTagSuggestOpen(false);
                        }
                      } else if (e.key === 'Escape') {
                        setTagSuggestOpen(false);
                      }
                    }}
                    onBlur={() => setTimeout(() => setTagSuggestOpen(false), 150)}
                    onFocus={() => tagDraft.trim() && setTagSuggestOpen(true)}
                    placeholder={form.tags.length ? '' : t.keywordsPh}
                  />
                </div>
                {tagSuggestOpen && tagSuggestions.length > 0 && (
                  <div className="ot-tag-suggest">
                    {tagSuggestions.slice(0, 8).map((s) => (
                      <button
                        key={s}
                        type="button"
                        className="ot-tag-suggest-item"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          set('tags', [...form.tags, s]);
                          setTagDraft('');
                          setTagSuggestOpen(false);
                        }}
                      >
                        #{s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </label>

            <div className="ot-field">
              <span className="ot-field-label">
                {t.gpxField} <em className="ot-field-badge">{t.opt}</em>
              </span>
              <GpxDropzone
                result={gpxResult}
                onLoaded={onGpxLoaded}
                onRemove={() => setGpxResult(null)}
                accent={SPORTS[sport]?.color ?? 'var(--accent)'}
                label={t.gpxField}
                hint={t.gpxDrop}
                removeLabel={t.gpxRemove}
                loadedLabel={t.gpxLoaded}
                pointsLabel={t.gpxPoints}
                filledLabel={t.gpxFilled}
              />
            </div>

            <div className="ot-field">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}
              >
                <span className="ot-field-label">
                  {t.descField} <em className="ot-field-badge">{t.opt}</em>
                </span>
                <div
                  style={{
                    display: 'flex',
                    gap: 4,
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: 3,
                  }}
                >
                  {(['wysiwyg', 'markdown'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setEditorMode(mode)}
                      style={{
                        border: 0,
                        borderRadius: 6,
                        padding: '4px 10px',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        background: editorMode === mode ? 'var(--surface)' : 'transparent',
                        color: editorMode === mode ? 'var(--text)' : 'var(--text-faint)',
                      }}
                    >
                      {mode === 'wysiwyg' ? t.writeEditor : t.writeMarkdown}
                    </button>
                  ))}
                </div>
              </div>
              {editorMode === 'wysiwyg' ? (
                <RichEditor
                  value={form.descHtml}
                  onChange={(html) => set('descHtml', html)}
                  placeholder={t.descPh}
                />
              ) : (
                <textarea
                  className="ot-textarea"
                  rows={6}
                  value={form.desc}
                  onChange={(e) => {
                    set('desc', e.target.value);
                    set('descHtml', e.target.value);
                  }}
                  placeholder={t.descPh}
                />
              )}
            </div>
          </Card>
        </form>

        <aside className="ot-log-preview">
          <div className="ot-preview-sticky">
            <div className="ot-rail-hd" style={{ marginBottom: 12 }}>
              <Icon name="feed" size={15} stroke={2} style={{ color: 'var(--accent)' }} />
              {t.preview}
            </div>
            <Card style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18 }}>
                {form.title || t.titlePh}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(12px, 3%, 24px)' }}>
                {km > 0 && (
                  <div>
                    <div
                      style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22 }}
                    >
                      {fmtDistKm(effectiveDistM, lang, 2)}
                      <span style={{ fontSize: 11, color: 'var(--text-dim)', marginLeft: 4 }}>
                        km
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: 'var(--text-faint)',
                        fontWeight: 600,
                      }}
                    >
                      {t.distance}
                    </div>
                  </div>
                )}
                {sec > 0 && (
                  <div>
                    <div
                      style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22 }}
                    >
                      {fmtDurLabel(sec)}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: 'var(--text-faint)',
                        fontWeight: 600,
                      }}
                    >
                      {t.time}
                    </div>
                  </div>
                )}
                {pace > 0 && (
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 600,
                        fontSize: 22,
                        color: 'var(--accent)',
                      }}
                    >
                      {paceDisplay}
                      <span style={{ fontSize: 11, marginLeft: 4, color: 'var(--text-dim)' }}>
                        {paceUnitDisplay}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: 'var(--text-faint)',
                        fontWeight: 600,
                      }}
                    >
                      {t.pace}
                    </div>
                  </div>
                )}
              </div>
              {form.tags.length > 0 && (
                <div className="ot-tags">
                  {form.tags.map((tag) => (
                    <span key={tag} className="ot-tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </Card>
            <p className="ot-preview-hint">{t.previewHint}</p>
          </div>
        </aside>
      </div>

      <div className="ot-log-footer">
        <button
          type="button"
          className="ot-btn-ghost"
          onClick={() => nav({ to: '/feed', search: {} })}
        >
          {t.cancel}
        </button>
        <button
          type="submit"
          form="ot-log-form"
          className="ot-btn-primary"
          disabled={!canSave || saveMut.isPending}
        >
          <Icon name="check" size={18} stroke={2.4} />
          {t.save}
        </button>
      </div>

      {pickerOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'grid',
            placeItems: 'center',
            padding: 16,
          }}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setPickerOpen(false)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,.36)',
              border: 'none',
              cursor: 'default',
              padding: 0,
            }}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t.sportPicker}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              zIndex: 1,
              width: 'min(620px, 100%)',
              maxHeight: 'min(720px, 88vh)',
              overflow: 'hidden',
              borderRadius: 12,
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              boxShadow: '0 24px 70px rgba(0,0,0,.25)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                padding: 16,
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                gap: 10,
                alignItems: 'center',
              }}
            >
              <div style={{ fontWeight: 700, flex: 1 }}>{t.sportPicker}</div>
              <button
                type="button"
                className="ot-iconbtn"
                onClick={() => setPickerOpen(false)}
                aria-label={t.cancel}
              >
                <Icon name="close" size={16} />
              </button>
            </div>
            <div style={{ padding: 14, borderBottom: '1px solid var(--border)' }}>
              <input
                ref={sportSearchRef}
                className="ot-input"
                value={sportQuery}
                onChange={(e) => setSportQuery(e.target.value)}
                placeholder={t.sportSearch}
              />
            </div>
            <div
              style={{
                overflowY: 'auto',
                padding: 10,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: 8,
              }}
            >
              {filteredSports.map((s) => (
                <button
                  type="button"
                  key={s.key}
                  onClick={() => chooseSport(s.key)}
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: '10px 11px',
                    background:
                      sport === s.key
                        ? 'color-mix(in oklab, var(--accent) 10%, var(--surface))'
                        : 'var(--surface)',
                    color: 'var(--text)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    cursor: 'pointer',
                    textAlign: 'left',
                    minHeight: 42,
                  }}
                >
                  <span style={{ color: s.color }}>
                    <SportGlyph sport={s.key} size={17} />
                  </span>
                  <span style={{ fontWeight: sport === s.key ? 700 : 600 }}>
                    {lang === 'fi' ? s.nameFi : s.nameEn}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
