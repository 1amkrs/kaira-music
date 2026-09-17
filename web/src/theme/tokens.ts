export const THEME_COLORS = {
  lime: '#C6F100',
  cyan: '#00E5FF',
  peach: '#FFB4A2',
  purple: '#B388FF',
  bgDark: '#080C12',
  bgCard: '#101522',
  bgSurface: '#141B2D',
  glassOverlay: 'rgba(16, 21, 34, 0.72)',
  borderLight: 'rgba(255, 255, 255, 0.08)',
};

export const QUALITY_BADGES: Record<string, { label: string; bg: string; text: string; border: string }> = {
  HI_RES_192: {
    label: '24-BIT / 192kHz HI-RES',
    bg: 'bg-lime-400/10',
    text: 'text-brand-lime',
    border: 'border-brand-lime/30',
  },
  HI_RES_96: {
    label: '24-BIT / 96kHz HI-RES',
    bg: 'bg-cyan-400/10',
    text: 'text-brand-cyan',
    border: 'border-brand-cyan/30',
  },
  LOSSLESS_CD: {
    label: '16-BIT / 44.1kHz FLAC',
    bg: 'bg-emerald-400/10',
    text: 'text-emerald-400',
    border: 'border-emerald-400/30',
  },
  HIGH_320: {
    label: '320 KBPS HQ',
    bg: 'bg-slate-400/10',
    text: 'text-slate-300',
    border: 'border-slate-500/20',
  },
};
