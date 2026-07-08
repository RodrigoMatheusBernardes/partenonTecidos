'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import CartDrawer from '@/components/CartDrawer';
import { Search, ShoppingBag, Heart, User, Menu, X } from 'lucide-react';

export default function Header() {
  const { totalItems } = useCart();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [busca, setBusca] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (busca.trim()) {
      router.push(`/loja?busca=${encodeURIComponent(busca.trim())}`);
      setBusca('');
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 font-sans text-[#1a1a1a]">
      <div className="max-w-[1440px] mx-auto px-4 py-4 md:py-6">
        
        {/* LINHA 1: LOGO, BUSCA E ÍCONES */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6 mb-4 lg:mb-6">
          
          {/* LOGO */}
          <Link href="/" className="flex items-end gap-1 flex-shrink-0">
            <span className="font-serif font-light text-2xl md:text-3xl tracking-[0.15em] text-[#1a1a1a]">
              PARTHENON
            </span>
            <span className="hidden sm:inline font-serif font-light text-lg md:text-xl tracking-[0.1em] text-[#8a7a6a] -ml-1">
              TECIDOS
            </span>
          </Link>

          {/* BARRA DE BUSCA GRANDE E ARREDONDADA */}
          <form onSubmit={handleSearch} className="relative w-full max-w-lg mx-auto lg:mx-0">
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar tecidos, cores, estampas..."
              className="w-full border border-gray-300 rounded-full px-5 py-2.5 md:py-3 text-sm font-light placeholder:text-gray-400 focus:outline-none focus:border-gray-800 transition-all"
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#1a1a1a] transition">
              <Search className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </form>

          {/* ÍCONES E CARRINHO */}
          <div className="flex items-center gap-5 shrink-0">
            {/* Favoritos */}
            <Link href="/favoritos" className="text-[#1a1a1a] hover:text-[#8a7a6a] transition hidden sm:block">
              <Heart className="w-5 h-5" strokeWidth={1.5} />
            </Link>

            {/* Conta / Entrar */}
            {isAuthenticated ? (
              <Link href="/meu-perfil" className="text-[#1a1a1a] hover:text-[#8a7a6a] transition hidden sm:block">
                <User className="w-5 h-5" strokeWidth={1.5} />
              </Link>
            ) : (
              <div className="hidden sm:flex items-center gap-1 text-xs font-light text-gray-600">
                <Link href="/login" className="flex items-center gap-1 hover:text-black transition">
                  <User className="w-3.5 h-3.5" strokeWidth={1.5} /> Entrar
                </Link>
                <span className="text-gray-300">/</span>
                <Link href="/cadastro" className="hover:text-black transition">
                  Cadastre-se
                </Link>
              </div>
            )}

            {/* Carrinho */}
            <button
              onClick={() => setCartOpen(true)}
              className="bg-[#1a1a1a] text-white rounded-full px-4 py-2 flex items-center gap-2 text-xs font-light hover:bg-black transition shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
              <span className="hidden sm:inline">Carrinho</span>
              {totalItems > 0 && (
                <span className="bg-white text-[#1a1a1a] text-[0.6rem] w-5 h-5 flex items-center justify-center rounded-full font-medium">
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

        {/* LINHA 2: MENU DE NAVEGAÇÃO */}
        <nav className="hidden lg:flex justify-center items-center gap-8 pt-3 md:pt-4 border-t border-gray-100">
          <Link href="/loja" className="text-xs md:text-sm font-light uppercase tracking-[0.15em] text-[#1a1a1a] hover:text-[#8a7a6a] transition">
            Coleção
          </Link>
          <Link href="/novidades" className="text-xs md:text-sm font-light uppercase tracking-[0.15em] text-[#1a1a1a] hover:text-[#8a7a6a] transition">
            Novidades
          </Link>
          <Link href="/promocoes" className="text-xs md:text-sm font-light uppercase tracking-[0.15em] text-[#1a1a1a] hover:text-[#8a7a6a] transition">
            Promoções
          </Link>
        </nav>
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