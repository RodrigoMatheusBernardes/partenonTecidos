'use client';

import { useEffect, useState } from 'react';

interface AdminGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // opcional: define quais roles podem acessar
}

export default function AdminGuard({ children, allowedRoles = ['admin'] }: AdminGuardProps) {
  const [status, setStatus] = useState<'loading' | 'authorized' | 'denied'>('loading');
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('AdminGuard: token não encontrado');
      setStatus('denied');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('AdminGuard: payload decodificado', payload);
      setUserRole(payload.role || null);

      if (allowedRoles.includes(payload.role)) {
        setStatus('authorized');
      } else {
        console.log(`AdminGuard: role "${payload.role}" não está em allowedRoles:`, allowedRoles);
        setStatus('denied');
      }
    } catch (e) {
      console.error('AdminGuard: token inválido', e);
      localStorage.removeItem('token');
      setStatus('denied');
    }
  }, [allowedRoles]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Verificando acesso...</span>
      </div>
    );
  }

  if (status === 'denied') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
        <p className="text-red-600 text-lg mb-4">Acesso negado.</p>
        {userRole && <p className="text-gray-500 mb-2">Seu perfil: {userRole}</p>}
        <a href="/login" className="text-blue-600 hover:underline">Fazer login como administrador</a>
      </div>
    );
  }

  return <>{children}</>;
}