import { useId, useMemo } from 'react';

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeRoute(seed: number, n = 64): [number, number][] {
  const r = mulberry32(seed);
  let x = 0.5,
    y = 0.5,
    ang = r() * Math.PI * 2;
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    ang += (r() - 0.5) * 0.9;
    const step = 0.018 + r() * 0.02;
    x += Math.cos(ang) * step;
    y += Math.sin(ang) * step;
    if (x < 0.08 || x > 0.92) {
      ang = Math.PI - ang;
      x = Math.max(0.08, Math.min(0.92, x));
    }
    if (y < 0.1 || y > 0.9) {
      ang = -ang;
      y = Math.max(0.1, Math.min(0.9, y));
    }
    pts.push([x, y]);
  }
  return pts;
}

function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return '';
  const r = (n: number, d = 2) => Math.round(n * 10 ** d) / 10 ** d;
  let d = `M ${r(pts[0][0])} ${r(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i],
      p1 = pts[i],
      p2 = pts[i + 1],
      p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6,
      c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6,
      c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${r(c1x)} ${r(c1y)}, ${r(c2x)} ${r(c2y)}, ${r(p2[0])} ${r(p2[1])}`;
  }
  return d;
}

interface RouteMapProps {
  route?: [number, number][];
  seed?: number;
  height?: number;
  accent?: string;
  progress?: number;
  showMarkers?: boolean;
  rounded?: number;
  live?: boolean;
}

export function RouteMap({
  route,
  seed = 1,
  height = 240,
  accent = 'var(--accent)',
  progress = 1,
  showMarkers = true,
  rounded = 16,
  live = false,
}: RouteMapProps) {
  const W = 480,
    H = height;
  const pad = 0.06;

  const pts = useMemo(() => {
    const raw = route ?? makeRoute(seed, 60);
    return raw.map(([x, y]): [number, number] => [
      pad * W + x * W * (1 - pad * 2),
      pad * H + y * H * (1 - pad * 2),
    ]);
  }, [route, seed, H]);

  const shown = Math.max(2, Math.round(pts.length * progress));
  const drawn = pts.slice(0, shown);
  const head = drawn[drawn.length - 1];

  const blobs = useMemo(() => {
    const r = mulberry32(pts.length * 13 + Math.round((pts[0]?.[0] ?? 0) * 1000));
    return Array.from({ length: 3 }).map(() => ({
      cx: (0.2 + r() * 0.6) * W,
      cy: (0.2 + r() * 0.6) * H,
      rx: (0.1 + r() * 0.16) * W,
      ry: (0.08 + r() * 0.14) * H,
    }));
  }, [pts, H]);

  const _gid = useId();
  const gid = `rm${_gid.replace(/:/g, '')}`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      style={{
        width: '100%',
        height,
        display: 'block',
        borderRadius: rounded,
        background: 'var(--map-bg)',
      }}
    >
      <defs>
        <pattern id={`${gid}g`} width="26" height="26" patternUnits="userSpaceOnUse">
          <path d="M26 0H0V26" fill="none" stroke="var(--map-grid)" strokeWidth="1" />
        </pattern>
        <linearGradient id={`${gid}l`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={accent} />
          <stop offset="1" stopColor={`color-mix(in oklab, ${accent} 55%, white)`} />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width={W} height={H} fill={`url(#${gid}g)`} />
      {blobs.map((b, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: decorative SVG blobs with no stable id
        <ellipse key={i} cx={b.cx} cy={b.cy} rx={b.rx} ry={b.ry} fill="var(--map-blob)" />
      ))}
      <path
        d={smoothPath(pts)}
        fill="none"
        stroke="var(--map-route-ghost)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={smoothPath(drawn)}
        fill="none"
        stroke={`url(#${gid}l)`}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {showMarkers && (
        <circle
          cx={pts[0][0]}
          cy={pts[0][1]}
          r="5"
          fill="var(--map-bg)"
          stroke={accent}
          strokeWidth="2.5"
        />
      )}
      {live ? (
        <g>
          <circle cx={head[0]} cy={head[1]} r="9" fill={accent} opacity="0.25">
            <animate attributeName="r" values="6;13;6" dur="1.6s" repeatCount="indefinite" />
          </circle>
          <circle cx={head[0]} cy={head[1]} r="5" fill={accent} stroke="white" strokeWidth="2" />
        </g>
      ) : (
        showMarkers && (
          <circle
            cx={pts[pts.length - 1][0]}
            cy={pts[pts.length - 1][1]}
            r="5"
            fill={accent}
            stroke="white"
            strokeWidth="2"
          />
        )
      )}
    </svg>
  );
}
