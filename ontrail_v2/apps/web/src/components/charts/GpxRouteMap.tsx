import type { GpxPoint } from '../../utils/gpx';

interface Props {
  points: GpxPoint[];
  height?: number;
  accent?: string;
  rounded?: number;
}

export function GpxRouteMap({
  points,
  height = 200,
  accent = 'var(--accent)',
  rounded = 14,
}: Props) {
  if (points.length < 2) return null;

  const W = 900;
  const H = height * (900 / 400); // keep proportional to viewBox width

  const lats = points.map((p) => p.lat);
  const lons = points.map((p) => p.lon);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);

  const pad = 40;
  const rangeX = maxLon - minLon || 1e-6;
  const rangeY = maxLat - minLat || 1e-6;
  // Preserve aspect ratio by fitting into padded box
  const scaleX = (W - pad * 2) / rangeX;
  const scaleY = (H - pad * 2) / rangeY;
  const scale = Math.min(scaleX, scaleY);
  const offX = (W - rangeX * scale) / 2;
  const offY = (H - rangeY * scale) / 2;

  const toSvg = (p: GpxPoint): [number, number] => [
    offX + (p.lon - minLon) * scale,
    H - offY - (p.lat - minLat) * scale, // flip Y (SVG y grows down)
  ];

  const d = points
    .map((p, i) => {
      const [x, y] = toSvg(p);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const [sx, sy] = toSvg(points[0]);
  const [ex, ey] = toSvg(points[points.length - 1]);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height={height}
      style={{
        display: 'block',
        borderRadius: rounded,
        background: 'var(--inset, var(--surface-2))',
      }}
      aria-hidden="true"
    >
      {/* track */}
      <path
        d={d}
        fill="none"
        stroke={accent}
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.85}
      />
      {/* start dot */}
      <circle cx={sx} cy={sy} r={8} fill={accent} opacity={0.9} />
      {/* finish flag */}
      <circle cx={ex} cy={ey} r={6} fill="none" stroke={accent} strokeWidth={3} />
      <circle cx={ex} cy={ey} r={3} fill={accent} />
    </svg>
  );
}
