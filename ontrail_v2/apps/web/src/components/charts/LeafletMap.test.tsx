import { beforeEach, describe, expect, mock, test } from 'bun:test';
import { render, waitFor } from '@testing-library/react';

const calls = {
  maps: [] as unknown[],
  tileLayers: [] as unknown[],
  polylines: [] as Array<{ latlngs: Array<[number, number]>; options: Record<string, unknown> }>,
  circleMarkers: [] as Array<{ latlng: [number, number]; options: Record<string, unknown> }>,
  fitBounds: [] as unknown[],
  setLatLngs: [] as Array<Array<[number, number]>>,
  removed: 0,
  iconOptions: [] as unknown[],
};

const latestPolyline = {
  addTo: mock(() => latestPolyline),
  getBounds: mock(() => 'poly-bounds'),
  setLatLngs: mock((latlngs: Array<[number, number]>) => {
    calls.setLatLngs.push(latlngs);
    return latestPolyline;
  }),
};

mock.module('leaflet', () => ({
  Icon: {
    Default: {
      prototype: { _getIconUrl: () => '' },
      mergeOptions: (options: unknown) => calls.iconOptions.push(options),
    },
  },
  map: (element: unknown, options: unknown) => {
    const map = {
      element,
      options,
      fitBounds: mock((bounds: unknown, fitOptions: unknown) => {
        calls.fitBounds.push({ bounds, fitOptions });
        return map;
      }),
      remove: mock(() => {
        calls.removed += 1;
      }),
    };
    calls.maps.push(map);
    return map;
  },
  tileLayer: (url: string, options: unknown) => {
    const layer = { url, options, addTo: mock(() => layer) };
    calls.tileLayers.push(layer);
    return layer;
  },
  polyline: (latlngs: Array<[number, number]>, options: Record<string, unknown>) => {
    calls.polylines.push({ latlngs, options });
    return latestPolyline;
  },
  circleMarker: (latlng: [number, number], options: Record<string, unknown>) => {
    const marker = { latlng, options, addTo: mock(() => marker) };
    calls.circleMarkers.push({ latlng, options });
    return marker;
  },
  latLngBounds: (latlngs: Array<[number, number]>) => ({ latlngs }),
}));

const { LeafletMap } = await import('./LeafletMap');

beforeEach(() => {
  calls.maps.length = 0;
  calls.tileLayers.length = 0;
  calls.polylines.length = 0;
  calls.circleMarkers.length = 0;
  calls.fitBounds.length = 0;
  calls.setLatLngs.length = 0;
  calls.removed = 0;
  calls.iconOptions.length = 0;
  document.head.innerHTML = '';
});

describe('LeafletMap', () => {
  test('renders nothing for routes with fewer than two points', () => {
    const { container } = render(<LeafletMap points={[{ lat: 60.1, lon: 24.9 }]} />);

    expect(container.firstChild).toBeNull();
    expect(calls.maps).toHaveLength(0);
  });

  test('initializes OpenStreetMap tiles, route line, markers, and cleanup', async () => {
    const { container, unmount } = render(
      <LeafletMap
        points={[
          { lat: 60.1, lon: 24.9 },
          { lat: 60.2, lon: 25 },
        ]}
        height={220}
        accent="#118855"
        rounded={10}
      />,
    );

    const host = container.querySelector('div');
    expect(host?.style.height).toBe('220px');
    expect(host?.style.borderRadius).toBe('10px');

    await waitFor(() => expect(calls.maps).toHaveLength(1));
    expect(document.getElementById('leaflet-css')?.getAttribute('href')).toContain('leaflet.css');
    expect(calls.iconOptions).toHaveLength(1);
    expect(calls.tileLayers[0]).toEqual(
      expect.objectContaining({
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      }),
    );
    expect(calls.polylines[0]).toEqual({
      latlngs: [
        [60.1, 24.9],
        [60.2, 25],
      ],
      options: expect.objectContaining({ color: '#118855', weight: 4 }),
    });
    expect(calls.circleMarkers).toHaveLength(2);
    expect(calls.fitBounds).toContainEqual({
      bounds: 'poly-bounds',
      fitOptions: { padding: [24, 24] },
    });

    unmount();
    expect(calls.removed).toBe(1);
  });

  test('updates the polyline when points change after mount', async () => {
    const { rerender } = render(
      <LeafletMap
        points={[
          { lat: 60.1, lon: 24.9 },
          { lat: 60.2, lon: 25 },
        ]}
      />,
    );

    await waitFor(() => expect(calls.maps).toHaveLength(1));

    rerender(
      <LeafletMap
        points={[
          { lat: 60.3, lon: 25.1 },
          { lat: 60.4, lon: 25.2 },
        ]}
      />,
    );

    await waitFor(() =>
      expect(calls.setLatLngs).toContainEqual([
        [60.3, 25.1],
        [60.4, 25.2],
      ]),
    );
    expect(calls.fitBounds).toContainEqual({
      bounds: {
        latlngs: [
          [60.3, 25.1],
          [60.4, 25.2],
        ],
      },
      fitOptions: { padding: [24, 24] },
    });
  });
});
