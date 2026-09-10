// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'partenontecidos.onrender.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    // Em desenvolvimento: proxy para backend local.
    // Em produção: proxy para o backend do Render.
    // Motivo: manter /api/* same-origin no navegador para evitar
    // bloqueio de cookies third-party (Vercel ↔ Render).
    return [
      {
        source: '/api/:path*',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:5000/api/:path*'
            : 'https://partenontecidos.onrender.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;