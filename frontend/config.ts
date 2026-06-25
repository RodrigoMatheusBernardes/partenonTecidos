const config = {
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  api: {
    development: 'http://localhost:5000',
    production: 'https://parthenon-ecommerce.onrender.com'
  }
};
export const getApiUrl = (): string => {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return config.api.development;
  }
  return config.api.production;
};
export default config;
