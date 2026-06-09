import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Card } from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';
import { SportGlyph } from '../components/ui/SportGlyph';
import { RichEditor } from '../components/editor/RichEditor';
import { GpxDropzone } from '../components/exercise/GpxDropzone';
import { useStore } from '../store';
import { I18N } from '../i18n';
import { SPORTS } from '../sports';
import { parseDuration, parseDistance, calcPace, calcSpeed, fmtPace } from '../utils/format';
import { createExercise, updateExercise, getExercise } from '../api';
import type { GpxResult } from '../utils/gpx';

export function LogPage() {
  const { lang } = useStore();
  const t = I18N[lang];
  const nav = useNavigate();

  // check for edit mode
  const searchParams = new URLSearchParams(window.location.search);
  const editId = searchParams.get('id');

  const { data: existing } = useQuery({
    queryKey: ['exercise', editId],
    queryFn: () => getExercise(editId!),
    enabled: !!editId,
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
    tags: existing?.tags ?? [] as string[],
    desc: '',
    descHtml: existing?.body ?? '',
  });
  const [tagDraft, setTagDraft] = useState('');
  const [editorMode, setEditorMode] = useState<'wysiwyg' | 'markdown'>('wysiwyg');
  const [gpxResult, setGpxResult] = useState<GpxResult | null>(null);

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
      updates.duration = h > 0 ? `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}` : `${m}:${String(s).padStart(2,'0')}`;
    }
    if (!form.climb && result.elevationGainM > 0)
      updates.climb = String(Math.round(result.elevationGainM));
    if (result.startTime)
      updates.date = result.startTime.slice(0, 10);
    setForm(f => ({ ...f, ...updates }));
  };

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const meta = SPORTS[sport];
  const sec = parseDuration(form.duration);
  const distM = parseDistance(form.distance);
  const km = distM / 1000;
  const pace = distM > 0 && sec > 0 ? calcPace(sec, distM) : 0;
  const speed = distM > 0 && sec > 0 ? calcSpeed(sec, distM) : 0;
  const isReps = meta?.metric === 'reps';
  const isSpeed = meta?.metric === 'speed';
  const canSave = form.title.trim() && sec > 0;

  const addTag = () => {
    const v = tagDraft.trim().replace(/^#/, '');
    if (v && !form.tags.includes(v)) set('tags', [...form.tags, v]);
    setTagDraft('');
  };

  const saveMut = useMutation({
    mutationFn: () => {
      const payload = {
        sport, title: form.title, durationSec: sec, distanceM: distM || undefined,
        avgHr: form.hr ? +form.hr : undefined, climbM: form.climb ? +form.climb : undefined,
        feelRating: form.feel as 'easy' | 'ok' | 'hard',
        tags: form.tags, body: form.descHtml, date: form.date,
        details: isReps ? { reps: +form.reps, volume: +form.volume * 1000 } : undefined,
        gpxPoints: gpxResult ? gpxResult.points.map(p => ({ lat: p.lat, lon: p.lon, ele: p.ele })) : undefined,
      };
      return editId ? updateExercise(editId, payload) : createExercise(payload);
    },
    onSuccess: (ex) => nav({ to: '/exercise/$id', params: { id: ex.id } }),
  });

  const paceDisplay = isSpeed
    ? (speed ? speed.toFixed(1) : '—')
    : (pace ? fmtPace(pace) : '—');
  const paceUnitDisplay = isSpeed ? t.kmh : t.minkm;

  return (
    <div className="ot-log">
      <div className="ot-log-head">
        <button className="ot-back" onClick={() => nav({ to: '/feed', search: {} })}>
          <Icon name="chevron" size={18} style={{ transform: 'rotate(180deg)' }} />{t.back}
        </button>
        <h1 className="ot-page-title" style={{ marginTop: 12 }}>{editId ? t.editExercise : t.logTitle}</h1>
        <p className="ot-page-sub">{t.logSub}</p>
      </div>

      <div className="ot-log-grid">
        <form className="ot-log-form" onSubmit={e => { e.preventDefault(); if (canSave) saveMut.mutate(); }}>
          <Card style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <input
              className="ot-log-title"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder={t.titlePh}
              autoFocus
            />

            <div>
              <span className="ot-field-label" style={{ marginBottom: 10, display: 'block' }}>{t.sportField}</span>
              <div className="ot-sport-pick">
                {Object.values(SPORTS).map(s => (
                  <button
                    type="button" key={s.key}
                    className={'ot-sport-chip' + (sport === s.key ? ' active' : '')}
                    onClick={() => setSport(s.key)}
                    style={sport === s.key ? { '--chip': s.color } as React.CSSProperties : undefined}
                  >
                    <SportGlyph sport={s.key} size={17} />
                    {lang === 'fi' ? s.nameFi : s.nameEn}
                  </button>
                ))}
              </div>
            </div>

            <div className="ot-field-row">
              <label className="ot-field">
                <span className="ot-field-label">{t.durationField} <em className="ot-field-badge">{t.req}</em></span>
                <input className="ot-input" value={form.duration} onChange={e => set('duration', e.target.value)}
                  placeholder="0:00:00" inputMode="numeric" />
                <span className="ot-field-hint">{t.durationPh}</span>
              </label>
              {!isReps && (
                <label className="ot-field">
                  <span className="ot-field-label">{t.distanceField} <em className="ot-field-badge">{t.opt}</em></span>
                  <div className="ot-input-unit">
                    <input value={form.distance} onChange={e => set('distance', e.target.value)} placeholder="0,00" inputMode="decimal" />
                    <span>km</span>
                  </div>
                </label>
              )}
              {isReps && (
                <label className="ot-field">
                  <span className="ot-field-label">{t.repsField} <em className="ot-field-badge">{t.opt}</em></span>
                  <input className="ot-input" value={form.reps} onChange={e => set('reps', e.target.value)} placeholder="0" inputMode="numeric" />
                </label>
              )}
            </div>

            <div className="ot-field-row">
              <label className="ot-field">
                <span className="ot-field-label">{t.avgHrField} <em className="ot-field-badge">{t.opt}</em></span>
                <div className="ot-input-unit">
                  <input value={form.hr} onChange={e => set('hr', e.target.value)} placeholder="0" inputMode="numeric" />
                  <span>{t.bpm}</span>
                </div>
              </label>
              {isReps ? (
                <label className="ot-field">
                  <span className="ot-field-label">{t.volumeField} <em className="ot-field-badge">{t.opt}</em></span>
                  <div className="ot-input-unit">
                    <input value={form.volume} onChange={e => set('volume', e.target.value)} placeholder="0" inputMode="numeric" />
                    <span>kg</span>
                  </div>
                </label>
              ) : (
                <label className="ot-field">
                  <span className="ot-field-label">{t.paceField} <em className="ot-field-badge">{t.autoCalc}</em></span>
                  <div className="ot-input-unit ot-computed">
                    <input readOnly value={paceDisplay} />
                    <span>{paceUnitDisplay}</span>
                  </div>
                </label>
              )}
            </div>

            <div className="ot-field-row">
              <label className="ot-field">
                <span className="ot-field-label">{t.climbField} <em className="ot-field-badge">{t.opt}</em></span>
                <div className="ot-input-unit">
                  <input value={form.climb} onChange={e => set('climb', e.target.value)} placeholder="0" inputMode="numeric" />
                  <span>m</span>
                </div>
              </label>
              <label className="ot-field">
                <span className="ot-field-label">{t.dateField}</span>
                <input className="ot-input" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
              </label>
            </div>

            <div>
              <span className="ot-field-label" style={{ marginBottom: 10, display: 'block' }}>{t.intensityField}</span>
              <div className="ot-feel">
                {([['feelEasy', 'easy'], ['feelOk', 'ok'], ['feelHard', 'hard']] as const).map(([lbl, v], i) => (
                  <button type="button" key={v}
                    className={'ot-feel-btn' + (form.feel === v ? ' active' : '')}
                    onClick={() => set('feel', v)}>
                    <span className="ot-feel-dots">
                      {Array.from({ length: 3 }).map((_, j) => <i key={j} className={j <= i ? 'on' : ''} />)}
                    </span>
                    {t[lbl]}
                  </button>
                ))}
              </div>
            </div>

            <label className="ot-field">
              <span className="ot-field-label">{t.keywords} <em className="ot-field-badge">{t.opt}</em></span>
              <div className="ot-tag-input">
                {form.tags.map(tag => (
                  <span key={tag} className="ot-tag-chip">
                    #{tag}
                    <button type="button" onClick={() => set('tags', form.tags.filter(x => x !== tag))}>
                      <Icon name="close" size={12} stroke={2.4} />
                    </button>
                  </span>
                ))}
                <input
                  value={tagDraft}
                  onChange={e => setTagDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                  placeholder={form.tags.length ? '' : t.keywordsPh}
                />
              </div>
            </label>

            <label className="ot-field">
              <span className="ot-field-label">{t.gpxField} <em className="ot-field-badge">{t.opt}</em></span>
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
            </label>

            <div className="ot-field">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className="ot-field-label">{t.descField} <em className="ot-field-badge">{t.opt}</em></span>
                <div style={{ display: 'flex', gap: 4, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: 3 }}>
                  {(['wysiwyg', 'markdown'] as const).map(mode => (
                    <button key={mode} type="button" onClick={() => setEditorMode(mode)}
                      style={{
                        border: 0, borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        background: editorMode === mode ? 'var(--surface)' : 'transparent',
                        color: editorMode === mode ? 'var(--text)' : 'var(--text-faint)',
                      }}>
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
                  className="ot-textarea" rows={6} value={form.desc}
                  onChange={e => { set('desc', e.target.value); set('descHtml', e.target.value); }}
                  placeholder={t.descPh}
                />
              )}
            </div>

            <div className="ot-log-actions">
              <button type="button" className="ot-btn-ghost" onClick={() => nav({ to: '/feed', search: {} })}>{t.cancel}</button>
              <button type="submit" className="ot-btn-primary" disabled={!canSave || saveMut.isPending}>
                <Icon name="check" size={18} stroke={2.4} />{t.save}
              </button>
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
                {km > 0 && <div><div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22 }}>{km.toFixed(2).replace('.', ',')}<span style={{ fontSize: 11, color: 'var(--text-dim)', marginLeft: 4 }}>km</span></div><div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-faint)', fontWeight: 600 }}>{t.distance}</div></div>}
                {sec > 0 && <div><div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22 }}>{Math.floor(sec/60)} min</div><div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-faint)', fontWeight: 600 }}>{t.time}</div></div>}
                {pace > 0 && <div><div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, color: 'var(--accent)' }}>{paceDisplay}<span style={{ fontSize: 11, marginLeft: 4, color: 'var(--text-dim)' }}>{paceUnitDisplay}</span></div><div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-faint)', fontWeight: 600 }}>{t.pace}</div></div>}
              </div>
              {form.tags.length > 0 && <div className="ot-tags">{form.tags.map(tag => <span key={tag} className="ot-tag">#{tag}</span>)}</div>}
            </Card>
            <p className="ot-preview-hint">{t.previewHint}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
