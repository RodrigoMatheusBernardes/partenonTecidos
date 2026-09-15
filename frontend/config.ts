const config = {
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  api: {
    development: '',
    production: 'https://partenontecidos.onrender.com',
  },
};

const envApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, '');

export const getApiUrl = (): string => {
  if (process.env.NODE_ENV === 'production') return '';
  return envApiUrl || '';
};

export const getImageUrl = (url: string | undefined) => {
  if (!url) return '/images/placeholder.jpg';
  return url.replace('http://localhost:5000', config.api.production);
};

export const MERCADO_PAGO_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY || '';

export default config;