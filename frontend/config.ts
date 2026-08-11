const config = {
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  api: {
    development: '', // Em desenvolvimento, usa o proxy do Next.js
    production: 'https://partenontecidos.onrender.com'
  }
};

const envApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, '');

export const getApiUrl = (): string => {
  if (envApiUrl) {
    return envApiUrl;
  }

  if (process.env.NODE_ENV === 'development') {
    return ''; // Ativa o proxy do Next.js
  }
  return config.api.production;
};

export const getImageUrl = (url: string | undefined) => {
  if (!url) return '/images/placeholder.jpg';
  // Substitui apenas se a URL ainda apontar para localhost
  return url.replace('http://localhost:5000', config.api.production);
};

export default config;