'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import CartDrawer from '@/components/CartDrawer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Search, ShoppingBag, Heart, LogOut, Package, LayoutDashboard, Menu, X, ChevronDown, Home
} from 'lucide-react';

export default function HeaderNew() {
  const router = useRouter();
  const { totalItems } = useCart();
  const { isAuthenticated, isAdmin, logout, user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/loja?busca=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    router.push('/');
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/loja', label: 'Coleção' },
    { href: '/novidades', label: 'Novidades' },
    { href: '/promocoes', label: 'Promoções' },
  ];

  return (
    <>
      {/* HEADER LINHA 1: Logo | Busca | Ações */}
      <header className="sticky top-0 w-full bg-white border-b border-gray-mid shadow-sm-luxury z-40">
        <div className="container-main w-full">
          <div className="flex items-center justify-between h-24 gap-6">

            {/* LOGO */}
            <Link 
              href="/" 
              className="shrink-0 flex items-center gap-2 hover:opacity-75 transition-opacity"
            >
              <div className="w-12 h-12 bg-dark-light rounded-lg flex items-center justify-center">
                <span className="text-white font-serif font-bold text-lg">P</span>
              </div>
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-sm font-serif font-bold tracking-tight text-dark-light">PARTHENON</span>
                <span className="text-xs font-serif font-light tracking-[0.1em] text-text-light">TECIDOS</span>
              </div>
            </Link>

            {/* BUSCA - Centro e Destaque (Desktop) */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
              <div className="w-full relative">
                <Input
                  type="search"
                  placeholder="Buscar tecidos, características, coleções..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  inputSize="lg"
                  icon={<Search className="w-5 h-5" />}
                  className="!border-2 !border-gold"
                />
              </div>
            </form>

            {/* AÇÕES - Direita */}
            <div className="flex items-center gap-2 shrink-0">

              {/* Busca Mobile */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2.5 hover:bg-light rounded-button transition-colors"
                aria-label="Busca"
              >
                <Search className="w-6 h-6 text-dark-light" strokeWidth={2} />
              </button>

              {/* Favoritos */}
              <Link 
                href="/favoritos" 
                className="p-2.5 hover:bg-light rounded-button transition-colors relative"
                aria-label="Favoritos"
              >
                <Heart className="w-6 h-6 text-dark-light" strokeWidth={1.5} />
              </Link>

              {/* Carrinho com Badge */}
              <button
                onClick={() => setCartOpen(true)}
                className="p-2.5 hover:bg-light rounded-button transition-colors relative"
                aria-label="Carrinho"
              >
                <ShoppingBag className="w-6 h-6 text-dark-light" strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold text-dark-light text-xs font-bold flex items-center justify-center">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </button>

              {/* Menu Usuário (Desktop) */}
              <div className="relative hidden lg:block" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="p-2.5 hover:bg-light rounded-button transition-colors flex items-center gap-1"
                >
                  <div className="w-6 h-6 rounded-full bg-dark-light flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {user?.nome?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-text-secondary" strokeWidth={2} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-80 bg-white rounded-card shadow-lg-luxury border border-gray-mid py-2 z-50 animate-fade-in">
                    {isAuthenticated ? (
                      <>
                        <div className="px-6 py-4 border-b border-gray-mid bg-light/50">
                          <p className="text-sm font-semibold text-dark-light">{user?.nome}</p>
                          <p className="text-xs text-text-secondary font-light mt-1 capitalize">{user?.role === 'vendedor' ? 'Vendedor' : user?.role === 'admin' ? 'Administrador' : 'Cliente'}</p>
                        </div>

                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-6 py-3 text-sm text-dark-light hover:bg-light transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Painel Admin
                          </Link>
                        )}

                        <Link
                          href="/meu-perfil"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-6 py-3 text-sm text-dark-light hover:bg-light transition-colors"
                        >
                          <span>👤</span>
                          Meu Perfil
                        </Link>

                        <Link
                          href="/meus-pedidos"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-6 py-3 text-sm text-dark-light hover:bg-light transition-colors"
                        >
                          <Package className="w-4 h-4" />
                          Meus Pedidos
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-6 py-3 text-sm text-dark-light hover:bg-light transition-colors border-t border-gray-mid"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-6 py-3 text-sm text-dark-light hover:bg-light transition-colors"
                        >
                          Login
                        </Link>
                        <Link
                          href="/cadastro"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-6 py-3 text-sm text-dark-light hover:bg-light transition-colors border-t border-gray-mid"
                        >
                          Criar Conta
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Menu Mobile */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 hover:bg-light rounded-button transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-dark-light" strokeWidth={2} />
                ) : (
                  <Menu className="w-6 h-6 text-dark-light" strokeWidth={2} />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* HEADER LINHA 2: Navegação Secundária (Desktop Only) */}
      <nav className="hidden lg:block sticky top-24 w-full bg-light border-b border-gray-mid z-30">
        <div className="container-main w-full">
          <div className="flex items-center gap-8 h-12 px-0">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold uppercase tracking-wider text-dark-light hover:text-gold transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed right-0 top-24 h-[calc(100vh-6rem)] w-80 max-w-full bg-white z-40 shadow-lg-luxury overflow-y-auto lg:hidden animate-slide-up">
            
            {/* Busca Mobile */}
            <div className="p-6 border-b border-gray-mid">
              <form onSubmit={handleSearch}>
                <Input
                  type="search"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  inputSize="md"
                  icon={<Search className="w-4 h-4" />}
                />
              </form>
            </div>

            {/* Navegação */}
            <nav className="flex flex-col p-6 gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-semibold text-dark-light rounded-button hover:bg-light transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Divisor */}
            <div className="border-t border-gray-mid my-4" />

            {/* User Menu Mobile */}
            <div className="p-6">
              {isAuthenticated ? (
                <>
                  <div className="mb-4 pb-4 border-b border-gray-mid">
                    <p className="text-sm font-semibold text-dark-light">{user?.nome}</p>
                    <p className="text-xs text-text-secondary capitalize">{user?.role}</p>
                  </div>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-dark-light rounded-button hover:bg-light transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Painel Admin
                    </Link>
                  )}

                  <Link
                    href="/meu-perfil"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-dark-light rounded-button hover:bg-light transition-colors"
                  >
                    <span>👤</span>
                    Meu Perfil
                  </Link>

                  <Link
                    href="/meus-pedidos"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-dark-light rounded-button hover:bg-light transition-colors"
                  >
                    <Package className="w-4 h-4" />
                    Meus Pedidos
                  </Link>

                  <Button
                    onClick={handleLogout}
                    variant="secondary"
                    fullWidth
                    className="mt-4"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block mb-2">
                    <Button variant="primary" fullWidth>Login</Button>
                  </Link>
                  <Link href="/cadastro" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="secondary" fullWidth>Criar Conta</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* CART DRAWER */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
