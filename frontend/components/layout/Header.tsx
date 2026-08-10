'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import CartDrawer from '@/components/CartDrawer';
import { Search, Heart, ShoppingBag, Menu, X, User, ChevronDown } from 'lucide-react';

export default function Header() {
  const { totalItems } = useCart();
  const { isAuthenticated, isAdmin, isSeller, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      router.push(`/loja?busca=${encodeURIComponent(searchTerm.trim())}`);
      setSearchOpen(false);
      setSearchTerm('');
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.push('/');
  };

  const whatsappNumber = '5511999999999';
  const whatsappMessage = encodeURIComponent(
    'Olá! Gostaria de mais informações sobre os tecidos da Parthenon.'
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  // Determinar rótulo da role para exibição
  const roleLabel = user?.role === 'admin' ? 'Administrador' : user?.role === 'seller' ? 'Vendedor' : 'Cliente';

  return (
    <header className="bg-primary-dark border-b border-secondary-gray/20 sticky top-0 z-50 text-white">
      <div className="main-container">
        <div className="flex items-center justify-between h-20">
          
          {/* LOGO - Tamanho máximo com margem de segurança e alta resolução */}
          <Link href="/" className="flex items-center flex-shrink-0 h-20">
            <Image
              src="/images/img/logoT.png"
              alt="Parthenon Tecidos"
              width={600}
              height={150}
              priority
              className="max-h-[76px] w-auto object-contain"
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="font-secondary font-medium text-sm tracking-[0.1em] uppercase text-white hover:text-gold transition-colors">Home</Link>
            <Link href="/loja" className="font-secondary font-medium text-sm tracking-[0.1em] uppercase text-white hover:text-gold transition-colors">Coleção</Link>
            <Link href="/sobre" className="font-secondary font-medium text-sm tracking-[0.1em] uppercase text-white hover:text-gold transition-colors">Sobre</Link>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="font-secondary font-medium text-sm tracking-[0.1em] uppercase text-white hover:text-gold transition-colors">Contato</a>
            <Link href="/novidades" className="font-secondary font-medium text-sm tracking-[0.1em] uppercase text-white hover:text-gold transition-colors">Novidades</Link>
            <Link href="/promocoes" className="font-secondary font-medium text-sm tracking-[0.1em] uppercase text-white hover:text-gold transition-colors">Promoções</Link>
          </nav>

          {/* Icons + User Menu */}
          <div className="flex items-center gap-6">
            <button onClick={() => setSearchOpen(!searchOpen)} className="text-white hover:text-gold transition-colors">
              <Search className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <Link href="/favoritos" className="text-white hover:text-gold transition-colors hidden sm:block">
              <Heart className="w-5 h-5" strokeWidth={1.5} />
            </Link>

            {/* User Menu (dropdown) */}
            <div className="relative" ref={dropdownRef}>
              {isAuthenticated ? (
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-white hover:text-gold transition-colors focus:outline-none"
                  aria-label="Menu do usuário"
                >
                  <div className="w-8 h-8 rounded-full bg-gold text-primary-dark flex items-center justify-center font-primary font-bold text-sm">
                    {user?.nome?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} strokeWidth={2} />
                </button>
              ) : (
                <Link href="/login" className="text-white hover:text-gold transition-colors">
                  <User className="w-5 h-5" strokeWidth={1.5} />
                </Link>
              )}

              {/* Dropdown */}
              {isAuthenticated && dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white !bg-white rounded-card shadow-xl-luxury border border-gray-mid overflow-hidden z-[100] animate-fadeInUp">
                  <div className="px-4 py-3 border-b border-gray-mid bg-light/50">
                    <p className="font-primary font-medium text-dark-light !text-dark-light text-sm truncate">{user?.nome}</p>
                    <p className="font-secondary text-xs text-text-light !text-text-light">{roleLabel}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/meu-perfil"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-secondary text-text-secondary !text-text-secondary hover:bg-light hover:text-dark-light transition-colors"
                    >
                      <User className="w-4 h-4" strokeWidth={2} />
                      Meu Perfil
                    </Link>
                    <Link
                      href="/meus-pedidos"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-secondary text-text-secondary !text-text-secondary hover:bg-light hover:text-dark-light transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4" strokeWidth={2} />
                      Meus Pedidos
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-primary text-gold !text-gold hover:bg-light hover:text-gold transition-colors font-medium"
                      >
                        <User className="w-4 h-4" strokeWidth={2} />
                        Painel Administrativo
                      </Link>
                    )}
                    {isSeller && (
                      <Link
                        href="/seller"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-primary text-gold !text-gold hover:bg-light hover:text-gold transition-colors font-medium"
                      >
                        <User className="w-4 h-4" strokeWidth={2} />
                        Painel do Vendedor
                      </Link>
                    )}
                    <hr className="my-1 border-gray-mid" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-secondary text-error !text-error hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <User className="w-4 h-4" strokeWidth={2} />
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => setCartOpen(true)} className="text-white hover:text-gold transition-colors relative">
              <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-primary-dark text-[0.6rem] w-5 h-5 flex items-center justify-center rounded-full font-primary font-bold">
                  {totalItems}
                </span>
              )}
            </button>
            <button onClick={() => setMobileOpen(true)} className="md:hidden text-white hover:text-gold transition-colors">
              <Menu className="w-6 h-6" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Search Input */}
        {searchOpen && (
          <div className="py-4 border-t border-secondary-gray/20">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Buscar tecidos..."
              className="w-full px-4 py-3 bg-primary-dark border border-secondary-gray/30 rounded-none text-sm font-secondary text-white placeholder:text-secondary-gray/60 focus:outline-none focus:ring-1 focus:ring-gold tracking-[0.1em]"
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/90 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <div className={`fixed top-0 left-0 h-full w-80 bg-primary-dark border-r border-secondary-gray/20 shadow-xl z-50 p-6 md:hidden transform transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center mb-10">
          <span className="font-primary text-xl text-white tracking-[0.1em]">Menu</span>
          <button onClick={() => setMobileOpen(false)} className="text-white hover:text-gold">
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
        <nav className="flex flex-col gap-4 font-secondary text-sm font-medium tracking-[0.1em] uppercase">
          <Link href="/" onClick={() => setMobileOpen(false)} className="text-white hover:text-gold">Home</Link>
          <Link href="/loja" onClick={() => setMobileOpen(false)} className="text-white hover:text-gold">Loja</Link>
          <Link href="/sobre" onClick={() => setMobileOpen(false)} className="text-white hover:text-gold">Sobre</Link>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} className="text-white hover:text-gold">Contato</a>
          <Link href="/novidades" onClick={() => setMobileOpen(false)} className="text-white hover:text-gold">Novidades</Link>
          <Link href="/promocoes" onClick={() => setMobileOpen(false)} className="text-white hover:text-gold">Promoções</Link>
          <Link href="/meus-pedidos" onClick={() => setMobileOpen(false)} className="text-white hover:text-gold">Meus Pedidos</Link>
          <Link href="/favoritos" onClick={() => setMobileOpen(false)} className="text-white hover:text-gold">Favoritos</Link>
          {isAuthenticated ? (
            <>
              {isAdmin && <Link href="/admin" onClick={() => setMobileOpen(false)} className="text-white hover:text-gold">Admin</Link>}
              {isSeller && <Link href="/seller" onClick={() => setMobileOpen(false)} className="text-white hover:text-gold">Painel Vendedor</Link>}
              <button onClick={() => { logout(); setMobileOpen(false); }} className="text-left text-red-400 hover:text-red-500">Sair</button>
            </>
          ) : (
            <>
              <Link href="/cadastro" onClick={() => setMobileOpen(false)} className="text-white hover:text-gold">Criar conta</Link>
              <Link href="/login" onClick={() => setMobileOpen(false)} className="text-white hover:text-gold">Entrar</Link>
            </>
          )}
        </nav>
      </div>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}