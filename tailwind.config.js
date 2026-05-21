/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        graphite: '#151515',
        ink: '#222222',
        pravac: '#a91524',
        wine: '#7b1020',
        smoke: '#f4f5f7',
      },
      boxShadow: {
        soft: '0 20px 60px rgba(21, 21, 21, 0.12)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
