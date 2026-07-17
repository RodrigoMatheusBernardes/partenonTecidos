'use client';

import Link from 'next/link';
import { MapPin, User, Package, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function TopBar() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="bg-[#0B1F33] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between text-xs py-0.5 tracking-[0.1em] uppercase font-light gap-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-white">
              <MapPin className="w-3 h-3 text-[#C5A880]" strokeWidth={1.5} />
              <span className="hidden sm:inline font-light">Av. Martins Bastos, 1234 – Sarandi, Porto Alegre · RS</span>
            </span>
            <span className="hidden md:inline text-white/30">|</span>
            <span className="hidden md:inline font-light text-white/80">Entrega para todo o Brasil</span>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <>
                    <Link href="/admin" className="flex items-center gap-1 hover:opacity-80 transition-opacity text-white">
                      <User className="w-3 h-3 text-[#C5A880]" strokeWidth={1.5} />
                      <span className="hidden sm:inline">Admin</span>
                    </Link>
                    <span className="hidden sm:inline text-white/30">|</span>
                  </>
                )}
                <Link href="/meus-pedidos" className="flex items-center gap-1 hover:opacity-80 transition-opacity text-white">
                  <Package className="w-3 h-3 text-[#C5A880]" strokeWidth={1.5} />
                  <span className="hidden sm:inline">Meus Pedidos</span>
                </Link>
                <span className="hidden sm:inline text-white/30">|</span>
                <button onClick={handleLogout} className="flex items-center gap-1 hover:opacity-80 transition-opacity text-white">
                  <LogOut className="w-3 h-3 text-red-400" strokeWidth={1.5} />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/meus-pedidos" className="flex items-center gap-1 hover:opacity-80 transition-opacity text-white">
                  <Package className="w-3 h-3 text-[#C5A880]" strokeWidth={1.5} />
                  <span className="hidden sm:inline">Meus Pedidos</span>
                </Link>
                <span className="hidden sm:inline text-white/30">|</span>
                <Link href="/login" className="flex items-center gap-1 hover:opacity-80 transition-opacity text-white">
                  <User className="w-3 h-3 text-[#C5A880]" strokeWidth={1.5} />
                  <span className="hidden sm:inline">Entrar</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}