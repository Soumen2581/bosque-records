/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'forest-black': '#080B08',
        'forest-green': '#183A28',
        'mystical-gold': '#B9A36C',
        'green-accent': '#2a7a4a',
        'green-border': '#065f46',
        'gray-light': '#E9E6D9',
        'gray-medium': '#A4A69B',
        'gray-dark': '#374151',
        'gold-text': '#d4af37'
      },
      fontFamily: {
        'fell': ['"IM Fell English"', 'serif'],
        'fell-sc': ['"IM Fell English SC"', 'serif'],
        'ui': ['Figtree', '"Avenir Next"', '"Segoe UI"', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 15px rgba(212, 175, 55, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-organic': 'organic-float 6s ease-in-out infinite',
        'grow-organic': 'organic-grow 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'sway-forest': 'forest-sway 8s ease-in-out infinite',
        'pulse-organic': 'organic-pulse 4s ease-in-out infinite',
      },
      transitionTimingFunction: {
        'organic': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'forest': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'growth': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'flow': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      },
      borderColor: {
        'gold-border': '#d4af37',
        'green-border': '#065f46'
      }
    }
  },
  plugins: []
} 