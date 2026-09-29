import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        ink: 'var(--ink)',
        'ink-soft': 'var(--ink-soft)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        accent: 'var(--accent)',
        'accent-dark': 'var(--accent-dark)',
        rose: 'var(--rose)',
        sage: 'var(--sage)',
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        DEFAULT: '16px',
        lg: '24px',
      },
      boxShadow: {
        sm: '0 2px 8px rgba(26, 29, 36, 0.04)',
        DEFAULT: '0 4px 20px rgba(26, 29, 36, 0.06)',
        lg: '0 8px 40px rgba(26, 29, 36, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
