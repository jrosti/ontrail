import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from '@tanstack/react-router';
import { BottomNav } from './components/layout/BottomNav';
import { TopNav } from './components/layout/TopNav';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AthletePage } from './pages/AthletePage';
import { CalendarPage } from './pages/CalendarPage';
import { DiaryPage } from './pages/DiaryPage';
import { ExercisePage } from './pages/ExercisePage';
import { FeedPage } from './pages/FeedPage';
import { GroupsPage } from './pages/GroupsPage';
import { LoginPage } from './pages/LoginPage';
import { LogPage } from './pages/LogPage';
import { ProfilePage } from './pages/ProfilePage';
import { SearchPage } from './pages/SearchPage';
import { TopListsPage } from './pages/TopListsPage';

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
    sports: Array.isArray(s.sports)
      ? (s.sports as string[])
      : s.sports
        ? [s.sports as string]
        : undefined,
    user: s.user as string | undefined,
    group: s.group as string | undefined,
    page: s.page ? Number(s.page) : undefined,
    minDistM: s.minDistM ? Number(s.minDistM) : undefined,
    maxDistM: s.maxDistM ? Number(s.maxDistM) : undefined,
    minDurCs: s.minDurCs ? Number(s.minDurCs) : undefined,
    maxDurCs: s.maxDurCs ? Number(s.maxDurCs) : undefined,
    minHr: s.minHr ? Number(s.minHr) : undefined,
    maxHr: s.maxHr ? Number(s.maxHr) : undefined,
    dateFrom: s.dateFrom as string | undefined,
    dateTo: s.dateTo as string | undefined,
    sortBy: s.sortBy as FeedSearch['sortBy'],
    sortDir: s.sortDir as FeedSearch['sortDir'],
  }),
  component: FeedPage,
});

export type FeedSearch = {
  tag?: string;
  sports?: string[];
  user?: string;
  group?: string;
  page?: number;
  minDistM?: number;
  maxDistM?: number;
  minDurCs?: number;
  maxDurCs?: number;
  minHr?: number;
  maxHr?: number;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'recent' | 'date' | 'distance' | 'duration' | 'hr';
  sortDir?: 'asc' | 'desc';
};

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

const topListsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/toplists',
  component: TopListsPage,
});

function AthletePageWrapper() {
  const { username } = athleteRoute.useParams();
  const { tab } = athleteRoute.useSearch();
  return (
    <AthletePage
      username={username}
      initialTab={tab as 'workouts' | 'sports' | 'tags' | 'records' | undefined}
    />
  );
}

const athleteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/user/$username',
  validateSearch: (s: Record<string, unknown>) => ({
    tab: s.tab as string | undefined,
  }),
  component: AthletePageWrapper,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/feed', search: {} });
  },
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
  topListsRoute,
  athleteRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
