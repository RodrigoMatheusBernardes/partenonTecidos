'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface SellerGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // opcional: permite especificar outras roles (ex: ['admin', 'seller'])
}

export default function SellerGuard({ children, allowedRoles = ['admin', 'seller'] }: SellerGuardProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'authorized' | 'denied'>('loading');

  useEffect(() => {
    if (!isAuthenticated) {
      setStatus('denied');
      return;
    }

    if (!user) {
      setStatus('denied');
      return;
    }

    if (allowedRoles.includes(user.role)) {
      setStatus('authorized');
    } else {
      setStatus('denied');
    }
  }, [isAuthenticated, user, allowedRoles]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
        <span className="ml-3 text-text-secondary">Verificando acesso...</span>
      </div>
    );
  }

  if (status === 'denied') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-center p-6">
        <p className="text-error text-lg mb-4">Acesso negado.</p>
        <p className="text-text-secondary mb-4">Você não tem permissão para acessar esta área.</p>
        <button
          onClick={() => router.push('/')}
          className="text-gold hover:underline font-medium"
        >
          Voltar para a loja
        </button>
      </div>
    );
  }

  return <>{children}</>;
}