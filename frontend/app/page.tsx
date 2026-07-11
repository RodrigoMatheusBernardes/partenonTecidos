'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import SearchBar from '@/components/SearchBar';
import FiltersSidebar from '@/components/FiltersSidebar';
import { SkeletonProduct } from '@/components/Skeleton';
import ProductCard from '@/components/ui/ProductCard';
import HomeBanner from '@/components/HomeBanner';
import TrendingBar from '@/components/TrendingBar';
import { SlidersHorizontal, Package, Truck, Headphones } from 'lucide-react';

interface Categoria { _id: string; nome: string; }
interface Produto {
  _id: string;
  nome: string;
  preco: number;
  fotos: string[];
  imagemUrl?: string;
  disponivel: number;
  estoque?: number;
  categoria?: Categoria | string;
  preco_original?: number;
}

export default function Home() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const [busca, setBusca] = useState('');
  const [precoMin, setPrecoMin] = useState(0);
  const [precoMax, setPrecoMax] = useState(1000);
  const [precoMaxGlobal, setPrecoMaxGlobal] = useState(1000);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<string[]>([]);
  const [ordenacao, setOrdenacao] = useState('');
  const [pagina, setPagina] = useState(1);
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const ITENS_POR_PAGINA = 12;

  const removerAcentos = (texto: string) =>
    texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  useEffect(() => {
    const apiUrl = getApiUrl();
    Promise.all([
      axios.get(`${apiUrl}/api/produtos/vitrine`),
      axios.get(`${apiUrl}/api/categorias`),
    ])
      .then(([resProdutos, resCategorias]) => {
        const data = resProdutos.data;
        const prods = Array.isArray(data) ? data : [];
        setProdutos(prods);
        const maxPreco = prods.length > 0 ? Math.max(...prods.map((p: Produto) => p.preco), 100) : 1000;
        setPrecoMaxGlobal(maxPreco);
        setPrecoMax(maxPreco);
        setCategorias(Array.isArray(resCategorias.data) ? resCategorias.data : []);
      })
      .catch(err => {
        console.error(err);
        setErro('Erro ao carregar produtos.');
      })
      .finally(() => setCarregando(false));
  }, []);

  const filtrar = (lista: Produto[]) =>
    lista.filter(p => {
      if (busca.trim()) {
        const termo = removerAcentos(busca.toLowerCase());
        if (!removerAcentos(p.nome.toLowerCase()).includes(termo)) return false;
      }
      if (p.preco < precoMin || p.preco > precoMax) return false;
      if (categoriasSelecionadas.length) {
        const idCat = typeof p.categoria === 'object' ? p.categoria?._id : p.categoria;
        if (!idCat || !categoriasSelecionadas.includes(idCat.toString())) return false;
      }
      return true;
    });

  const ordenar = (lista: Produto[]) => {
    const copia = [...lista];
    if (ordenacao === 'menor-preco') copia.sort((a, b) => a.preco - b.preco);
    else if (ordenacao === 'maior-preco') copia.sort((a, b) => b.preco - a.preco);
    else if (ordenacao === 'nome') copia.sort((a, b) => a.nome.localeCompare(b.nome));
    return copia;
  };

  const produtosFiltrados = ordenar(filtrar(produtos));
  const totalPaginas = Math.ceil(produtosFiltrados.length / ITENS_POR_PAGINA);
  const paginaAtual = produtosFiltrados.slice(
    (pagina - 1) * ITENS_POR_PAGINA,
    pagina * ITENS_POR_PAGINA
  );

  const limparFiltros = () => {
    setBusca('');
    setPrecoMin(0);
    setPrecoMax(precoMaxGlobal);
    setCategoriasSelecionadas([]);
    setOrdenacao('');
    setPagina(1);
  };

  const handlePrecoChange = (min: number, max: number) => { setPrecoMin(min); setPrecoMax(max); setPagina(1); };
  const handleCategoriaChange = (catId: string) => {
    setCategoriasSelecionadas(prev =>
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
    setPagina(1);
  };

  if (erro) return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-error font-medium">{erro}</p>
    </main>
  );

  return (
    <>
      {/* BANNER */}
      <HomeBanner />

      {/* TRENDING */}
      <TrendingBar />

      {/* SEÇÃO COLEÇÃO */}
      <main className="container-main py-16 md:py-28">
        {/* BACKGROUND REFINADO */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute inset-0 bg-gradient-to-b from-gold/3 via-transparent to-light/20" />
        </div>

        <div className="relative z-10">
          {/* TÍTULO COM DIVIDER VISUAL */}
          <div className="text-center mb-14 md:mb-20">
            <div className="flex items-center justify-center gap-4 mb-5">
              <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-gold" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                Excelência em Tecidos
              </span>
              <div className="h-0.5 w-12 bg-gradient-to-l from-transparent to-gold" />
            </div>
            <h2 className="font-serif font-bold text-4xl md:text-6xl text-dark-light tracking-tight leading-tight mb-4">
              Nossa Coleção Premium
            </h2>
            <p className="text-text-secondary text-base md:text-lg font-light max-w-2xl mx-auto">
              Explore nossa seleção refinada de tecidos de alta qualidade, escolhidos com excelência para elevar seus projetos
            </p>
          </div>

          <div className="flex gap-8 lg:gap-12">

            {/* FILTRO DESKTOP */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-28 bg-white rounded-card shadow-sm-luxury border border-gray-mid p-6 backdrop-blur-sm">
                <FiltersSidebar
                  precoMin={precoMin}
                  precoMax={precoMax}
                  precoMaxGlobal={precoMaxGlobal}
                  categorias={categorias}
                  categoriasSelecionadas={categoriasSelecionadas}
                  onPrecoChange={handlePrecoChange}
                  onCategoriaChange={handleCategoriaChange}
                  limparFiltros={limparFiltros}
                />
              </div>
            </aside>

            {/* CONTEÚDO PRINCIPAL */}
            <div className="flex-1 min-w-0">

              {/* BARRA DE CONTROLES */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 md:mb-10">
                <div className="w-full sm:max-w-xs">
                  <SearchBar value={busca} onChange={v => { setBusca(v); setPagina(1); }} />
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* Botão Filtro Mobile */}
                  <button
                    onClick={() => setSidebarAberta(true)}
                    className="
                      lg:hidden flex items-center gap-2
                      px-4 py-3
                      border-2 border-gray-mid rounded-button
                      text-sm font-semibold text-dark-light
                      bg-white hover:bg-light hover:border-dark-light
                      transition-all duration-300
                      focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2
                    "
                  >
                    <SlidersHorizontal className="w-4 h-4" strokeWidth={2} />
                    Filtros
                    {(categoriasSelecionadas.length > 0 || precoMin > 0 || precoMax < precoMaxGlobal) && (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gold text-dark-light text-xs font-bold ml-1">
                        {categoriasSelecionadas.length + (precoMin > 0 || precoMax < precoMaxGlobal ? 1 : 0)}
                      </span>
                    )}
                  </button>

                  <p className="text-sm text-text-secondary font-medium whitespace-nowrap">
                    <span className="font-bold text-dark-light">{produtosFiltrados.length}</span> produto{produtosFiltrados.length !== 1 ? 's' : ''}
                  </p>

                  <select
                    value={ordenacao}
                    onChange={e => { setOrdenacao(e.target.value); setPagina(1); }}
                    className="
                      border-2 border-gray-mid rounded-button
                      px-4 py-3 text-sm font-medium
                      bg-white text-dark-light
                      focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2
                      transition-all duration-300 cursor-pointer
                    "
                  >
                    <option value="">Mais relevantes</option>
                    <option value="menor-preco">Menor Preço</option>
                    <option value="maior-preco">Maior Preço</option>
                    <option value="nome">Nome (A-Z)</option>
                  </select>
                </div>
              </div>

              {/* ESTADO VAZIO */}
              {!carregando && produtosFiltrados.length === 0 && (
                <div className="text-center py-24 bg-gradient-to-br from-light via-light-mid to-gray-mid rounded-card border border-gray-mid">
                  <Package className="w-16 h-16 text-text-light mx-auto mb-4 opacity-40" strokeWidth={1} />
                  <p className="text-text-secondary font-semibold text-lg mb-6">
                    Nenhum produto encontrado.
                  </p>
                  <button
                    onClick={limparFiltros}
                    className="
                      text-sm font-bold
                      text-gold uppercase tracking-wide
                      border-b-2 border-gold
                      hover:text-dark-light hover:border-dark-light
                      transition-all duration-300
                      pb-1
                    "
                  >
                    Limpar todos os filtros
                  </button>
                </div>
              )}

              {/* GRID DE PRODUTOS */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 pb-4">
                {carregando
                  ? Array.from({ length: 12 }).map((_, i) => <SkeletonProduct key={i} />)
                  : paginaAtual.map(produto => (
                      <ProductCard key={produto._id} produto={produto} />
                    ))
                }
              </div>

              {/* PAGINAÇÃO */}
              {!carregando && totalPaginas > 1 && (
                <div className="mt-16 pt-8 border-t border-gray-mid">
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      onClick={() => { setPagina(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      disabled={pagina === 1}
                      className="px-6 py-3 text-sm font-semibold text-dark-light border-2 border-gray-mid rounded-button hover:bg-dark-light hover:text-white hover:border-dark-light disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 uppercase tracking-wide"
                    >
                      ← Anterior
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPaginas }, (_, i) => i + 1)
                        .filter(num => totalPaginas <= 7 || num === 1 || num === totalPaginas || Math.abs(num - pagina) <= 2)
                        .map((num, idx, arr) => (
                          <React.Fragment key={num}>
                            {idx > 0 && arr[idx - 1] !== num - 1 && (
                              <span className="text-text-secondary px-2 py-3 text-sm font-medium">…</span>
                            )}
                            <button
                              onClick={() => { setPagina(num); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                              className={`
                                w-11 h-11 rounded-button text-sm font-bold
                                transition-all duration-300
                                ${num === pagina
                                  ? 'bg-dark-light text-white shadow-md-luxury border-2 border-dark-light'
                                  : 'text-text-secondary border-2 border-gray-mid hover:bg-light hover:text-dark-light hover:border-dark-light'
                                }
                              `}
                            >
                              {num}
                            </button>
                          </React.Fragment>
                        ))}
                    </div>

                    <button
                      onClick={() => { setPagina(p => Math.min(totalPaginas, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      disabled={pagina === totalPaginas}
                      className="px-6 py-3 text-sm font-semibold text-dark-light border-2 border-gray-mid rounded-button hover:bg-dark-light hover:text-white hover:border-dark-light disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 uppercase tracking-wide"
                    >
                      Próximo →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* BENEFÍCIOS - Seção Premium */}
      <section className="container-main mt-24 md:mt-40 pt-20 border-t border-gray-mid">
        <div className="text-center mb-16">
          <h3 className="font-serif font-bold text-3xl md:text-4xl text-dark-light mb-3">
            Por que escolher Parthenon
          </h3>
          <p className="text-text-secondary font-light text-base">
            Qualidade, confiança e excelência em cada detalhe
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {[
            { 
              icon: <Package className="w-10 h-10 text-gold" strokeWidth={1.5} />, 
              title: 'Qualidade Premium', 
              desc: 'Tecidos selecionados dos melhores fornecedores, com acabamento impecável e características únicas.' 
            },
            { 
              icon: <Truck className="w-10 h-10 text-gold" strokeWidth={1.5} />, 
              title: 'Entrega Rápida', 
              desc: 'Enviamos para todo o Brasil com agilidade, total rastreamento e embalagem cuidadosa.' 
            },
            { 
              icon: <Headphones className="w-10 h-10 text-gold" strokeWidth={1.5} />, 
              title: 'Suporte Especializado', 
              desc: 'Atendimento personalizado para ajudar na escolha do tecido ideal para seu projeto.' 
            },
          ].map(({ icon, title, desc }) => (
            <div 
              key={title} 
              className="
                p-8 rounded-card border-2 border-gray-mid
                bg-gradient-to-br from-white to-light/30
                hover:shadow-lg-luxury hover:border-gold
                transition-all duration-400
              "
            >
              <div className="mb-5">{icon}</div>
              <h4 className="font-serif font-bold text-xl text-dark-light mb-3">
                {title}
              </h4>
              <p className="text-text-secondary text-sm leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FILTRO MOBILE DRAWER */}
      {sidebarAberta && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setSidebarAberta(false)}
          />
          <div className="fixed right-0 top-0 h-full w-80 max-w-full bg-white shadow-xl-luxury z-50 flex flex-col lg:hidden animate-slide-up">
            <div className="flex-1 overflow-y-auto p-6">
              <FiltersSidebar
                precoMin={precoMin}
                precoMax={precoMax}
                precoMaxGlobal={precoMaxGlobal}
                categorias={categorias}
                categoriasSelecionadas={categoriasSelecionadas}
                onPrecoChange={handlePrecoChange}
                onCategoriaChange={handleCategoriaChange}
                limparFiltros={limparFiltros}
                isMobile
                onClose={() => setSidebarAberta(false)}
              />
            </div>
            <div className="p-6 border-t border-gray-mid">
              <button
                onClick={() => setSidebarAberta(false)}
                className="w-full py-3 bg-dark-light text-white rounded-button font-medium text-sm hover:bg-gold hover:text-dark-light transition-all"
              >
                Ver {produtosFiltrados.length} produto{produtosFiltrados.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}