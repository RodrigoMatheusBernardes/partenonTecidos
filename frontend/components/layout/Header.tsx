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
  Search, ShoppingBag, Heart, LogOut, Package, Shield, Menu, X, ChevronDown, User
} from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const { totalItems } = useCart();
  const { isAuthenticated, isAdmin, logout, user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOverlayOpen(false);
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
      setSearchOverlayOpen(false);
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
    { href: '/', label: 'Home' },
    { href: '/loja', label: 'Coleção' },
    { href: '/novidades', label: 'Novidades' },
    { href: '/promocoes', label: 'Promoções' },
  ];

  return (
    <>
      {/* HEADER - Linha 1: Logo | Ações | Menu */}
      <header className="sticky top-0 w-full bg-white border-b border-gray-mid shadow-sm-luxury z-40">
        <div className="container-main w-full">
          <div className="flex items-center justify-between h-20 gap-4">

            {/* LOGO - Sempre visível, nunca comprimida */}
            <Link 
              href="/" 
              className="shrink-0 flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-parthenon-navy rounded-lg flex items-center justify-center shadow-sm-luxury">
                <span className="text-white font-serif font-bold text-base">P</span>
              </div>
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-xs font-serif font-bold tracking-tight text-parthenon-navy">PARTHENON</span>
                <span className="text-[10px] font-serif font-light tracking-[0.1em] text-parthenon-dark">TECIDOS</span>
              </div>
            </Link>

            {/* AÇÕES + BUSCA - Direita */}
            <div className="flex items-center gap-1 shrink-0">

              {/* Busca - Ícone que abre overlay */}
              <button 
                onClick={() => setSearchOverlayOpen(!searchOverlayOpen)}
                className="p-2 hover:bg-parthenon-light rounded-button transition-colors"
                aria-label="Buscar"
                title="Buscar tecidos"
              >
                <Search className="w-5 h-5 text-parthenon-navy" strokeWidth={2} />
              </button>

              {/* Favoritos */}
              <Link 
                href="/favoritos" 
                className="p-2 hover:bg-parthenon-light rounded-button transition-colors"
                aria-label="Favoritos"
                title="Meus favoritos"
              >
                <Heart className="w-5 h-5 text-parthenon-navy" strokeWidth={1.5} />
              </Link>

              {/* Carrinho com Badge */}
              <button
                onClick={() => setCartOpen(true)}
                className="p-2 hover:bg-parthenon-light rounded-button transition-colors relative"
                aria-label="Carrinho"
                title="Meu carrinho"
              >
                <ShoppingBag className="w-5 h-5 text-parthenon-navy" strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-parthenon-royal text-white text-xs font-bold flex items-center justify-center">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </button>

              {/* Menu Usuário (Desktop) */}
              <div className="relative hidden lg:block" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="p-2 hover:bg-parthenon-light rounded-button transition-colors flex items-center gap-1.5"
                  title={isAuthenticated ? `Olá, ${user?.nome}` : 'Sua conta'}
                >
                  <div className="w-5 h-5 rounded-full bg-parthenon-navy flex items-center justify-center">
                    <User className="w-3 h-3 text-white" strokeWidth={2} />
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-text-secondary" strokeWidth={2} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-72 bg-white rounded-card shadow-lg-luxury border border-gray-mid py-2 z-50 animate-fade-in">
                    {isAuthenticated ? (
                      <>
                        <div className="px-5 py-3 border-b border-gray-mid bg-parthenon-light/40">
                          <p className="text-sm font-semibold text-parthenon-navy">{user?.nome}</p>
                          <p className="text-xs text-parthenon-dark font-light mt-0.5 capitalize">{user?.role === 'vendedor' ? 'Vendedor' : user?.role === 'admin' ? 'Administrador' : 'Cliente'}</p>
                        </div>

                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-5 py-2.5 text-sm text-parthenon-navy hover:bg-parthenon-light/40 transition-colors"
                          >
                            <Shield className="w-4 h-4" strokeWidth={2} />
                            <span>Painel Admin</span>
                          </Link>
                        )}

                        <Link
                          href="/meu-perfil"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-5 py-2.5 text-sm text-parthenon-navy hover:bg-parthenon-light/40 transition-colors"
                        >
                          <User className="w-4 h-4" strokeWidth={2} />
                          <span>Meu Perfil</span>
                        </Link>

                        <Link
                          href="/meus-pedidos"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-5 py-2.5 text-sm text-parthenon-navy hover:bg-parthenon-light/40 transition-colors"
                        >
                          <Package className="w-4 h-4" strokeWidth={2} />
                          <span>Meus Pedidos</span>
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-parthenon-navy hover:bg-parthenon-light/40 transition-colors border-t border-gray-mid"
                        >
                          <LogOut className="w-4 h-4" strokeWidth={2} />
                          <span>Sair</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-5 py-2.5 text-sm text-parthenon-navy hover:bg-parthenon-light/40 transition-colors"
                        >
                          Entrar
                        </Link>
                        <Link
                          href="/cadastro"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-5 py-2.5 text-sm text-parthenon-navy hover:bg-parthenon-light/40 transition-colors border-t border-gray-mid"
                        >
                          Criar Conta
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Menu Mobile Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-parthenon-light rounded-button transition-colors"
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-parthenon-navy" strokeWidth={2} />
                ) : (
                  <Menu className="w-5 h-5 text-parthenon-navy" strokeWidth={2} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* SEARCH OVERLAY - Elegant reveal animation */}
        {searchOverlayOpen && (
          <div className="border-t border-gray-mid bg-parthenon-light/60 backdrop-blur-sm animate-fade-in">
            <div className="container-main w-full px-0">
              <form onSubmit={handleSearch} className="p-4">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Input
                      type="search"
                      placeholder="Buscar por tecidos, coleções, características..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      inputSize="md"
                      icon={<Search className="w-4 h-4" />}
                      className="!border-2 !border-parthenon-navy focus:!border-parthenon-royal"
                      autoFocus
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchOverlayOpen(false);
                      setSearchTerm('');
                    }}
                    className="p-2 hover:bg-white rounded-button transition-colors"
                  >
                    <X className="w-5 h-5 text-parthenon-navy" strokeWidth={2} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* HEADER LINHA 2: Navegação Secundária (Desktop: lg+, Tablet: md+) */}
      <nav className="hidden md:block sticky top-20 w-full bg-white border-b border-gray-mid z-30">
        <div className="container-main w-full">
          <div className="flex items-center gap-8 h-12 px-0">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-bold uppercase tracking-wider text-parthenon-navy hover:text-parthenon-royal transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-parthenon-royal group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* MOBILE MENU - Drawer lateral elegante */}
      {mobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 z-40 lg:hidden" 
            onClick={() => setMobileMenuOpen(false)} 
          />
          <div className="fixed right-0 top-20 h-[calc(100vh-5rem)] w-80 max-w-full bg-white z-50 shadow-lg-luxury overflow-y-auto lg:hidden animate-slide-up">
            
            {/* Busca Mobile */}
            <div className="p-4 border-b border-gray-mid bg-parthenon-light/40">
              <form onSubmit={handleSearch}>
                <Input
                  type="search"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  inputSize="md"
                  icon={<Search className="w-4 h-4" />}
                  className="!border-2 !border-parthenon-navy"
                />
              </form>
            </div>

            {/* Navegação Mobile */}
            <nav className="flex flex-col p-4 gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-bold text-parthenon-navy rounded-button hover:bg-parthenon-light/60 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Divisor */}
            <div className="border-t border-gray-mid my-2" />

            {/* User Menu Mobile */}
            <div className="p-4">
              {isAuthenticated ? (
                <>
                  <div className="mb-4 pb-4 border-b border-gray-mid">
                    <p className="text-sm font-bold text-parthenon-navy">{user?.nome}</p>
                    <p className="text-xs text-parthenon-dark font-light mt-1 capitalize">{user?.role === 'vendedor' ? 'Vendedor' : user?.role === 'admin' ? 'Administrador' : 'Cliente'}</p>
                  </div>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-parthenon-navy rounded-button hover:bg-parthenon-light/60 transition-colors"
                    >
                      <Shield className="w-4 h-4" strokeWidth={2} />
                      <span>Painel Admin</span>
                    </Link>
                  )}

                  <Link
                    href="/meu-perfil"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-parthenon-navy rounded-button hover:bg-parthenon-light/60 transition-colors"
                  >
                    <User className="w-4 h-4" strokeWidth={2} />
                    <span>Meu Perfil</span>
                  </Link>

                  <Link
                    href="/meus-pedidos"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-parthenon-navy rounded-button hover:bg-parthenon-light/60 transition-colors"
                  >
                    <Package className="w-4 h-4" strokeWidth={2} />
                    <span>Meus Pedidos</span>
                  </Link>

                  <Button
                    onClick={handleLogout}
                    variant="secondary"
                    fullWidth
                    className="mt-4"
                  >
                    <LogOut className="w-4 h-4" strokeWidth={2} />
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block mb-2">
                    <Button variant="primary" fullWidth>Entrar</Button>
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
