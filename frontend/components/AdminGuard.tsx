'use client';

import { useEffect, useState } from 'react';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'authorized' | 'denied'>('loading');

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Sem token = negado
    if (!token) {
      setStatus('denied');
      return;
    }

    try {
      // Tenta decodificar o token
      const payload = JSON.parse(atob(token.split('.')[1]));

      // Verifica se é admin
      if (payload.role === 'admin') {
        setStatus('authorized');
      } else {
        setStatus('denied');
      }
    } catch (error) {
      // Token inválido
      console.error('Token inválido:', error);
      localStorage.removeItem('token');
      setStatus('denied');
    }
  }, []);

  // Tela de carregamento
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  // Acesso negado
  if (status === 'denied') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-md">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">Acesso Restrito</h1>
          <p className="text-gray-600 mb-6">Esta área é exclusiva para administradores.</p>
          <a
            href="/login"
            className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Fazer Login
          </a>
        </div>
      </div>
    );
  }

  // Acesso autorizado
  return <>{children}</>;
}