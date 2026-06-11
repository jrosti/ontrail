import { createHash } from 'node:crypto';

export function gravatarHash(email: string | null | undefined): string {
  if (!email) return '';
  return createHash('md5').update(email.trim().toLowerCase()).digest('hex');
}
