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
    <div style={{ backgroundColor: '#0a1628' }} className="border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* py-2 → py-1, gap-4 → gap-3 */}
        <div className="flex items-center justify-between text-xs py-1 tracking-[0.1em] uppercase font-light gap-3">
          {/* Esquerda – Endereço */}
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1" style={{ color: 'white' }}>
              <MapPin className="w-3 h-3" style={{ color: '#2463eb' }} strokeWidth={1.5} />
              <span className="hidden sm:inline font-light">
                Av. Martins Bastos, 1234 – Sarandi, Porto Alegre · RS
              </span>
            </span>
            <span className="hidden md:inline text-white/30">|</span>
            <span className="hidden md:inline font-light" style={{ color: 'white', opacity: 0.8 }}>
              Entrega para todo o Brasil
            </span>
          </div>

          {/* Direita – Links */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <>
                    <Link
                      href="/admin"
                      className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                      style={{ color: 'white' }}
                    >
                      <User className="w-3 h-3" style={{ color: '#2463eb' }} strokeWidth={1.5} />
                      <span className="hidden sm:inline">Admin</span>
                    </Link>
                    <span className="hidden sm:inline text-white/30">|</span>
                  </>
                )}
                <Link
                  href="/meus-pedidos"
                  className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                  style={{ color: 'white' }}
                >
                  <Package className="w-3 h-3" style={{ color: '#2463eb' }} strokeWidth={1.5} />
                  <span className="hidden sm:inline">Meus Pedidos</span>
                </Link>
                <span className="hidden sm:inline text-white/30">|</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                  style={{ color: 'white' }}
                >
                  <LogOut className="w-3 h-3" style={{ color: '#ef4444' }} strokeWidth={1.5} />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/meus-pedidos"
                  className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                  style={{ color: 'white' }}
                >
                  <Package className="w-3 h-3" style={{ color: '#2463eb' }} strokeWidth={1.5} />
                  <span className="hidden sm:inline">Meus Pedidos</span>
                </Link>
                <span className="hidden sm:inline text-white/30">|</span>
                <Link
                  href="/login"
                  className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                  style={{ color: 'white' }}
                >
                  <User className="w-3 h-3" style={{ color: '#2463eb' }} strokeWidth={1.5} />
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