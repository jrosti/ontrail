import { describe, expect, test } from 'bun:test';
import {
  calcPace,
  calcSpeed,
  durLong,
  durShort,
  fmtDistance,
  fmtDistanceKm,
  fmtPace,
  parseDistance,
  parseDuration,
} from './format';

describe('duration formatting and parsing', () => {
  test('formats short and long durations', () => {
    expect(durShort(65 * 60)).toBe('1:05');
    expect(durShort(45 * 60)).toBe('45 min');
    expect(durLong(3665)).toBe('1 h 1 min');
    expect(durLong(75)).toBe('1 min 15 s');
  });

  test('parses clock and text inputs', () => {
    expect(parseDuration('1:02:03')).toBe(3723);
    expect(parseDuration('45:30')).toBe(2730);
    expect(parseDuration('1,5 h')).toBe(5400);
    expect(parseDuration('45min')).toBe(2700);
    expect(parseDuration('90')).toBe(5400);
  });
});

describe('distance, pace, and speed', () => {
  test('formats distances using Finnish decimal separator', () => {
    expect(fmtDistance(0)).toBe('');
    expect(fmtDistance(560)).toBe('560 m');
    expect(fmtDistance(12500)).toBe('12,5 km');
    expect(fmtDistanceKm(12500)).toBe('12,50');
  });

  test('parses km and meter inputs', () => {
    expect(parseDistance('12,5')).toBe(12500);
    expect(parseDistance('12.5 km')).toBe(12500);
    expect(parseDistance('560 m')).toBe(560);
  });

  test('calculates pace and speed', () => {
    expect(calcPace(30 * 60, 5000)).toBe(6);
    expect(fmtPace(4.5)).toBe('4.30');
    expect(calcSpeed(3600, 30000)).toBe(30);
  });
});
