/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        health: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        senior: {
          blue: '#1d4ed8',
          teal: '#0f766e',
          amber: '#b45309',
          rose: '#be123c',
          purple: '#6b21a8'
        }
      },
      fontSize: {
        'accessible-base': '1.125rem', // 18px base for elderly readability
        'accessible-lg': '1.25rem',   // 20px
        'accessible-xl': '1.5rem',    // 24px
      },
      minHeight: {
        'touch': '48px', // accessible minimum touch target
      },
      minWidth: {
        'touch': '48px',
      }
    },
  },
  plugins: [],
};
