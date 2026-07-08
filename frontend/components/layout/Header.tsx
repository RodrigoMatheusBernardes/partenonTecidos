'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import CartDrawer from '@/components/CartDrawer';
import {
  Search, ShoppingBag, User, Heart, LogOut, Package, LayoutDashboard, Menu, X
} from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const { totalItems } = useCart();
  const { isAuthenticated, isAdmin, logout, user } = useAuth();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Função de Busca – redireciona para a loja com o termo
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/loja?busca=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setMobileSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    setMobileMenuOpen(false);
    router.push('/');
  };

  // Links específicos por role
  const getPedidosLabel = () => {
    if (!user) return 'Meus Pedidos';
    if (user.role === 'admin') return 'Gerenciar Pedidos';
    if (user.role === 'vendedor') return 'Pedidos dos Vendedores';
    return 'Meus Pedidos';
  };

  const getPedidosLink = () => {
    if (!user) return '/meus-pedidos';
    if (user.role === 'admin') return '/admin/pedidos';
    if (user.role === 'vendedor') return '/meus-pedidos'; // vendedor vê seus próprios pedidos
    return '/meus-pedidos';
  };

  const getAdminLink = () => {
    if (isAdmin) return '/admin';
    return null;
  };

  return (
    <>
      <header className="w-full bg-white border-b border-[#e5e5e5] shadow-[0_2px_10px_rgba(0,0,0,0.02)] h-[90px] md:h-[120px] flex items-center relative z-50">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 w-full flex items-center justify-between gap-6">

          {/* 1. LOGO (mantido exatamente como você enviou) */}
          <Link href="/" className="flex items-end gap-1 shrink-0">
            <span className="text-4xl md:text-5xl font-serif font-medium tracking-wider text-[#1a1a1a]">PARTHENON</span>
            <span className="text-4xl md:text-5xl font-light tracking-widest text-[#666]">TECIDOS</span>
          </Link>

          {/* 2. MENU DE NAVEGAÇÃO (Coleção agora aponta para /loja) */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-14 text-sm md:text-base font-medium uppercase tracking-[0.2em] text-[#1a1a1a]">
            <Link href="/loja" className="hover:opacity-60 transition-opacity duration-300">Coleção</Link>
            <Link href="/novidades" className="hover:opacity-60 transition-opacity duration-300">Novidades</Link>
            <Link href="/promocoes" className="hover:opacity-60 transition-opacity duration-300">Promoções</Link>
          </nav>

          {/* 3. AÇÕES DO USUÁRIO */}
          <div className="flex items-center gap-3 md:gap-5 shrink-0">

            {/* 🔍 BARRA DE PESQUISA (desktop) – funcionalidade corrigida */}
            <form onSubmit={handleSearch} className="relative hidden lg:block w-40 lg:w-64">
              <input
                type="text"
                placeholder="Buscar tecidos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border-b border-gray-200 bg-transparent py-2 text-sm font-light tracking-wide outline-none focus:border-[#1a1a1a] transition-all duration-300 placeholder:text-gray-400"
              />
              <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 hover:opacity-60 transition-opacity">
                <Search className="w-5 h-5 text-[#1a1a1a]" strokeWidth={1.5} />
              </button>
            </form>

            {/* 🔍 Ícone de Busca (Mobile) – abre campo expansível */}
            <button
              className="lg:hidden hover:opacity-60 transition-opacity duration-300"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            >
              <Search className="w-6 h-6 text-[#1a1a1a]" strokeWidth={1.5} />
            </button>

            {/* ♡ FAVORITOS */}
            <Link href="/favoritos" className="hover:opacity-60 transition-opacity duration-300">
              <Heart className="w-6 h-6 md:w-7 md:h-7 text-[#1a1a1a]" strokeWidth={1.5} />
            </Link>

            {/* 👤 USUÁRIO – dropdown real */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="hover:opacity-60 transition-opacity duration-300 flex items-center gap-1"
              >
                <User className="w-6 h-6 md:w-7 md:h-7 text-[#1a1a1a]" strokeWidth={1.5} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-4 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-[#1a1a1a]">Olá, {user?.nome}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                      </div>

                      {getAdminLink() && (
                        <Link
                          href={getAdminLink()!}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" /> Painel Admin
                        </Link>
                      )}

                      <Link
                        href={getPedidosLink()}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Package className="w-4 h-4" /> {getPedidosLabel()}
                      </Link>

                      <Link
                        href="/meu-perfil"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User className="w-4 h-4" /> Meu Perfil
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition w-full text-left"
                      >
                        <LogOut className="w-4 h-4" /> Sair
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Entrar
                      </Link>
                      <Link
                        href="/cadastro"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Cadastre-se
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* 🛒 CARRINHO – drawer real */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative hover:opacity-60 transition-opacity duration-300"
            >
              <ShoppingBag className="w-6 h-6 md:w-7 md:h-7 text-[#1a1a1a]" strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#1a1a1a] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* ☰ MENU MOBILE (hambúrguer) */}
            <button
              className="md:hidden hover:opacity-60 transition-opacity duration-300"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6 text-[#1a1a1a]" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* CAMPO DE BUSCA MOBILE (expansível) */}
        {mobileSearchOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-gray-200 px-6 py-4 lg:hidden">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Buscar tecidos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border-b border-gray-300 bg-transparent py-2 text-sm font-light outline-none focus:border-[#1a1a1a] transition-all"
                autoFocus
              />
              <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2">
                <Search className="w-5 h-5 text-[#1a1a1a]" strokeWidth={1.5} />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* MENU MOBILE (drawer lateral) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 p-6 md:hidden transform transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <span className="font-serif text-xl text-[#1a1a1a]">Menu</span>
          <button onClick={() => setMobileMenuOpen(false)}>
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
        <div className="flex flex-col gap-4 text-sm font-light tracking-[0.1em] uppercase">
          <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link href="/loja" onClick={() => setMobileMenuOpen(false)}>Loja</Link>
          <Link href="/novidades" onClick={() => setMobileMenuOpen(false)}>Novidades</Link>
          <Link href="/promocoes" onClick={() => setMobileMenuOpen(false)}>Promoções</Link>
          <Link href="/favoritos" onClick={() => setMobileMenuOpen(false)}>Favoritos</Link>
          {isAuthenticated ? (
            <>
              {isAdmin && <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>Admin</Link>}
              <Link href="/meus-pedidos" onClick={() => setMobileMenuOpen(false)}>Meus Pedidos</Link>
              <Link href="/meu-perfil" onClick={() => setMobileMenuOpen(false)}>Meu Perfil</Link>
              <button onClick={handleLogout} className="text-left text-red-500">Sair</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Entrar</Link>
              <Link href="/cadastro" onClick={() => setMobileMenuOpen(false)}>Cadastre-se</Link>
            </>
          )}
        </div>
      </div>

      {/* CARRINHO DRAWER */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}