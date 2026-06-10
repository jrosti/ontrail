import { beforeEach, describe, expect, mock, test } from 'bun:test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { useStore } from '../../store';
import type { ExerciseListItem } from '../../types';

mock.module('@tanstack/react-router', () => ({
  Link: ({ children, className, style, onClick }: React.HTMLAttributes<HTMLAnchorElement>) => (
    <a href="/mock" className={className} style={style} onClick={onClick}>
      {children}
    </a>
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
  const client = new QueryClient();

  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

describe('ExerciseCard', () => {
  beforeEach(() => {
    useStore.getState().setLang('fi');
  });

  test('renders the core feed card content', () => {
    renderWithProviders(<ExerciseCard exercise={exercise} />);

    expect(screen.getByText('Aamulenkki')).toBeTruthy();
    expect(screen.getByText('Test User')).toBeTruthy();
    expect(screen.getByText('Juoksu')).toBeTruthy();
    expect(screen.getByText('5,0')).toBeTruthy();
    expect(screen.getByText('30 min')).toBeTruthy();
    expect(screen.getByText('#polku')).toBeTruthy();
    expect(screen.getByText('#kevyt')).toBeTruthy();
  });

  test('renders compact cards without tags', () => {
    renderWithProviders(<ExerciseCard exercise={exercise} layout="compact" />);

    expect(screen.getByText('Aamulenkki')).toBeTruthy();
    expect(screen.getByText('Juoksu')).toBeTruthy();
    expect(screen.queryByText('#polku')).toBeNull();
  });
});
