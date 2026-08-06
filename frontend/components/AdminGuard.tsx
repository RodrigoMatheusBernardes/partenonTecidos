'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface AdminGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // opcional: define quais roles podem acessar
}

export default function AdminGuard({ children, allowedRoles = ['admin'] }: AdminGuardProps) {
  const { user, loading, token } = useAuth();
  const userRole = user?.role || null;
  const status = loading ? 'loading' : token && userRole && allowedRoles.includes(userRole) ? 'authorized' : 'denied';

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
        <Link href="/login" className="text-blue-600 hover:underline">Fazer login como administrador</Link>
      </div>
    );
  }

  return <>{children}</>;
}