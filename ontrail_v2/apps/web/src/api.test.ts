import { beforeEach, describe, expect, mock, test } from 'bun:test';

interface ApiCall {
  method: 'get' | 'post' | 'patch' | 'delete';
  url: string;
  data?: unknown;
  config?: Record<string, unknown>;
}

const calls: ApiCall[] = [];
const requestInterceptors: ((config: { headers: Record<string, string> }) => unknown)[] = [];
let nextData: unknown = {};
let createConfig: unknown;

const fakeClient = {
  interceptors: {
    request: {
      use(handler: (config: { headers: Record<string, string> }) => unknown) {
        requestInterceptors.push(handler);
      },
    },
  },
  get(url: string, config?: Record<string, unknown>) {
    calls.push({ method: 'get', url, config });
    return Promise.resolve({ data: nextData });
  },
  post(url: string, data?: unknown, config?: Record<string, unknown>) {
    calls.push({ method: 'post', url, data, config });
    return Promise.resolve({ data: nextData });
  },
  patch(url: string, data?: unknown, config?: Record<string, unknown>) {
    calls.push({ method: 'patch', url, data, config });
    return Promise.resolve({ data: nextData });
  },
  delete(url: string, config?: Record<string, unknown>) {
    calls.push({ method: 'delete', url, config });
    return Promise.resolve({ data: nextData });
  },
};

Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: {
    store: new Map<string, string>(),
    getItem(key: string) {
      return this.store.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      this.store.set(key, value);
    },
    removeItem(key: string) {
      this.store.delete(key);
    },
    clear() {
      this.store.clear();
    },
  },
});

mock.module('axios', () => ({
  default: {
    create(config: unknown) {
      createConfig = config;
      return fakeClient;
    },
  },
}));

const api = await import('./api');

beforeEach(() => {
  calls.length = 0;
  nextData = {};
  localStorage.clear();
});

