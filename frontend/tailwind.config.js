/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './context/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      /* Design System Premium */
      colors: {
        /* Neutros Principais */
        'dark': '#0a1628',          /* Navy profundo */
        'dark-light': '#1a1a1a',    /* Preto sofisticado */
        'light': '#f5f4f0',         /* Bege claro */
        'light-mid': '#ede9e3',     /* Bege médio */
        'gray-mid': '#dcd9d4',      /* Cinza médio */
        'text-primary': '#1a1a1a',  /* Texto principal */
        'text-secondary': '#5c5c5c',/* Texto secundário */
        
        /* Acentos Refinados */
        'gold': '#c2a56c',          /* Dourado luxuoso */
        'gold-light': '#e5d9c4',    /* Dourado claro */
        
        /* Cores Funcionais */
        'primary': '#2c5f2d',       /* Verde (manter compatibilidade) */
        'secondary': '#d4a373',     /* Ouro secundário */
        'accent': '#e76f51',        /* Coral (alerta/destaque) */
        'success': '#10b981',       /* Verde (sucesso) */
        'warning': '#f59e0b',       /* Laranja (aviso) */
        'error': '#ef4444',         /* Vermelho (erro) */
      },
      
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        product: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      
      /* Espaçamento consistente */
      spacing: {
        'section-xs': '1.25rem',    /* 20px - mobile */
        'section-sm': '1.5rem',     /* 24px */
        'section-md': '2.5rem',     /* 40px */
        'section-lg': '3.5rem',     /* 56px */
        'section-xl': '5rem',       /* 80px - desktop */
      },
      
      /* Sombras refinadas */
      boxShadow: {
        'sm-luxury': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'md-luxury': '0 4px 16px rgba(0, 0, 0, 0.06)',
        'lg-luxury': '0 8px 32px rgba(0, 0, 0, 0.08)',
        'xl-luxury': '0 12px 48px rgba(0, 0, 0, 0.1)',
        'hover': '0 20px 40px rgba(0, 0, 0, 0.06)',
      },
      
      /* Border radius consistente */
      borderRadius: {
        'button': '0.375rem',       /* 6px - botões */
        'card': '0.5rem',           /* 8px - cards */
        'large': '0.75rem',         /* 12px */
        'full-soft': '1.25rem',     /* 20px - soft pills */
      },
      
      /* Transições suaves */
      transitionDuration: {
        'fast': '150ms',
        'base': '300ms',
        'slow': '500ms',
      },
      
      /* Animações sutis */
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-up': 'scaleUp 0.3s ease-out',
        'bounce-light': 'bounceLight 0.4s ease-in-out',
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