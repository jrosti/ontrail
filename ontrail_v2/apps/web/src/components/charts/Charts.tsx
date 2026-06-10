import { useId } from 'react';

const _r = (n: number, d = 1) => Math.round(n * 10 ** d) / 10 ** d;

function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return '';
  let d = `M ${_r(pts[0][0], 2)} ${_r(pts[0][1], 2)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i],
      p1 = pts[i],
      p2 = pts[i + 1],
      p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6,
      c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6,
      c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${_r(c1x, 2)} ${_r(c1y, 2)}, ${_r(c2x, 2)} ${_r(c2y, 2)}, ${_r(p2[0], 2)} ${_r(p2[1], 2)}`;
  }
  return d;
}

// ── Sparkline ──────────────────────────────────────────────────────────────────
export function Sparkline({
  data,
  color = 'var(--accent)',
  height = 36,
}: {
  data: number[];
  color?: string;
  height?: number;
}) {
  const W = 120,
    H = height,
    pad = 3;
  const min = Math.min(...data),
    max = Math.max(...data),
    span = max - min || 1;
  const pts: [number, number][] = data.map((v, i) => [
    pad + (i / (data.length - 1)) * (W - pad * 2),
    H - pad - ((v - min) / span) * (H - pad * 2),
  ]);
  const d = smoothPath(pts);
  const _gid = useId();
  const gid = 'sp' + _gid.replace(/:/g, '');
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={{ width: '100%', height, display: 'block' }}
    >
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.28" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L ${W - pad} ${H} L ${pad} ${H} Z`} fill={`url(#${gid})`} />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

// ── LineChart ──────────────────────────────────────────────────────────────────
interface LineSeries {
  data: number[];
  color?: string;
}

export function LineChart({
  series,
  height = 220,
  xTicks,
  color = 'var(--accent)',
  style = 'soft',
  yFmt = (v: number) => String(v),
  invertY = false,
  area = true,
}: {
  series: LineSeries[];
  height?: number;
  xTicks?: string[];
  color?: string;
  style?: string;
  yFmt?: (v: number) => string;
  invertY?: boolean;
  area?: boolean;
}) {
  const W = 720,
    H = height,
    L = 40,
    R = 14,
    T = 14,
    B = 26;
  const all = series.flatMap((s) => s.data);
  let min = Math.min(...all),
    max = Math.max(...all);
  const pad2 = (max - min) * 0.12 || 1;
  min -= pad2;
  max += pad2;
  const span = max - min || 1;
  const x = (i: number, n: number) => L + (i / (n - 1)) * (W - L - R);
  const y = (v: number) => {
    const t = (v - min) / span;
    return T + (invertY ? t : 1 - t) * (H - T - B);
  };
  const _gid = useId();
  const gid = 'lc' + _gid.replace(/:/g, '');

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', height, display: 'block' }}
      fontFamily="var(--font-mono)"
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const gv = min + (i / 4) * span,
          gy = y(gv);
        return (
          <g key={i}>
            <line x1={L} x2={W - R} y1={gy} y2={gy} stroke="var(--grid)" strokeWidth="1" />
            <text x={L - 6} y={gy + 3} textAnchor="end" fontSize="10" fill="var(--text-faint)">
              {yFmt(gv)}
            </text>
          </g>
        );
      })}
      {series.map((s, si) => {
        const pts: [number, number][] = s.data.map((v, i) => [x(i, s.data.length), y(v)]);
        const c = s.color ?? color;
        return (
          <g key={si}>
            {area && style !== 'line' && (
              <>
                <defs>
                  <linearGradient id={gid + si} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor={c} stopOpacity={style === 'soft' ? 0.22 : 0.1} />
                    <stop offset="1" stopColor={c} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d={`${smoothPath(pts)} L ${x(s.data.length - 1, s.data.length)} ${H - B} L ${L} ${H - B} Z`}
                  fill={`url(#${gid + si})`}
                />
              </>
            )}
            <path
              d={smoothPath(pts)}
              fill="none"
              stroke={c}
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        );
      })}
      {xTicks?.map(
        (t, i) =>
          i % Math.ceil(xTicks.length / 8) === 0 && (
            <text
              key={i}
              x={x(i, xTicks.length)}
              y={H - 8}
              textAnchor="middle"
              fontSize="10"
              fill="var(--text-faint)"
            >
              {t}
            </text>
          ),
      )}
    </svg>
  );
}

// ── StackedBars ────────────────────────────────────────────────────────────────
interface WeekData {
  week: string;
  total: number;
  parts: Record<string, number>;
}

