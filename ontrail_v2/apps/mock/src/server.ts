import { EXERCISES, USERS, getUserByUsername, type Exercise } from './seed';

const PORT = 3001;

let exercises: Exercise[] = EXERCISES.map(e => ({ ...e, comments: [...e.comments], cares: [...e.cares] }));

function cors(res: Response): Response {
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return res;
}

function json(data: unknown, status = 200) {
  return cors(new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  }));
}

function paginate<T>(items: T[], page: number, perPage: number) {
  const start = (page - 1) * perPage;
  return { items: items.slice(start, start + perPage), total: items.length, page, perPage, totalPages: Math.ceil(items.length / perPage) };
}

Bun.serve({
  port: PORT,
  async fetch(req: Request) {
    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;

    if (method === 'OPTIONS') return cors(new Response(null, { status: 204 }));

    // GET /api/me
    if (path === '/api/me' && method === 'GET') return json(USERS[0]);

    // PATCH /api/me
    if (path === '/api/me' && method === 'PATCH') {
      const body = await req.json() as Partial<typeof USERS[0]>;
      Object.assign(USERS[0], body);
      return json(USERS[0]);
    }

    // GET /api/users/:username
    const userMatch = path.match(/^\/api\/users\/([^/]+)$/);
    if (userMatch && method === 'GET') {
      const u = getUserByUsername(userMatch[1]);
      return u ? json(u) : json({ error: 'not found' }, 404);
    }

    // GET /api/exercises
    if (path === '/api/exercises' && method === 'GET') {
      const page = parseInt(url.searchParams.get('page') ?? '1');
      const perPage = parseInt(url.searchParams.get('perPage') ?? '20');
      const sport = url.searchParams.get('sport');
      const user = url.searchParams.get('user');
      const tag = url.searchParams.get('tag');
      let filtered = exercises;
      if (sport) filtered = filtered.filter(e => e.sport === sport);
      if (user) filtered = filtered.filter(e => e.ownerUsername === user);
      if (tag) filtered = filtered.filter(e => e.tags.includes(tag));
      return json(paginate(filtered, page, perPage));
    }

    // POST /api/exercises
    if (path === '/api/exercises' && method === 'POST') {
      const body = await req.json() as Partial<Exercise>;
      const ts = new Date().toISOString();
      const newEx: Exercise = {
        id: `ex${Date.now()}`,
        userId: USERS[0].id,
        ownerUsername: USERS[0].username,
        ownerDisplayName: USERS[0].displayName,
        ownerInitials: USERS[0].avatarInitials,
        ownerColor: USERS[0].avatarColor,
        sport: 'run',
        title: '',
        date: new Date().toISOString().slice(0, 10),
        durationSec: 0,
        distanceM: 0,
        comments: [],
        cares: [],
        careCount: 0,
        commentCount: 0,
        details: {},
        feel: 2,
        feelRating: 'ok',
        tags: [],
        body: '',
        createdAt: ts,
        updatedAt: ts,
        ...body,
      };
      exercises.unshift(newEx);
      return json(newEx, 201);
    }

    // GET/PUT/PATCH/DELETE /api/exercises/:id
    const exMatch = path.match(/^\/api\/exercises\/([^/]+)$/);
    if (exMatch) {
      const ex = exercises.find(e => e.id === exMatch[1]);
      if (!ex) return json({ error: 'not found' }, 404);
      if (method === 'GET') return json(ex);
      if (method === 'PUT' || method === 'PATCH') {
        const body = await req.json() as Partial<Exercise>;
        Object.assign(ex, body, { updatedAt: new Date().toISOString() });
        return json(ex);
      }
      if (method === 'DELETE') {
        exercises = exercises.filter(e => e.id !== exMatch[1]);
        return json({ ok: true });
      }
    }

    // POST /api/exercises/:id/comments
    const commentMatch = path.match(/^\/api\/exercises\/([^/]+)\/comments$/);
    if (commentMatch && method === 'POST') {
      const ex = exercises.find(e => e.id === commentMatch[1]);
      if (!ex) return json({ error: 'not found' }, 404);
      const body = await req.json() as { body: string };
      const comment = {
        id: `c${Date.now()}`,
        userId: USERS[0].id,
        username: USERS[0].username,
        displayName: USERS[0].displayName,
        avatarInitials: USERS[0].avatarInitials,
        avatarColor: USERS[0].avatarColor,
        body: body.body,
        createdAt: new Date().toISOString(),
      };
      ex.comments.push(comment);
      ex.commentCount = ex.comments.length;
      return json(comment, 201);
    }

    // DELETE /api/exercises/:id/comments/:cid
    const delCommentMatch = path.match(/^\/api\/exercises\/([^/]+)\/comments\/([^/]+)$/);
    if (delCommentMatch && method === 'DELETE') {
      const ex = exercises.find(e => e.id === delCommentMatch[1]);
      if (!ex) return json({ error: 'not found' }, 404);
      ex.comments = ex.comments.filter(c => c.id !== delCommentMatch[2]);
      ex.commentCount = ex.comments.length;
      return json({ ok: true });
    }

    // POST /api/exercises/:id/cares
    const caresMatch = path.match(/^\/api\/exercises\/([^/]+)\/cares$/);
    if (caresMatch && method === 'POST') {
      const ex = exercises.find(e => e.id === caresMatch[1]);
      if (!ex) return json({ error: 'not found' }, 404);
      if (!ex.cares.includes(USERS[0].id)) {
        ex.cares.push(USERS[0].id);
        ex.careCount = ex.cares.length;
      }
      return json({ ok: true });
    }
    if (caresMatch && method === 'DELETE') {
      const ex = exercises.find(e => e.id === caresMatch[1]);
      if (!ex) return json({ error: 'not found' }, 404);
      ex.cares = ex.cares.filter(id => id !== USERS[0].id);
      ex.careCount = ex.cares.length;
      return json({ ok: true });
    }

    // GET /api/search
    if (path === '/api/search' && method === 'GET') {
      const q = (url.searchParams.get('q') ?? '').toLowerCase();
      const results = q
        ? exercises.filter(e =>
            e.title.toLowerCase().includes(q) ||
            e.tags.some(t => t.includes(q)) ||
            e.sport.includes(q) ||
            e.ownerUsername.includes(q)
          )
        : [];
      return json(paginate(results, 1, 20));
    }

    // GET /api/summaries/year/:year
    const yearMatch = path.match(/^\/api\/summaries\/year\/(\d{4})$/);
    if (yearMatch && method === 'GET') {
      const year = parseInt(yearMatch[1]);
      const exYear = exercises.filter(e => e.date.startsWith(String(year)));
      const totalKm = exYear.reduce((s, e) => s + e.distanceM / 1000, 0);
      const totalH = exYear.reduce((s, e) => s + e.durationSec / 3600, 0);
      return json({
        year,
        totalExercises: exYear.length,
        totalDistanceKm: Math.round(totalKm),
        totalHours: Math.round(totalH * 10) / 10,
        bySport: Object.fromEntries(
          [...new Set(exYear.map(e => e.sport))].map(sport => {
            const sub = exYear.filter(e => e.sport === sport);
            return [sport, { count: sub.length, distanceKm: Math.round(sub.reduce((s, e) => s + e.distanceM / 1000, 0)) }];
          })
        ),
      });
    }

    // GET /api/summaries/months
    if (path === '/api/summaries/months' && method === 'GET') {
      const months = Array.from({ length: 12 }, (_, m) => {
        const exMonth = exercises.filter(e => {
          const d = new Date(e.date);
          return d.getFullYear() === 2026 && d.getMonth() === m;
        });
        return { year: 2026, month: m + 1, distanceKm: Math.round(exMonth.reduce((s, e) => s + e.distanceM / 1000, 0)), count: exMonth.length };
      });
      return json(months);
    }

    // GET /api/summaries/weeks
    if (path === '/api/summaries/weeks' && method === 'GET') return json([]);

    // GET /api/groups
    if (path === '/api/groups' && method === 'GET') {
      return json({
        items: [
          { id: 'g1', name: 'Helsinki Runners', memberCount: 42, isJoined: true },
          { id: 'g2', name: 'Pyöräilijät', memberCount: 18, isJoined: false },
          { id: 'g3', name: 'Suunnistajat', memberCount: 25, isJoined: true },
        ],
        total: 3,
      });
    }

    // POST/DELETE /api/groups/:id/members
    if (path.match(/^\/api\/groups\/([^/]+)\/members$/)) return json({ ok: true });

    // GET /api/export/csv
    if (path === '/api/export/csv' && method === 'GET') {
      const rows = exercises.map(e =>
        [e.date, e.sport, e.title, (e.distanceM / 1000).toFixed(2), Math.round(e.durationSec / 60), e.avgHr ?? ''].join(',')
      );
      const csv = ['date,sport,title,distance_km,duration_min,hr_avg', ...rows].join('\n');
      return cors(new Response(csv, { headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="ontrail.csv"' } }));
    }

    // POST /api/auth/callback
    if (path === '/api/auth/callback' && method === 'POST') {
      return json({ token: 'mock-token-dev', user: USERS[0] });
    }

    return json({ error: 'not found' }, 404);
  },
});

console.log(`\n  🏃 OnTrail mock API  →  http://localhost:${PORT}/api\n`);
