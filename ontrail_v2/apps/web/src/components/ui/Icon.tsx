const PATHS: Record<string, string> = {
  feed: 'M4 7h16M4 12h16M4 17h10',
  analytics: 'M4 19V5M9 19v-6M14 19v-9M19 19v-4',
  calendar: 'M4 6h16v14H4zM4 10h16M8 4v4M16 4v4',
  search: 'M11 11m-6 0a6 6 0 1 0 12 0a6 6 0 1 0-12 0M20 20l-4.5-4.5',
  bell: 'M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6M10 21h4',
  comment: 'M4 5h16v11H9l-4 3v-3H4z',
  heart:
    'M12 20s-7-4.6-9.2-9C1.3 8 2.6 4.7 6 4.7c2 0 3.2 1.4 4 2.6.8-1.2 2-2.6 4-2.6 3.4 0 4.7 3.3 3.2 6.3C19 15.4 12 20 12 20z',
  forward: 'M14 4l7 7-7 7M21 11H6a3 3 0 0 0-3 3v3',
  chevron: 'M9 6l6 6-6 6',
  chevronDown: 'M6 9l6 6 6-6',
  plus: 'M12 5v14M5 12h14',
  location:
    'M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10zM12 11m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0',
  clock: 'M12 12l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18',
  bolt: 'M13 3L5 13h6l-1 8 8-10h-6z',
  trophy:
    'M7 4h10v3a5 5 0 0 1-10 0zM7 5H4v1a3 3 0 0 0 3 3M17 5h3v1a3 3 0 0 1-3 3M9 14h6M10 14v4M14 14v4M8 20h8',
  settings:
    'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6M12 2l1.6 2.2 2.6-.7.4 2.7 2.4 1.2-1.2 2.4 1.2 2.4-2.4 1.2-.4 2.7-2.6-.7L12 22l-1.6-2.2-2.6.7-.4-2.7L5 16.3l1.2-2.4L5 11.5l2.4-1.2.4-2.7 2.6.7z',
  flame:
    'M12 22c4 0 6-2.6 6-6 0-3-2-5-3-7-.5 2-2 2.5-2 1 0-2-1-4-3-6 0 3-2 4-3 6.5-.6 1.5-1 2.7-1 5.5 0 3.4 2 6 6 6z',
  route:
    'M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM8 17h6a3 3 0 0 0 3-3V9',
  arrowUp: 'M12 19V5M6 11l6-6 6 6',
  play: 'M7 5l12 7-12 7z',
  pause: 'M8 5v14M16 5v14',
  stop: 'M6 6h12v12H6z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4 21c0-4 4-6 8-6s8 2 8 6',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6L6 18',
  edit: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
  trash: 'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6',
  download: 'M12 15V3M18 15l-6 6-6-6M3 21h18',
  upload: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12',
  check: 'M20 6L9 17l-5-5',
  info: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20M12 16v-4M12 8h.01',
  externalLink: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3',
};

interface IconProps {
  name: string;
  size?: number;
  stroke?: number;
  fill?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function Icon({ name, size = 20, stroke = 2, fill = false, style, className }: IconProps) {
  const filled = name === 'heart-f' || (fill && name === 'heart');
  const key = name === 'heart-f' ? 'heart' : name;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block', flexShrink: 0, ...style }}
      className={className}
    >
      <path d={PATHS[key] ?? PATHS.info} />
    </svg>
  );
}
