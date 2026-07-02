'use client';

import { useEffect, useState } from 'react';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Tenta ler o token imediatamente
    const token = localStorage.getItem('token');
    
    if (!token) {
      // Se não tem token, não está logado
      setChecking(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role === 'admin') {
        setOk(true);
      }
    } catch {
      localStorage.removeItem('token');
    }
    
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Verificando acesso...</p>
      </div>
    );
  }

  if (!ok) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">Acesso restrito a administradores.</p>
          <a href="/login" className="text-primary hover:underline">Fazer login</a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}