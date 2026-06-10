import { beforeEach, describe, expect, mock, test } from 'bun:test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import type React from 'react';
import { useStore } from '../../store';
import type { ExerciseListItem } from '../../types';

const addCare = mock(async () => ({ ok: true }));
const removeCare = mock(async () => ({ ok: true }));

mock.module('@tanstack/react-router', () => ({
  Link: ({ children, className, style, onClick }: React.HTMLAttributes<HTMLAnchorElement>) => (
    <a href="/mock" className={className} style={style} onClick={onClick}>
      {children}
    </a>
  ),
}));

mock.module('../../api', () => ({
  addCare,
  removeCare,
}));

mock.module('../charts/LeafletMap', () => ({
  LeafletMap: ({ points }: { points: unknown[] }) => (
    <div data-testid="leaflet-map">leaflet-map:{points.length}</div>
  ),
}));

const { ExerciseCard } = await import('./ExerciseCard');

const exercise: ExerciseListItem = {
  id: '8f544286-369a-4baf-b229-1c569da040c3',
  ownerUsername: 'testi',
  ownerDisplayName: 'Test User',
  ownerInitials: 'TU',
  ownerColor: 'oklch(60% .18 260)',
  sport: 'run',
  title: 'Aamulenkki',
  tags: ['polku', 'kevyt'],
  date: new Date().toISOString().slice(0, 10),
  durationSec: 30 * 60,
  distanceM: 5000,
  commentCount: 2,
  careCount: 3,
};

function renderWithProviders(ui: React.ReactNode) {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  });

  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

describe('ExerciseCard', () => {
  beforeEach(() => {
    addCare.mockClear();
    removeCare.mockClear();
    useStore.getState().setLang('fi');
  });

  test('renders the core feed card content', () => {
    renderWithProviders(
      <ExerciseCard exercise={{ ...exercise, avgHr: 142 }} groupFilter="Trail crew" />,
    );

    expect(screen.getByText('Aamulenkki')).toBeTruthy();
    expect(screen.getByText('Test User')).toBeTruthy();
    expect(screen.getByText('Juoksu')).toBeTruthy();
    expect(screen.getByText('5,0')).toBeTruthy();
    expect(screen.getByText('30 min')).toBeTruthy();
    expect(screen.getByText('142')).toBeTruthy();
    expect(screen.getByText('Trail crew')).toBeTruthy();
    expect(screen.getByText('#polku')).toBeTruthy();
    expect(screen.getByText('#kevyt')).toBeTruthy();
  });

  test('renders compact cards without tags', () => {
    renderWithProviders(<ExerciseCard exercise={exercise} layout="compact" />);

    expect(screen.getByText('Aamulenkki')).toBeTruthy();
    expect(screen.getByText('Juoksu')).toBeTruthy();
    expect(screen.queryByText('#polku')).toBeNull();
  });

  test('optimistically toggles care state', async () => {
    renderWithProviders(<ExerciseCard exercise={exercise} />);

    const careButton = document.querySelector('button.ot-act');
    expect(careButton).toBeTruthy();

    fireEvent.click(careButton as HTMLButtonElement);

    expect(screen.getByText('4')).toBeTruthy();
  });

  test('renders route maps for outdoor GPX routes but hides them for gym workouts', () => {
    const gpxPoints = [
      { lat: 60.1, lon: 24.9 },
      { lat: 60.2, lon: 25.0 },
    ];
    const { rerender } = renderWithProviders(
      <ExerciseCard exercise={{ ...exercise, gpxPoints }} />,
    );

    expect(screen.getByTestId('leaflet-map').textContent).toBe('leaflet-map:2');

    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <ExerciseCard exercise={{ ...exercise, sport: 'gym', gpxPoints }} />
      </QueryClientProvider>,
    );
    expect(screen.queryByTestId('leaflet-map')).toBeNull();
  });

  test('uses speed metrics for cycling and hides pace for time-only sports', () => {
    const { rerender } = renderWithProviders(
      <ExerciseCard exercise={{ ...exercise, sport: 'bike' }} />,
    );

    expect(screen.getByText('km/h')).toBeTruthy();
    expect(screen.queryByText('min/km')).toBeNull();

    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <ExerciseCard exercise={{ ...exercise, sport: 'beach-volley' }} />
      </QueryClientProvider>,
    );
    expect(screen.queryByText('min/km')).toBeNull();
    expect(screen.queryByText('km/h')).toBeNull();
  });

  test('hides distance and pace metrics for repetition-based sports', () => {
    renderWithProviders(<ExerciseCard exercise={{ ...exercise, sport: 'gym' }} />);

    expect(screen.queryByText('Matka')).toBeNull();
    expect(screen.queryByText('Vauhti')).toBeNull();
    expect(screen.getByText('30 min')).toBeTruthy();
  });
});
