'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setAuthorized(true);
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      // Decodifica o token para verificar a role
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      if (payload.role === 'admin') {
        setAuthorized(true);
      } else {
        console.log('Acesso negado - role não é admin');
        router.push('/login');
      }
    } catch (e) {
      console.log('Token inválido');
      localStorage.removeItem('token');
      router.push('/login');
    }
    
    setLoading(false);
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Acesso negado. Redirecionando...</p>
      </div>
    );
  }

  return <>{children}</>;
}