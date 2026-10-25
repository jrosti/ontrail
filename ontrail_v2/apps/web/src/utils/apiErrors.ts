/**
 * The API answers 409 `{ error: 'username_taken', username }` when a Hanko session's username
 * already belongs to another OnTrail user. Returns that username, or null for any other error.
 */
export function usernameTakenFrom(error: unknown): string | null {
  const response = (error as { response?: { status?: number; data?: unknown } } | null)?.response;
  if (response?.status !== 409) return null;
  const data = response.data as { error?: unknown; username?: unknown } | undefined;
  if (data?.error !== 'username_taken') return null;
  return typeof data.username === 'string' ? data.username : '';
}
