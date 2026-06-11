import type { Map as LMap, Polyline } from 'leaflet';
import { useEffect, useRef } from 'react';
import type { GpxPoint } from '../../utils/gpx';

// Leaflet CSS is imported globally in index.css (via @import)
// We load Leaflet lazily to avoid SSR issues and keep the initial bundle small.

interface Props {
  points: GpxPoint[];
  height?: number;
  accent?: string;
  rounded?: number;
  style?: React.CSSProperties;
}

export function LeafletMap({
  points,
  height = 300,
  accent = '#e8602c',
  rounded = 14,
  style,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LMap | null>(null);
  const polyRef = useRef<Polyline | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional mount-only effect
  useEffect(() => {
    if (!containerRef.current || points.length < 2) return;

    let destroyed = false;

    import('leaflet').then((L) => {
      if (destroyed || !containerRef.current) return;

      // Leaflet requires its CSS; inject it if not already present
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Fix default icon paths broken by Vite asset hashing
      // @ts-expect-error — _getIconUrl is an internal Leaflet method
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const latlngs = points.map((p) => [p.lat, p.lon] as [number, number]);

      if (mapRef.current) {
        // Update existing map
        polyRef.current?.setLatLngs(latlngs);
        mapRef.current.fitBounds(L.latLngBounds(latlngs), { padding: [24, 24] });
        return;
      }

      const map = L.map(containerRef.current as HTMLElement, {
        zoomControl: true,
        attributionControl: true,
        scrollWheelZoom: false,
      });
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const poly = L.polyline(latlngs, {
        color: accent,
        weight: 4,
        opacity: 0.9,
        lineJoin: 'round',
      }).addTo(map);
      polyRef.current = poly;

      // Start marker
      L.circleMarker(latlngs[0], {
        radius: 8,
        color: accent,
        fillColor: accent,
        fillOpacity: 1,
        weight: 2,
      }).addTo(map);

      // End marker
      L.circleMarker(latlngs[latlngs.length - 1], {
        radius: 6,
        color: accent,
        fillColor: '#fff',
        fillOpacity: 1,
        weight: 3,
      }).addTo(map);

      map.fitBounds(poly.getBounds(), { padding: [24, 24] });
    });

    return () => {
      destroyed = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        polyRef.current = null;
      }
    };
  }, []);

  // Update polyline when points change after initial mount
  useEffect(() => {
    if (!mapRef.current || points.length < 2) return;
    import('leaflet').then((L) => {
      if (!mapRef.current) return;
      const latlngs = points.map((p) => [p.lat, p.lon] as [number, number]);
      polyRef.current?.setLatLngs(latlngs);
      mapRef.current.fitBounds(L.latLngBounds(latlngs), { padding: [24, 24] });
    });
  }, [points]);

  if (points.length < 2) return null;

  return (
    <div
      ref={containerRef}
      style={{
        height,
        borderRadius: rounded,
        overflow: 'hidden',
        background: 'var(--surface-2)',
        ...style,
      }}
    />
  );
}
