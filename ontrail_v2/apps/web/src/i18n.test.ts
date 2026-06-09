import { describe, expect, test } from 'bun:test';
import { I18N } from './i18n';

describe('Finnish translations', () => {
  test('uses Syöte for the feed label', () => {
    expect(I18N.fi.feed).toBe('Syöte');
  });

  test('keeps required logging labels available', () => {
    expect(I18N.fi.gpxField).toContain('.gpx');
    expect(I18N.fi.durationField).toBe('Kesto');
    expect(I18N.fi.distanceField).toBe('Matka');
  });
});
