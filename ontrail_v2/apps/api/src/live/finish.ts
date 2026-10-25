export interface FinishInput {
  title?: string;
  body?: string;
  tags?: string[];
  feelRating?: 'easy' | 'ok' | 'hard';
  /** Moving time in centiseconds; overrides the first-to-last point span (pauses!). */
  durationCs?: number;
  distanceM?: number;
  avgHr?: number;
  /** Exercise date, YYYY-MM-DD; defaults to the session start in Europe/Helsinki. */
  date?: string;
}

export type ParsedFinish = { ok: true; value: FinishInput } | { ok: false; error: string };

const FEEL = new Set(['easy', 'ok', 'hard']);

function nonNegInt(v: unknown, max: number): v is number {
  return typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= max;
}

/** Validate the optional body of POST /api/live/:id/finish. An empty/missing body is fine. */
export function parseFinish(input: unknown): ParsedFinish {
  if (input == null) return { ok: true, value: {} };
  if (typeof input !== 'object' || Array.isArray(input))
    return { ok: false, error: 'invalid_body' };
  const src = input as Record<string, unknown>;
  const value: FinishInput = {};

  if (src.title != null) {
    if (typeof src.title !== 'string' || src.title.length > 200)
      return { ok: false, error: 'invalid_title' };
    value.title = src.title.trim();
  }
  if (src.body != null) {
    if (typeof src.body !== 'string' || src.body.length > 50_000)
      return { ok: false, error: 'invalid_body_text' };
    value.body = src.body;
  }
  if (src.tags != null) {
    const ok =
      Array.isArray(src.tags) &&
      src.tags.length <= 20 &&
      src.tags.every((t) => typeof t === 'string' && t.trim() !== '' && t.length <= 50);
    if (!ok) return { ok: false, error: 'invalid_tags' };
    value.tags = (src.tags as string[]).map((t) => t.trim());
  }
  if (src.feelRating != null) {
    if (typeof src.feelRating !== 'string' || !FEEL.has(src.feelRating)) {
      return { ok: false, error: 'invalid_feel_rating' };
    }
    value.feelRating = src.feelRating as FinishInput['feelRating'];
  }
  if (src.durationCs != null) {
    // 1 000 h in centiseconds is far beyond any real workout.
    if (!nonNegInt(src.durationCs, 360_000_000)) return { ok: false, error: 'invalid_duration' };
    value.durationCs = src.durationCs;
  }
  if (src.distanceM != null) {
    if (!nonNegInt(src.distanceM, 10_000_000)) return { ok: false, error: 'invalid_distance' };
    value.distanceM = src.distanceM;
  }
  if (src.avgHr != null) {
    if (!nonNegInt(src.avgHr, 250) || src.avgHr < 20) return { ok: false, error: 'invalid_avg_hr' };
    value.avgHr = src.avgHr;
  }
  if (src.date != null) {
    if (
      typeof src.date !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(src.date) ||
      Number.isNaN(Date.parse(src.date))
    ) {
      return { ok: false, error: 'invalid_date' };
    }
    value.date = src.date;
  }
  return { ok: true, value };
}
