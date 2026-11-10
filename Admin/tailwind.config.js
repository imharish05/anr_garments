/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg:      '#F8FAFC',
          text:    '#0F172A',
          gold:    '#1a175a',
          primary: '#1a175a',
          navy:    '#1a175a',
          white:   '#FFFFFF',
          grey:    '#64748B',
          light:   '#E2E8F0',
        },
        primary: {
          DEFAULT: '#1a175a',
          50:  '#F4F5FB',
          100: '#E6E8F6',
          200: '#C7CCE8',
          300: '#9DA7D4',
          400: '#6474BE',
          500: '#3B4DA4',
          600: '#2A3686',
          700: '#222B70',
          800: '#1a175a',
          900: '#141247',
          950: '#0C0A2E',
        },
      },
      fontFamily: {
        sans: ['"Montserrat"', 'system-ui', '-apple-system', 'sans-serif'],
        montserrat: ['"Montserrat"', 'system-ui', '-apple-system', 'sans-serif'],
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        cinzel: ['"Cinzel"', 'Georgia', 'serif'],
        inter: ['"Montserrat"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      maxWidth: { site: '1440px' },
    },
  },
  plugins: [],
}
