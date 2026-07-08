'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import CartDrawer from '@/components/CartDrawer';
import { Search, ShoppingBag, Heart, User, Menu, X, Package } from 'lucide-react';

export default function Header() {
  const { totalItems } = useCart();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [busca, setBusca] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (busca.trim()) {
      router.push(`/loja?busca=${encodeURIComponent(busca.trim())}`);
      setBusca('');
      setSearchOpen(false);
    }
  };

  return (
    <header className="w-full bg-white border-b border-[#e8e4dc] font-sans text-[#1a1a1a]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-6 md:py-8 flex items-center justify-between gap-6">
        
        {/* LOGO */}
        <Link href="/" className="flex items-end gap-1 flex-shrink-0">
          <span className="font-serif font-light text-3xl md:text-4xl tracking-[0.2em] text-[#1a1a1a]">
            PARTHENON
          </span>
          <span className="hidden sm:inline font-serif font-light text-xl md:text-2xl tracking-[0.15em] text-[#8a7a6a] -ml-1">
            TECIDOS
          </span>
        </Link>

        {/* NAVEGAÇÃO CENTRAL (DESKTOP) */}
        <nav className="hidden lg:flex items-center gap-10">
          <Link href="/loja" className="text-sm font-light uppercase tracking-[0.2em] text-[#1a1a1a] hover:text-[#8a7a6a] transition">
            Coleção
          </Link>
          <Link href="/novidades" className="text-sm font-light uppercase tracking-[0.2em] text-[#1a1a1a] hover:text-[#8a7a6a] transition">
            Novidades
          </Link>
          <Link href="/promocoes" className="text-sm font-light uppercase tracking-[0.2em] text-[#1a1a1a] hover:text-[#8a7a6a] transition">
            Promoções
          </Link>
        </nav>

        {/* ÍCONES + BUSCA + LINKS */}
        <div className="flex items-center gap-5 shrink-0">
          
          {/* Busca (ícone + campo expansível) */}
          <div className="flex items-center gap-2">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar..."
                  className="w-40 md:w-56 border-b border-[#d4cfc6] bg-transparent px-2 py-1 text-sm font-light focus:outline-none focus:border-[#1a1a1a] transition-all"
                  autoFocus
                />
                <button type="submit" className="ml-2 text-[#8a7a6a] hover:text-[#1a1a1a]">
                  <Search className="w-5 h-5" strokeWidth={1.5} />
                </button>
                <button type="button" onClick={() => setSearchOpen(false)} className="ml-2 text-xs text-gray-400 hover:text-gray-600">
                  ✕
                </button>
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="text-[#1a1a1a] hover:text-[#8a7a6a] transition">
                <Search className="w-5 h-5" strokeWidth={1.5} />
              </button>
            )}
          </div>

          {/* Favoritos */}
          <Link href="/favoritos" className="text-[#1a1a1a] hover:text-[#8a7a6a] transition hidden sm:block" aria-label="Favoritos">
            <Heart className="w-5 h-5" strokeWidth={1.5} />
          </Link>

          {/* Conta / Entrar + Meus Pedidos */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-light text-[#5c5c5c]">
            {isAuthenticated ? (
              <>
                <Link href="/meus-pedidos" className="flex items-center gap-1 hover:text-[#1a1a1a] transition">
                  <Package className="w-4 h-4" strokeWidth={1.5} /> Meus Pedidos
                </Link>
                <span className="text-[#d4cfc6]">|</span>
                <Link href="/meu-perfil" className="flex items-center gap-1 hover:text-[#1a1a1a] transition">
                  <User className="w-4 h-4" strokeWidth={1.5} /> Conta
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="flex items-center gap-1 hover:text-[#1a1a1a] transition">
                  <User className="w-4 h-4" strokeWidth={1.5} /> Entrar
                </Link>
                <span className="text-[#d4cfc6]">/</span>
                <Link href="/cadastro" className="hover:text-[#1a1a1a] transition">
                  Cadastre-se
                </Link>
              </>
            )}
          </div>

          {/* Carrinho */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 text-[#1a1a1a] hover:text-[#8a7a6a] transition"
            aria-label="Carrinho"
          >
            <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#1a1a1a] text-white text-[0.6rem] w-5 h-5 flex items-center justify-center rounded-full font-light">
                {totalItems}
              </span>
            )}
          </button>

          {/* Menu mobile */}
          <button onClick={() => setMobileOpen(true)} className="lg:hidden text-[#1a1a1a]">
            <Menu className="w-6 h-6" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* MENU MOBILE */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 p-6 lg:hidden transform transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <span className="font-serif text-xl text-[#1a1a1a]">Menu</span>
          <button onClick={() => setMobileOpen(false)} className="text-[#1a1a1a]">
            <X className="w-5 h-5" strokeWidth={1.5} />
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