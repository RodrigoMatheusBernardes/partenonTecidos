const config = {
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  api: {
    development: '',
    production: 'https://partenontecidos.onrender.com',
  },
};

const envApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, '');

/**
 * Retorna a base da API para chamadas do navegador.
 *
 * Em PRODUÇÃO, sempre retorna '' (caminho relativo).
 * Motivo: o backend está em outro domínio raiz (onrender.com).
 * Se o frontend chamar o Render diretamente, os cookies definidos
 * pelo backend são classificados como "third-party" pelo navegador
 * e bloqueados → 401 "Token não fornecido".
 *
 * Com '' + rewrite em next.config.ts, todas as chamadas /api/* são
 * same-origin (partenon-tecidos.vercel.app) e passam pelo proxy
 * server-side do Next.js. Cookies passam a ser first-party.
 *
 * Em DESENVOLVIMENTO, mantém o comportamento anterior (usa
 * NEXT_PUBLIC_API_URL se definido; caso contrário, caminho relativo
 * também funciona via rewrite para localhost:5000).
 *
 * NÃO reintroduzir URL absoluta em produção.
 */
export const getApiUrl = (): string => {
  if (process.env.NODE_ENV === 'production') {
    return '';
  }
  return envApiUrl || '';
};

/**
 * Retorna a URL completa para imagens e arquivos estáticos.
 * NÃO usar para chamadas de API.
 */
export const getImageUrl = (url: string | undefined) => {
  if (!url) return '/images/placeholder.jpg';
  return url.replace('http://localhost:5000', config.api.production);
};

export default config;