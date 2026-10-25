import { beforeEach, describe, expect, mock, test } from 'bun:test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type React from 'react';
import { useStore } from '../store';
import { DEFAULT_THEME } from '../theme';
import type { User } from '../types';

const updateProfile = mock(async (_body: unknown) => ({}) as User);
const listGroups = mock(async () => []);

function MockLink({ children }: { children?: React.ReactNode }) {
  return <a href="/mock">{children}</a>;
}

// mock.module is process-wide in bun test, so keep every router export other tests import.
mock.module('@tanstack/react-router', () => ({ Link: MockLink, useNavigate: () => () => {} }));
mock.module('../api', () => ({
  updateProfile,
  listGroups,
  exportCSV: mock(async () => new Blob()),
  exportData: mock(async () => new Blob()),
}));
mock.module('../hankoClient', () => ({ registerHankoElements: async () => {} }));

const { ProfilePage } = await import('./ProfilePage');

const user: User = {
  id: 'user-id',
  username: 'pliish',
  displayName: 'pliish',
  email: 'runner@example.test',
  synopsis: 'Runs',
  restHr: 44,
  maxHr: 187,
  avatarInitials: 'PL',
  avatarColor: '#336699',
  createdAt: '2026-06-10T00:00:00.000Z',
};

const restHrInput = () => screen.getByPlaceholderText('40') as HTMLInputElement;
const maxHrInput = () => screen.getByPlaceholderText('185') as HTMLInputElement;

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <ProfilePage />
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  updateProfile.mockClear();
  updateProfile.mockImplementation(async () => user);
  useStore.setState({ currentUser: user, lang: 'fi', theme: DEFAULT_THEME });
});

describe('ProfilePage', () => {
  test('has no editable display name: it is the Hanko username', () => {
    renderPage();

    expect(screen.queryByText('Näyttönimi')).toBeNull();
    expect(screen.queryByPlaceholderText('Näyttönimi')).toBeNull();
    expect(restHrInput().value).toBe('44');
    expect(maxHrInput().value).toBe('187');
  });

  test('saves the profile fields without a display name', async () => {
    renderPage();

    fireEvent.click(screen.getByText('Tallenna'));

    await waitFor(() => expect(updateProfile).toHaveBeenCalledTimes(1));
    expect(updateProfile.mock.calls[0][0]).toEqual({ synopsis: 'Runs', restHr: 44, maxHr: 187 });
    await waitFor(() => expect(screen.getByText('Tallennettu!')).toBeTruthy());
  });

  test('sends null for unset heart rates so a saved value can be cleared', async () => {
    useStore.setState({ currentUser: { ...user, maxHr: undefined } });
    renderPage();

    fireEvent.click(screen.getByText('Tallenna'));

    await waitFor(() => expect(updateProfile).toHaveBeenCalledTimes(1));
    expect(updateProfile.mock.calls[0][0]).toMatchObject({ restHr: 44, maxHr: null });
  });

  test('shows an error when saving fails', async () => {
    updateProfile.mockImplementation(async () => {
      throw new Error('400');
    });
    renderPage();

    fireEvent.click(screen.getByText('Tallenna'));

    await waitFor(() => expect(screen.getByRole('alert')).toBeTruthy());
  });
});
