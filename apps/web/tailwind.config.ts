import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#151412', // Wabi-Sabi deep sumi basalt stone
        surface: {
          DEFAULT: '#1c1a17', // Aged stone block
          raised: '#24211d',  // Carved slate
          alt: '#2b2824',     // Raw weathered earth
        },
        border: {
          DEFAULT: '#383531', // Weathered mortar seam
          strong: '#524c45',  // Chiseled stone edge
          gold: '#ca8a04',    // Kintsugi gold repair seam
        },
        text: {
          primary: '#e7e5e4',   // Unbleached washi paper
          secondary: '#a8a29e', // Riverbed silt
          tertiary: '#78716c',  // Ancient soot
          muted: '#57534e',
        },
        accent: {
          DEFAULT: '#ca8a04',   // Kintsugi gold lacquer
          bright: '#eab308',    // Gleaming gold leaf
          hover: '#d97706',
          dim: '#854d0e',       // Aged amber patina
          contrast: '#151412',  // Deep sumi ink on gold
          subtle: 'rgba(202, 138, 4, 0.12)',
        },
        moss: {
          DEFAULT: '#65a30d',   // Zen garden moss
          dim: '#4d7c0f',
        },
        sakura: {
          DEFAULT: '#f472b6',   // Retro pixel cherry blossom
        },
        danger: '#ef4444',
        warning: '#f59e0b',
      },
      fontFamily: {
        display: ['"Shippori Mincho"', 'Georgia', 'serif'],
        serif: ['"Shippori Mincho"', 'Georgia', 'serif'],
        sans: ['"Space Grotesk"', 'Inter', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Space Mono"', 'monospace'],
        pixel: ['"Press Start 2P"', 'monospace'],
      },
      borderRadius: {
        none: '0px',
        xs: '0px',
        sm: '0px',
        DEFAULT: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        full: '0px',
      },
      boxShadow: {
        pixel: '3px 3px 0px #0c0b0a',
        'pixel-lg': '4px 4px 0px #0c0b0a',
        'pixel-xl': '6px 6px 0px #0c0b0a',
        'pixel-huge': '8px 8px 0px #0c0b0a',
        'pixel-gold': '3px 3px 0px #78350f',
        'pixel-stone': '3px 3px 0px #383531',
        'pixel-pressed': '1px 1px 0px #0c0b0a',
      },
    },
  },
  plugins: [],
};

export default config;
