'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import SearchBar from '@/components/SearchBar';
import FiltersSidebar from '@/components/FiltersSidebar';
import ProductCard from '@/components/ui/ProductCard';
import HomeBanner from '@/components/HomeBanner';
import TrendingBar from '@/components/TrendingBar';

// ... interfaces ...

export default function Home() {
  // ... estados ...

  // --- REMOVEMOS O BLOCO `if (carregando)` DO TOPO ---
  // O carregamento será tratado diretamente dentro do return.

  return (
    <>
      {/* 1. O Banner SEMPRE será renderizado primeiro */}
      <HomeBanner />

      {/* 2. Agora verificamos o estado de carregamento */}
      {carregando ? (
        // Estado de carregamento: apenas o spinner centralizado, com altura mínima para ocupar o espaço da grade
        <div className="w-full bg-[#F7F7F7] py-24 md:py-32">
          <div className="main-container flex justify-center items-center min-h-[400px]">
            <div className="w-12 h-12 border-4 border-[#e8e3dc] border-t-[#C5A880] rounded-full animate-spin" />
          </div>
        </div>
      ) : (
        // 3. Conteúdo normal (exibido apenas quando os dados carregarem)
        <section className="w-full bg-[#F7F7F7] mt-24 md:mt-32 py-24 md:py-32">
          <div className="main-container">
            {/* ... estrutura de FiltersSidebar, TrendingBar, Grid, etc. ... */}
            <div className="flex flex-col md:flex-row gap-8">
              <aside className="hidden md:block w-64 flex-shrink-0">
                <FiltersSidebar
                  precoMin={precoMin}
                  precoMax={precoMax}
                  precoMaxGlobal={precoMaxGlobal}
                  categorias={categorias}
                  categoriasSelecionadas={categoriasSelecionadas}
                  onPrecoChange={(min, max) => {
                    setPrecoMin(min);
                    setPrecoMax(max);
                    setPagina(1);
                  }}
                  onCategoriaChange={catId => {
                    setCategoriasSelecionadas(prev =>
                      prev.includes(catId)
                        ? prev.filter(c => c !== catId)
                        : [...prev, catId]
                    );
                    setPagina(1);
                  }}
                  limparFiltros={limparFiltros}
                />
              </aside>

              <div className="flex-1">
                <div className="mb-16">
                  <TrendingBar />
                </div>

                <div className="text-center mb-12 md:mb-16">
                  <h2 className="font-serif font-light text-3xl md:text-4xl text-[#1a1a1a]">
                    Nossa Coleção
                  </h2>
                  <p className="text-[#4a4a4a] font-medium text-sm mt-2 tracking-wide">
                    Explore nossos tecidos
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div className="w-full sm:max-w-md">
                    <SearchBar value={busca} onChange={setBusca} />
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-[#8a7a6a] font-light whitespace-nowrap">
                      {produtosFiltrados.length} produto(s)
                    </p>
                    <select
                      value={ordenacao}
                      onChange={e => {
                        setOrdenacao(e.target.value);
                        setPagina(1);
                      }}
                      className="border border-[#e8e3dc] rounded-lg px-3 py-2 text-sm bg-white text-[#1a1a1a] font-light focus:outline-none focus:ring-1 focus:ring-[#c9a96e]"
                    >
                      <option value="">Mais relevantes</option>
                      <option value="menor-preco">Menor Preço</option>
                      <option value="maior-preco">Maior Preço</option>
                      <option value="nome">Nome (A-Z)</option>
                    </select>
                  </div>
                </div>

                {produtosFiltrados.length === 0 ? (
                  <div className="text-center py-12 bg-white/60 rounded-2xl">
                    <p className="text-[#8a7a6a] font-light">Nenhum produto encontrado.</p>
                    <button
                      onClick={limparFiltros}
                      className="mt-2 text-sm text-[#1a1a1a] hover:underline font-light"
                    >
                      Limpar filtros
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                      {paginaAtual.map(produto => (
                        <ProductCard key={produto._id} produto={produto} />
                      ))}
                    </div>
                    {totalPaginas > 1 && (
                      <div className="mt-12 flex items-center justify-center gap-2">
                        {/* ... paginação ... */}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ... demais seções (Qualidades, Filtro Mobile) ... */}
      {/* Eles permanecem aqui fora do carregamento, pois são estáticos */}
      <section className="mt-24 md:mt-32 py-24 md:py-32 border-t border-[#e8e3dc]">
        <div className="main-container">
          <div className="grid md:grid-cols-3 gap-12 md:gap-20 text-center">
            {/* ... conteúdo das qualidades ... */}
          </div>
        </div>
      </section>

      {/* ... filtro mobile ... */}
    </>
  );
}