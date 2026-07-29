'use client';

import { useState } from 'react';
import SellerGuard from '@/components/SellerGuard';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const menuItems = [
  { href: '/seller', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/seller/pedidos', label: 'Meus Pedidos', icon: ShoppingBag },
  { href: '/seller/clientes', label: 'Clientes', icon: Users },
];

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <SellerGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Topbar mobile */}
        <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between">
          <Link href="/seller" className="text-xl font-serif font-semibold text-dark-light">
            Painel Vendedor
          </Link>
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-light transition"
            aria-label="Abrir menu"
          >
            <Menu className="w-6 h-6" strokeWidth={2} />
          </button>
        </div>

        {/* Overlay + Drawer mobile */}
        {mobileOpen && (
          <>
            <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
            <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 p-4 lg:hidden">
              <div className="flex justify-between items-center mb-6">
                <span className="font-serif font-semibold text-dark-light">Vendedor</span>
                <button onClick={() => setMobileOpen(false)} className="p-1 hover:bg-light rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="space-y-2">
                {menuItems.map(item => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                        pathname === item.href
                          ? 'bg-gold/10 text-gold font-medium'
                          : 'text-text-secondary hover:bg-light hover:text-dark-light'
                      }`}
                    >
                      <Icon className="w-5 h-5" strokeWidth={2} />
                      {item.label}
                    </Link>
                  );
                })}
                <hr className="my-2" />
                <button
                  onClick={() => { setMobileOpen(false); handleLogout(); }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-error hover:bg-red-50 transition w-full text-left"
                >
                  <LogOut className="w-5 h-5" strokeWidth={2} />
                  Sair
                </button>
              </nav>
            </div>
          </>
        )}

        <div className="flex">
          {/* Sidebar desktop */}
          <aside className="hidden lg:flex lg:flex-col w-64 bg-white shadow-sm min-h-screen p-4">
            <Link href="/seller" className="text-2xl font-serif font-semibold text-dark-light block mb-8">
              Painel Vendedor
            </Link>
            <nav className="space-y-2 flex-1">
              {menuItems.map(item => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                      pathname === item.href
                        ? 'bg-gold/10 text-gold font-medium'
                        : 'text-text-secondary hover:bg-light hover:text-dark-light'
                    }`}
                  >
                    <Icon className="w-5 h-5" strokeWidth={2} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t pt-4 mt-auto">
              <div className="flex items-center gap-3 px-3 py-2 mb-2">
                <div className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gold">
                    {user?.nome?.charAt(0)?.toUpperCase() || 'V'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.nome || 'Vendedor'}</p>
                  <p className="text-xs text-text-light truncate">{user?.email || ''}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-error hover:bg-red-50 transition w-full text-left"
              >
                <LogOut className="w-5 h-5" strokeWidth={2} />
                Sair
              </button>
            </div>
          </aside>

          {/* Conteúdo principal */}
          <main className="flex-1 p-4 md:p-6 max-w-full overflow-x-auto">
            {children}
          </main>
        </div>
      </div>
    </SellerGuard>
  );
}