import { beforeEach, describe, expect, mock, test } from 'bun:test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type React from 'react';
import { useStore } from '../../store';
import { DEFAULT_THEME } from '../../theme';
import type { User } from '../../types';

const navigate = mock(() => {});
const getUnread = mock(async () => ({ commentCount: 2, items: [] }));
const markAllRead = mock(async () => ({ ok: true }));

mock.module('@tanstack/react-router', () => ({
  Link: ({
    children,
    className,
    style,
    onClick,
    'aria-label': ariaLabel,
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { to?: string; search?: unknown }) => (
    <a href="/mock" className={className} style={style} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </a>
  ),
  useNavigate: () => navigate,
}));

mock.module('../../api', () => ({
  getUnread,
  markAllRead,
}));

const { BottomNav } = await import('./BottomNav');
const { TopNav } = await import('./TopNav');

const user: User = {
  id: 'user-id',
  username: 'runner',
  displayName: 'Trail Runner',
  email: 'runner@example.test',
  avatarInitials: 'TR',
  avatarColor: '#336699',
  createdAt: '2026-06-10T00:00:00.000Z',
};

function renderWithClient(ui: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

beforeEach(() => {
  navigate.mockClear();
  getUnread.mockClear();
  markAllRead.mockClear();
  useStore.setState({
    currentUser: user,
    lang: 'fi',
    theme: DEFAULT_THEME,
    token: null,
    favoriteSports: [
      'run',
      'bike',
      'ski',
      'walk',
      'orient',
      'gym',
      'mtb',
      'swim',
      'floor',
      'soutu',
    ],
  });
});

describe('BottomNav', () => {
  test('renders main tabs and marks unread comments read when opening feed', async () => {
    renderWithClient(<BottomNav />);

    expect(screen.getByText('Syöte')).toBeTruthy();
    expect(screen.getByText('Analytiikka')).toBeTruthy();
    expect(screen.getByText('Profiili')).toBeTruthy();

    await waitFor(() => expect(document.querySelector('.ot-nav-badge')).toBeTruthy());
    const feedTab = screen.getByText('Syöte').closest('a');
    expect(feedTab).toBeTruthy();
    fireEvent.click(feedTab as HTMLAnchorElement);

    await waitFor(() => expect(markAllRead).toHaveBeenCalledTimes(1));
  });

  test('does not fetch unread comments without a logged-in user', async () => {
    useStore.setState({ currentUser: null });

    renderWithClient(<BottomNav />);

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(getUnread).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Tallenna')).toBeTruthy();
  });
});

describe('TopNav', () => {
  test('toggles language and theme, renders search, and shows the current avatar', async () => {
    renderWithClient(<TopNav />);

    const search = screen.getByLabelText(/Hae/) as HTMLInputElement;
    expect(search.placeholder).toContain('Hae harjoituksia');

    fireEvent.click(screen.getByLabelText('Language'));
    expect(useStore.getState().lang).toBe('en');

    fireEvent.click(screen.getByLabelText('Toggle theme'));
    expect(useStore.getState().theme.theme).toBe('light');

    expect(screen.getByLabelText('Profile')).toBeTruthy();
    expect(screen.getByText('TR')).toBeTruthy();

    await waitFor(() => expect(document.querySelector('.ot-nav-badge')).toBeTruthy());
    const feedTab = screen.getByText('Feed').closest('a');
    expect(feedTab).toBeTruthy();
    fireEvent.click(feedTab as HTMLAnchorElement);
    await waitFor(() => expect(markAllRead).toHaveBeenCalledTimes(1));
  });

  test('shows the login action when logged out', () => {
    useStore.setState({ currentUser: null, lang: 'en' });

    renderWithClient(<TopNav />);

    expect(screen.getByText('Feed')).toBeTruthy();
    expect(document.querySelector('a.ot-iconbtn')).toBeTruthy();
    expect(screen.queryByText('TR')).toBeNull();
  });
});
