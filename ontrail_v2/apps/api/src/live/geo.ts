export interface LivePoint {
  seq: number;
  /** ISO 8601 timestamp of the GPS fix */
  t: string;
  lat: number;
  lon: number;
  ele?: number;
  hr?: number;
}

export const MAX_BATCH_POINTS = 1000;
const EARTH_RADIUS_M = 6_371_000;
/** Longest gpx_points track stored on an exercise; longer tracks are thinned evenly. */
export const MAX_EXERCISE_TRACK_POINTS = 3000;

export function haversineM(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLon = (b.lon - a.lon) * rad;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Sum of leg lengths, optionally continuing from `from` (the previous known point). */
export function pathDistanceM(
  points: { lat: number; lon: number }[],
  from?: { lat: number; lon: number } | null,
): number {
  let total = 0;
  let prev = from ?? null;
  for (const point of points) {
    if (prev) total += haversineM(prev, point);
    prev = point;
  }
  return total;
}

/** Evenly thin a track to at most `max` points, always keeping the first and last. */
export function downsample<T>(items: T[], max: number): T[] {
  if (items.length <= max || max < 2) return items;
  const out: T[] = [];
  const step = (items.length - 1) / (max - 1);
  for (let i = 0; i < max; i += 1) out.push(items[Math.round(i * step)]);
  return out;
}

export type ParsedPoints = { ok: true; points: LivePoint[] } | { ok: false; error: string };

/** Validate an untrusted point batch. The whole batch is rejected on the first bad point. */
export function parsePoints(input: unknown, now = Date.now()): ParsedPoints {
  if (!Array.isArray(input) || input.length === 0) return { ok: false, error: 'points_required' };
  if (input.length > MAX_BATCH_POINTS) return { ok: false, error: 'too_many_points' };

  const points: LivePoint[] = [];
  for (const [index, raw] of input.entries()) {
    const bad = (field: string) => ({
      ok: false as const,
      error: `invalid_point_${index}_${field}`,
    });
    if (!raw || typeof raw !== 'object') return bad('shape');
    const p = raw as Record<string, unknown>;

    const seq = p.seq;
    if (typeof seq !== 'number' || !Number.isInteger(seq) || seq < 0 || seq > 2_000_000_000) {
      return bad('seq');
    }
    const t = typeof p.t === 'string' ? new Date(p.t) : null;
    // Reject unparseable times and clocks more than a day ahead.
    if (!t || Number.isNaN(t.getTime()) || t.getTime() > now + 86_400_000) return bad('t');
    const lat = p.lat;
    const lon = p.lon;
    if (typeof lat !== 'number' || !Number.isFinite(lat) || lat < -90 || lat > 90)
      return bad('lat');
    if (typeof lon !== 'number' || !Number.isFinite(lon) || lon < -180 || lon > 180)
      return bad('lon');

    const point: LivePoint = { seq, t: t.toISOString(), lat, lon };
    if (p.ele != null) {
      if (typeof p.ele !== 'number' || !Number.isFinite(p.ele)) return bad('ele');
      point.ele = p.ele;
    }
    if (p.hr != null) {
      if (typeof p.hr !== 'number' || !Number.isInteger(p.hr) || p.hr < 20 || p.hr > 250) {
        return bad('hr');
      }
      point.hr = p.hr;
    }
    points.push(point);
  }
  return { ok: true, points };
}

/** Calendar date (YYYY-MM-DD) of an instant in the given IANA time zone. */
export function localDate(instant: Date, timeZone = 'Europe/Helsinki'): string {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(instant);
}
