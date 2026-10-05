/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#18231f',
        muted: '#718078',
        forest: '#245e49',
        mint: '#e4f2e8',
        canvas: '#f5f7f4',
      },
      boxShadow: { card: '0 12px 35px rgba(24, 35, 31, 0.06)' },
    },
  },
  plugins: [],
};
