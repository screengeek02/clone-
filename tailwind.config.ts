import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        panel: '0 12px 36px var(--shadow)'
      },
      backgroundImage: {
        glow: 'radial-gradient(circle at 20% 20%, rgba(59,130,246,.25), transparent 40%), radial-gradient(circle at 80% 10%, rgba(14,165,233,.2), transparent 35%)'
      }
    }
  },
  plugins: []
};

export default config;
