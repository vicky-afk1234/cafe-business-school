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
        // Brand palette — vivid indigo
        espresso: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#8b82ff',
          500: '#5a4bff',
          600: '#4a3dff',
          700: '#3b2fff',
          800: '#3126d6',
          900: '#261fa3',
          950: '#17125f',
        },
        coffee: {
          50:  '#f7f8ff',
          100: '#eff1ff',
          200: '#e1e6ff',
          300: '#ccd4ff',
          400: '#aab7ff',
          500: '#8598ff',
          600: '#697dff',
          700: '#5264dd',
          800: '#424fb8',
          900: '#343f91',
          950: '#1a2057',
        },
        cream: {
          50:  '#f8f9ff',
          100: '#f1f3ff',
          200: '#e8ebff',
          300: '#d8deff',
          400: '#c1cbff',
          500: '#99a8ff',
        },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        body:    ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-jetbrains)', 'monospace'],
      },
      backgroundImage: {
        'coffee-grain': "url('/images/textures/coffee-grain.png')",
        'hero-gradient': 'linear-gradient(135deg, rgba(59,47,255,0.96) 0%, rgba(90,75,255,0.84) 100%)',
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
