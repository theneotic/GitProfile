/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#07090e',
          surface: '#0d111a',
          cyan: '#00f0ff',
          toxic: '#39ff14',
          magenta: '#ff0055',
          amber: '#ffaa00',
          border: '#1f293d',
        },
      },
      fontFamily: {
        mono: ['"Share Tech Mono"', '"JetBrains Mono"', 'Consolas', 'monospace'],
        display: ['"Orbitron"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
