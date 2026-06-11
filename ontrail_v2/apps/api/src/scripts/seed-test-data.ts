#!/usr/bin/env bun
/**
 * Seed realistic exercise data for 2025–2026 (up to today) for the first user.
 * Run: bun run scripts/seed-test-data.ts
 */
import postgres from 'postgres';

const sql = postgres('postgres://hanko:hanko@localhost:5432/ontrail', { max: 1 });

const USER_ID = 'f8ec5019-2f36-42e4-be81-3f4afbb4b100';

// Sports mix: run-heavy, some cycling, swimming, skiing in winter, gym year-round
// [sportKey, weightRelative, distMeanM, distStdM, durMeanSec, durStdSec, hrMean, hrStd, climbMean]
const SPORT_PROFILES = [
  { key: 'run', weight: 32, distM: [8000, 4000], durSec: [3000, 900], hr: [155, 12], climb: 60 },
  {
    key: 'bike',
    weight: 20,
    distM: [35000, 15000],
    durSec: [5400, 1800],
    hr: [145, 10],
    climb: 400,
  },
  { key: 'swim', weight: 10, distM: [2000, 800], durSec: [2700, 600], hr: [140, 8], climb: 0 },
  { key: 'gym', weight: 12, distM: [0, 0], durSec: [3600, 600], hr: [130, 15], climb: 0 },
  { key: 'walk', weight: 8, distM: [5000, 2000], durSec: [2700, 600], hr: [115, 10], climb: 30 },
  {
    key: 'maastojuoksu',
    weight: 5,
    distM: [10000, 4000],
    durSec: [3600, 900],
    hr: [158, 12],
    climb: 250,
  },
  {
    key: 'maantiepyoraily',
    weight: 5,
    distM: [60000, 20000],
    durSec: [7200, 1800],
    hr: [148, 8],
    climb: 600,
  },
  { key: 'ski', weight: 4, distM: [15000, 8000], durSec: [5400, 1800], hr: [150, 10], climb: 300 },
  {
    key: 'voimaharjoittelu',
    weight: 4,
    distM: [0, 0],
    durSec: [3600, 600],
    hr: [125, 12],
    climb: 0,
  },
];

const TITLES: Record<string, string[]> = {
  run: [
    'Aamuverryttely',
    'Helppo hölkkä',
    'Intervalli',
    'Pitkäjuoksu',
    'Iltajuoksu',
    'Perjantaijuoksu',
    'Tempojuoksu',
    'Rauhallinen lenkki',
  ],
  bike: ['Pyöräily töihin', 'Pyörälenkkii', 'Pitkä pyöräily', 'Kierros', 'Nopea pyöräily'],
  swim: ['Uintiharjoitus', 'Tekniikkauinti', 'Kestävyysuinti', 'Vapaatyyli'],
  gym: ['Kuntosali', 'Voimaharjoittelu', 'Lihaskuntoharjoitus', 'Salitreeni'],
  walk: ['Kävelylenkki', 'Iltakävely', 'Metsäkävely', 'Rauhallinen kävely'],
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
  maastojuoksu: ['juoksu', 'maasto', 'polku'],
  maantiepyoraily: ['pyöräily', 'maantie'],
  ski: ['hiihto', 'talvi'],
  voimaharjoittelu: ['voima', 'sali'],
};

