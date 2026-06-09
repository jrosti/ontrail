// Deterministic in-memory seed data

export type Sport = 'run' | 'orient' | 'bike' | 'gym' | 'floor' | 'snow' | 'ski' | 'swim' | 'mtb' | 'walk' | 'soutu' | 'cyclo';

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarInitials: string;
  avatarColor: string;
  synopsis: string;
  totalExercises: number;
  totalKm: number;
  thisYearKm: number;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatarInitials: string;
  avatarColor: string;
  body: string;
  createdAt: string;
}

export interface Exercise {
  id: string;
  userId: string;
  // owner fields match frontend ExerciseListItem / Exercise types
  ownerUsername: string;
  ownerDisplayName: string;
  ownerInitials: string;
  ownerColor: string;
  sport: Sport;
  title: string;
  date: string;
  durationSec: number;
  distanceM: number;
  avgHr?: number;
  feel?: 1 | 2 | 3;
  feelRating?: 'easy' | 'ok' | 'hard';
  tags: string[];
  body: string;
  comments: Comment[];
  cares: string[];
  careCount: number;
  commentCount: number;
  details: { [key: string]: number };
  createdAt: string;
  updatedAt: string;
}

const COLORS = ['oklch(60% .18 260)', 'oklch(60% .18 30)', 'oklch(55% .16 150)', 'oklch(58% .2 300)', 'oklch(56% .15 200)'];
const SPORTS: Sport[] = ['run', 'orient', 'bike', 'gym', 'floor', 'snow', 'ski', 'swim', 'mtb', 'walk', 'soutu', 'cyclo'];

function rng(seed: number) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return Math.abs(s) / 0x7fffffff; };
}

const USERS: User[] = [
  { id: 'u1', username: 'petri', displayName: 'Petri L', avatarInitials: 'PL', avatarColor: COLORS[0], synopsis: 'Juoksija ja suunnistaja', totalExercises: 412, totalKm: 5820, thisYearKm: 623 },
  { id: 'u2', username: 'antta', displayName: 'Antta M', avatarInitials: 'AM', avatarColor: COLORS[1], synopsis: 'Pyöräilijä', totalExercises: 287, totalKm: 12450, thisYearKm: 1840 },
  { id: 'u3', username: 'saara', displayName: 'Saara K', avatarInitials: 'SK', avatarColor: COLORS[2], synopsis: 'Triathlonisti', totalExercises: 634, totalKm: 8900, thisYearKm: 980 },
  { id: 'u4', username: 'matti', displayName: 'Matti P', avatarInitials: 'MP', avatarColor: COLORS[3], synopsis: 'Hiihto & juoksu', totalExercises: 198, totalKm: 3200, thisYearKm: 340 },
];

const TITLES: Record<Sport, string[]> = {
  run: ['Aamuintoilu', 'Intervallit radalla', 'Pitkä hidas juoksu', 'Tempojuoksu', 'Metsälenkki', 'Kisajuoksu'],
  orient: ['SM-kartat', 'Suunnistusharjoitus', 'Yösuunnistus', 'Sprinttisuunnistus', 'Kartanmuistiharjoitus'],
  bike: ['Maantieajo', 'Pyörätreeni', 'Ratojen kiertäminen', 'Ryhmäajo', 'Pyöräilyretki'],
  gym: ['Voimatreeni', 'Jalkaharjoitus', 'Yläkroppa', 'Kuntosali', 'CrossFit'],
  floor: ['Joogaa', 'Venyttely', 'Pilates', 'Core-harjoitus'],
  snow: ['Lumikenkäkävely', 'Pulkkamäki'],
  ski: ['Ladun teko', 'Hiihtoharjoitus', 'Klassinen tekniikka', 'Vapaa tekniikka', 'Pitkä latu'],
  swim: ['Allasharjoitus', 'Tekniikkauinti', 'Kilpailutreeni', 'Avovesiuinti'],
  mtb: ['Maastopyöräily', 'Singlepolk-ura', 'Bikeparkki'],
  walk: ['Lenkki', 'Vaellus', 'Iltakävely', 'Koiran kanssa'],
  soutu: ['Souduntreeni', 'Joen soutu'],
  cyclo: ['Cyclocross', 'Harjoitusmäki'],
};

