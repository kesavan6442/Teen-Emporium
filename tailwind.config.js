/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4f8cff',   // Electric Blue
          hover:   '#2f6fe1',
          dark:    '#1f4fb3',
          light:   '#86b7ff',
        },
        dark: {
          bg:     '#0d1025',    // Deep Navy
          card:   '#141830',    // Midnight Indigo Card
          border: '#222a48',    // Subtle Navy Border
          text:   '#eef0f8',    // Soft Platinum White
          muted:  '#8090b8',    // Cool Steel Blue Muted
        },
        light: {
          bg:     '#f5f5f0',    // Warm Ivory
          card:   '#ffffff',
          border: '#e4e4f0',
          text:   '#0d1228',
          muted:  '#4a4e69',
        },
        navy: {
          50:  '#eef0f8',
          100: '#d8dcf0',
          200: '#b4bce3',
          300: '#8898d4',
          400: '#6274c4',
          500: '#4458b8',
          600: '#2e3e99',
          700: '#1e2e7a',
          800: '#141c55',
          900: '#0d1228',
          950: '#060914',
        }
      },
      fontFamily: {
        sans:    ['Outfit', 'Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      animation: {
        'spin-slow':   'spin 12s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow':  'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in':     'fadeIn 0.5s ease-out forwards',
        'slide-up':    'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shimmer':     'shimmer 2.5s linear infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' },                             '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        shimmer: { '0%': { backgroundPosition: '-200% center' },       '100%': { backgroundPosition: '200% center' } },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}
