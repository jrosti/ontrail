import { SPORTS, sportName } from '../../sports';
import { SportGlyph } from './SportGlyph';
import type { Lang } from '../../i18n';

interface SportBadgeProps {
  sport: string;
  lang: Lang;
  size?: 'sm' | 'md';
}

export function SportBadge({ sport, lang, size = 'md' }: SportBadgeProps) {
  const s = SPORTS[sport];
  const color = s?.color ?? 'var(--accent)';
  const small = size === 'sm';
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: small ? 5 : 7,
        padding: small ? '3px 9px 3px 7px' : '5px 12px 5px 9px',
        borderRadius: 999,
        background: `color-mix(in oklab, ${color} 16%, transparent)`,
        color,
        fontSize: small ? 11 : 12.5,
        fontWeight: 600,
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}
    >
      <SportGlyph sport={sport} size={small ? 13 : 15} />
      {sportName(sport, lang)}
    </span>
  );
}
