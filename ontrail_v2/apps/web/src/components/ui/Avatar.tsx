interface AvatarProps {
  initials: string;
  color: string;
  size?: number;
  ring?: boolean;
}

export function Avatar({ initials, color, size = 40, ring = false }: AvatarProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontWeight: 600,
        fontFamily: 'var(--font-display)',
        fontSize: size * 0.38,
        letterSpacing: '0.01em',
        userSelect: 'none',
        boxShadow: ring ? '0 0 0 2px var(--surface), 0 0 0 4px var(--accent)' : 'none',
      }}
    >
      {initials}
    </div>
  );
}
