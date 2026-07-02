const config = {
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  api: {
    development: 'http://localhost:5000',
    production: 'https://partenontecidos.onrender.com' // <-- URL correta do seu Render
  }
};

export const getApiUrl = (): string => {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return config.api.development;
  }
  return config.api.production;
};

export const getImageUrl = (url: string | undefined) => {
  if (!url) return '/images/placeholder.jpg';
  // Substitui apenas se a URL ainda apontar para localhost
  return url.replace('http://localhost:5000', config.api.production);
};

export default config;