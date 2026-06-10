import type React from 'react';

interface CardProps {
  children: React.ReactNode;
  pad?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
  hover?: boolean;
  className?: string;
}

const cardStyle = (
  pad: boolean,
  hover: boolean | undefined,
  style?: React.CSSProperties,
): React.CSSProperties => ({
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  padding: pad ? 'var(--card-pad)' : 0,
  cursor: hover ? 'pointer' : 'default',
  width: '100%',
  textAlign: 'left',
  ...style,
});

const cls = (hover: boolean | undefined, className?: string) =>
  ['ot-card', hover ? 'ot-card-hover' : '', className].filter(Boolean).join(' ');

export function Card({ children, pad = true, style, onClick, hover, className }: CardProps) {
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cls(hover, className)}
        style={cardStyle(pad, hover, style)}
      >
        {children}
      </button>
    );
  }
  return (
    <div
      className={cls(hover, className)}
      style={{ ...cardStyle(pad, hover, style), cursor: 'default' }}
    >
      {children}
    </div>
  );
}
