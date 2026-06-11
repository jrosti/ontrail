// All locale arguments accept 'fi' | 'en' and map to fi-FI / en-GB

function locale(lang: string): string {
  return lang === 'fi' ? 'fi-FI' : 'en-GB';
}

// Duration is stored and passed around in CENTISECONDS (1 s = 100). Display
// helpers convert to seconds locally; see plans/units.md.

/** "1:23" or "45 min" — compact card/chip display */
export function durShort(cs: number): string {
  const sec = cs / 100;
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return h ? `${h}:${String(m).padStart(2, '0')}` : `${m} min`;
}

/** "1h 23min" or "45min 10s" — expanded label display */
export function durLong(cs: number): string {
  const sec = cs / 100;
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.round(sec % 60);
  if (h) return `${h} h ${m} min`;
  if (m) return `${m} min ${s} s`;
  return `${s} s`;
}

/** "1h 23min" with "—" fallback — for summary tables */
export function fmtDur(cs: number): string {
  if (!cs) return '—';
  const sec = cs / 100;
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h > 0) return `${h}h ${m}min`;
  return m > 0 ? `${m}min` : '—';
}

/** "1h 23min" without "—" — for calendar chips and counters */
export function fmtDurLabel(cs: number): string {
  if (!cs) return '0min';
  const sec = cs / 100;
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h > 0) return `${h}h ${m}min`;
  return `${m}min`;
}

/** "98,9 km" / "450 m" — locale-aware with Intl units */
export function fmtDist(meters: number, lang: string): string {
  if (!meters) return '';
  const loc = locale(lang);
  if (meters >= 1000) {
    return new Intl.NumberFormat(loc, {
      style: 'unit',
      unit: 'kilometer',
      maximumFractionDigits: 1,
    }).format(meters / 1000);
  }
  return new Intl.NumberFormat(loc, {
    style: 'unit',
    unit: 'meter',
    maximumFractionDigits: 0,
  }).format(meters);
}

/** "98,9 km" or "—" — for summary tables */
export function fmtDistSummary(meters: number, lang: string): string {
  if (!meters) return '—';
  return fmtDist(meters, lang);
}