describe('API client', () => {
  test('creates an axios client for the API base URL with credentials', () => {
    expect(createConfig).toEqual({ baseURL: '/api', withCredentials: true });
    expect(requestInterceptors).toHaveLength(1);
  });

  test('injects persisted bearer tokens into outgoing requests', () => {
    localStorage.setItem('ontrail-app', JSON.stringify({ state: { token: 'jwt-token' } }));

    const config = requestInterceptors[0]({ headers: {} }) as { headers: Record<string, string> };

    expect(config.headers.Authorization).toBe('Bearer jwt-token');
  });

  test('ignores malformed persisted auth state', () => {
    localStorage.setItem('ontrail-app', '{not-json');

    const config = requestInterceptors[0]({ headers: {} }) as { headers: Record<string, string> };

    expect(config.headers.Authorization).toBeUndefined();
  });

  test('wraps exercise endpoints', async () => {
    nextData = { items: [{ id: 'exercise-id' }], total: 1, page: 2, perPage: 5 };
    await expect(api.listExercises({ page: 2, perPage: 5, sport: 'Juoksu' })).resolves.toEqual(
      nextData,
    );
    expect(calls.at(-1)).toEqual({
      method: 'get',
      url: '/exercises',
      config: { params: { page: 2, perPage: 5, sport: 'Juoksu' } },
    });

    nextData = { id: 'exercise-id' };
    await expect(api.getExercise('exercise-id')).resolves.toEqual(nextData);
    await api.createExercise({ title: 'Run' });
    await api.updateExercise('exercise-id', { title: 'Edited' });
    await api.deleteExercise('exercise-id');

    expect(calls.slice(-4)).toEqual([
      { method: 'get', url: '/exercises/exercise-id', config: undefined },
      { method: 'post', url: '/exercises', data: { title: 'Run' }, config: undefined },
      { method: 'patch', url: '/exercises/exercise-id', data: { title: 'Edited' }, config: undefined },
      { method: 'delete', url: '/exercises/exercise-id', config: undefined },
    ]);
  });

  test('wraps comments, cares, sports, and users', async () => {
    nextData = { body: 'Nice' };
    await expect(api.addComment('exercise-id', 'Nice')).resolves.toEqual(nextData);
    await api.deleteComment('exercise-id', 'comment-id');
    await api.addCare('exercise-id');
    await api.removeCare('exercise-id');

    nextData = { items: [{ key: 'Juoksu' }], total: 1 };
    await expect(api.listSports()).resolves.toEqual([{ key: 'Juoksu' }]);

    nextData = { id: 'me' };
    await expect(api.getMe()).resolves.toEqual(nextData);
    await api.getUser('trail_runner');
    await api.updateProfile({ displayName: 'Trail Runner' });

    nextData = { items: [], total: 0, page: 1, perPage: 10 };
    await expect(api.listUsers('trail', 1, 10)).resolves.toEqual(nextData);

    expect(calls.map((call) => `${call.method} ${call.url}`)).toContain('post /exercises/exercise-id/comments');
    expect(calls.map((call) => `${call.method} ${call.url}`)).toContain('delete /exercises/exercise-id/comments/comment-id');
    expect(calls.map((call) => `${call.method} ${call.url}`)).toContain('post /exercises/exercise-id/cares');
    expect(calls.map((call) => `${call.method} ${call.url}`)).toContain('delete /exercises/exercise-id/cares');
    expect(calls.map((call) => `${call.method} ${call.url}`)).toContain('get /sports');
    expect(calls.map((call) => `${call.method} ${call.url}`)).toContain('get /me');
    expect(calls.map((call) => `${call.method} ${call.url}`)).toContain('get /users/trail_runner');
    expect(calls.map((call) => `${call.method} ${call.url}`)).toContain('patch /me');
    expect(calls.at(-1)?.config).toEqual({ params: { q: 'trail', page: 1, perPage: 10 } });
  });

  test('wraps analytics endpoints', async () => {
    nextData = { items: [{ sport: 'Juoksu' }] };

    await expect(api.getSportSummary('trail_runner')).resolves.toEqual([{ sport: 'Juoksu' }]);
    await expect(api.getYearSummary('trail_runner', 2026)).resolves.toEqual([{ sport: 'Juoksu' }]);
    await expect(api.getMonthSummaries('trail_runner', 2026)).resolves.toEqual([
      { sport: 'Juoksu' },
    ]);
    await expect(api.getWeekSummaries('trail_runner', 2026)).resolves.toEqual([{ sport: 'Juoksu' }]);
    await expect(api.getPersonalRecords('trail_runner')).resolves.toEqual([{ sport: 'Juoksu' }]);
    await expect(api.getTagSummary('trail_runner')).resolves.toEqual([{ sport: 'Juoksu' }]);
    await expect(api.getLeaderboard('month')).resolves.toEqual([{ sport: 'Juoksu' }]);

    nextData = { username: 'trail_runner' };
    await expect(api.getAthleteProfile('trail_runner')).resolves.toEqual(nextData);

    expect(calls.map((call) => call.url)).toEqual([
      '/users/trail_runner/summary',
      '/users/trail_runner/summary/2026',
      '/users/trail_runner/summary/2026/by/month',
      '/users/trail_runner/summary/2026/by/week',
      '/users/trail_runner/records',
      '/users/trail_runner/summary/tags',
      '/leaderboards/month',
      '/users/trail_runner/athlete',
    ]);
  });

  test('wraps unread, groups, search, export, and auth endpoints', async () => {
    nextData = { commentCount: 1, exerciseIds: ['exercise-id'] };
    await expect(api.getUnread()).resolves.toEqual(nextData);
    await api.markAllRead();

    nextData = { items: [{ id: 'group-id' }], total: 1 };
    await expect(api.listGroups()).resolves.toEqual([{ id: 'group-id' }]);
    await api.createGroup({ name: 'Trail crew', description: 'Runs' });
    await api.joinGroup('group/id');
    await api.leaveGroup('group/id');

    nextData = { items: [], total: 0, page: 1, perPage: 20 };
    await expect(api.search('forest')).resolves.toEqual(nextData);

    nextData = new Blob(['json']);
    await expect(api.exportData()).resolves.toBe(nextData);
    nextData = new Blob(['csv']);
    await expect(api.exportCSV()).resolves.toBe(nextData);

    nextData = { token: 'jwt-token', user: { id: 'user-id' } };
    await expect(api.authCallback('hanko-token')).resolves.toEqual(nextData);

    expect(calls.map((call) => `${call.method} ${call.url}`)).toEqual([
      'get /unread',
      'post /unread/mark-all-read',
      'get /groups',
      'post /groups',
      'post /groups/group%2Fid/join',
      'post /groups/group%2Fid/leave',
      'get /search',
      'get /export',
      'get /export/csv',
      'post /auth/callback',
    ]);
    expect(calls[6].config).toEqual({ params: { q: 'forest' } });
    expect(calls[7].config).toEqual({ responseType: 'blob' });
    expect(calls[8].config).toEqual({ responseType: 'blob' });
    expect(calls[9].data).toEqual({ token: 'hanko-token' });
  });
});
