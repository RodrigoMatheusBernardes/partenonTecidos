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
      <main className="container-main py-12 md:py-20">

        {/* TÍTULO */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="font-serif font-semibold text-3xl md:text-5xl text-dark-light tracking-wide">
            Nossa Coleção
          </h2>
          <p className="text-text-secondary text-sm md:text-base mt-3">
            Explore nossos tecidos selecionados com a elegância que você merece
          </p>
        </div>

        <div className="flex gap-8 lg:gap-12">

          {/* FILTRO DESKTOP */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-8 bg-white rounded-card shadow-sm-luxury border border-gray-mid p-6">
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
              <div className="w-full sm:max-w-xs">
                <SearchBar value={busca} onChange={v => { setBusca(v); setPagina(1); }} />
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Botão Filtro Mobile */}
                <button
                  onClick={() => setSidebarAberta(true)}
                  className="
                    lg:hidden flex items-center gap-2
                    px-4 py-2.5
                    border border-gray-mid rounded-button
                    text-sm font-medium text-dark-light
                    hover:bg-light hover:border-dark-light
                    transition-all duration-300
                    focus:outline-none focus:ring-2 focus:ring-gold
                  "
                >
                  <SlidersHorizontal className="w-4 h-4" strokeWidth={2} />
                  Filtros
                  {(categoriasSelecionadas.length > 0 || precoMin > 0 || precoMax < precoMaxGlobal) && (
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-dark-light text-white text-xs font-bold ml-1">
                      {categoriasSelecionadas.length + (precoMin > 0 || precoMax < precoMaxGlobal ? 1 : 0)}
                    </span>
                  )}
                </button>

                <p className="text-sm text-text-secondary font-medium whitespace-nowrap ml-auto sm:ml-0">
                  {produtosFiltrados.length} produto{produtosFiltrados.length !== 1 ? 's' : ''}
                </p>

                <select
                  value={ordenacao}
                  onChange={e => { setOrdenacao(e.target.value); setPagina(1); }}
                  className="
                    border border-gray-mid rounded-button
                    px-4 py-2.5 text-sm font-medium
                    bg-white text-dark-light
                    focus:outline-none focus:ring-2 focus:ring-gold
                    transition
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
              <div className="text-center py-20 bg-light rounded-card">
                <p className="text-text-secondary font-medium text-lg mb-4">
                  Nenhum produto encontrado.
                </p>
                <button
                  onClick={limparFiltros}
                  className="
                    text-sm font-semibold
                    text-dark-light underline-offset-4
                    hover:text-gold hover:underline
                    transition-colors
                  "
                >
                  Limpar filtros
                </button>
              </div>
            )}

            {/* GRID DE PRODUTOS */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
              {carregando
                ? Array.from({ length: 12 }).map((_, i) => <SkeletonProduct key={i} />)
                : paginaAtual.map(produto => (
                    <ProductCard key={produto._id} produto={produto} />
                  ))
              }
            </div>

            {/* PAGINAÇÃO */}
            {!carregando && totalPaginas > 1 && (
              <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => { setPagina(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  disabled={pagina === 1}
                  className="px-5 py-2.5 text-sm font-medium text-dark-light border border-gray-mid rounded-button hover:bg-dark-light hover:text-white disabled:opacity-40 transition-all"
                >
                  ← Anterior
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPaginas }, (_, i) => i + 1)
                    .filter(num => totalPaginas <= 7 || num === 1 || num === totalPaginas || Math.abs(num - pagina) <= 2)
                    .map((num, idx, arr) => (
                      <React.Fragment key={num}>
                        {idx > 0 && arr[idx - 1] !== num - 1 && (
                          <span className="text-text-light px-2 py-2">…</span>
                        )}
                        <button
                          onClick={() => { setPagina(num); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          className={`
                            w-10 h-10 rounded-button text-sm font-medium
                            transition-all duration-300
                            ${num === pagina
                              ? 'bg-dark-light text-white shadow-sm-luxury'
                              : 'text-text-secondary hover:bg-light hover:text-dark-light'
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
                  className="px-5 py-2.5 text-sm font-medium text-dark-light border border-gray-mid rounded-button hover:bg-dark-light hover:text-white disabled:opacity-40 transition-all"
                >
                  Próximo →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* BENEFÍCIOS */}
        <section className="mt-20 md:mt-32 pt-16 border-t border-gray-mid">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
            {[
              { icon: <Package className="w-8 h-8 mx-auto mb-4 text-gold" strokeWidth={1.5} />, title: 'Qualidade Premium', desc: 'Tecidos selecionados dos melhores fornecedores, com acabamento impecável.' },
              { icon: <Truck className="w-8 h-8 mx-auto mb-4 text-gold" strokeWidth={1.5} />, title: 'Entrega Rápida', desc: 'Enviamos para todo o Brasil com agilidade e total rastreamento.' },
              { icon: <Headphones className="w-8 h-8 mx-auto mb-4 text-gold" strokeWidth={1.5} />, title: 'Atendimento Especial', desc: 'Suporte personalizado para ajudar na escolha do tecido ideal.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="p-8 rounded-card border border-gray-mid hover:shadow-md-luxury transition-shadow duration-300">
                {icon}
                <h3 className="font-serif font-semibold text-xl md:text-2xl text-dark-light mb-3">
                  {title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed max-w-xs mx-auto">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

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