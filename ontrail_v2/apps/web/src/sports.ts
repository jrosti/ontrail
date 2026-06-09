import type { Sport } from './types';

export const SPORTS: Record<string, Sport> = {
  run:    { key: 'run',    nameFi: 'Juoksu',         nameEn: 'Running',      glyph: 'run',    color: 'oklch(0.71 0.17 32)',  metric: 'pace',  paceUnit: 'min/km' },
  orient: { key: 'orient', nameFi: 'Suunnistus',      nameEn: 'Orienteering', glyph: 'orient', color: 'oklch(0.70 0.15 150)', metric: 'pace',  paceUnit: 'min/km' },
  bike:   { key: 'bike',   nameFi: 'Pyöräily',        nameEn: 'Cycling',      glyph: 'bike',   color: 'oklch(0.72 0.14 232)', metric: 'speed', paceUnit: 'km/h' },
  gym:    { key: 'gym',    nameFi: 'Kuntosali',       nameEn: 'Strength',     glyph: 'gym',    color: 'oklch(0.68 0.15 300)', metric: 'reps',  paceUnit: 'min/km' },
  floor:  { key: 'floor',  nameFi: 'Sähly',           nameEn: 'Floorball',    glyph: 'floor',  color: 'oklch(0.78 0.15 92)',  metric: 'time',  paceUnit: 'min/km' },
  snow:   { key: 'snow',   nameFi: 'Lumilautailu',    nameEn: 'Snowboard',    glyph: 'snow',   color: 'oklch(0.73 0.12 205)', metric: 'time',  paceUnit: 'min/km' },
  ski:    { key: 'ski',    nameFi: 'Hiihto',          nameEn: 'Skiing',       glyph: 'ski',    color: 'oklch(0.76 0.10 250)', metric: 'pace',  paceUnit: 'min/km' },
  swim:   { key: 'swim',   nameFi: 'Uinti',           nameEn: 'Swimming',     glyph: 'swim',   color: 'oklch(0.70 0.13 212)', metric: 'pace',  paceUnit: 'min/100m' },
  mtb:    { key: 'mtb',    nameFi: 'Maastopyöräily',  nameEn: 'MTB',          glyph: 'mtb',    color: 'oklch(0.69 0.16 58)',  metric: 'speed', paceUnit: 'km/h' },
  walk:   { key: 'walk',   nameFi: 'Kävely',          nameEn: 'Walk',         glyph: 'walk',   color: 'oklch(0.68 0.09 135)', metric: 'pace',  paceUnit: 'min/km' },
  soutu:  { key: 'soutu',  nameFi: 'Soutu',           nameEn: 'Rowing',       glyph: 'swim',   color: 'oklch(0.68 0.12 210)', metric: 'pace',  paceUnit: 'min/500m' },
  cyclo:  { key: 'cyclo',  nameFi: 'Cyclocross',      nameEn: 'Cyclocross',   glyph: 'bike',   color: 'oklch(0.70 0.14 60)',  metric: 'speed', paceUnit: 'km/h' },
};

export const SPORT_GLYPHS: Record<string, string> = {
  run: 'M9 5a1.4 1.4 0 1 0 0-2.8M9 5l-3 4 3 2 1 5M9 11l-4 1M15 9l-3-1M13 15l3 3',
  bike: 'M6 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM9 14l3-5 3 5M9 9h3',
  orient: 'M12 12m-7 0a7 7 0 1 0 14 0a7 7 0 1 0-14 0M12 12m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0',
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
