import type { Sport } from './types';

const palette = [
  'oklch(0.71 0.17 32)',
  'oklch(0.70 0.15 150)',
  'oklch(0.72 0.14 232)',
  'oklch(0.68 0.15 300)',
  'oklch(0.78 0.15 92)',
  'oklch(0.73 0.12 205)',
  'oklch(0.76 0.10 250)',
  'oklch(0.70 0.13 212)',
  'oklch(0.69 0.16 58)',
  'oklch(0.68 0.09 135)',
  'oklch(0.66 0.13 18)',
  'oklch(0.70 0.12 285)',
];

function sport(
  key: string,
  nameFi: string,
  nameEn = nameFi,
  glyph = 'run',
  metric: Sport['metric'] = 'pace',
  paceUnit: Sport['paceUnit'] = 'min/km',
): Sport {
  const color = palette[ALL_SPORTS.length % palette.length];
  return { key, nameFi, nameEn, glyph, color, metric, paceUnit };
}

export const ALL_SPORTS: Sport[] = [];
ALL_SPORTS.push(
  sport('beach-volley', 'Beach volley', 'Beach volleyball', 'floor', 'time'),
  sport('crossfit', 'Crossfit', 'CrossFit', 'gym', 'reps'),
  sport('crosstrainer', 'Crosstrainer', 'Cross trainer', 'walk', 'time'),
  sport('cyclo', 'Cyclocross', 'Cyclocross', 'bike', 'speed', 'km/h'),
  sport('frisbeegolf', 'Frisbeegolf', 'Disc golf', 'orient', 'time'),
  sport('golf', 'Golf', 'Golf', 'walk', 'time'),
  sport('hieronta', 'Hieronta', 'Massage', 'gym', 'time'),
  sport('ski', 'Hiihto', 'Skiing', 'ski'),
  sport('jalkapallo', 'Jalkapallo', 'Football', 'floor', 'time'),
  sport('jooga', 'Jooga', 'Yoga', 'floor', 'time'),
  sport('jumppa', 'Jumppa', 'Exercise class', 'gym', 'time'),
  sport('run', 'Juoksu', 'Running', 'run'),
  sport('jaakiekko', 'Jääkiekko', 'Ice hockey', 'floor', 'time'),
  sport('kahvakuula', 'Kahvakuula', 'Kettlebell', 'gym', 'reps'),
  sport('kamppailulaji', 'Kamppailulaji', 'Martial arts', 'gym', 'time'),
  sport('kaukalopallo', 'Kaukalopallo', 'Rinkball', 'floor', 'time'),
  sport('kickbike', 'Kickbike', 'Kickbike', 'bike', 'speed', 'km/h'),
  sport('kiipeily', 'Kiipeily', 'Climbing', 'gym', 'time'),
  sport('koripallo', 'Koripallo', 'Basketball', 'floor', 'time'),
  sport('kuntopiiri', 'Kuntopiiri', 'Circuit training', 'gym', 'reps'),
  sport('kuntopyora', 'Kuntopyörä', 'Exercise bike', 'bike', 'speed', 'km/h'),
  sport('gym', 'Kuntosali', 'Strength', 'gym', 'reps'),
  sport('walk', 'Kävely', 'Walk', 'walk'),
  sport('laskettelu', 'Laskettelu', 'Downhill skiing', 'snow', 'time'),
  sport('lentopallo', 'Lentopallo', 'Volleyball', 'floor', 'time'),
  sport('leuanveto', 'Leuanveto', 'Pull-ups', 'gym', 'reps'),
  sport('luistelu', 'Luistelu', 'Skating', 'ski', 'speed', 'km/h'),
  sport('luisteluhiihto', 'Luisteluhiihto', 'Skate skiing', 'ski'),
  sport('lumikenkaily', 'Lumikenkäily', 'Snowshoeing', 'snow'),
  sport('snow', 'Lumilautailu', 'Snowboarding', 'snow', 'time'),
  sport('maantiepyoraily', 'Maantiepyöräily', 'Road cycling', 'bike', 'speed', 'km/h'),
  sport('maastojuoksu', 'Maastojuoksu', 'Trail running', 'run'),
  sport('mtb', 'Maastopyöräily', 'MTB', 'mtb', 'speed', 'km/h'),
  sport('melonta', 'Melonta', 'Paddling', 'swim', 'pace', 'min/500m'),
  sport('muu-laji', 'Muu laji', 'Other sport', 'run', 'time'),
  sport('muu-merkinta', 'Muu merkintä', 'Other entry', 'run', 'time'),
  sport('nyrkkeily', 'Nyrkkeily', 'Boxing', 'gym', 'time'),
  sport('perinteinen-hiihto', 'Perinteinen hiihto', 'Classic skiing', 'ski'),
  sport('pilates', 'Pilates', 'Pilates', 'floor', 'time'),
  sport('potkukelkkailu', 'Potkukelkkailu', 'Kick sledding', 'ski'),
  sport('pumppi', 'Pumppi', 'Pump', 'gym', 'reps'),
  sport('bike', 'Pyöräily', 'Cycling', 'bike', 'speed', 'km/h'),
  sport('ratsastus', 'Ratsastus', 'Horse riding', 'walk', 'time'),
  sport('ringette', 'Ringette', 'Ringette', 'floor', 'time'),
  sport('rogaining', 'Rogaining', 'Rogaining', 'orient'),
  sport('rullahiihto', 'Rullahiihto', 'Roller skiing', 'ski', 'speed', 'km/h'),
  sport('rullaluistelu', 'Rullaluistelu', 'Inline skating', 'ski', 'speed', 'km/h'),
  sport('sairaus', 'Sairaus', 'Illness', 'run', 'time'),
  sport('salibandy', 'Salibandy', 'Floorball', 'floor', 'time'),
  sport('sauvakavely', 'Sauvakävely', 'Nordic walking', 'walk'),
  sport('seikkailu-urheilu', 'Seikkailu-urheilu', 'Adventure racing', 'orient'),
  sport('sisasoutu', 'Sisäsoutu', 'Indoor rowing', 'swim', 'pace', 'min/500m'),
  sport('soutu', 'Soutu', 'Rowing', 'swim', 'pace', 'min/500m'),
  sport('spinning', 'Spinning', 'Spinning', 'bike', 'speed', 'km/h'),
  sport('squash', 'Squash', 'Squash', 'floor', 'time'),
  sport('sulkapallo', 'Sulkapallo', 'Badminton', 'floor', 'time'),
  sport('orient', 'Suunnistus', 'Orienteering', 'orient'),
  sport('floor', 'Sähly', 'Floorball', 'floor', 'time'),
  sport('tanssi', 'Tanssi', 'Dance', 'floor', 'time'),
  sport('tapahtuma', 'Tapahtuma', 'Event', 'run', 'time'),
  sport('telinevoimistelu', 'Telinevoimistelu', 'Artistic gymnastics', 'gym', 'reps'),
  sport('tennis', 'Tennis', 'Tennis', 'floor', 'time'),
  sport('triathlon', 'Triathlon', 'Triathlon', 'run'),
  sport('swim', 'Uinti', 'Swimming', 'swim', 'pace', 'min/100m'),
  sport('vaellus', 'Vaellus', 'Hiking', 'walk'),
  sport('venyttely', 'Venyttely', 'Stretching', 'floor', 'time'),
  sport('vesijuoksu', 'Vesijuoksu', 'Aqua jogging', 'swim', 'time'),
  sport('voimaharjoittelu', 'Voimaharjoittelu', 'Strength training', 'gym', 'reps'),
  sport('yleisurheilu', 'Yleisurheilu', 'Athletics', 'run'),
);

