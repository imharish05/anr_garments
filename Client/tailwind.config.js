/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F4F5FB',
          100: '#E6E8F6',
          200: '#C7CCE8',
          300: '#9DA7D4',
          400: '#6474BE',
          500: '#3B4DA4',
          600: '#2A3686',
          700: '#222B70',
          800: '#1A175A', // Exact ANR Logo deep navy
          900: '#141247',
          950: '#0C0A2E',
        },
        navy: {
          DEFAULT: '#1A175A',
          dark: '#110E3F',
          light: '#282479',
          surface: '#F8F9FD',
        },
        medical: {
          teal: '#0D9488',
          sky: '#0284C7',
          blue: '#1E40AF',
          green: '#15803D',
          rose: '#BE123C',
          slate: '#334155',
        }
      },
      fontFamily: {
        sans: ['"Inter"', '"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'brand': '0 10px 25px -5px rgba(26, 23, 90, 0.1), 0 8px 10px -6px rgba(26, 23, 90, 0.1)',
        'brand-lg': '0 20px 30px -10px rgba(26, 23, 90, 0.15), 0 10px 10px -5px rgba(26, 23, 90, 0.08)',
      }
    },
  },
  plugins: [],
}
