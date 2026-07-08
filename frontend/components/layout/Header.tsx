'use client';

import Link from 'next/link';
import { Search, ShoppingBag, User, Heart } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-[#e5e5e5] shadow-[0_2px_10px_rgba(0,0,0,0.02)] h-[90px] md:h-[120px] flex items-center">
      {/* A altura agora é fixa e robusta, e o flex items-center alinha tudo no meio verticalmente */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 w-full flex items-center justify-between gap-6">
        
        {/* 1. LOGO (Aumentei drasticamente para preencher a altura) */}
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
          <Link href="/colecao" className="hover:opacity-60 transition-opacity duration-300">
            Coleção
          </Link>
          <Link href="/novidades" className="hover:opacity-60 transition-opacity duration-300">
            Novidades
          </Link>
          <Link href="/promocoes" className="hover:opacity-60 transition-opacity duration-300">
            Promoções
          </Link>
        </nav>

        {/* 3. AÇÕES DO USUÁRIO (Ícones maiores) */}
        <div className="flex items-center gap-4 md:gap-6 lg:gap-8">
          
          {/* Busca */}
          <div className="relative hidden lg:block">
            <input
              type="text"
              placeholder="Buscar tecidos..."
              className="w-40 lg:w-64 border-b border-gray-200 bg-transparent py-2 text-sm font-light tracking-wide outline-none focus:border-[#1a1a1a] transition-all duration-300 placeholder:text-gray-400"
            />
            <Search className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1a1a1a]" strokeWidth={1.5} />
          </div>
          
          {/* Ícone de Busca Mobile */}
          <button className="lg:hidden hover:opacity-60 transition-opacity">
            <Search className="w-6 h-6 text-[#1a1a1a]" strokeWidth={1.5} />
          </button>

          {/* Favoritos */}
          <Link href="/favoritos" className="hover:opacity-60 transition-opacity">
            <Heart className="w-6 h-6 md:w-7 md:h-7 text-[#1a1a1a]" strokeWidth={1.5} />
          </Link>

          {/* Conta / Login */}
          <div className="hidden sm:flex items-center gap-1 text-sm md:text-base font-light text-[#1a1a1a]">
            <User className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
            <span className="flex items-center gap-1">
              <Link href="/login" className="hover:opacity-60 transition-opacity">Entrar</Link>
              <span className="text-gray-300">/</span>
              <Link href="/cadastro" className="hover:opacity-60 transition-opacity">Cadastre-se</Link>
            </span>
          </div>
          <Link href="/login" className="sm:hidden hover:opacity-60 transition-opacity">
             <User className="w-6 h-6 text-[#1a1a1a]" strokeWidth={1.5} />
          </Link>

          {/* Carrinho */}
          <Link href="/carrinho" className="relative hover:opacity-60 transition-opacity">
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