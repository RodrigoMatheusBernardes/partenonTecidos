'use client';

import { useState } from 'react';
import AdminGuard from '@/components/AdminGuard';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/produtos', label: 'Produtos', icon: '📦' },
  { href: '/admin/categorias', label: 'Categorias', icon: '📁' },
  { href: '/admin/estoque', label: 'Estoque', icon: '📋' },
  { href: '/admin/pedidos', label: 'Pedidos', icon: '🛒' },
  { href: '/admin/cupons', label: 'Cupons', icon: '🎫' },
  { href: '/admin/vendedores', label: 'Vendedores', icon: '👥' },
  { href: '/admin/relatorios', label: 'Relatórios', icon: '📈' },
  { href: '/admin/insights', label: 'Insights', icon: '🔮' },
  { href: '/admin/concorrentes', label: 'Concorrentes', icon: '🏪' },
  { href: '/admin/promocoes', label: 'Promoções', icon: '🏷️' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Topbar mobile */}
        <div className="md:hidden bg-white shadow-sm p-4 flex items-center justify-between">
          <Link href="/admin" className="text-xl font-heading font-bold text-primary">
            Painel Admin
          </Link>
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
            aria-label="Abrir menu admin"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Overlay + Drawer mobile */}
        {mobileOpen && (
          <>
            <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
            <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 p-4 md:hidden">
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-lg text-primary">Admin</span>
                <button onClick={() => setMobileOpen(false)} className="p-1 hover:bg-gray-100 rounded">✕</button>
              </div>
              <nav className="space-y-2">
                {menuItems.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                      pathname === item.href
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
                <hr className="my-2" />
                <button
                  onClick={() => { setMobileOpen(false); handleLogout(); }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition w-full text-left"
                >
                  <span className="text-lg">🚪</span>
                  Sair
                </button>
              </nav>
            </div>
          </>
        )}

        <div className="flex">
          {/* Sidebar desktop */}
          <aside className="hidden md:flex md:flex-col w-64 bg-white shadow-sm min-h-screen p-4">
            <Link href="/admin" className="text-2xl font-heading font-black text-primary block mb-8">
              Painel Admin
            </Link>
            <nav className="space-y-2 flex-1">
              {menuItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                    pathname === item.href
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
            {/* Botão de logout no final da sidebar */}
            <div className="border-t pt-4 mt-auto">
              <div className="flex items-center gap-3 px-3 py-2 mb-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {user?.nome?.charAt(0)?.toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.nome || 'Admin'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition w-full text-left"
              >
                <span className="text-lg">🚪</span>
                Sair do Painel
              </button>
            </div>
          </aside>
<div className="border-t pt-4 mt-auto">
  <div className="flex items-center gap-3 px-3 py-2 mb-2">
    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
      <span className="text-sm font-medium text-primary">A</span>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-900 truncate">Admin</p>
      <p className="text-xs text-gray-500 truncate">admin@partenon.com</p>
    </div>
  </div>
  <a
    href="/login"
    onClick={(e) => {
      e.preventDefault();
      localStorage.removeItem('token');
      window.location.href = '/login';
    }}
    className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition w-full text-left cursor-pointer"
  >
    <span className="text-lg">🚪</span>
    Sair do Painel
  </a>
</div>
          {/* Conteúdo principal */}
          <main className="flex-1 p-4 md:p-6 max-w-full overflow-x-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}