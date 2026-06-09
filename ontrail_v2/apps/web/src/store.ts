import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeSettings } from './theme';
import { DEFAULT_THEME } from './theme';
import type { Lang } from './i18n';
import type { User } from './types';

interface AppState {
  theme: ThemeSettings;
  lang: Lang;
  currentUser: User | null;
  token: string | null;
  setTheme: (patch: Partial<ThemeSettings>) => void;
  setLang: (lang: Lang) => void;
  setCurrentUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      theme: DEFAULT_THEME,
      lang: 'fi',
      currentUser: null,
      token: null,
      setTheme: (patch) => set((s) => ({ theme: { ...s.theme, ...patch } })),
      setLang: (lang) => set({ lang }),
      setCurrentUser: (user) => set({ currentUser: user }),
      setToken: (token) => set({ token }),
      logout: () => set({ currentUser: null, token: null }),
    }),
    { name: 'ontrail-app' }
  )
);
