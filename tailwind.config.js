/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        graphite: '#151515',
        ink: '#222222',
        pravac: '#F59B12',
        'pravac-orange': '#F59B12',
        'pravac-blue': '#062E45',
        wine: '#7b1020',
        smoke: '#F6F8F9',
        paper: '#F6F8F9',
        warm: '#FFF1D5',
      },
      boxShadow: {
        soft: '0 20px 60px rgba(21, 21, 21, 0.12)',
      },
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Space Grotesk', 'Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