const BODIES = [
  '<p>Hyvä fiilis koko lenkin ajan. Tempo tuntui sopivalta ja jalat toimivat hyvin.</p>',
  '<p>Hiukan raskas olo alussa mutta loppujen lopuksi ihan mukava vedellä. Täytyy muistaa juoda enemmän ennen harjoitusta.</p>',
  '<p>Loistava sää, aurinko paistoi. Tempo nousi loppua kohden luontevasti.</p>',
  '<p>Intervallitreeni meni hyvin. Ensimmäiset 4 erää 4:10/km ja loput 4:05/km.</p>',
  '',
];

function makeExercises(): Exercise[] {
  const r = rng(42);
  const now = new Date('2026-06-09');
  const exs: Exercise[] = [];

  for (let i = 0; i < 60; i++) {
    const user = USERS[Math.floor(r() * USERS.length)];
    const sport = SPORTS[Math.floor(r() * SPORTS.length)];
    const titles = TITLES[sport];
    const title = titles[Math.floor(r() * titles.length)];
    const daysBack = Math.floor(r() * 180);
    const date = new Date(now.getTime() - daysBack * 86400000);
    const durationSec = Math.floor(1800 + r() * 7200);
    const distanceM = sport === 'gym' || sport === 'floor' ? 0 : Math.floor(3000 + r() * 35000);
    const hr = sport === 'gym' ? undefined : Math.floor(130 + r() * 40);
    const feel = ([1, 2, 3] as const)[Math.floor(r() * 3)];
    const tagPool = ['aamu', 'ilta', 'intervalli', 'pitkä', 'kilpailu', 'helppo', 'raskasta', 'luonto'];
    const tags = r() > 0.5 ? [tagPool[Math.floor(r() * tagPool.length)]] : [];

    const commentCount = Math.floor(r() * 4);
    const comments: Comment[] = Array.from({ length: commentCount }, (_, ci) => {
      const cu = USERS[Math.floor(r() * USERS.length)];
      return {
        id: `c${i}-${ci}`,
        userId: cu.id,
        username: cu.username,
        displayName: cu.displayName,
        avatarInitials: cu.avatarInitials,
        avatarColor: cu.avatarColor,
        body: ['Hyvä vedos!', 'Mahtavaa!', 'Tsemppiä!', 'Kiva lenkki 👍', 'Siistiä!'][Math.floor(r() * 5)],
        createdAt: new Date(date.getTime() + 3600000 * (ci + 1)).toISOString(),
      };
    });

    const caresCount = Math.floor(r() * 8);
    const cares = USERS.slice(0, caresCount).map(u => u.id);

    const feelRating = feel === 1 ? 'easy' : feel === 2 ? 'ok' : 'hard';
    const ts = new Date(date.getTime() + 7200000).toISOString();
    exs.push({
      id: `ex${i + 1}`,
      userId: user.id,
      ownerUsername: user.username,
      ownerDisplayName: user.displayName,
      ownerInitials: user.avatarInitials,
      ownerColor: user.avatarColor,
      sport,
      title,
      date: date.toISOString().slice(0, 10),
      durationSec,
      distanceM,
      avgHr: hr,
      feel,
      feelRating,
      tags,
      body: BODIES[Math.floor(r() * BODIES.length)],
      comments,
      cares,
      careCount: cares.length,
      commentCount: comments.length,
      details: {},
      createdAt: ts,
      updatedAt: ts,
    });
  }

  return exs.sort((a, b) => b.date.localeCompare(a.date));
}

export const EXERCISES: Exercise[] = makeExercises();

export function getUserByUsername(username: string): User | undefined {
  return USERS.find(u => u.username === username);
}

export { USERS };
