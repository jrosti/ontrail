import { SPORT_GLYPHS } from '../../sports';

interface SportGlyphProps {
  sport: string;
  size?: number;
}

export function SportGlyph({ sport, size = 18 }: SportGlyphProps) {
  const d = SPORT_GLYPHS[sport] ?? SPORT_GLYPHS.run;
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
