export type AccentColor =
  | 'crimson'
  | 'violet'
  | 'ocean'
  | 'sage'
  | 'amber'
  | 'rose'
  | 'mono'
  | 'custom';

export interface AccentPalette {
  id: AccentColor;
  name: string;
  primary: string; // Main vibrant accent (#E2A9B0, #4EA8DE, etc.)
  primaryDark: string; // Contrast text for buttons (#4A2027, #0C2B40, etc.)
  container: string; // Icon/card container background (#34272C, #172A3A, etc.)
  containerSubtle: string; // Subtle card tint (#261E23, #10202D, etc.)
  containerBorder: string; // Accent border (#543339, #284B66, etc.)
  onContainer: string; // Text on container (#F9D8DE, #90E0EF, etc.)
  glow: string; // Box-shadow glow rgba
  ambient: string; // Ambient background blur rgba
  swatchColors: [string, string, string, string]; // 4 quadrant preview colors
}

export const ACCENT_PALETTES: Record<Exclude<AccentColor, 'custom'>, AccentPalette> = {
  crimson: {
    id: 'crimson',
    name: 'Crimson',
    primary: '#E06D67',
    primaryDark: '#4D1B1B',
    container: '#3C1B1E',
    containerSubtle: '#2A1618',
    containerBorder: '#5A2326',
    onContainer: '#F2B8B5',
    glow: 'rgba(224, 109, 103, 0.35)',
    ambient: 'rgba(224, 109, 103, 0.12)',
    swatchColors: ['#B3261E', '#E06D67', '#F2B8B5', '#8C1D18'],
  },
  violet: {
    id: 'violet',
    name: 'Violet',
    primary: '#9A82DB',
    primaryDark: '#2D1C59',
    container: '#2A203E',
    containerSubtle: '#1F1930',
    containerBorder: '#4A386D',
    onContainer: '#CCC2DC',
    glow: 'rgba(154, 130, 219, 0.35)',
    ambient: 'rgba(154, 130, 219, 0.12)',
    swatchColors: ['#6750A4', '#9A82DB', '#CCC2DC', '#4F378B'],
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    primary: '#4EA8DE',
    primaryDark: '#0C2B40',
    container: '#172A3A',
    containerSubtle: '#10202D',
    containerBorder: '#284B66',
    onContainer: '#90E0EF',
    glow: 'rgba(78, 168, 222, 0.35)',
    ambient: 'rgba(78, 168, 222, 0.12)',
    swatchColors: ['#00639B', '#4EA8DE', '#90E0EF', '#004A77'],
  },
  sage: {
    id: 'sage',
    name: 'Sage',
    primary: '#6BAE45',
    primaryDark: '#1E3A10',
    container: '#202D1B',
    containerSubtle: '#182215',
    containerBorder: '#37502E',
    onContainer: '#B6DF97',
    glow: 'rgba(107, 174, 69, 0.35)',
    ambient: 'rgba(107, 174, 69, 0.12)',
    swatchColors: ['#386A20', '#6BAE45', '#B6DF97', '#254E10'],
  },
  amber: {
    id: 'amber',
    name: 'Amber',
    primary: '#D4A017',
    primaryDark: '#422F00',
    container: '#332712',
    containerSubtle: '#261D0C',
    containerBorder: '#59441B',
    onContainer: '#FFDF99',
    glow: 'rgba(212, 160, 23, 0.35)',
    ambient: 'rgba(212, 160, 23, 0.12)',
    swatchColors: ['#7A5900', '#D4A017', '#FFDF99', '#5B4300'],
  },
  rose: {
    id: 'rose',
    name: 'Rose',
    primary: '#E2A9B0',
    primaryDark: '#4A2027',
    container: '#34272C',
    containerSubtle: '#261E23',
    containerBorder: '#543339',
    onContainer: '#F9D8DE',
    glow: 'rgba(226, 169, 176, 0.35)',
    ambient: 'rgba(226, 169, 176, 0.12)',
    swatchColors: ['#8C384D', '#E2A9B0', '#F9D8DE', '#6A2335'],
  },
  mono: {
    id: 'mono',
    name: 'Mono',
    primary: '#D1D5DB',
    primaryDark: '#111827',
    container: '#262626',
    containerSubtle: '#1C1C1C',
    containerBorder: '#404040',
    onContainer: '#F3F4F6',
    glow: 'rgba(209, 213, 219, 0.35)',
    ambient: 'rgba(209, 213, 219, 0.12)',
    swatchColors: ['#2E2E2E', '#5C5C5C', '#A8A8A8', '#E6E6E6'],
  },
};

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) {
    return { r: 0, g: 229, b: 255 }; // Fallback cyan
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return (
    '#' +
    [clamp(r), clamp(g), clamp(b)]
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('')
  );
}

