import { createRootRoute, createRoute, createRouter, Outlet, redirect } from '@tanstack/react-router';
import { TopNav } from './components/layout/TopNav';
import { BottomNav } from './components/layout/BottomNav';
import { FeedPage } from './pages/FeedPage';
import { ExercisePage } from './pages/ExercisePage';
import { LogPage } from './pages/LogPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { CalendarPage } from './pages/CalendarPage';
import { DiaryPage } from './pages/DiaryPage';
import { SearchPage } from './pages/SearchPage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { GroupsPage } from './pages/GroupsPage';
import { AthletePage } from './pages/AthletePage';

const rootRoute = createRootRoute({
  component: () => (
    <div className="ot-app">
      <TopNav />
      <div className="ot-shell">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  ),
});

const feedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/feed',
  validateSearch: (s: Record<string, unknown>): FeedSearch => ({
    tag: s.tag as string | undefined,
    sport: s.sport as string | undefined,
    user: s.user as string | undefined,
    page: s.page ? Number(s.page) : undefined,
  }),
  component: FeedPage,
});

export type FeedSearch = { tag?: string; sport?: string; user?: string; page?: number };

const exerciseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/exercise/$id',
  component: ExercisePage,
});

const logRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/log',
  validateSearch: (s: Record<string, unknown>): LogSearch => ({
    id: s.id as string | undefined,
  }),
  component: LogPage,
});

export type LogSearch = { id?: string };

const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/analytics',
  component: AnalyticsPage,
});

const calendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calendar',
  component: CalendarPage,
});

const diaryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/diary/$username',
  component: DiaryPage,
});

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/search',
  validateSearch: (s: Record<string, unknown>) => ({
    q: s.q as string | undefined,
  }),
  component: SearchPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

const groupsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/groups',
  component: GroupsPage,
});

function AthletePageWrapper() {
  const { username } = athleteRoute.useParams();
  return <AthletePage username={username} />;
}

const athleteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/user/$username',
  component: AthletePageWrapper,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => { throw redirect({ to: '/feed', search: {} }); },
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  feedRoute,
  exerciseRoute,
  logRoute,
  analyticsRoute,
  calendarRoute,
  diaryRoute,
  searchRoute,
  loginRoute,
  profileRoute,
  groupsRoute,
  athleteRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
