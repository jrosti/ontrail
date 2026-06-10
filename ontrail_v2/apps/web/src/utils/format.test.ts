import { describe, expect, test } from 'bun:test';
import {
  calcPace,
  calcSpeed,
  fmtDist,
  fmtDistKm,
  fmtDistSummary,
  durLong,
  durShort,
  fmtDistanceKm,
  fmtDur,
  fmtDurLabel,
  fmtInt,
  fmtPace,
  fmtPaceSport,
  fmtSpeed,
  parseDistance,
  parseDuration,
  relDay,
} from './format';

describe('duration formatting and parsing', () => {
  test('formats short and long durations', () => {
    expect(durShort(65 * 60)).toBe('1:05');
    expect(durShort(45 * 60)).toBe('45 min');
    expect(durLong(3665)).toBe('1 h 1 min');
    expect(durLong(75)).toBe('1 min 15 s');
    expect(durLong(42)).toBe('42 s');
    expect(fmtDur(0)).toBe('—');
    expect(fmtDur(3660)).toBe('1h 1min');
    expect(fmtDur(1800)).toBe('30min');
    expect(fmtDurLabel(0)).toBe('0min');
    expect(fmtDurLabel(7200)).toBe('2h 0min');
  });

  test('parses clock and text inputs', () => {
    expect(parseDuration('1:02:03')).toBe(3723);
    expect(parseDuration('45:30')).toBe(2730);
    expect(parseDuration('bad:input')).toBe(0);
    expect(parseDuration('1,5 h')).toBe(5400);
    expect(parseDuration('45min')).toBe(2700);
    expect(parseDuration('1h 2min 3s')).toBe(3723);
    expect(parseDuration('90')).toBe(5400);
    expect(parseDuration('')).toBe(0);
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

  test('calculates pace and speed', () => {
    expect(calcPace(30 * 60, 5000)).toBe(6);
    expect(calcPace(0, 5000)).toBe(0);
    expect(fmtPace(4.5)).toBe('4.30');
    expect(calcSpeed(3600, 30000)).toBe(30);
    expect(calcSpeed(0, 30000)).toBe(0);
    expect(fmtSpeed(30000, 3600, 'fi')).toBe('30');
    expect(fmtSpeed(0, 3600, 'fi')).toBe('—');
    expect(fmtPaceSport(1800, 5000, 'run', 'fi')).toBe('6:00/km');
    expect(fmtPaceSport(90, 100, 'uinti', 'fi')).toBe('1:30/100m');
    expect(fmtPaceSport(3600, 30000, 'bike', 'fi')).toBe('30 km/h');
    expect(fmtPaceSport(0, 30000, 'run', 'fi')).toBe('—');
  });

  test('formats relative dates in both languages', () => {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 864e5);
    const threeDaysAgo = new Date(today.getTime() - 3 * 864e5);

    expect(relDay(today.toISOString().slice(0, 10), 'fi')).toBe('tänään');
    expect(relDay(yesterday.toISOString().slice(0, 10), 'en')).toBe('yesterday');
    expect(relDay(threeDaysAgo.toISOString().slice(0, 10), 'fi')).toBe('3 pv sitten');
  });
});
