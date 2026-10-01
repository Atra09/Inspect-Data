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
          50: '#ecf3ff',
          100: '#dde9ff',
          200: '#c2d6ff',
          300: '#9cb9ff',
          400: '#7592ff',
          500: '#465fff',
          600: '#3641f5',
          700: '#2a31d8',
          800: '#252dae',
          900: '#262e89',
          950: '#161950',
        },
        ksop: {
          purple: '#6A53CE',
          blue: '#4A90E2',
          magenta: '#E91E63',
          darkBlue: '#4834DF',
          navy: '#2E3192',
          bg: '#F0EDF7',
        },
      },
    },
  },
  plugins: [],
}
