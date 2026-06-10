import { useState } from 'react';

interface AvatarProps {
  initials: string;
  color: string;
  size?: number;
  ring?: boolean;
  gravatarHash?: string;
}

export function Avatar({ initials, color, size = 40, ring = false, gravatarHash }: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const showGravatar = !!gravatarHash && !imgError;
  const style: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: '50%',
    flexShrink: 0,
    userSelect: 'none',
    boxShadow: ring ? '0 0 0 2px var(--surface), 0 0 0 4px var(--accent)' : 'none',
    overflow: 'hidden',
  };

  if (showGravatar) {
    return (
      <div style={style}>
        <img
          src={`https://www.gravatar.com/avatar/${gravatarHash}?s=${size * 2}&d=404`}
          alt={initials}
          width={size}
          height={size}
          style={{ display: 'block', width: size, height: size, objectFit: 'cover' }}
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        ...style,
        background: color,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        fontFamily: 'var(--font-display)',
        fontSize: size * 0.38,
        letterSpacing: '0.01em',
      }}
    >
      {initials}
    </div>
  );
}
