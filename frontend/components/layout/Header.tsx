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
    <header className="w-full bg-white border-b border-[#e8e4dc] font-sans text-[#1a1a1a]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-6 md:py-8">
        
        {/* LINHA 1: LOGO, BUSCA E ÍCONES */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10">
          
          {/* LOGO – com espaçamento generoso */}
          <Link href="/" className="flex items-end gap-1 flex-shrink-0">
            <span className="font-serif font-light text-3xl md:text-4xl tracking-[0.2em] text-[#1a1a1a]">
              PARTHENON
            </span>
            <span className="hidden sm:inline font-serif font-light text-xl md:text-2xl tracking-[0.15em] text-[#8a7a6a] -ml-1">
              TECIDOS
            </span>
          </Link>

          {/* BARRA DE BUSCA – maior, com bordas suaves e sombra leve */}
          <form onSubmit={handleSearch} className="relative w-full max-w-xl mx-auto lg:mx-0">
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar tecidos, cores, estampas..."
              className="w-full border border-[#d4cfc6] rounded-full px-6 py-3.5 text-sm font-light placeholder:text-[#a0a0a0] focus:outline-none focus:border-[#1a1a1a] focus:shadow-sm transition-all duration-300"
            />
            <button type="submit" className="absolute right-5 top-1/2 -translate-y-1/2 text-[#8a7a6a] hover:text-[#1a1a1a] transition">
              <Search className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </form>

          {/* ÍCONES E CARRINHO – mais espaçados */}
          <div className="flex items-center gap-6 shrink-0">
            {/* Favoritos */}
            <Link href="/favoritos" className="text-[#1a1a1a] hover:text-[#8a7a6a] transition hidden sm:block" aria-label="Favoritos">
              <Heart className="w-5 h-5" strokeWidth={1.5} />
            </Link>

            {/* Conta / Entrar */}
            {isAuthenticated ? (
              <Link href="/meu-perfil" className="text-[#1a1a1a] hover:text-[#8a7a6a] transition hidden sm:block" aria-label="Minha Conta">
                <User className="w-5 h-5" strokeWidth={1.5} />
              </Link>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5 text-xs font-light text-[#5c5c5c]">
                <Link href="/login" className="flex items-center gap-1 hover:text-[#1a1a1a] transition">
                  <User className="w-4 h-4" strokeWidth={1.5} /> Entrar
                </Link>
                <span className="text-[#d4cfc6]">/</span>
                <Link href="/cadastro" className="hover:text-[#1a1a1a] transition">
                  Cadastre-se
                </Link>
              </div>
            )}

            {/* Carrinho – com botão discreto e elegante */}
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

        {/* LINHA 2: NAVEGAÇÃO – mais espaçada e centralizada */}
        <nav className="hidden lg:flex justify-center items-center gap-10 mt-6 pt-4 border-t border-[#e8e4dc]">
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