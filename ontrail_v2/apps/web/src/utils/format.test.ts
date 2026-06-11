import { describe, expect, test } from 'bun:test';
import {
  calcPace,
  calcSpeed,
  durLong,
  durShort,
  fmtDist,
  fmtDistanceKm,
  fmtDistKm,
  fmtDistSummary,
  fmtDur,
  fmtDurLabel,
  fmtInt,
  fmtPace,
  fmtPaceSport,
  fmtSpeed,
  parseDistance,
  parseDuration,
  relDay,
  stripHtml,
} from './format';

function localIsoDate(daysFromToday = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Durations are centiseconds (1 s = 100, 1 min = 6000, 1 h = 360000).
describe('duration formatting and parsing', () => {
  test('formats short and long durations', () => {
    expect(durShort(65 * 6000)).toBe('1:05');
    expect(durShort(45 * 6000)).toBe('45 min');
    expect(durLong(366500)).toBe('1 h 1 min'); // 1:01:05
    expect(durLong(7500)).toBe('1 min 15 s');
    expect(durLong(4200)).toBe('42 s');
    expect(fmtDur(0)).toBe('—');
    expect(fmtDur(366000)).toBe('1h 1min');
    expect(fmtDur(180000)).toBe('30min');
    expect(fmtDurLabel(0)).toBe('0min');
    expect(fmtDurLabel(720000)).toBe('2h 0min');
  });

  test('parses clock and text inputs into centiseconds', () => {
    expect(parseDuration('1:02:03')).toBe(372300);
    expect(parseDuration('45:30')).toBe(273000);
    expect(parseDuration('bad:input')).toBe(0);
    expect(parseDuration('1,5 h')).toBe(540000);
    expect(parseDuration('45min')).toBe(270000);
    expect(parseDuration('1h 2min 3s')).toBe(372300);
    expect(parseDuration('90')).toBe(540000);
    expect(parseDuration('')).toBe(0);
  });

  test('preserves sub-second (hundredths) precision', () => {
    // A 800 m record time: 2:31.76 must stay distinct from 2:32.00.
    expect(parseDuration('2.31,76')).toBe(15176);
    expect(parseDuration('2:31,76')).toBe(15176);
    expect(parseDuration('2.32')).toBe(15200);
    expect(parseDuration('2.31,76')).not.toBe(parseDuration('2.32'));
    expect(parseDuration('5 min 4,15 s')).toBe(30415);
  });
});

describe('distance, pace, and speed', () => {
  test('formats distances using Finnish decimal separator', () => {
    expect(fmtDist(0, 'fi')).toBe('');
    expect(fmtDist(560, 'fi')).toBe('560 m');
    expect(fmtDist(12500, 'fi')).toBe('12,5 km');
    expect(fmtDist(12500, 'en')).toBe('12.5 km');
    expect(fmtDistSummary(0, 'fi')).toBe('—');
    expect(fmtDistSummary(12500, 'fi')).toBe('12,5 km');
    expect(fmtDistKm(12500, 'fi')).toBe('12,5');
    expect(fmtDistanceKm(12500, 'fi', 2)).toBe('12,50');
    expect(fmtInt(1234.4, 'fi')).toBe('1 234');
  });

  test('parses km and meter inputs', () => {
    expect(parseDistance('12,5')).toBe(12500);
    expect(parseDistance('12.5 km')).toBe(12500);
    expect(parseDistance('560 m')).toBe(560);
    expect(parseDistance('bad')).toBe(0);
    expect(parseDistance('')).toBe(0);
  });

  test('calculates pace and speed (duration in centiseconds)', () => {
    expect(calcPace(30 * 6000, 5000)).toBe(6); // 30 min over 5 km = 6 min/km
    expect(calcPace(0, 5000)).toBe(0);
    expect(fmtPace(4.5)).toBe('4.30');
    expect(calcSpeed(360000, 30000)).toBe(30); // 1 h over 30 km = 30 km/h
    expect(calcSpeed(0, 30000)).toBe(0);
    expect(fmtSpeed(30000, 360000, 'fi')).toBe('30');
    expect(fmtSpeed(0, 360000, 'fi')).toBe('—');
    expect(fmtPaceSport(180000, 5000, 'run', 'fi')).toBe('6:00/km');
    expect(fmtPaceSport(9000, 100, 'uinti', 'fi')).toBe('1:30/100m');
    expect(fmtPaceSport(360000, 30000, 'bike', 'fi')).toBe('30 km/h');
    expect(fmtPaceSport(0, 30000, 'run', 'fi')).toBe('—');
  });

  test('strips html tags and entities to plain text', () => {
    expect(stripHtml('<td><p>Hello&nbsp;world</p></td>')).toBe('Hello world');
    expect(stripHtml('<p>a</p>\n<p>b</p>')).toBe('a b');
    expect(stripHtml('Tom &amp; Jerry &lt;3')).toBe('Tom & Jerry <3');
    expect(stripHtml('<p><br></p>')).toBe('');
  });

  test('formats relative dates in both languages', () => {
    expect(relDay(localIsoDate(), 'fi')).toBe('tänään');
    expect(relDay(localIsoDate(-1), 'en')).toBe('yesterday');
    expect(relDay(localIsoDate(-3), 'fi')).toBe('3 pv sitten');
  });
});
