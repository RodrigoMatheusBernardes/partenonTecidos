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

  const whatsappNumber = '5511999999999';
  const whatsappMessage = encodeURIComponent(
    'Olá! Gostaria de mais informações sobre os tecidos da Parthenon.'
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <header className="bg-[#0B1F33] border-b border-white/5 sticky top-0 z-50 text-white">
      <div className="main-container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 flex-shrink-0">
            <span className="font-serif font-light text-2xl tracking-[0.15em] text-white">
              PARTHENON
            </span>
            <span className="font-serif font-light text-xl tracking-[0.1em] text-[#C5A880] hidden sm:inline">
              TECIDOS
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="font-sans font-medium text-sm tracking-[0.1em] uppercase text-white hover:text-[#C5A880] transition-colors">Home</Link>
            <Link href="/loja" className="font-sans font-medium text-sm tracking-[0.1em] uppercase text-white hover:text-[#C5A880] transition-colors">Coleção</Link>
            <Link href="/sobre" className="font-sans font-medium text-sm tracking-[0.1em] uppercase text-white hover:text-[#C5A880] transition-colors">Sobre</Link>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="font-sans font-medium text-sm tracking-[0.1em] uppercase text-white hover:text-[#C5A880] transition-colors">Contato</a>
            <Link href="/novidades" className="font-sans font-medium text-sm tracking-[0.1em] uppercase text-white hover:text-[#C5A880] transition-colors">Novidades</Link>
            <Link href="/promocoes" className="font-sans font-medium text-sm tracking-[0.1em] uppercase text-white hover:text-[#C5A880] transition-colors">Promoções</Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-6">
            <button onClick={() => setSearchOpen(!searchOpen)} className="text-white hover:text-[#C5A880] transition-colors">
              <Search className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <Link href="/favoritos" className="text-white hover:text-[#C5A880] transition-colors hidden sm:block">
              <Heart className="w-5 h-5" strokeWidth={1.5} />
            </Link>
            {isAuthenticated ? (
              <Link href="/meu-perfil" className="text-white hover:text-[#C5A880] transition-colors hidden sm:block">
                <User className="w-5 h-5" strokeWidth={1.5} />
              </Link>
            ) : (
              <Link href="/login" className="text-white hover:text-[#C5A880] transition-colors hidden sm:block">
                <User className="w-5 h-5" strokeWidth={1.5} />
              </Link>
            )}
            <button onClick={() => setCartOpen(true)} className="text-white hover:text-[#C5A880] transition-colors relative">
              <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#C5A880] text-[#050A14] text-[0.6rem] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {totalItems}
                </span>
              )}
            </button>
            <button onClick={() => setMobileOpen(true)} className="md:hidden text-white hover:text-[#C5A880] transition-colors">
              <Menu className="w-6 h-6" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Search Input */}
        {searchOpen && (
          <div className="py-4 border-t border-white/5">
            <input
              type="text"
              placeholder="Buscar tecidos..."
              className="w-full px-4 py-3 bg-[#050A14] border border-white/10 rounded-none text-sm font-light text-white placeholder:text-[#8a7a6a] focus:outline-none focus:ring-1 focus:ring-[#C5A880] tracking-[0.1em]"
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

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/90 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <div className={`fixed top-0 left-0 h-full w-80 bg-[#0B1F33] border-r border-white/5 shadow-xl z-50 p-6 md:hidden transform transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center mb-10">
          <span className="font-serif text-xl text-white tracking-[0.1em]">Menu</span>
          <button onClick={() => setMobileOpen(false)} className="text-white hover:text-[#C5A880]">
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
        <nav className="flex flex-col gap-4 text-sm font-medium tracking-[0.1em] uppercase">
          <Link href="/" onClick={() => setMobileOpen(false)} className="text-white hover:text-[#C5A880]">Home</Link>
          <Link href="/loja" onClick={() => setMobileOpen(false)} className="text-white hover:text-[#C5A880]">Loja</Link>
          <Link href="/sobre" onClick={() => setMobileOpen(false)} className="text-white hover:text-[#C5A880]">Sobre</Link>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} className="text-white hover:text-[#C5A880]">Contato</a>
          <Link href="/novidades" onClick={() => setMobileOpen(false)} className="text-white hover:text-[#C5A880]">Novidades</Link>
          <Link href="/promocoes" onClick={() => setMobileOpen(false)} className="text-white hover:text-[#C5A880]">Promoções</Link>
          <Link href="/meus-pedidos" onClick={() => setMobileOpen(false)} className="text-white hover:text-[#C5A880]">Meus Pedidos</Link>
          <Link href="/favoritos" onClick={() => setMobileOpen(false)} className="text-white hover:text-[#C5A880]">Favoritos</Link>
          {isAuthenticated ? (
            <>
              {isAdmin && <Link href="/admin" onClick={() => setMobileOpen(false)} className="text-white hover:text-[#C5A880]">Admin</Link>}
              <button onClick={() => { logout(); setMobileOpen(false); }} className="text-left text-red-400 hover:text-red-500">Sair</button>
            </>
          ) : (
            <>
              <Link href="/cadastro" onClick={() => setMobileOpen(false)} className="text-white hover:text-[#C5A880]">Criar conta</Link>
              <Link href="/login" onClick={() => setMobileOpen(false)} className="text-white hover:text-[#C5A880]">Entrar</Link>
            </>
          )}
        </nav>
      </div>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}