import { describe, expect, test } from 'bun:test';
import { ACCENTS, buildCSSVars, DEFAULT_THEME, DENSITY, FONTS, THEMES } from './theme';

describe('buildCSSVars', () => {
  test('combines theme, accent, font, and density tokens', () => {
    const vars = buildCSSVars({
      theme: 'light',
      accent: 'blue',
      font: 'industrial',
      density: 'compact',
    });

    expect(vars['--bg']).toBe(THEMES.light['--bg']);
    expect(vars['--accent']).toBe(ACCENTS.blue.c);
    expect(vars['--accent-on']).toBe(ACCENTS.blue.on);
    expect(vars['--font-display']).toBe(FONTS.industrial.display);
    expect(vars['--font-body']).toBe(FONTS.industrial.body);
    expect(vars['--card-pad']).toBe(DENSITY.compact.pad);
    expect(vars['--nav-h']).toBe(DENSITY.compact.nav);
  });

  test('default theme produces complete CSS variables', () => {
    const vars = buildCSSVars(DEFAULT_THEME);

    expect(vars['--bg']).toBeTruthy();
    expect(vars['--surface']).toBeTruthy();
    expect(vars['--radius']).toBeTruthy();
    expect(vars['--metric-size']).toBeTruthy();
    expect(Object.keys(vars).length).toBeGreaterThan(20);
  });
});