export function generateCustomPalette(hex: string): AccentPalette {
  const { r, g, b } = hexToRgb(hex);

  // Dark contrast text for buttons
  const primaryDark = rgbToHex(r * 0.22, g * 0.22, b * 0.22);
  // Container backgrounds (darker, tinted with background #120E11)
  const container = rgbToHex(r * 0.22 + 18 * 0.78, g * 0.22 + 14 * 0.78, b * 0.22 + 17 * 0.78);
  const containerSubtle = rgbToHex(r * 0.14 + 18 * 0.86, g * 0.14 + 14 * 0.86, b * 0.14 + 17 * 0.86);
  const containerBorder = rgbToHex(r * 0.35 + 24 * 0.65, g * 0.35 + 20 * 0.65, b * 0.35 + 23 * 0.65);
  // Lighter on-container text
  const onContainer = rgbToHex(r * 0.5 + 255 * 0.5, g * 0.5 + 255 * 0.5, b * 0.5 + 255 * 0.5);

  const glow = `rgba(${r}, ${g}, ${b}, 0.35)`;
  const ambient = `rgba(${r}, ${g}, ${b}, 0.15)`;

  const s1 = rgbToHex(r * 0.6, g * 0.6, b * 0.6);
  const s2 = hex;
  const s3 = onContainer;
  const s4 = rgbToHex(r * 0.4, g * 0.4, b * 0.4);

  return {
    id: 'custom',
    name: 'Custom',
    primary: hex,
    primaryDark,
    container,
    containerSubtle,
    containerBorder,
    onContainer,
    glow,
    ambient,
    swatchColors: [s1, s2, s3, s4],
  };
}

export function getPaletteForTheme(theme: AccentColor, customColor?: string): AccentPalette {
  if (theme === 'custom') {
    return generateCustomPalette(customColor || '#00E5FF');
  }
  return ACCENT_PALETTES[theme] || ACCENT_PALETTES.rose;
}

export function applyAccentTheme(theme: AccentColor, customColor?: string): void {
  if (typeof document === 'undefined') return;

  const palette = getPaletteForTheme(theme, customColor);
  const root = document.documentElement;

  root.style.setProperty('--color-accent-primary', palette.primary);
  root.style.setProperty('--color-accent-primary-dark', palette.primaryDark);
  root.style.setProperty('--color-accent-container', palette.container);
  root.style.setProperty('--color-accent-container-subtle', palette.containerSubtle);
  root.style.setProperty('--color-accent-container-border', palette.containerBorder);
  root.style.setProperty('--color-accent-on-container', palette.onContainer);
  root.style.setProperty('--color-accent-glow', palette.glow);
  root.style.setProperty('--color-accent-ambient', palette.ambient);
}

export interface AccentSwatchItem {
  id: AccentColor;
  name: string;
  colors: [string, string, string, string];
}

export function getAccentSwatches(customColor?: string): AccentSwatchItem[] {
  const customPalette = generateCustomPalette(customColor || '#00E5FF');
  return [
    { id: 'crimson', name: 'Crimson', colors: ACCENT_PALETTES.crimson.swatchColors },
    { id: 'violet', name: 'Violet', colors: ACCENT_PALETTES.violet.swatchColors },
    { id: 'ocean', name: 'Ocean', colors: ACCENT_PALETTES.ocean.swatchColors },
    { id: 'sage', name: 'Sage', colors: ACCENT_PALETTES.sage.swatchColors },
    { id: 'amber', name: 'Amber', colors: ACCENT_PALETTES.amber.swatchColors },
    { id: 'rose', name: 'Rose', colors: ACCENT_PALETTES.rose.swatchColors },
    { id: 'mono', name: 'Mono', colors: ACCENT_PALETTES.mono.swatchColors },
    { id: 'custom', name: 'Custom', colors: customPalette.swatchColors },
  ];
}
