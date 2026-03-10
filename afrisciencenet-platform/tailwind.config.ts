import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0B1F3A',
        teal: '#14B8A6'
      },
      boxShadow: {
        card: '0 10px 30px rgba(11,31,58,.10)'
      }
    }
  },
  plugins: []
};

export default config;
