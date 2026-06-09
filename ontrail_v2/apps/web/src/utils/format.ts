export function durShort(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return h ? `${h}:${String(m).padStart(2, '0')}` : `${m} min`;
}

export function durLong(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.round(sec % 60);
  if (h) return `${h} h ${m} min`;
  if (m) return `${m} min ${s} s`;
  return `${s} s`;
}

export function fmtPace(minPerKm: number): string {
  const m = Math.floor(minPerKm);
  const s = Math.round((minPerKm - m) * 60);
  return `${m}.${String(s).padStart(2, '0')}`;
}

export function fmtDistance(meters: number): string {
  if (!meters) return '';
  const km = meters / 1000;
  if (km >= 1) {
    const int = Math.floor(km);
    const dec = Math.round((km - int) * 1000);
    if (dec === 0) return `${int} km`;
    const decStr = dec.toString().replace(/0+$/, '');
    return `${int},${decStr} km`;
  }
  return `${Math.round(meters)} m`;
}

export function fmtDistanceKm(meters: number, decimals = 2): string {
  return (meters / 1000).toFixed(decimals).replace('.', ',');
}

export function calcPace(durationSec: number, distanceM: number): number {
  if (!durationSec || !distanceM) return 0;
  return (durationSec / 60) / (distanceM / 1000);
}

export function calcSpeed(durationSec: number, distanceM: number): number {
  if (!durationSec || !distanceM) return 0;
  return (distanceM / 1000) / (durationSec / 3600);
}

export function relDay(isoDate: string, lang: 'fi' | 'en'): string {
  const date = new Date(isoDate);
  const now = new Date();
  const days = Math.round((now.getTime() - date.getTime()) / 864e5);
  if (days === 0) return lang === 'fi' ? 'tänään' : 'today';
  if (days === 1) return lang === 'fi' ? 'eilen' : 'yesterday';
  if (days < 7) return lang === 'fi' ? `${days} pv sitten` : `${days}d ago`;
  return date.toLocaleDateString(lang === 'fi' ? 'fi-FI' : 'en-GB', { day: '2-digit', month: 'short' });
}

export function parseDuration(str: string): number {
  if (!str) return 0;
  const s = str.trim().toLowerCase();
  if (/[:.]/.test(s) && !/[a-z]/.test(s)) {
    const p = s.split(/[:.]/).map(Number);
    if (p.some(isNaN)) return 0;
    if (p.length === 3) return p[0] * 3600 + p[1] * 60 + p[2];
    if (p.length === 2) return p[0] * 60 + p[1];
    return p[0] * 60;
  }
  let sec = 0;
  let m: RegExpMatchArray | null;
  if ((m = s.match(/(\d+(?:[.,]\d+)?)\s*h/))) sec += parseFloat(m[1].replace(',', '.')) * 3600;
  if ((m = s.match(/(\d+)\s*m(?:in)?/))) sec += +m[1] * 60;
  if ((m = s.match(/(\d+)\s*s/))) sec += +m[1];
  if (!sec) { const n = parseFloat(s.replace(',', '.')); if (!isNaN(n)) sec = n * 60; }
  return Math.round(sec);
}

export function parseDistance(str: string): number {
  if (!str) return 0;
  const s = str.trim().toLowerCase().replace(',', '.');
  const n = parseFloat(s);
  if (isNaN(n)) return 0;
  if (/\bm\b|metr|(?<!k)m$/.test(s) && !/km/.test(s) && n > 80) return n;
  return n * 1000;
}
