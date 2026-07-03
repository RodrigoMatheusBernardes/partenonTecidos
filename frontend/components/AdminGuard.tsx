'use client';

import { useEffect, useState } from 'react';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role === 'admin') {
          setAllowed(true);
        }
      } catch (e) {
        console.error('Token inválido', e);
      }
    }
    setLoading(false);
  }, []);

  if (loading) return <p className="p-8 text-center">Verificando acesso...</p>;
  if (!allowed) return <p className="p-8 text-center text-red-600">Acesso negado. <a href="/login" className="underline">Fazer login</a></p>;

  return <>{children}</>;
}