import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { useEffect } from 'react';
import { getMe } from './api';
import { router } from './router';
import { useStore } from './store';
import { buildCSSVars } from './theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
});

function AuthBootstrap() {
  const setCurrentUser = useStore((s) => s.setCurrentUser);

  useEffect(() => {
    getMe()
      .then(setCurrentUser)
      .catch(() => setCurrentUser(null));
  }, [setCurrentUser]);

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
