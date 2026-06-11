import { describe, expect, test } from 'bun:test';
import { downsample, parseGpx } from './gpx';

const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="OnTrail test">
  <trk>
    <name>Morning run</name>
    <trkseg>
      <trkpt lat="60.1699" lon="24.9384">
        <ele>10</ele>
        <time>2026-06-09T12:00:00Z</time>
      </trkpt>
      <trkpt lat="60.1709" lon="24.9484">
        <ele>20</ele>
        <time>2026-06-09T12:05:00Z</time>
      </trkpt>
    </trkseg>
  </trk>
</gpx>`;

describe('parseGpx', () => {
  test('extracts track metadata and metrics', () => {
    const result = parseGpx(gpx);

    expect(result.name).toBe('Morning run');
    expect(result.points).toHaveLength(2);
    expect(result.startTime).toBe('2026-06-09T12:00:00Z');
    expect(result.durationSec).toBe(300);
    expect(result.elevationGainM).toBe(10);
    expect(result.distanceM).toBeGreaterThan(500);
  });

  test('returns no points when a valid GPX has no track data', () => {
    const result = parseGpx('<gpx version="1.1"><metadata><name>Empty</name></metadata></gpx>');

    expect(result.points).toEqual([]);
    expect(result.distanceM).toBe(0);
    expect(result.durationSec).toBeUndefined();
  });
});

describe('downsample', () => {
  test('keeps short arrays unchanged', () => {
    const points = [{ lat: 1, lon: 1 }];
    expect(downsample(points, 10)).toBe(points);
  });

  test('limits long arrays to the requested size', () => {
    const points = Array.from({ length: 100 }, (_, i) => ({ lat: i, lon: i }));
    expect(downsample(points, 10)).toHaveLength(10);
  });
});
