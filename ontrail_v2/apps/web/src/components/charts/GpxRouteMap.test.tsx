import { describe, expect, test } from 'bun:test';
import { render } from '@testing-library/react';
import { GpxRouteMap } from './GpxRouteMap';

describe('GpxRouteMap', () => {
  test('renders nothing without enough route points', () => {
    const { container } = render(<GpxRouteMap points={[{ lat: 60.17, lon: 24.94 }]} />);

    expect(container.firstChild).toBeNull();
  });

  test('projects GPX points into a route SVG', () => {
    const { container } = render(
      <GpxRouteMap
        points={[
          { lat: 60.1699, lon: 24.9384 },
          { lat: 60.1709, lon: 24.9484 },
          { lat: 60.1719, lon: 24.9584 },
        ]}
        height={160}
        accent="#dd5522"
        rounded={8}
      />,
    );

    const svg = container.querySelector('svg');
    const path = container.querySelector('path');
    expect(svg?.getAttribute('viewBox')).toBe('0 0 900 360');
    expect(svg?.getAttribute('height')).toBe('160');
    expect(svg?.style.borderRadius).toBe('8px');
    expect(path?.getAttribute('d')).toMatch(/^M/);
    expect(path?.getAttribute('stroke')).toBe('#dd5522');
    expect(container.querySelectorAll('circle')).toHaveLength(3);
  });
});
