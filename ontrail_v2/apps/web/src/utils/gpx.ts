export interface GpxPoint {
  lat: number;
  lon: number;
  ele?: number;
  time?: string;
}

export interface GpxResult {
  name?: string;
  points: GpxPoint[];
  distanceM: number;
  elevationGainM: number;
  durationSec?: number;
  startTime?: string;
}

function haversineM(a: GpxPoint, b: GpxPoint): number {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

export function parseGpx(xmlText: string): GpxResult {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, 'application/xml');

  const name =
    doc.querySelector('name')?.textContent?.trim() ?? undefined;

  // collect all trackpoints (trkpt) or waypoints (wpt)
  const nodes = Array.from(
    doc.querySelectorAll('trkpt, wpt')
  );

  const points: GpxPoint[] = nodes.map((n) => ({
    lat: parseFloat(n.getAttribute('lat') ?? '0'),
    lon: parseFloat(n.getAttribute('lon') ?? '0'),
    ele: n.querySelector('ele') ? parseFloat(n.querySelector('ele')!.textContent ?? '0') : undefined,
    time: n.querySelector('time')?.textContent ?? undefined,
  }));

  let distanceM = 0;
  let elevationGainM = 0;
  for (let i = 1; i < points.length; i++) {
    distanceM += haversineM(points[i - 1], points[i]);
    const dEle = (points[i].ele ?? 0) - (points[i - 1].ele ?? 0);
    if (dEle > 0) elevationGainM += dEle;
  }

  let durationSec: number | undefined;
  let startTime: string | undefined;
  if (points.length >= 2 && points[0].time && points[points.length - 1].time) {
    startTime = points[0].time;
    durationSec = Math.round(
      (new Date(points[points.length - 1].time!).getTime() -
        new Date(points[0].time).getTime()) /
        1000
    );
  }

  return {
    name,
    points,
    distanceM: Math.round(distanceM),
    elevationGainM: Math.round(elevationGainM),
    durationSec,
    startTime,
  };
}

// Downsample to at most maxPoints for display
export function downsample(points: GpxPoint[], maxPoints = 300): GpxPoint[] {
  if (points.length <= maxPoints) return points;
  const step = points.length / maxPoints;
  return Array.from({ length: maxPoints }, (_, i) => points[Math.floor(i * step)]);
}