export function StackedBars({
  weeks,
  keys,
  colorOf,
  height = 220,
  xFmt = () => '',
}: {
  weeks: WeekData[];
  keys: string[];
  colorOf: (k: string) => string;
  height?: number;
  xFmt?: (w: WeekData, i: number) => string;
}) {
  const W = 720,
    H = height,
    L = 32,
    R = 12,
    T = 12,
    B = 24;
  const max = Math.max(...weeks.map((w) => w.total)) || 1;
  const bw = (W - L - R) / weeks.length;
  const y = (v: number) => T + (1 - v / max) * (H - T - B);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', height, display: 'block' }}
      fontFamily="var(--font-mono)"
    >
      {[0, 0.5, 1].map((f, i) => {
        const gy = T + (1 - f) * (H - T - B);
        return (
          <g key={i}>
            <line x1={L} x2={W - R} y1={gy} y2={gy} stroke="var(--grid)" />
            <text x={L - 5} y={gy + 3} textAnchor="end" fontSize="10" fill="var(--text-faint)">
              {_r(max * f, 0)}
            </text>
          </g>
        );
      })}
      {weeks.map((w, i) => {
        let acc = 0;
        const xx = L + i * bw + bw * 0.16,
          w2 = bw * 0.68;
        return (
          <g key={i}>
            {keys.map((k) => {
              const v = w.parts[k] || 0;
              if (!v) return null;
              const h = (v / max) * (H - T - B);
              const yy = y(acc + v);
              acc += v;
              return (
                <rect
                  key={k}
                  x={xx}
                  y={yy}
                  width={w2}
                  height={Math.max(0, h - 1)}
                  rx="1.5"
                  fill={colorOf(k)}
                />
              );
            })}
            <text
              x={xx + w2 / 2}
              y={H - 7}
              textAnchor="middle"
              fontSize="9"
              fill="var(--text-faint)"
            >
              {xFmt(w, i)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Donut ──────────────────────────────────────────────────────────────────────
interface DonutData {
  label: string;
  color: string;
  value: number;
}

export function Donut({
  data,
  size = 180,
  thickness = 26,
  centerLabel,
  centerSub,
}: {
  data: DonutData[];
  size?: number;
  thickness?: number;
  centerLabel?: string | number;
  centerSub?: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const R = size / 2,
    r = R - thickness / 2,
    C = 2 * Math.PI * r;
  const segments = data.reduce<{ d: DonutData; off: number; len: number }[]>((acc, d) => {
    const prev = acc[acc.length - 1];
    const off = prev ? prev.off + prev.len : 0;
    return [...acc, { d, off, len: (d.value / total) * C }];
  }, []);
  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: size, height: size, display: 'block' }}>
      <g transform={`rotate(-90 ${R} ${R})`}>
        {segments.map(({ d, off, len }, i) => (
          <circle
            key={i}
            cx={R}
            cy={R}
            r={r}
            fill="none"
            stroke={d.color}
            strokeWidth={thickness}
            strokeDasharray={`${len} ${C - len}`}
            strokeDashoffset={-off}
            strokeLinecap="butt"
          />
        ))}
      </g>
      {centerLabel && (
        <text
          x={R}
          y={R - 2}
          textAnchor="middle"
          fontFamily="var(--font-display)"
          fontSize={size * 0.2}
          fontWeight="600"
          fill="var(--text)"
        >
          {centerLabel}
        </text>
      )}
      {centerSub && (
        <text
          x={R}
          y={R + size * 0.12}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={size * 0.075}
          fill="var(--text-dim)"
          letterSpacing="0.05em"
        >
          {centerSub}
        </text>
      )}
    </svg>
  );
}

// ── HR Zones ───────────────────────────────────────────────────────────────────
export const ZONE_COLORS = [
  'oklch(0.72 0.04 240)',
  'oklch(0.74 0.13 200)',
  'oklch(0.78 0.15 130)',
  'oklch(0.76 0.16 60)',
  'oklch(0.66 0.20 28)',
];

interface HRZone {
  z: number;
  pct: number;
  name: { fi: string; en: string };
}

export function HRZonesBar({ zones, height = 14 }: { zones: HRZone[]; height?: number }) {
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height,
        borderRadius: 999,
        overflow: 'hidden',
        background: 'var(--grid)',
      }}
    >
      {zones.map(
        (z, i) =>
          z.pct > 0 && (
            <div
              key={i}
              title={`Z${z.z} · ${z.pct}%`}
              style={{ width: `${z.pct}%`, background: ZONE_COLORS[z.z - 1] }}
            />
          ),
      )}
    </div>
  );
}

// ── Elevation ──────────────────────────────────────────────────────────────────
export function Elevation({
  ele,
  height = 120,
}: {
  ele: number[];
  dist?: number[];
  height?: number;
}) {
  const W = 720,
    H = height,
    pad = 2;
  const min = Math.min(...ele),
    max = Math.max(...ele),
    span = max - min || 1;
  const pts: [number, number][] = ele.map((v, i) => [
    pad + (i / (ele.length - 1)) * (W - pad * 2),
    H - pad - ((v - min) / span) * (H - pad * 2 - 6),
  ]);
  const _gid = useId();
  const gid = 'el' + _gid.replace(/:/g, '');
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={{ width: '100%', height, display: 'block' }}
    >
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="var(--text-dim)" stopOpacity="0.3" />
          <stop offset="1" stopColor="var(--text-dim)" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={`${smoothPath(pts)} L ${W - pad} ${H} L ${pad} ${H} Z`} fill={`url(#${gid})`} />
      <path
        d={smoothPath(pts)}
        fill="none"
        stroke="var(--text-dim)"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

// ── Heatmap ────────────────────────────────────────────────────────────────────
export function Heatmap({
  weeks,
  accent = 'var(--accent)',
  cell = 13,
  gap = 3,
}: {
  weeks: number[][];
  accent?: string;
  cell?: number;
  gap?: number;
}) {
  const W = weeks.length * (cell + gap),
    H = 7 * (cell + gap);
  const max = Math.max(1, ...weeks.flat());
  const lvl = (v: number) =>
    v === 0
      ? 'var(--heat-0)'
      : `color-mix(in oklab, ${accent} ${Math.round(18 + (v / max) * 82)}%, transparent)`;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', maxWidth: W, height: 'auto', display: 'block' }}
    >
      {weeks.map((days, wi) =>
        days.map((v, di) => (
          <rect
            key={`${wi}-${di}`}
            x={wi * (cell + gap)}
            y={di * (cell + gap)}
            width={cell}
            height={cell}
            rx="2.5"
            fill={lvl(v)}
            stroke="var(--heat-stroke)"
            strokeWidth="0.5"
          />
        )),
      )}
    </svg>
  );
}
