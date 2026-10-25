import { SPORT_GLYPHS, SPORTS } from '../../sports';

interface SportGlyphProps {
  sport: string;
  size?: number;
}

export function SportGlyph({ sport, size = 18 }: SportGlyphProps) {
  // `sport` may be a sport key (resolved to its glyph) or a glyph name.
  const d = SPORT_GLYPHS[SPORTS[sport]?.glyph ?? sport] ?? SPORT_GLYPHS[sport] ?? SPORT_GLYPHS.run;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block' }}
    >
      <path d={d} />
    </svg>
  );
}
