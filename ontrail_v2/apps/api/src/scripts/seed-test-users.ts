#!/usr/bin/env bun
/**
 * Seed 5 test users, each with ~6 months of realistic exercise data.
 * Run: bun run src/scripts/seed-test-users.ts
 * Safe to run multiple times (skips existing usernames).
 */
import postgres from 'postgres';

const sql = postgres('postgres://hanko:hanko@localhost:5432/ontrail', { max: 1 });

const AVATAR_COLORS = [
  '#e74c3c',
  '#2980b9',
  '#27ae60',
  '#8e44ad',
  '#f39c12',
  '#16a085',
  '#d35400',
];

const TEST_USERS = [
  {
    username: 'mikko_m',
    displayName: 'Mikko Mäkinen',
    email: 'mikko.m@example.test',
    synopsis: 'Triathlonisti ja maastojuoksija',
    sports: ['run', 'bike', 'swim', 'maastojuoksu'],
    restHr: 48,
    maxHr: 188,
  },
  {
    username: 'saara_k',
    displayName: 'Saara Korhonen',
    email: 'saara.k@example.test',
    synopsis: 'Hiihtäjä ja pyöräilijä',
    sports: ['ski', 'bike', 'run', 'walk', 'maantiepyoraily'],
    restHr: 52,
    maxHr: 182,
  },
  {
    username: 'janne_v',
    displayName: 'Janne Virtanen',
    email: 'janne.v@example.test',
    synopsis: 'Kuntosaliharrastaja ja juoksija',
    sports: ['gym', 'run', 'voimaharjoittelu', 'walk'],
    restHr: 55,
    maxHr: 185,
  },
  {
    username: 'liisa_n',
    displayName: 'Liisa Nieminen',
    email: 'liisa.n@example.test',
    synopsis: 'Juoksija — tavoitteena ensimmäinen maraton',
    sports: ['run', 'walk', 'gym'],
    restHr: 58,
    maxHr: 178,
  },
  {
    username: 'pekka_h',
    displayName: 'Pekka Hämäläinen',
    email: 'pekka.h@example.test',
    synopsis: 'Pyöräily on elämäntapa',
    sports: ['bike', 'maantiepyoraily', 'run', 'gym'],
    restHr: 44,
    maxHr: 192,
  },
];

const SPORT_PROFILES: Record<
  string,
  { distM: [number, number]; durSec: [number, number]; hr: [number, number]; climb: number }
> = {
  run: { distM: [8000, 4000], durSec: [3000, 900], hr: [155, 12], climb: 60 },
  bike: { distM: [35000, 15000], durSec: [5400, 1800], hr: [145, 10], climb: 400 },
  swim: { distM: [2000, 800], durSec: [2700, 600], hr: [140, 8], climb: 0 },
  gym: { distM: [0, 0], durSec: [3600, 600], hr: [130, 15], climb: 0 },
  walk: { distM: [5000, 2000], durSec: [2700, 600], hr: [115, 10], climb: 30 },
  maastojuoksu: { distM: [10000, 4000], durSec: [3600, 900], hr: [158, 12], climb: 250 },
  maantiepyoraily: { distM: [60000, 20000], durSec: [7200, 1800], hr: [148, 8], climb: 600 },
  ski: { distM: [15000, 8000], durSec: [5400, 1800], hr: [150, 10], climb: 300 },
  voimaharjoittelu: { distM: [0, 0], durSec: [3600, 600], hr: [125, 12], climb: 0 },
};

const TITLES: Record<string, string[]> = {
  run: ['Aamuverryttely', 'Helppo hölkkä', 'Intervalli', 'Pitkäjuoksu', 'Iltajuoksu', 'Tempojuoksu'],
  bike: ['Pyörälenkkii', 'Pitkä pyöräily', 'Kierros', 'Nopea pyöräily'],
  swim: ['Uintiharjoitus', 'Tekniikkauinti', 'Kestävyysuinti'],
  gym: ['Kuntosali', 'Voimaharjoittelu', 'Salitreeni'],
  walk: ['Kävelylenkki', 'Iltakävely', 'Metsäkävely'],
  maastojuoksu: ['Maastojuoksu', 'Polkujuoksu', 'Metsäjuoksu'],
  maantiepyoraily: ['Maantieajo', 'Pitkä pyöräreissu', 'Kierros maantiellä'],
  ski: ['Hiihto', 'Ladulla', 'Klassinen hiihto', 'Luisteluhiihto'],
  voimaharjoittelu: ['Voimatreeni', 'Raskaat sarjat', 'Voima + kunto'],
};

