/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './context/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      /* ════════════════════════════════════════════════════════════
         FONTES
         ════════════════════════════════════════════════════════════ */
      fontFamily: {
        primary: ['Gotham Ultra', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        secondary: ['Asap', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        product: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },

      /* ════════════════════════════════════════════════════════════
         CORES
         ════════════════════════════════════════════════════════════ */
      colors: {
        // Cores mantidas do projeto
        'parthenon-brown': '#6B5344',
        'parthenon-brown-dark': '#4A3A2E',
        'parthenon-beige': '#E8DCC8',
        'parthenon-navy': '#3D4E5C',
        'parthenon-navy-light': '#556B7F',
        'dark': '#0a1628',
        'dark-light': '#1a1a1a',
        'light': '#f5f4f0',
        'light-mid': '#ede9e3',
        'gray-mid': '#dcd9d4',
        'gray-premium': '#9B9B9B',
        'text-primary': '#1a1a1a',
        'text-secondary': '#5c5c5c',
        'text-light': '#9B9B9B',
        'success': '#6B9B6B',
        'error': '#C85C5C',
        'warning': '#D4A574',
        'gold': '#c2a56c',
        'gold-light': '#e5d9c4',
        'primary': '#2c5f2d',
        'secondary': '#d4a373',
        'accent': '#e76f51',

        // NOVAS CORES (manual da marca)
        'primary-dark': '#0B1742',    // Azul escuro institucional
        'secondary-gray': '#A9ABAE',  // Cinza institucional
      },

      /* ════════════════════════════════════════════════════════════
         ESPAÇAMENTO, SHADOWS E DEMAIS TOKENS (mantidos)
         ════════════════════════════════════════════════════════════ */
      spacing: {
        'section-xs': '1.25rem',
        'section-sm': '1.5rem',
        'section-md': '2.5rem',
        'section-lg': '3.5rem',
        'section-xl': '5rem',
      },

      boxShadow: {
        'sm-luxury': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'md-luxury': '0 4px 16px rgba(0, 0, 0, 0.06)',
        'lg-luxury': '0 8px 32px rgba(0, 0, 0, 0.08)',
        'xl-luxury': '0 12px 48px rgba(0, 0, 0, 0.1)',
        'hover': '0 20px 40px rgba(0, 0, 0, 0.06)',
      },

      borderRadius: {
        'button': '0.375rem',
        'card': '0.5rem',
        'large': '0.75rem',
        'full-soft': '1.25rem',
      },

      transitionDuration: {
        'fast': '150ms',
        'base': '300ms',
        'slow': '500ms',
      },

      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-up': 'scaleUp 0.3s ease-out',
        'bounce-light': 'bounceLight 0.4s ease-in-out',
        'shimmer': 'shimmer 1.5s infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceLight: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },

  plugins: [],
};