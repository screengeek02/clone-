import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        basement: {
          950: '#070707',
          900: '#0f0f0f',
          800: '#181818',
          700: '#252525'
        },
        accent: '#9e1f1f'
      },
      fontFamily: {
        display: ['Impact', 'Haettenschweiler', 'Arial Narrow Bold', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif']
      },
    }
  },
  plugins: []
};

export default config;