const TAGS: Record<string, string[]> = {
  run: ['juoksu', 'aerobinen', 'kestävyys'],
  bike: ['pyöräily', 'aerobinen'],
  swim: ['uinti', 'aerobinen'],
  gym: ['sali', 'voima'],
  walk: ['kävely', 'palautuminen'],
  maastojuoksu: ['juoksu', 'maasto'],
  maantiepyoraily: ['pyöräily', 'maantie'],
  ski: ['hiihto', 'talvi'],
  voimaharjoittelu: ['voima', 'sali'],
};

function randn() {
  const u = Math.random(), v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
function gauss(mean: number, std: number) {
  return Math.max(0, mean + randn() * std);
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seedUser(u: (typeof TEST_USERS)[0], color: string) {
  const [existing] = await sql<{ id: string }[]>`
    select id from users where username = ${u.username}
  `;
  let userId: string;
  if (existing) {
    userId = existing.id;
    console.log(`  skipping user ${u.username} (exists)`);
  } else {
    const initials = u.displayName
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    const [row] = await sql<{ id: string }[]>`
      insert into users (username, normalized_username, email, display_name, avatar_initials, avatar_color, synopsis, resthr, maxhr)
      values (
        ${u.username},
        ${u.username.toLowerCase()},
        ${u.email},
        ${u.displayName},
        ${initials},
        ${color},
        ${u.synopsis},
        ${u.restHr},
        ${u.maxHr}
      )
      returning id
    `;
    userId = row.id;
    console.log(`  created user ${u.username} (${userId})`);
  }

  const existingCount = await sql<{ count: number }[]>`
    select count(*)::int as count from exercises where owner_id = ${userId}
  `;
  if (existingCount[0].count > 0) {
    console.log(`  skipping exercises for ${u.username} (${existingCount[0].count} exist)`);
    return;
  }

  // Generate ~6 months of exercises
  const start = new Date('2026-01-01');
  const end = new Date('2026-06-10');
  const days = Math.round((end.getTime() - start.getTime()) / 86400000);
  const sports = u.sports;

  const exercises = [];
  for (let d = 0; d < days; d++) {
    if (Math.random() > 0.55) continue;

    const date = new Date(start);
    date.setDate(start.getDate() + d);
    const dateStr = date.toISOString().slice(0, 10);
    const sport = pick(sports);
    const p = SPORT_PROFILES[sport];
    if (!p) continue;

    const distM = p.distM[0] > 0 ? Math.round(gauss(p.distM[0], p.distM[1]) / 100) * 100 : null;
    const durSec = Math.max(600, Math.round(gauss(p.durSec[0], p.durSec[1]) / 60) * 60);
    const avgHr = p.hr[0] > 0 ? Math.round(gauss(p.hr[0], p.hr[1])) : null;
    const climbM = p.climb > 0 && distM ? Math.round(gauss(p.climb, p.climb * 0.4)) : null;
    const tags = (TAGS[sport] ?? []).slice(0, Math.random() > 0.5 ? 2 : 1);

    exercises.push({
      sport,
      title: pick(TITLES[sport] ?? ['Harjoitus']),
      date: dateStr,
      durSec,
      distM: distM && distM > 0 ? distM : null,
      avgHr: avgHr && avgHr > 60 ? avgHr : null,
      climbM: climbM && climbM > 0 ? climbM : null,
      tags,
    });
  }

  for (const ex of exercises) {
    await sql`
      insert into exercises
        (owner_id, sport_key, title, exercise_date, duration_cs, distance_m, avg_hr, climb_m, tags, details, feel_rating)
      values (
        ${userId},
        ${ex.sport},
        ${ex.title},
        ${ex.date}::date,
        ${ex.durSec * 100},
        ${ex.distM},
        ${ex.avgHr},
        ${ex.climbM},
        ${ex.tags},
        '{}',
        ${pick(['easy', 'ok', 'hard'])}
      )
    `;
  }
  console.log(`  inserted ${exercises.length} exercises for ${u.username}`);
}

async function main() {
  for (let i = 0; i < TEST_USERS.length; i++) {
    const u = TEST_USERS[i];
    const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
    console.log(`Processing ${u.displayName}...`);
    await seedUser(u, color);
  }
  await sql.end();
  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
