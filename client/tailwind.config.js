/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agro: {
          50: '#f2f9f1',
          100: '#e1f2df',
          200: '#c5e5c2',
          300: '#9cd298',
          400: '#6eb86a',
          500: '#489c44',
          600: '#368033',
          700: '#2b6529',
          800: '#265125',
          900: '#204320',
          950: '#0c250d',
        }
      }
    },
  },
  plugins: [],
}
