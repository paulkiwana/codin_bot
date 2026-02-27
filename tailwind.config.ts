import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f0f1e',
        foreground: '#ffffff',
        primary: '#00d4aa',
        secondary: '#6366f1',
        muted: '#2a2a3e',
        destructive: '#ff4444',
        success: '#22c55e',
        warning: '#f59e0b',
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
        mono: ['Monaco', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
