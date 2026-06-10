import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { useEffect } from 'react';
import { getMe } from './api';
import { HANKO_URL } from './hankoClient';
import { router } from './router';
import { useStore } from './store';
import { buildCSSVars } from './theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
});

// Refresh interval: every 4 minutes (Hanko tokens expire after 5m by default)
const REFRESH_INTERVAL_MS = 4 * 60 * 1000;

function AuthBootstrap() {
  const setCurrentUser = useStore((s) => s.setCurrentUser);
  const setToken = useStore((s) => s.setToken);
  const token = useStore((s) => s.token);

  // Load/clear user profile whenever the stored token changes
  useEffect(() => {
    if (!token) {
      setCurrentUser(null);
      return;
    }
    getMe()
      .then(setCurrentUser)
      .catch(() => setCurrentUser(null));
  }, [token, setCurrentUser]);

  // Listen for Hanko session events and refresh token on a timer
  useEffect(() => {
    let timerId: ReturnType<typeof setInterval>;
    let removeListeners: () => void = () => undefined;

    const refresh = async () => {
      try {
        const { Hanko } = await import('@teamhanko/hanko-frontend-sdk');
        const hanko = new Hanko(HANKO_URL);
        const result = await hanko.validateSession();
        if (result.is_valid) {
          const fresh = hanko.getSessionToken();
          if (fresh && fresh !== useStore.getState().token) setToken(fresh);
        } else {
          setToken(null);
          setCurrentUser(null);
        }
      } catch {
        // keep current token on transient network errors
      }
    };

    const setup = async () => {
      const { Hanko, sessionCreatedType, sessionExpiredType, userLoggedOutType } = await import(
        '@teamhanko/hanko-frontend-sdk'
      );
      const hanko = new Hanko(HANKO_URL);

      const onCreated = () => {
        const tok = hanko.getSessionToken();
        if (tok) setToken(tok);
      };
      const onExpired = () => {
        setToken(null);
        setCurrentUser(null);
      };

      hanko.onSessionCreated(onCreated);
      hanko.onSessionExpired(onExpired);
      hanko.onUserLoggedOut(onExpired);

      timerId = setInterval(refresh, REFRESH_INTERVAL_MS);

      removeListeners = () => {
        clearInterval(timerId);
        document.removeEventListener(sessionCreatedType, onCreated);
        document.removeEventListener(sessionExpiredType, onExpired);
        document.removeEventListener(userLoggedOutType, onExpired);
      };
    };

    setup();
    return () => removeListeners();
  }, [setCurrentUser, setToken]);

  return null;
}

function ThemedApp() {
  const { theme } = useStore();
  const vars = buildCSSVars(theme);
  return (
    <div data-theme={theme.theme} style={vars as React.CSSProperties}>
      <AuthBootstrap />
      <RouterProvider router={router} />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemedApp />
    </QueryClientProvider>
  );
}
