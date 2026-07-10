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
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
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
      setSearchOpen(false);
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

  return (
    <>
      {/* HEADER PRINCIPAL */}
      <header className="
        w-full bg-white
        border-b border-gray-mid
        shadow-sm-luxury
        h-auto md:h-[120px]
        flex items-center relative z-50
      ">
        <div className="container-main w-full flex items-center justify-between gap-4 md:gap-6 py-4 md:py-0">

          {/* LOGO */}
          <Link 
            href="/" 
            className="
              flex items-end gap-1 shrink-0
              hover:opacity-70 transition-opacity duration-300
            "
            aria-label="Voltar para home"
          >
            <span className="
              text-3xl md:text-5xl font-serif font-semibold
              tracking-wider text-dark-light
            ">
              PARTHENON
            </span>
            <span className="
              text-2xl md:text-4xl font-serif font-light
              tracking-widest text-text-light
            ">
              TECIDOS
            </span>
          </Link>

          {/* MENU DE NAVEGAÇÃO (Desktop) */}
          <nav className="
            hidden md:flex items-center gap-8 lg:gap-14
            text-xs lg:text-sm font-semibold uppercase
            tracking-[0.2em] text-dark-light
            flex-1 justify-center ml-8
          ">
            <Link href="/loja" className="hover:text-gold transition-colors duration-300">
              Coleção
            </Link>
            <Link href="/novidades" className="hover:text-gold transition-colors duration-300">
              Novidades
            </Link>
            <Link href="/promocoes" className="hover:text-gold transition-colors duration-300">
              Promoções
            </Link>
          </nav>

          {/* AÇÕES DO HEADER */}
          <div className="flex items-center gap-3 md:gap-5 shrink-0">

            {/* SEARCH BAR COM ANIMAÇÃO */}
            <div ref={searchRef} className="relative hidden sm:block">
              {!searchOpen ? (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="
                    p-2 hover:text-gold
                    transition-colors duration-300
                    focus:outline-none focus:ring-2 focus:ring-gold
                    rounded-button
                  "
                  aria-label="Abrir barra de pesquisa"
                >
                  <Search className="w-5 h-5 md:w-6 md:h-6 text-dark-light" strokeWidth={2} />
                </button>
              ) : (
                <form 
                  onSubmit={handleSearch}
                  className="
                    absolute right-0 top-1/2 -translate-y-1/2
                    animate-slide-up
                  "
                >
                  <div className="
                    flex items-center gap-2
                    border-b border-dark-light
                    bg-white
                    rounded-button
                  ">
                    <input
                      type="text"
                      placeholder="Buscar..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      autoFocus
                      className="
                        bg-transparent px-4 py-2
                        text-sm font-medium
                        outline-none placeholder:text-text-light
                        w-40 md:w-56
                      "
                    />
                    <button
                      type="submit"
                      className="
                        p-2 text-dark-light hover:text-gold
                        transition-colors duration-300
                      "
                      aria-label="Pesquisar"
                    >
                      <Search className="w-4 h-4" strokeWidth={2} />
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* SEARCH ICON MOBILE */}
            <button
              onClick={() => setSearchOpen(true)}
              className="
                sm:hidden p-2 hover:text-gold
                transition-colors duration-300
                focus:outline-none focus:ring-2 focus:ring-gold
                rounded-button
              "
              aria-label="Abrir barra de pesquisa"
            >
              <Search className="w-5 h-5 text-dark-light" strokeWidth={2} />
            </button>

            {/* FAVORITOS */}
            <Link 
              href="/favoritos" 
              className="
                p-2 hover:text-gold
                transition-colors duration-300
                focus:outline-none focus:ring-2 focus:ring-gold
                rounded-button
              "
              aria-label="Acessar favoritos"
            >
              <Heart className="w-5 h-5 md:w-6 md:h-6 text-dark-light" strokeWidth={2} />
            </Link>

            {/* DROPDOWN DO USUÁRIO */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="
                  p-2 hover:text-gold
                  transition-colors duration-300
                  focus:outline-none focus:ring-2 focus:ring-gold
                  rounded-button
                "
                aria-label="Menu do usuário"
                aria-expanded={isDropdownOpen}
              >
                <User className="w-5 h-5 md:w-6 md:h-6 text-dark-light" strokeWidth={2} />
              </button>

              {isDropdownOpen && (
                <div className="
                  absolute right-0 top-full mt-2 w-56
                  bg-white rounded-card
                  shadow-lg-luxury border border-gray-mid
                  py-2 z-50
                  animate-slide-up
                ">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-mid">
                        <p className="text-sm font-semibold text-dark-light">{user?.nome}</p>
                        <p className="text-xs text-text-light capitalize font-medium">{user?.role}</p>
                      </div>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="
                            flex items-center gap-3 px-4 py-3
                            text-sm text-dark-light font-medium
                            hover:bg-light-mid transition-colors
                          "
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" /> Painel Admin
                        </Link>
                      )}

                      <Link
                        href={getPedidosLink()}
                        className="
                          flex items-center gap-3 px-4 py-3
                          text-sm text-dark-light font-medium
                          hover:bg-light-mid transition-colors
                        "
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Package className="w-4 h-4" /> {getPedidosLabel()}
                      </Link>

                      <Link
                        href="/meu-perfil"
                        className="
                          flex items-center gap-3 px-4 py-3
                          text-sm text-dark-light font-medium
                          hover:bg-light-mid transition-colors
                        "
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User className="w-4 h-4" /> Meu Perfil
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="
                          w-full flex items-center gap-3 px-4 py-3
                          text-sm text-error font-medium
                          hover:bg-red-50 transition-colors text-left
                        "
                      >
                        <LogOut className="w-4 h-4" /> Sair
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="
                          block px-4 py-3 text-sm text-dark-light font-medium
                          hover:bg-light-mid transition-colors
                        "
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Entrar
                      </Link>
                      <Link
                        href="/cadastro"
                        className="
                          block px-4 py-3 text-sm text-dark-light font-medium
                          hover:bg-light-mid transition-colors
                        "
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Cadastre-se
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* CARRINHO */}
            <button
              onClick={() => setCartOpen(true)}
              className="
                relative p-2 hover:text-gold
                transition-colors duration-300
                focus:outline-none focus:ring-2 focus:ring-gold
                rounded-button
              "
              aria-label={`Carrinho com ${totalItems} itens`}
            >
              <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-dark-light" strokeWidth={2} />
              {totalItems > 0 && (
                <span className="
                  absolute -top-1 -right-1
                  bg-error text-white text-[10px] font-bold
                  w-5 h-5 rounded-full
                  flex items-center justify-center
                ">
                  {totalItems}
                </span>
              )}
            </button>

            {/* MENU MOBILE */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="
                md:hidden p-2 hover:text-gold
                transition-colors duration-300
                focus:outline-none focus:ring-2 focus:ring-gold
                rounded-button
              "
              aria-label="Abrir menu"
            >
              <Menu className="w-5 h-5 text-dark-light" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* SEARCH BAR MOBILE EXPANDIDA */}
        {searchOpen && (
          <div className="
            w-full border-t border-gray-mid
            bg-white px-4 md:px-0 md:hidden
            animate-slide-down
          ">
            <form onSubmit={handleSearch} className="flex items-center gap-3 py-4 container-main">
              <input
                type="text"
                placeholder="Buscar tecidos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                className="
                  flex-1 bg-light rounded-button px-4 py-2
                  text-sm font-medium outline-none
                  focus:ring-2 focus:ring-gold
                  placeholder:text-text-light
                "
              />
              <button
                type="submit"
                className="
                  p-2 text-dark-light hover:text-gold
                  transition-colors duration-300
                "
              >
                <Search className="w-5 h-5" strokeWidth={2} />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* MENU MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      <div
        className={`
          fixed top-0 left-0 h-full w-72 bg-white
          shadow-xl-luxury z-50 p-6 md:hidden
          transform transition-transform duration-300
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-serif text-2xl text-dark-light">Menu</h2>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1 hover:text-gold transition-colors"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        <nav className="flex flex-col gap-6 text-sm font-semibold uppercase tracking-[0.1em] text-dark-light">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-gold transition-colors"
          >
            Home
          </Link>
          <Link
            href="/loja"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-gold transition-colors"
          >
            Coleção
          </Link>
          <Link
            href="/novidades"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-gold transition-colors"
          >
            Novidades
          </Link>
          <Link
            href="/promocoes"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-gold transition-colors"
          >
            Promoções
          </Link>
          <Link
            href="/favoritos"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-gold transition-colors"
          >
            Favoritos
          </Link>

          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-gold transition-colors"
                >
                  Painel Admin
                </Link>
              )}
              <Link
                href="/meus-pedidos"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-gold transition-colors"
              >
                Meus Pedidos
              </Link>
              <Link
                href="/meu-perfil"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-gold transition-colors"
              >
                Meu Perfil
              </Link>
              <button
                onClick={handleLogout}
                className="text-left text-error font-semibold hover:text-red-700 transition-colors"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-gold transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/cadastro"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-gold transition-colors"
              >
                Cadastre-se
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* CARRINHO DRAWER */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}