export const SPORTS: Record<string, Sport> = Object.fromEntries(ALL_SPORTS.map((s) => [s.key, s]));

export const SPORT_GLYPHS: Record<string, string> = {
  run: 'M9 5a1.4 1.4 0 1 0 0-2.8M9 5l-3 4 3 2 1 5M9 11l-4 1M15 9l-3-1M13 15l3 3',
  bike: 'M6 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM9 14l3-5 3 5M9 9h3',
  orient:
    'M12 12m-7 0a7 7 0 1 0 14 0a7 7 0 1 0-14 0M12 12m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0',
  gym: 'M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10',
  floor: 'M6 4l9 12M15 17a2.5 2.5 0 1 0 0.01 0z',
  snow: 'M5 16l14-8M7 17l1 1M16 6l1 1',
  ski: 'M5 18L17 6M7 18L19 6M5 18h2M17 6h2',
  swim: 'M3 14c2 0 2-1.5 4.5-1.5S10 14 12 14s2-1.5 4.5-1.5S19 14 21 14M14 7a1.6 1.6 0 1 0 0-0.01z',
  mtb: 'M6 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM9 14l3-5 3 5',
  walk: 'M11 5a1.3 1.3 0 1 0 0-2.6M11 5l-2 5 3 2v6M9 10l-3 2M14 10l-2-1',
};

export function sportName(key: string, lang: 'fi' | 'en'): string {
  const s = SPORTS[key];
  if (!s) return key;
  return lang === 'fi' ? s.nameFi : s.nameEn;
}
