'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, User, Heart, LogOut, Package, LayoutDashboard } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function Header() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Simulação de dados do usuário (SUBSTITUA ISSO PELA SUA LÓGICA DE AUTENTICAÇÃO REAL)
  const [user, setUser] = useState<{ nome: string; role: 'admin' | 'vendedor' | 'cliente' } | null>(null);

  // Exemplo: Descomente isso se você tiver um contexto de autenticação
  // const { user } = useAuth(); 

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

  // Função de Busca (Redireciona para a página de resultados)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/busca?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  // Função de Logout
  const handleLogout = () => {
    // Lógica de logout aqui (ex: localStorage.removeItem('token'))
    setUser(null);
    setIsDropdownOpen(false);
    router.push('/');
  };

  // Determina o texto do menu "Meus Pedidos" baseado na role
  const getPedidosLabel = () => {
    if (!user) return 'Meus Pedidos';
    if (user.role === 'admin') return 'Gerenciar Pedidos';
    if (user.role === 'vendedor') return 'Pedidos dos Vendedores';
    return 'Meus Pedidos';
  };

  // Determina o link do menu "Meus Pedidos"
  const getPedidosLink = () => {
    if (!user) return '/pedidos';
    if (user.role === 'admin') return '/admin/pedidos';
    if (user.role === 'vendedor') return '/vendedor/pedidos';
    return '/pedidos';
  };

  // Link do Painel Admin (se for admin)
  const getAdminLink = () => {
    if (user?.role === 'admin') return '/admin';
    return null;
  };

  return (
    <header className="w-full bg-white border-b border-[#e5e5e5] shadow-[0_2px_10px_rgba(0,0,0,0.02)] h-[90px] md:h-[120px] flex items-center relative z-50">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 w-full flex items-center justify-between gap-6">
        
        {/* 1. LOGO */}
        <Link href="/" className="flex items-end gap-1 shrink-0">
          <span className="text-4xl md:text-5xl font-serif font-medium tracking-wider text-[#1a1a1a]">PARTHENON</span>
          <span className="text-4xl md:text-5xl font-light tracking-widest text-[#666]">TECIDOS</span>
        </Link>

        {/* 2. MENU DE NAVEGAÇÃO */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-14 text-sm md:text-base font-medium uppercase tracking-[0.2em] text-[#1a1a1a]">
          <Link href="/colecao" className="hover:opacity-60 transition-opacity duration-300">Coleção</Link>
          <Link href="/novidades" className="hover:opacity-60 transition-opacity duration-300">Novidades</Link>
          <Link href="/promocoes" className="hover:opacity-60 transition-opacity duration-300">Promoções</Link>
        </nav>

        {/* 3. AÇÕES DO USUÁRIO (Busca, Ícones e Login) */}
        <div className="flex items-center gap-3 md:gap-5 shrink-0">
          
          {/* 🔍 BARRA DE PESQUISA FUNCIONAL */}
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

          {/* 🔍 Ícone de Busca (Mobile) */}
          <button className="lg:hidden hover:opacity-60 transition-opacity duration-300">
            <Search className="w-6 h-6 text-[#1a1a1a]" strokeWidth={1.5} />
          </button>

          {/* ♡ FAVORITOS */}
          <Link href="/favoritos" className="hover:opacity-60 transition-opacity duration-300">
            <Heart className="w-6 h-6 md:w-7 md:h-7 text-[#1a1a1a]" strokeWidth={1.5} />
          </Link>

          {/* 👤 LOGIN / DROPDOWN */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="hover:opacity-60 transition-opacity duration-300 flex items-center gap-1"
            >
              <User className="w-6 h-6 md:w-7 md:h-7 text-[#1a1a1a]" strokeWidth={1.5} />
            </button>

            {/* Menu Dropdown */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-4 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                {user ? (
                  <>
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-[#1a1a1a]">Olá, {user.nome}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                    
                    {getAdminLink() && (
                      <Link href={getAdminLink()!} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                        <LayoutDashboard className="w-4 h-4" /> Painel Admin
                      </Link>
                    )}

                    <Link href={getPedidosLink()} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                      <Package className="w-4 h-4" /> {getPedidosLabel()}
                    </Link>

                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition w-full text-left">
                      <LogOut className="w-4 h-4" /> Sair
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                      Entrar
                    </Link>
                    <Link href="/cadastro" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                      Cadastre-se
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* 🛒 CARRINHO */}
          <Link href="/carrinho" className="relative hover:opacity-60 transition-opacity duration-300">
            <ShoppingBag className="w-6 h-6 md:w-7 md:h-7 text-[#1a1a1a]" strokeWidth={1.5} />
            <span className="absolute -top-1 -right-1 bg-[#1a1a1a] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
              0
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}