'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ok, setOk] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setOk(true);
      setChecking(false);
      return;
    }

    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role === 'admin') {
        setOk(true);
      } else {
        router.push('/login');
      }
    } catch {
      localStorage.removeItem('token');
      router.push('/login');
    }
    
    setChecking(false);
  }, [pathname, router]);

  if (checking) {
    return <div className="p-12 text-center">Verificando acesso...</div>;
  }

  if (!ok) {
    return <div className="p-12 text-center">Acesso negado.</div>;
  }

  return <>{children}</>;
}