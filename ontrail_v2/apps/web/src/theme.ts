export const ACCENTS = {
  coral:  { c: 'oklch(0.70 0.17 32)',  on: 'oklch(0.18 0.03 32)' },
  blue:   { c: 'oklch(0.66 0.15 252)', on: 'oklch(0.98 0.01 252)' },
  volt:   { c: 'oklch(0.84 0.18 128)', on: 'oklch(0.22 0.05 128)' },
  violet: { c: 'oklch(0.64 0.19 300)', on: 'oklch(0.98 0.01 300)' },
} as const;

export type AccentKey = keyof typeof ACCENTS;

export const FONTS = {
  grotesk:    { display: "'Space Grotesk', sans-serif", body: "'Hanken Grotesk', sans-serif", mono: "'IBM Plex Mono', monospace" },
  editorial:  { display: "'Instrument Serif', serif",   body: "'Hanken Grotesk', sans-serif", mono: "'IBM Plex Mono', monospace" },
  industrial: { display: "'Archivo', sans-serif",       body: "'Archivo', sans-serif",        mono: "'Space Mono', monospace" },
} as const;

export type FontKey = keyof typeof FONTS;

export const DENSITY = {
  compact: { pad: '15px', radius: '13px', radiusSm: '10px', base: '13.5px', metric: '20px', nav: '56px' },
  regular: { pad: '18px', radius: '16px', radiusSm: '12px', base: '14.5px', metric: '22px', nav: '62px' },
  comfy:   { pad: '22px', radius: '19px', radiusSm: '14px', base: '15.5px', metric: '24px', nav: '66px' },
} as const;

export type DensityKey = keyof typeof DENSITY;

export const THEMES = {
  dark: {
    '--bg': 'oklch(0.165 0.012 258)', '--surface': 'oklch(0.205 0.013 258)', '--surface-2': 'oklch(0.235 0.014 258)',
    '--inset': 'oklch(0.245 0.013 258)', '--border': 'oklch(0.285 0.013 258)',
    '--text': 'oklch(0.965 0.004 258)', '--text-dim': 'oklch(0.77 0.01 258)', '--text-faint': 'oklch(0.6 0.012 258)',
    '--grid': 'oklch(0.6 0.01 258 / 0.16)', '--bar': 'oklch(0.6 0.035 258)', '--pos': 'oklch(0.8 0.14 152)',
    '--logo-bg': 'oklch(0.26 0.014 258)',
    '--map-bg': 'oklch(0.195 0.014 258)', '--map-grid': 'oklch(0.6 0.01 258 / 0.1)', '--map-blob': 'oklch(0.6 0.03 200 / 0.1)',
    '--map-route-ghost': 'oklch(0.6 0.01 258 / 0.16)', '--map-readout': 'oklch(0.17 0.012 258 / 0.74)',
    '--heat-0': 'oklch(0.255 0.012 258)', '--heat-stroke': 'oklch(0.3 0.012 258 / 0.5)',
  },
  light: {
    '--bg': 'oklch(0.975 0.004 258)', '--surface': 'oklch(1 0 0)', '--surface-2': 'oklch(0.982 0.004 258)',
    '--inset': 'oklch(0.963 0.005 258)', '--border': 'oklch(0.912 0.006 258)',
    '--text': 'oklch(0.26 0.02 258)', '--text-dim': 'oklch(0.46 0.015 258)', '--text-faint': 'oklch(0.62 0.012 258)',
    '--grid': 'oklch(0.45 0.01 258 / 0.13)', '--bar': 'oklch(0.8 0.025 258)', '--pos': 'oklch(0.56 0.14 152)',
    '--logo-bg': 'oklch(0.24 0.02 258)',
    '--map-bg': 'oklch(0.955 0.008 232)', '--map-grid': 'oklch(0.5 0.02 232 / 0.12)', '--map-blob': 'oklch(0.72 0.05 200 / 0.16)',
    '--map-route-ghost': 'oklch(0.5 0.02 258 / 0.14)', '--map-readout': 'oklch(1 0 0 / 0.8)',
    '--heat-0': 'oklch(0.93 0.006 258)', '--heat-stroke': 'oklch(0.89 0.006 258)',
  },
} as const;

export type ThemeKey = 'dark' | 'light';

export interface ThemeSettings {
  theme: ThemeKey;
  accent: AccentKey;
  font: FontKey;
  density: DensityKey;
}

export const DEFAULT_THEME: ThemeSettings = {
  theme: 'dark',
  accent: 'coral',
  font: 'grotesk',
  density: 'regular',
};

export function buildCSSVars(t: ThemeSettings): Record<string, string> {
  const acc = ACCENTS[t.accent];
  const f = FONTS[t.font];
  const d = DENSITY[t.density];
  return {
    ...THEMES[t.theme],
    '--accent': acc.c, '--accent-on': acc.on,
    '--font-display': f.display, '--font-body': f.body, '--font-mono': f.mono,
    '--card-pad': d.pad, '--radius': d.radius, '--radius-sm': d.radiusSm,
    '--base-font': d.base, '--metric-size': d.metric, '--nav-h': d.nav,
  };
}
