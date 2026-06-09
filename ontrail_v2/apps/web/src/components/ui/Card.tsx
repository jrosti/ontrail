import React from 'react';

interface CardProps {
  children: React.ReactNode;
  pad?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
  hover?: boolean;
  className?: string;
}

export function Card({ children, pad = true, style, onClick, hover, className }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={['ot-card', hover ? 'ot-card-hover' : '', className].filter(Boolean).join(' ')}
      style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: pad ? 'var(--card-pad)' : 0,
        cursor: onClick ? 'pointer' : 'default', ...style,
      }}
    >
      {children}
    </div>
  );
}
