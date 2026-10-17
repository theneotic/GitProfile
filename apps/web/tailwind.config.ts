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
        background: '#0a0a0c',
        surface: {
          DEFAULT: '#121216',
          raised: '#18181d',
        },
        border: {
          DEFAULT: '#26262c',
          strong: '#34343c',
        },
        text: {
          primary: '#e8e8ec',
          secondary: '#9a9aa4',
          tertiary: '#5f5f6b',
        },
        accent: {
          DEFAULT: '#3ddc84',
          dim: '#26a65f',
          contrast: '#052e18',
        },
        danger: '#ef4444',
        warning: '#f5a623',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '12px',
        md: '12px',
        lg: '16px',
        xl: '20px',
      },
    },
  },
  plugins: [],
};

export default config;
