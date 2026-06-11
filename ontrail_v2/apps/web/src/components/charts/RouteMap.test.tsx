import { describe, expect, test } from 'bun:test';
import { render } from '@testing-library/react';
import { makeRoute, RouteMap } from './RouteMap';

describe('makeRoute', () => {
  test('creates deterministic bounded routes', () => {
    const first = makeRoute(42, 8);
    const second = makeRoute(42, 8);

    expect(first).toEqual(second);
    expect(first).toHaveLength(8);
    for (const [x, y] of first) {
      expect(x).toBeGreaterThanOrEqual(0.08);
      expect(x).toBeLessThanOrEqual(0.92);
      expect(y).toBeGreaterThanOrEqual(0.1);
      expect(y).toBeLessThanOrEqual(0.9);
    }
  });
});

describe('RouteMap', () => {
  test('renders an SVG route with start and finish markers', () => {
    const { container } = render(
      <RouteMap
        route={[
          [0.1, 0.2],
          [0.4, 0.7],
          [0.8, 0.3],
        ]}
        height={180}
        accent="#11aa77"
      />,
    );

    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('viewBox')).toBe('0 0 480 180');
    expect(svg?.style.height).toBe('180px');
    expect(container.querySelectorAll('path').length).toBeGreaterThanOrEqual(3);
    expect(container.querySelectorAll('circle')).toHaveLength(2);
  });

  test('renders live progress with pulsing head instead of finish marker', () => {
    const { container } = render(
      <RouteMap
        route={[
          [0.1, 0.2],
          [0.4, 0.7],
          [0.8, 0.3],
          [0.9, 0.8],
        ]}
        progress={0.5}
        showMarkers={false}
        live
      />,
    );

    expect(container.querySelector('animate')).toBeTruthy();
    expect(container.querySelectorAll('circle')).toHaveLength(2);
  });
});
