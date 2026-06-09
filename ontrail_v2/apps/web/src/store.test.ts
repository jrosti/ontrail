import { beforeEach, describe, expect, test } from 'bun:test';
import { useStore } from './store';
import { DEFAULT_THEME } from './theme';

const initialState = useStore.getState();

beforeEach(() => {
  localStorage.removeItem('ontrail-app');
  useStore.setState({
    theme: DEFAULT_THEME,
    lang: 'fi',
    currentUser: null,
    token: null,
    favoriteSports: initialState.favoriteSports,
  });
});

describe('useStore', () => {
  test('updates theme and language settings', () => {
    useStore.getState().setTheme({ theme: 'light', density: 'compact' });
    useStore.getState().setLang('en');

    expect(useStore.getState().theme).toEqual({
      ...DEFAULT_THEME,
      theme: 'light',
      density: 'compact',
    });
    expect(useStore.getState().lang).toBe('en');
  });

  test('keeps the most recent 10 favorite sports without duplicates', () => {
    for (const sport of [
      'Juoksu',
      'Pyöräily',
      'Hiihto',
      'Kävely',
      'Uinti',
      'Jooga',
      'Golf',
      'Tennis',
      'Soutu',
      'Melonta',
      'Salibandy',
    ]) {
      useStore.getState().rememberSport(sport);
    }
    useStore.getState().rememberSport('Juoksu');

    const favorites = useStore.getState().favoriteSports;
    expect(favorites).toHaveLength(10);
    expect(favorites[0]).toBe('Juoksu');
    expect(favorites.filter((sport) => sport === 'Juoksu')).toHaveLength(1);
    expect(favorites).not.toContain('Pyöräily');
  });

  test('clears auth state on logout without resetting preferences', () => {
    useStore.getState().setCurrentUser({
      id: 'user-id',
      username: 'trail_runner',
      displayName: 'Trail Runner',
      email: 'runner@example.test',
      avatarInitials: 'TR',
      avatarColor: 'oklch(60% .18 260)',
      createdAt: '2026-06-09T12:00:00.000Z',
    });
    useStore.getState().setToken('jwt-token');
    useStore.getState().setLang('en');

    useStore.getState().logout();

    expect(useStore.getState().currentUser).toBeNull();
    expect(useStore.getState().token).toBeNull();
    expect(useStore.getState().lang).toBe('en');
  });
});
