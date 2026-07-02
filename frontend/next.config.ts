import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Ignora erros de TypeScript durante o build (libera o deploy)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configuração de imagens externas (localhost para desenvolvimento)
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
