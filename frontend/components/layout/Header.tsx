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
  Search, ShoppingBag, Heart, LogOut, Package, Shield, Menu, X, ChevronDown, User, LogIn
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

  // Navegação completa: Home, Coleção, Sobre, Contato, Novidades, Promoções
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/loja', label: 'Coleção' },
    { href: '/sobre', label: 'Sobre' },
    { href: '/contato', label: 'Contato' },
    { href: '/novidades', label: 'Novidades' },
    { href: '/promocoes', label: 'Promoções' },
  ];

  return (
    <>
      {/* HEADER - LINHA 1: Logo | Navegação | Ações - Com presença visual */}
      <header className="sticky top-0 w-full bg-gradient-to-r from-parthenon-beige/30 via-white to-white border-b border-gray-mid shadow-sm-luxury z-40">
        <div className="container-main w-full">
          <div className="flex items-center justify-between h-20 gap-4">

            {/* LOGO - TERRA BRUCIATA: Luxury brand inspirado em Loro Piana, Zara, Hugo Boss */}
            <Link 
              href="/" 
              className="shrink-0 flex items-center gap-3.5 hover:opacity-90 transition-opacity duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-parthenon-brown to-parthenon-brown-dark rounded-lg flex items-center justify-center shadow-md-luxury hover:shadow-lg-luxury transition-shadow duration-300">
                <span className="text-white font-serif font-bold text-2xl leading-none">Π</span>
              </div>
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="font-serif font-bold tracking-tight text-base text-parthenon-brown">PARTHENON</span>
                <span className="font-serif font-light tracking-widest text-xs text-parthenon-brown-dark">TECIDOS PREMIUM</span>
              </div>
            </Link>

            {/* NAVEGAÇÃO - Desktop only, espaçada elegantemente, Terra Bruciata */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-parthenon-brown hover:bg-parthenon-beige/60 rounded-button transition-all duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute bottom-1.5 left-4 right-4 h-0.5 bg-parthenon-brown opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              ))}
            </nav>

            {/* AÇÕES - Direita, Terra Bruciata */}
            <div className="flex items-center gap-1 shrink-0">

              {/* Busca - Ícone elegante */}
              <button 
                onClick={() => setSearchOverlayOpen(!searchOverlayOpen)}
                className="p-2.5 hover:bg-parthenon-beige rounded-button transition-all duration-300 hover:scale-105 hover:shadow-sm-luxury"
                aria-label="Buscar"
                title="Buscar tecidos"
              >
                <Search className="w-5 h-5 text-parthenon-brown" strokeWidth={1.5} />
              </button>

              {/* Favoritos - Link elegante */}
              <Link 
                href="/favoritos" 
                className="p-2.5 hover:bg-parthenon-beige rounded-button transition-all duration-300 hover:scale-105 hover:shadow-sm-luxury"
                aria-label="Favoritos"
                title="Meus favoritos"
              >
                <Heart className="w-5 h-5 text-parthenon-brown" strokeWidth={1.5} />
              </Link>

              {/* Carrinho com Badge - Terra Bruciata */}
              <button
                onClick={() => setCartOpen(true)}
                className="p-2.5 hover:bg-parthenon-beige rounded-button transition-all duration-300 hover:scale-105 hover:shadow-sm-luxury relative"
                aria-label="Carrinho"
                title="Meu carrinho"
              >
                <ShoppingBag className="w-5 h-5 text-parthenon-brown" strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-parthenon-brown text-white text-xs font-bold flex items-center justify-center shadow-md-luxury">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </button>

              {/* Menu Usuário (Desktop) - Terra Bruciata */}
              <div className="relative hidden lg:block" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="p-2.5 hover:bg-parthenon-beige rounded-button transition-all duration-300 hover:scale-105 hover:shadow-sm-luxury flex items-center gap-1.5"
                  title={isAuthenticated ? `Olá, ${user?.nome}` : 'Sua conta'}
                >
                  <div className="w-6 h-6 rounded-full bg-parthenon-brown flex items-center justify-center shadow-sm-luxury">
                    <User className="w-3 h-3 text-white" strokeWidth={2.5} />
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-text-secondary" strokeWidth={2} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-card shadow-lg-luxury border border-gray-mid overflow-hidden z-50 animate-fade-in">
                    {isAuthenticated ? (
                      <>
                        <div className="px-5 py-4 border-b border-gray-mid bg-parthenon-beige/70">
                          <p className="text-sm font-semibold text-parthenon-brown">{user?.nome}</p>
                          <p className="text-xs text-parthenon-brown-dark font-light mt-0.5 capitalize">{user?.role === 'vendedor' ? 'Vendedor' : user?.role === 'admin' ? 'Administrador' : 'Cliente'}</p>
                        </div>

                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-5 py-3 text-sm text-parthenon-brown hover:bg-parthenon-beige/50 transition-all duration-150"
                          >
                            <Shield className="w-4 h-4" strokeWidth={2} />
                            <span>Painel Admin</span>
                          </Link>
                        )}

                        <Link
                          href="/meu-perfil"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-5 py-3 text-sm text-parthenon-brown hover:bg-parthenon-beige/50 transition-all duration-150"
                        >
                          <User className="w-4 h-4" strokeWidth={2} />
                          <span>Meu Perfil</span>
                        </Link>

                        <Link
                          href="/meus-pedidos"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-5 py-3 text-sm text-parthenon-brown hover:bg-parthenon-beige/50 transition-all duration-150"
                        >
                          <Package className="w-4 h-4" strokeWidth={2} />
                          <span>Meus Pedidos</span>
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-5 py-3 text-sm text-parthenon-brown hover:bg-parthenon-beige/50 transition-all duration-150 border-t border-gray-mid"
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
                          className="flex items-center gap-3 px-5 py-3 text-sm text-parthenon-brown hover:bg-parthenon-beige/50 transition-all duration-150"
                        >
                          <LogIn className="w-4 h-4" strokeWidth={2} />
                          <span>Entrar</span>
                        </Link>
                        <Link
                          href="/cadastro"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-5 py-3 text-sm text-parthenon-brown hover:bg-parthenon-beige/50 transition-all duration-150 border-t border-gray-mid"
                        >
                          <User className="w-4 h-4" strokeWidth={2} />
                          <span>Criar Conta</span>
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Menu Mobile Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 hover:bg-parthenon-beige rounded-button transition-all duration-300 hover:scale-105 hover:shadow-sm-luxury"
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-parthenon-brown" strokeWidth={2} />
                ) : (
                  <Menu className="w-5 h-5 text-parthenon-brown" strokeWidth={2} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* SEARCH OVERLAY - Bege Linho sofisticado */}
        {searchOverlayOpen && (
          <div className="border-t border-gray-mid bg-parthenon-beige/50 backdrop-blur-md animate-fade-in">
            <div className="container-main w-full px-0">
              <form onSubmit={handleSearch} className="p-4 md:p-5">
                <div className="flex gap-3 items-center">
                  <div className="flex-1 relative">
                    <Input
                      type="search"
                      placeholder="Buscar por tecidos, coleções, características..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      inputSize="md"
                      icon={<Search className="w-4 h-4" />}
                      className="!border-2 !border-parthenon-brown focus:!ring-parthenon-brown focus:!border-parthenon-brown transition-all"
                      autoFocus
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchOverlayOpen(false);
                      setSearchTerm('');
                    }}
                    className="p-2.5 hover:bg-white rounded-button transition-all duration-300 hover:scale-105 flex-shrink-0"
                  >
                    <X className="w-5 h-5 text-parthenon-brown" strokeWidth={2} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* NAVEGAÇÃO - Tablet/Mobile (md:block, lg:hidden) */}
      <nav className="hidden md:block lg:hidden sticky top-20 w-full bg-white border-b border-gray-mid z-30">
        <div className="container-main w-full">
          <div className="flex items-center gap-4 overflow-x-auto h-12 px-0">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-bold uppercase tracking-widest text-parthenon-brown hover:text-parthenon-brown-dark whitespace-nowrap transition-colors duration-300 relative group pb-2 border-b-2 border-transparent hover:border-parthenon-brown"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* MOBILE MENU - Drawer elegante com Playfair Display */}
      {mobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 z-40 lg:hidden" 
            onClick={() => setMobileMenuOpen(false)} 
          />
          <div className="fixed right-0 top-20 h-[calc(100vh-5rem)] w-80 max-w-full bg-white z-50 shadow-lg-luxury overflow-y-auto lg:hidden animate-slide-up">
            
            {/* Busca Mobile */}
            <div className="p-4 border-b border-gray-mid bg-parthenon-beige/40">
              <form onSubmit={handleSearch}>
                <Input
                  type="search"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  inputSize="md"
                  icon={<Search className="w-4 h-4" />}
                  className="!border-2 !border-parthenon-brown"
                />
              </form>
            </div>

            {/* Navegação Mobile */}
            <nav className="flex flex-col p-4 gap-0.5">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-bold text-parthenon-brown rounded-button hover:bg-parthenon-beige/60 transition-all duration-150"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Divisor */}
            <div className="border-t border-gray-mid my-3" />

            {/* User Menu Mobile */}
            <div className="p-4">
              {isAuthenticated ? (
                <>
                  <div className="mb-4 pb-4 border-b border-gray-mid">
                    <p className="text-sm font-bold text-parthenon-brown">{user?.nome}</p>
                    <p className="text-xs text-parthenon-brown-dark font-light mt-1 capitalize">{user?.role === 'vendedor' ? 'Vendedor' : user?.role === 'admin' ? 'Administrador' : 'Cliente'}</p>
                  </div>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-parthenon-brown rounded-button hover:bg-parthenon-beige/60 transition-all duration-150"
                    >
                      <Shield className="w-4 h-4" strokeWidth={2} />
                      <span>Painel Admin</span>
                    </Link>
                  )}

                  <Link
                    href="/meu-perfil"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-parthenon-brown rounded-button hover:bg-parthenon-beige/60 transition-all duration-150"
                  >
                    <User className="w-4 h-4" strokeWidth={2} />
                    <span>Meu Perfil</span>
                  </Link>

                  <Link
                    href="/meus-pedidos"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-parthenon-brown rounded-button hover:bg-parthenon-beige/60 transition-all duration-150"
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
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-parthenon-brown rounded-button hover:bg-parthenon-beige/60 transition-all duration-150 mb-2"
                  >
                    <LogIn className="w-4 h-4" strokeWidth={2} />
                    <span>Entrar</span>
                  </Link>
                  <Link
                    href="/cadastro"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-parthenon-brown rounded-button hover:bg-parthenon-beige/60 transition-all duration-150 border-t border-gray-mid"
                  >
                    <User className="w-4 h-4" strokeWidth={2} />
                    <span>Criar Conta</span>
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
