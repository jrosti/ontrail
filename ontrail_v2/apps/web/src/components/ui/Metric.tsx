interface MetricProps {
  value: string | number;
  unit?: string;
  label: string;
  big?: boolean;
  accent?: boolean;
}

export function Metric({ value, unit, label, big, accent }: MetricProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
      <div style={{
        fontFamily: 'var(--font-display)', fontWeight: 600, lineHeight: 1,
        fontSize: big ? 'clamp(26px, 4vw, 40px)' : 'var(--metric-size)',
        color: accent ? 'var(--accent)' : 'var(--text)',
        letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums',
        display: 'flex', alignItems: 'baseline', gap: 4,
      }}>
        {value}
        {unit && (
          <span style={{ fontSize: '0.5em', fontWeight: 500, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            {unit}
          </span>
        )}
      </div>
      <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-faint)', fontWeight: 600 }}>
        {label}
      </div>
    </div>
  );
}
