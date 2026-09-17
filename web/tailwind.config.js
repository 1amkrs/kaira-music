/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          lime: '#C6F100',
          cyan: '#00E5FF',
          peach: '#FFB4A2',
          purple: '#B388FF',
          dark: '#080C12',
          darker: '#05070B',
          card: '#101522',
          surface: '#141B2D',
          border: 'rgba(255, 255, 255, 0.08)',
          glass: 'rgba(16, 21, 34, 0.72)',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        sequel: ['Sequel', 'Sequel 100 Wide', 'Sequel Sans', 'Syne', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
        glass: '16px',
        heavy: '28px',
      },
      boxShadow: {
        'glow-lime': '0 0 24px -4px rgba(198, 241, 0, 0.35)',
        'glow-cyan': '0 0 24px -4px rgba(0, 229, 255, 0.35)',
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 18s linear infinite',
      },
    },
  },
  plugins: [],
};
