/**
 * Hanko username rules, mirrored from the Hanko flow API (`ValidateUsername`: `^\w+$`, ASCII) and
 * the `username.min_length`/`max_length` in infra/hanko/config.yaml. Legacy OnTrail names contain
 * spaces and Finnish letters (e.g. "Jörö", "Pekka Hämäläinen"), which Hanko's registration and
 * profile flows reject, so accounts are provisioned with a Hanko-safe form.
 */
export const HANKO_USERNAME_MIN = 2;
export const HANKO_USERNAME_MAX = 32;

export function isHankoUsername(name: string): boolean {
  return (
    name.length >= HANKO_USERNAME_MIN && name.length <= HANKO_USERNAME_MAX && /^\w+$/.test(name)
  );
}

/** Closest Hanko-valid form of `input`: diacritics folded, other characters become `_`. Case is kept. */
export function toHankoUsername(input: string): string {
  const safe = input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Za-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, HANKO_USERNAME_MAX)
    .replace(/_+$/, '');
  return safe.length >= HANKO_USERNAME_MIN ? safe : 'user';
}

/**
 * Ordered usernames to try for a user: their display name if Hanko accepts it as is, then their
 * OnTrail username if valid, then the transliterated username. Never returns duplicates.
 */
export function hankoUsernameCandidates(user: { displayName: string; username: string }): string[] {
  const ordered = [
    user.displayName,
    user.username,
    toHankoUsername(user.username),
    toHankoUsername(user.displayName),
  ];
  const valid = ordered.filter(isHankoUsername);
  return [...new Set(valid)];
}

/** `base` with a numeric suffix (`name_2`, `name_3`, …) that still fits the maximum length. */
export function withSuffix(base: string, n: number): string {
  const suffix = `_${n}`;
  return base.slice(0, HANKO_USERNAME_MAX - suffix.length) + suffix;
}
