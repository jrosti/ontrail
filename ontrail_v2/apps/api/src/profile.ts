/** Editable profile fields. The display name is the Hanko username and is not editable here. */
export interface ProfileUpdate {
  synopsis?: string;
  restHr?: number | null;
  maxHr?: number | null;
  aerk?: number | null;
  anaerk?: number | null;
  goals?: string | null;
}

export type ParsedProfileUpdate = { ok: true; value: ProfileUpdate } | { ok: false; error: string };

// Same bounds as the inputs on the profile page.
const REST_HR = [20, 120] as const;
const MAX_HR = [100, 220] as const;
const THRESHOLD_HR = [20, 250] as const;
const MAX_TEXT = 2000;

function hrOrNull(v: unknown, [min, max]: readonly [number, number]): number | null | undefined {
  if (v === null) return null;
  if (typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max) return v;
  return undefined;
}

/** Validate the body of PATCH /api/users/me. Unknown keys (e.g. `displayName`) are dropped. */
export function parseProfileUpdate(input: unknown): ParsedProfileUpdate {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { ok: false, error: 'invalid_body' };
  }
  const src = input as Record<string, unknown>;
  const value: ProfileUpdate = {};

  if ('synopsis' in src) {
    if (typeof src.synopsis !== 'string' || src.synopsis.length > MAX_TEXT) {
      return { ok: false, error: 'invalid_synopsis' };
    }
    value.synopsis = src.synopsis;
  }
  if ('goals' in src) {
    if (src.goals !== null && (typeof src.goals !== 'string' || src.goals.length > MAX_TEXT)) {
      return { ok: false, error: 'invalid_goals' };
    }
    value.goals = src.goals as string | null;
  }

  const hrFields = [
    ['restHr', REST_HR, 'invalid_rest_hr'],
    ['maxHr', MAX_HR, 'invalid_max_hr'],
    ['aerk', THRESHOLD_HR, 'invalid_aerk'],
    ['anaerk', THRESHOLD_HR, 'invalid_anaerk'],
  ] as const;
  for (const [key, bounds, error] of hrFields) {
    if (!(key in src)) continue;
    const parsed = hrOrNull(src[key], bounds);
    if (parsed === undefined) return { ok: false, error };
    value[key] = parsed;
  }

  if (value.restHr != null && value.maxHr != null && value.restHr >= value.maxHr) {
    return { ok: false, error: 'rest_hr_above_max_hr' };
  }
  return { ok: true, value };
}
