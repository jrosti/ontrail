interface LogoProps {
  size?: number;
  withText?: boolean;
}

export function Logo({ size = 26, withText = true }: LogoProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <svg width={size} height={size} viewBox="0 0 32 32" style={{ display: 'block', flexShrink: 0 }}>
        <rect x="1.5" y="1.5" width="29" height="29" rx="9" fill="var(--logo-bg)" />
        <path d="M7 21 L13 11 L18 18 L25 8" fill="none" stroke="var(--accent)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="25" cy="8" r="2.6" fill="var(--accent)" />
      </svg>
      {withText && (
        <span style={{
          fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: size * 0.72,
          letterSpacing: '-0.02em', color: 'var(--text)',
        }}>
          on<span style={{ color: 'var(--accent)' }}>trail</span>
        </span>
      )}
    </div>
  );
}
