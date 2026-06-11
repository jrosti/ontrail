import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Lang } from './i18n';
import type { ThemeSettings } from './theme';
import { DEFAULT_THEME } from './theme';
import type { User } from './types';

interface AppState {
  theme: ThemeSettings;
  lang: Lang;
  currentUser: User | null;
  token: string | null;
  favoriteSports: string[];
  setTheme: (patch: Partial<ThemeSettings>) => void;
  setLang: (lang: Lang) => void;
  setCurrentUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  rememberSport: (sport: string) => void;
  logout: () => void;
}

const DEFAULT_FAVORITE_SPORTS = [
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
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      theme: DEFAULT_THEME,
      lang: 'fi',
      currentUser: null,
      token: null,
      favoriteSports: DEFAULT_FAVORITE_SPORTS,
      setTheme: (patch) => set((s) => ({ theme: { ...s.theme, ...patch } })),
      setLang: (lang) => set({ lang }),
      setCurrentUser: (user) => set({ currentUser: user }),
      setToken: (token) => set({ token }),
      rememberSport: (sport) =>
        set((s) => ({
          favoriteSports: [sport, ...s.favoriteSports.filter((key) => key !== sport)].slice(0, 10),
        })),
      logout: () => set({ currentUser: null, token: null }),
    }),
    { name: 'ontrail-app' },
  ),
);
