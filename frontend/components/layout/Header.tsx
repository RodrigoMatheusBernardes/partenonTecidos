'use client';

import Link from 'next/link';
import { Search, ShoppingBag, User, Heart } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-[#e5e5e5] shadow-[0_2px_10px_rgba(0,0,0,0.02)] h-[90px] md:h-[120px] flex items-center">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 w-full flex items-center justify-between gap-6">
        
        {/* 1. LOGO */}
        <Link href="/" className="flex items-end gap-1 shrink-0">
          <span className="text-4xl md:text-5xl font-serif font-medium tracking-wider text-[#1a1a1a]">
            PARTHENON
          </span>
          <span className="text-4xl md:text-5xl font-light tracking-widest text-[#666]">
            TECIDOS
          </span>
        </Link>

        {/* 2. MENU DE NAVEGAÇÃO */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-14 text-sm md:text-base font-medium uppercase tracking-[0.2em] text-[#1a1a1a]">
          <Link href="/colecao" className="hover:opacity-60 transition-opacity duration-300">Coleção</Link>
          <Link href="/novidades" className="hover:opacity-60 transition-opacity duration-300">Novidades</Link>
          <Link href="/promocoes" className="hover:opacity-60 transition-opacity duration-300">Promoções</Link>
        </nav>

        {/* 3. TODOS OS ÍCONES EM EXIBIÇÃO (Sem esconder nada) */}
        <div className="flex items-center gap-4 md:gap-6 shrink-0">
          
          {/* Botão de Busca (Sempre visível) */}
          <button className="hover:opacity-60 transition-opacity duration-300">
            <Search className="w-6 h-6 md:w-7 md:h-7 text-[#1a1a1a]" strokeWidth={1.5} />
          </button>

          {/* Botão de Favoritos (Sempre visível) */}
          <Link href="/favoritos" className="hover:opacity-60 transition-opacity duration-300">
            <Heart className="w-6 h-6 md:w-7 md:h-7 text-[#1a1a1a]" strokeWidth={1.5} />
          </Link>

          {/* Botão de Login / Conta (Sempre visível) */}
          <Link href="/login" className="hover:opacity-60 transition-opacity duration-300">
            <User className="w-6 h-6 md:w-7 md:h-7 text-[#1a1a1a]" strokeWidth={1.5} />
          </Link>

          {/* Botão do Carrinho (Sempre visível) */}
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