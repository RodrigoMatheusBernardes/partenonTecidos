'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import CartDrawer from '@/components/CartDrawer';
import {
  Search, ShoppingBag, User, Heart, LogOut, Package, LayoutDashboard, Menu, X, ChevronDown
} from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const { totalItems } = useCart();
  const { isAuthenticated, isAdmin, logout, user } = useAuth();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchDrawerOpen, setSearchDrawerOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
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
      setSearchDrawerOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    setMobileMenuOpen(false);
    router.push('/');
  };

  const getPedidosLabel = () => {
    if (!user) return 'Meus Pedidos';
    if (user.role === 'admin') return 'Gerenciar Pedidos';
    if (user.role === 'vendedor') return 'Pedidos dos Vendedores';
    return 'Meus Pedidos';
  };

  const getPedidosLink = () => {
    if (!user) return '/meus-pedidos';
    if (user.role === 'admin') return '/admin/pedidos';
    if (user.role === 'vendedor') return '/meus-pedidos';
    return '/meus-pedidos';
  };

  const navLinks = [
    { href: '/loja', label: 'Coleção' },
    { href: '/novidades', label: 'Novidades' },
    { href: '/promocoes', label: 'Promoções' },
  ];

  return (
    <>
      {/* HEADER PRINCIPAL */}
      <header className="
        sticky top-0 w-full bg-white z-50
        border-b border-gray-200
        shadow-[0_2px_8px_rgba(0,0,0,0.04)]
      ">
        <div className="container-main w-full">
          <div className="flex items-center justify-between h-20 md:h-24 px-0">

            {/* LOGO */}
            <Link 
              href="/" 
              className="
                flex items-center gap-0.5 shrink-0
                hover:opacity-75 transition-opacity duration-300
              "
              aria-label="Voltar para home"
            >
              <div className="flex flex-col leading-none">
                <span className="
                  text-2xl md:text-4xl font-serif font-bold
                  tracking-tight text-dark-light
                ">
                  PARTHENON
                </span>
                <span className="
                  text-xs md:text-sm font-serif font-light
                  tracking-[0.15em] text-text-light
                ">
                  TECIDOS
                </span>
              </div>
            </Link>

            {/* MENU DE NAVEGAÇÃO (Desktop) */}
            <nav className="
              hidden lg:flex items-center gap-2 ml-16 flex-1
            ">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="
                    px-4 py-2 text-xs font-semibold uppercase tracking-widest
                    text-dark-light relative
                    hover:text-gold transition-colors duration-300
                    after:absolute after:bottom-0 after:left-0 after:h-0.5
                    after:bg-gold after:w-0 hover:after:w-full
                    after:transition-all after:duration-300
                  "
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* AÇÕES DO HEADER */}
            <div className="flex items-center gap-1 md:gap-2 shrink-0">

              {/* SEARCH (Desktop) */}
              <button
                onClick={() => setSearchDrawerOpen(true)}
                className="
                  hidden sm:flex items-center justify-center
                  p-2.5 md:p-3 rounded-button
                  text-dark-light hover:text-gold
                  hover:bg-light transition-all duration-300
                  focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2
                "
                aria-label="Abrir barra de pesquisa"
              >
                <Search className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
              </button>

              {/* SEARCH (Mobile) */}
              <button
                onClick={() => setSearchDrawerOpen(true)}
                className="
                  sm:hidden p-2.5 rounded-button
                  text-dark-light hover:text-gold
                  hover:bg-light transition-all duration-300
                  focus:outline-none focus:ring-2 focus:ring-gold
                "
                aria-label="Buscar produtos"
              >
                <Search className="w-5 h-5" strokeWidth={2} />
              </button>

              {/* FAVORITOS */}
              <Link 
                href="/favoritos" 
                className="
                  p-2.5 md:p-3 rounded-button
                  text-dark-light hover:text-gold hover:bg-light
                  transition-all duration-300
                  focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2
                "
                aria-label="Ir para favoritos"
              >
                <Heart className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
              </Link>

              {/* CARRINHO */}
              <button
                onClick={() => setCartOpen(true)}
                className="
                  relative p-2.5 md:p-3 rounded-button
                  text-dark-light hover:text-gold hover:bg-light
                  transition-all duration-300
                  focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2
                "
                aria-label="Abrir carrinho"
              >
                <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
                {totalItems > 0 && (
                  <span className="
                    absolute -top-1 -right-1 w-5 h-5 rounded-full
                    bg-gold text-dark-light text-xs font-bold
                    flex items-center justify-center
                  ">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </button>

              {/* DROPDOWN DO USUÁRIO */}
              <div className="relative hidden md:block" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="
                    p-2.5 md:p-3 rounded-button
                    text-dark-light hover:text-gold hover:bg-light
                    transition-all duration-300
                    focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2
                  "
                  aria-label="Menu do usuário"
                  aria-expanded={isDropdownOpen}
                >
                  <User className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
                </button>

                {isDropdownOpen && (
                  <div className="
                    absolute right-0 top-full mt-1 w-64
                    bg-white rounded-lg
                    shadow-lg border border-gray-100
                    py-1 z-50 animate-fade-in
                  ">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-4 border-b border-gray-100">
                          <p className="text-sm font-semibold text-dark-light truncate">{user?.nome}</p>
                          <p className="text-xs text-text-light capitalize font-medium mt-0.5">{user?.role}</p>
                        </div>

                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setIsDropdownOpen(false)}
                            className="
                              flex items-center gap-3 px-4 py-3
                              text-sm text-dark-light font-medium
                              hover:bg-light transition-colors
                            "
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Painel Admin
                          </Link>
                        )}

                        <Link
                          href="/meu-perfil"
                          onClick={() => setIsDropdownOpen(false)}
                          className="
                            flex items-center gap-3 px-4 py-3
                            text-sm text-dark-light font-medium
                            hover:bg-light transition-colors
                          "
                        >
                          <User className="w-4 h-4" />
                          Meu Perfil
                        </Link>

                        <Link
                          href={getPedidosLink()}
                          onClick={() => setIsDropdownOpen(false)}
                          className="
                            flex items-center gap-3 px-4 py-3
                            text-sm text-dark-light font-medium
                            hover:bg-light transition-colors
                          "
                        >
                          <Package className="w-4 h-4" />
                          {getPedidosLabel()}
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="
                            w-full flex items-center gap-3 px-4 py-3
                            text-sm text-dark-light font-medium
                            hover:bg-light transition-colors border-t border-gray-100
                          "
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          onClick={() => setIsDropdownOpen(false)}
                          className="
                            block px-4 py-3 text-sm text-dark-light font-medium
                            hover:bg-light transition-colors
                          "
                        >
                          Login
                        </Link>
                        <Link
                          href="/cadastro"
                          onClick={() => setIsDropdownOpen(false)}
                          className="
                            block px-4 py-3 text-sm text-dark-light font-medium
                            hover:bg-light transition-colors border-t border-gray-100
                          "
                        >
                          Cadastro
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* MENU MOBILE */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="
                  md:hidden p-2.5 rounded-button
                  text-dark-light hover:text-gold hover:bg-light
                  transition-all duration-300
                  focus:outline-none focus:ring-2 focus:ring-gold
                "
                aria-label="Menu mobile"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" strokeWidth={2} />
                ) : (
                  <Menu className="w-6 h-6" strokeWidth={2} />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-30 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed right-0 top-20 h-[calc(100vh-5rem)] w-80 max-w-full bg-white z-40 shadow-lg-luxury overflow-y-auto md:hidden">
            <nav className="flex flex-col p-6 gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="
                    px-4 py-3 text-sm font-medium text-dark-light
                    rounded-button hover:bg-light transition-colors
                  "
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-gray-200 my-4 pt-4">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-3 mb-2">
                      <p className="text-sm font-semibold text-dark-light">{user?.nome}</p>
                      <p className="text-xs text-text-light capitalize">{user?.role}</p>
                    </div>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="
                          flex items-center gap-3 px-4 py-3
                          text-sm text-dark-light rounded-button
                          hover:bg-light transition-colors
                        "
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Painel Admin
                      </Link>
                    )}

                    <Link
                      href="/meu-perfil"
                      onClick={() => setMobileMenuOpen(false)}
                      className="
                        flex items-center gap-3 px-4 py-3
                        text-sm text-dark-light rounded-button
                        hover:bg-light transition-colors
                      "
                    >
                      <User className="w-4 h-4" />
                      Meu Perfil
                    </Link>

                    <Link
                      href={getPedidosLink()}
                      onClick={() => setMobileMenuOpen(false)}
                      className="
                        flex items-center gap-3 px-4 py-3
                        text-sm text-dark-light rounded-button
                        hover:bg-light transition-colors
                      "
                    >
                      <Package className="w-4 h-4" />
                      {getPedidosLabel()}
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="
                        w-full flex items-center gap-3 px-4 py-3
                        text-sm text-dark-light rounded-button
                        hover:bg-light transition-colors
                      "
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="
                        block px-4 py-3 text-sm text-dark-light
                        rounded-button hover:bg-light transition-colors
                      "
                    >
                      Login
                    </Link>
                    <Link
                      href="/cadastro"
                      onClick={() => setMobileMenuOpen(false)}
                      className="
                        block px-4 py-3 text-sm text-dark-light
                        rounded-button hover:bg-light transition-colors
                      "
                    >
                      Cadastro
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </>
      )}

      {/* SEARCH DRAWER */}
      {searchDrawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setSearchDrawerOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-32 px-4 md:pt-40">
            <div className="w-full max-w-2xl animate-fade-in">
              <form onSubmit={handleSearch} className="w-full">
                <div className="
                  flex items-center gap-3 bg-white rounded-lg
                  px-5 py-4 shadow-xl-luxury
                  border-2 border-gold
                ">
                  <Search className="w-6 h-6 text-gold flex-shrink-0" strokeWidth={2} />
                  <input
                    type="text"
                    placeholder="Buscar tecidos, coleções, características..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                    className="
                      flex-1 bg-transparent
                      text-lg font-medium
                      outline-none placeholder:text-text-light
                    "
                  />
                  <button
                    type="button"
                    onClick={() => setSearchDrawerOpen(false)}
                    className="
                      text-text-light hover:text-dark-light
                      transition-colors
                    "
                    aria-label="Fechar busca"
                  >
                    <X className="w-6 h-6" strokeWidth={2} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* CARRINHO DRAWER */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}