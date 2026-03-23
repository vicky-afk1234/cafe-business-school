/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette — rich espresso & gold
        espresso: {
          50:  '#fdf8f0',
          100: '#f9eedb',
          200: '#f2d9b0',
          300: '#e8be7f',
          400: '#dc9e4c',
          500: '#c8860a', // Primary gold
          600: '#a96e07',
          700: '#8a5509',
          800: '#6e420d',
          900: '#5a360f',
          950: '#321b05',
        },
        coffee: {
          50:  '#f6f0e8',
          100: '#e8d8c0',
          200: '#d4b58a',
          300: '#bc8f58',
          400: '#a07040',
          500: '#7d5130',
          600: '#633f24',
          700: '#4e301c',
          800: '#3c2416',
          900: '#2d1b10',
          950: '#1a0d08',
        },
        cream: {
          50:  '#fffef9',
          100: '#fefcf0',
          200: '#fdf5d9',
          300: '#faeabb',
          400: '#f5d98a',
          500: '#edc55a',
        },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        body:    ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-jetbrains)', 'monospace'],
      },
      backgroundImage: {
        'coffee-grain': "url('/images/textures/coffee-grain.png')",
        'hero-gradient': 'linear-gradient(135deg, rgba(26,13,8,0.95) 0%, rgba(90,54,15,0.8) 100%)',
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease forwards',
        'fade-in':    'fadeIn 0.8s ease forwards',
        'slide-right':'slideRight 0.5s ease forwards',
        'shimmer':    'shimmer 1.5s infinite',
        'float':      'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:    { from: { opacity: 0, transform: 'translateY(24px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        slideRight:{ from: { opacity: 0, transform: 'translateX(-20px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        shimmer:   { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        float:     { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
