'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import CartDrawer from '@/components/CartDrawer';
import { Search, Heart, User, ShoppingBag, Menu, X } from 'lucide-react';

export default function Header() {
  const { totalItems } = useCart();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (termo: string) => {
    if (termo.trim()) {
      router.push(`/loja?busca=${encodeURIComponent(termo.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <header className="bg-white border-b border-[#e8e3dc] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 flex-shrink-0">
            <span className="font-serif font-light text-2xl tracking-[0.15em] text-[#1a1a1a]">
              PARTHENON
            </span>
            <span className="font-serif font-light text-xl tracking-[0.1em] text-[#8a7a6a] hidden sm:inline">
              TECIDOS
            </span>
          </Link>

          {/* Navegação */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/loja"
              className="font-sans font-light text-sm tracking-[0.1em] uppercase text-[#1a1a1a] hover:text-[#8a7a6a] transition-colors"
            >
              Coleção
            </Link>
            <Link
              href="/novidades"
              className="font-sans font-light text-sm tracking-[0.1em] uppercase text-[#1a1a1a] hover:text-[#8a7a6a] transition-colors"
            >
              Novidades
            </Link>
            <Link
              href="/promocoes"
              className="font-sans font-light text-sm tracking-[0.1em] uppercase text-[#1a1a1a] hover:text-[#8a7a6a] transition-colors"
            >
              Promoções
            </Link>
          </nav>

          {/* Ícones */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-[#1a1a1a] hover:text-[#8a7a6a] transition-colors"
            >
              <Search className="w-5 h-5" strokeWidth={1} />
            </button>

            <Link
              href="/favoritos"
              className="text-[#1a1a1a] hover:text-[#8a7a6a] transition-colors hidden sm:block"
            >
              <Heart className="w-5 h-5" strokeWidth={1} />
            </Link>

            {isAuthenticated ? (
              <Link
                href="/meu-perfil"
                className="text-[#1a1a1a] hover:text-[#8a7a6a] transition-colors hidden sm:block"
              >
                <User className="w-5 h-5" strokeWidth={1} />
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-[#1a1a1a] hover:text-[#8a7a6a] transition-colors hidden sm:block"
              >
                <User className="w-5 h-5" strokeWidth={1} />
              </Link>
            )}

            <button
              onClick={() => setCartOpen(true)}
              className="text-[#1a1a1a] hover:text-[#8a7a6a] transition-colors relative"
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={1} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#1a1a1a] text-white text-[0.6rem] w-5 h-5 flex items-center justify-center rounded-full font-light">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-[#1a1a1a]"
            >
              <Menu className="w-6 h-6" strokeWidth={1} />
            </button>
          </div>
        </div>

        {/* Busca expansível */}
        {searchOpen && (
          <div className="py-4 border-t border-[#e8e3dc]">
            <input
              type="text"
              placeholder="Buscar tecidos..."
              className="w-full px-4 py-3 bg-[#f8f6f2] border-none rounded-none text-sm font-light text-[#1a1a1a] placeholder:text-[#999] focus:outline-none focus:ring-1 focus:ring-[#d4cec4] tracking-[0.1em]"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch((e.target as HTMLInputElement).value);
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Menu mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 p-6 md:hidden transform transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <span className="font-serif text-xl text-[#1a1a1a]">Menu</span>
          <button onClick={() => setMobileOpen(false)} className="text-[#1a1a1a]">
            <X className="w-5 h-5" strokeWidth={1} />
          </button>
        </div>
        <div className="flex flex-col gap-4 text-sm font-light tracking-[0.1em] uppercase">
          <Link href="/" onClick={() => setMobileOpen(false)} className="text-[#1a1a1a] hover:text-[#8a7a6a]">Home</Link>
          <Link href="/loja" onClick={() => setMobileOpen(false)} className="text-[#1a1a1a] hover:text-[#8a7a6a]">Loja</Link>
          <Link href="/meus-pedidos" onClick={() => setMobileOpen(false)} className="text-[#1a1a1a] hover:text-[#8a7a6a]">Meus Pedidos</Link>
          <Link href="/favoritos" onClick={() => setMobileOpen(false)} className="text-[#1a1a1a] hover:text-[#8a7a6a]">Favoritos</Link>
          {isAuthenticated ? (
            <>
              {isAdmin && <Link href="/admin" onClick={() => setMobileOpen(false)} className="text-[#1a1a1a] hover:text-[#8a7a6a]">Admin</Link>}
              <button onClick={() => { logout(); setMobileOpen(false); }} className="text-left text-red-500 hover:text-red-600">Sair</button>
            </>
          ) : (
            <>
              <Link href="/cadastro" onClick={() => setMobileOpen(false)} className="text-[#1a1a1a] hover:text-[#8a7a6a]">Criar conta</Link>
              <Link href="/login" onClick={() => setMobileOpen(false)} className="text-[#1a1a1a] hover:text-[#8a7a6a]">Entrar</Link>
            </>
          )}
        </div>
      </div>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}