/** "98,9" (no unit) — for Metric component where unit is shown separately */
export function fmtDistKm(meters: number, lang: string, decimals = 1): string {
  if (!meters) return '0';
  return new Intl.NumberFormat(locale(lang), {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(meters / 1000);
}

/**
 * @deprecated use fmtDist(meters, lang) instead
 * Legacy compat — kept because ExercisePage/ExerciseCard use it with a separate "km" unit label
 */
export function fmtDistanceKm(meters: number, lang = 'fi', decimals = 1): string {
  return fmtDistKm(meters, lang, decimals);
}

/** "12,5 km/h" number part only — for Metric component with separate unit label */
export function fmtSpeed(distanceM: number, durationCs: number, lang: string): string {
  if (!distanceM || !durationCs) return '—';
  const durationSec = durationCs / 100;
  const kmh = distanceM / 1000 / (durationSec / 3600);
  return new Intl.NumberFormat(locale(lang), { maximumFractionDigits: 1 }).format(kmh);
}

/** "4.32" (min.ss) — legacy pace display used in ExerciseCard/ExercisePage */
export function fmtPace(minPerKm: number): string {
  const m = Math.floor(minPerKm);
  const s = Math.round((minPerKm - m) * 60);
  return `${m}.${String(s).padStart(2, '0')}`;
}

/** "4:32/km", "2:15/100m", or "18,5 km/h" — full pace string with unit for tables */
export function fmtPaceSport(
  durationCs: number,
  distanceM: number,
  sport: string,
  lang: string,
): string {
  if (!durationCs || !distanceM) return '—';
  const durationSec = durationCs / 100;
  const sportKey = sport.toLowerCase();
  const runLike = [
    'run',
    'juoksu',
    'maastojuoksu',
    'suunnistus',
    'kävely',
    'sauvakävely',
    'vaellus',
    'rogaining',
  ];
  const skiLike = ['hiihto', 'luisteluhiihto', 'perinteinen hiihto', 'rullahiihto'];
  const swimLike = ['uinti'];
  if (runLike.some((s) => sportKey.includes(s)) || skiLike.some((s) => sportKey.includes(s))) {
    const secPerKm = durationSec / (distanceM / 1000);
    const mm = Math.floor(secPerKm / 60);
    const ss = Math.round(secPerKm % 60);
    return `${mm}:${String(ss).padStart(2, '0')}/km`;
  }
  if (swimLike.some((s) => sportKey.includes(s))) {
    const secPer100 = durationSec / (distanceM / 100);
    const mm = Math.floor(secPer100 / 60);
    const ss = Math.round(secPer100 % 60);
    return `${mm}:${String(ss).padStart(2, '0')}/100m`;
  }
  const kmh = distanceM / 1000 / (durationSec / 3600);
  return `${new Intl.NumberFormat(locale(lang), { maximumFractionDigits: 1 }).format(kmh)} km/h`;
}

/** Locale-aware integer: "1 234" / "1,234" */
export function fmtInt(n: number, lang: string): string {
  return new Intl.NumberFormat(locale(lang)).format(Math.round(n));
}

export function calcPace(durationCs: number, distanceM: number): number {
  if (!durationCs || !distanceM) return 0;
  const durationSec = durationCs / 100;
  return durationSec / 60 / (distanceM / 1000);
}

export function calcSpeed(durationCs: number, distanceM: number): number {
  if (!durationCs || !distanceM) return 0;
  const durationSec = durationCs / 100;
  return distanceM / 1000 / (durationSec / 3600);
}

function parseLocalDate(isoDate: string): Date {
  const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return new Date(isoDate);
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function localDayIndex(date: Date): number {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 864e5);
}

export function relDay(isoDate: string, lang: 'fi' | 'en'): string {
  const date = parseLocalDate(isoDate);
  const now = new Date();
  const days = localDayIndex(now) - localDayIndex(date);
  if (days === 0) return lang === 'fi' ? 'tänään' : 'today';
  if (days === 1) return lang === 'fi' ? 'eilen' : 'yesterday';
  if (days < 7) return lang === 'fi' ? `${days} pv sitten` : `${days}d ago`;
  return date.toLocaleDateString(lang === 'fi' ? 'fi-FI' : 'en-GB', {
    day: '2-digit',
    month: 'short',
  });
}

/**
 * Parse a human duration string into CENTISECONDS (the stored unit).
 *
 * Hundredths precision is preserved so a record like "2.31,76" (2 min 31.76 s)
 * stays distinct from "2.32" — see plans/units.md. Convention (Finnish):
 *   - `,` is the decimal separator for fractional seconds (hundredths)
 *   - `:` and `.` are field separators (h:m:s / m.s)
 * Letter forms ("3h", "5 min 4,15 s", "45") are also accepted; a bare number
 * is minutes.
 */
export function parseDuration(str: string): number {
  if (!str) return 0;
  const s = str.trim().toLowerCase();

  // Letter form (contains h / min / s).
  if (/[a-z]/.test(s)) {
    let sec = 0;
    const mH = s.match(/(\d+(?:[.,]\d+)?)\s*h/);
    if (mH) sec += parseFloat(mH[1].replace(',', '.')) * 3600;
    const mMin = s.match(/(\d+(?:[.,]\d+)?)\s*m(?:in)?/);
    if (mMin) sec += parseFloat(mMin[1].replace(',', '.')) * 60;
    const mSec = s.match(/(\d+(?:[.,]\d+)?)\s*s/);
    if (mSec) sec += parseFloat(mSec[1].replace(',', '.'));
    if (!sec) {
      const n = parseFloat(s.replace(',', '.'));
      if (!Number.isNaN(n)) sec = n * 60;
    }
    return Math.round(sec * 100);
  }

  // Numeric form: fields split by : or . ; a comma marks fractional seconds.
  let fracCs = 0;
  let core = s;
  const ci = s.indexOf(',');
  if (ci >= 0) {
    const digits = s
      .slice(ci + 1)
      .replace(/\D/g, '')
      .slice(0, 2);
    fracCs = digits ? Math.round(parseFloat(`0.${digits}`) * 100) : 0;
    core = s.slice(0, ci);
  }
  const p = core
    .split(/[:.]/)
    .filter((x) => x !== '')
    .map(Number);
  if (!p.length || p.some(Number.isNaN)) return 0;
  let sec = 0;
  if (p.length === 3) sec = p[0] * 3600 + p[1] * 60 + p[2];
  else if (p.length === 2) sec = p[0] * 60 + p[1];
  else sec = p[0] * 60; // bare number = minutes
  return Math.round(sec * 100) + fracCs;
}

export function parseDistance(str: string): number {
  if (!str) return 0;
  const s = str.trim().toLowerCase().replace(',', '.');
  const n = parseFloat(s);
  if (Number.isNaN(n)) return 0;
  if (/\bm\b|metr|(?<!k)m$/.test(s) && !/km/.test(s) && n > 80) return n;
  return n * 1000;
}