function randn(): number {
  // Box-Muller
  const u = Math.random(),
    v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function gauss(mean: number, std: number): number {
  return Math.max(0, mean + randn() * std);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Winter months get more skiing, less cycling
function adjustedProfile(date: Date) {
  const month = date.getMonth() + 1; // 1-12
  const isWinter = month <= 3 || month === 12;
  const isSummer = month >= 5 && month <= 9;

  const profiles = SPORT_PROFILES.map((p) => {
    let w = p.weight;
    if (p.key === 'ski' && isWinter) w *= 5;
    if (p.key === 'ski' && !isWinter) w = 0;
    if ((p.key === 'bike' || p.key === 'maantiepyoraily') && isWinter) w = Math.round(w * 0.2);
    if ((p.key === 'bike' || p.key === 'maantiepyoraily') && isSummer) w *= 2;
    if (p.key === 'swim' && isSummer) w *= 2;
    return { ...p, weight: w };
  }).filter((p) => p.weight > 0);

  const total = profiles.reduce((s, p) => s + p.weight, 0);
  let r = Math.random() * total;
  for (const p of profiles) {
    r -= p.weight;
    if (r <= 0) return p;
  }
  return profiles[0];
}

async function main() {
  const start = new Date('2025-01-01');
  const end = new Date('2026-06-10'); // today
  const days = Math.round((end.getTime() - start.getTime()) / 86400000);

  const exercises: {
    sport: string;
    title: string;
    date: string;
    durSec: number;
    distM: number | null;
    avgHr: number | null;
    climbM: number | null;
    tags: string[];
  }[] = [];

  // Generate ~4-5 sessions per week on average — skip ~35% of days, some days have 2
  for (let d = 0; d < days; d++) {
    const date = new Date(start);
    date.setDate(start.getDate() + d);

    // ~60% chance of an exercise on any given day
    if (Math.random() > 0.6) continue;

    const profile = adjustedProfile(date);
    const dateStr = date.toISOString().slice(0, 10);
    const [dMean, dStd] = profile.distM;
    const [durMean, durStd] = profile.durSec;
    const [hrMean, hrStd] = profile.hr;

    const distM = dMean > 0 ? Math.round(gauss(dMean, dStd) / 100) * 100 : null;
    const durSec = Math.round(gauss(durMean, durStd) / 60) * 60;
    const avgHr = hrMean > 0 ? Math.round(gauss(hrMean, hrStd)) : null;
    const climbM =
      profile.climb > 0 && distM ? Math.round(gauss(profile.climb, profile.climb * 0.4)) : null;

    const titles = TITLES[profile.key] ?? ['Harjoitus'];
    const tags = (TAGS[profile.key] ?? []).slice(0, Math.random() > 0.5 ? 2 : 1);

    exercises.push({
      sport: profile.key,
      title: pick(titles),
      date: dateStr,
      durSec: Math.max(600, durSec),
      distM: distM && distM > 0 ? distM : null,
      avgHr: avgHr && avgHr > 60 ? avgHr : null,
      climbM: climbM && climbM > 0 ? climbM : null,
      tags,
    });

    // ~15% chance of a second exercise the same day (e.g., morning + evening)
    if (Math.random() < 0.15) {
      const p2 = adjustedProfile(date);
      const [dm2, ds2] = p2.distM;
      const [dur2, durs2] = p2.durSec;
      const [hr2, hrs2] = p2.hr;
      exercises.push({
        sport: p2.key,
        title: pick(TITLES[p2.key] ?? ['Harjoitus']),
        date: dateStr,
        durSec: Math.max(600, Math.round(gauss(dur2, durs2) / 60) * 60),
        distM: dm2 > 0 ? Math.max(0, Math.round(gauss(dm2, ds2) / 100) * 100) || null : null,
        avgHr: hr2 > 0 ? Math.round(gauss(hr2, hrs2)) : null,
        climbM: p2.climb > 0 ? Math.round(gauss(p2.climb, p2.climb * 0.4)) || null : null,
        tags: (TAGS[p2.key] ?? []).slice(0, 1),
      });
    }
  }

  console.log(`Inserting ${exercises.length} exercises…`);

  // Insert in batches
  const BATCH = 50;
  for (let i = 0; i < exercises.length; i += BATCH) {
    const batch = exercises.slice(i, i + BATCH);
    for (const ex of batch) {
      await sql`
        insert into exercises
          (owner_id, sport_key, title, exercise_date, duration_cs, distance_m, avg_hr, climb_m, tags, details, feel_rating)
        values (
          ${USER_ID},
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
    process.stdout.write(`  ${Math.min(i + BATCH, exercises.length)}/${exercises.length}\r`);
  }

  console.log('\nDone.');

  const counts = await sql<{ sport_key: string; count: number }[]>`
    select sport_key, count(*)::int
    from exercises
    where owner_id = ${USER_ID}
      and exercise_date >= '2025-01-01'
    group by sport_key
    order by count desc
  `;
  console.log('\nSummary:');
  for (const r of counts) console.log(`  ${r.sport_key}: ${r.count}`);

  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
