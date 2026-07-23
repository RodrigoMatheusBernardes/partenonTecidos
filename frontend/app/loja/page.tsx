'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import ProductCard from '@/components/ui/ProductCard';
import FiltersSidebar from '@/components/FiltersSidebar';
import SearchBar from '@/components/SearchBar';
import { SlidersHorizontal } from 'lucide-react';

interface Produto {
  _id: string;
  nome: string;
  preco: number;
  fotos: string[];
  imagemUrl?: string;
  disponivel: number;
  estoque?: number;
  categoria?: { _id: string; nome: string };
  preco_original?: number;
}

interface Categoria {
  _id: string;
  nome: string;
}

export default function LojaPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [precoMin, setPrecoMin] = useState(0);
  const [precoMax, setPrecoMax] = useState(1000);
  const [precoMaxGlobal, setPrecoMaxGlobal] = useState(1000);
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<string[]>([]);
  const [ordenacao, setOrdenacao] = useState('');
  const [busca, setBusca] = useState('');
  const [pagina, setPagina] = useState(1);
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const ITENS_POR_PAGINA = 16;

  useEffect(() => {
    const apiUrl = getApiUrl();
    Promise.all([
      axios.get(`${apiUrl}/api/produtos/vitrine`),
      axios.get(`${apiUrl}/api/categorias`),
    ])
      .then(([resProdutos, resCategorias]) => {
        const prods = Array.isArray(resProdutos.data) ? resProdutos.data : [];
        const cats = Array.isArray(resCategorias.data) ? resCategorias.data : [];
        setProdutos(prods);
        setCategorias(cats);
        const maxPreco = prods.length > 0 ? Math.max(...prods.map((p: Produto) => p.preco), 100) : 1000;
        setPrecoMaxGlobal(maxPreco);
        setPrecoMax(maxPreco);
      })
      .catch(console.error)
      .finally(() => setCarregando(false));
  }, []);

  const produtosFiltrados = produtos
    .filter(p => {
      if (busca.trim() && !p.nome.toLowerCase().includes(busca.toLowerCase())) return false;
      if (p.preco < precoMin || p.preco > precoMax) return false;
      if (categoriasSelecionadas.length) {
        const idCat = typeof p.categoria === 'object' ? p.categoria?._id : p.categoria;
        if (!idCat || !categoriasSelecionadas.includes(String(idCat))) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (ordenacao === 'menor-preco') return a.preco - b.preco;
      if (ordenacao === 'maior-preco') return b.preco - a.preco;
      if (ordenacao === 'nome') return a.nome.localeCompare(b.nome);
      return 0;
    });

  const totalPaginas = Math.ceil(produtosFiltrados.length / ITENS_POR_PAGINA);
  const paginaAtual = produtosFiltrados.slice((pagina - 1) * ITENS_POR_PAGINA, pagina * ITENS_POR_PAGINA);

  const limparFiltros = () => {
    setBusca(''); setPrecoMin(0); setPrecoMax(precoMaxGlobal);
    setCategoriasSelecionadas([]); setOrdenacao(''); setPagina(1);
  };

  const handlePrecoChange = (min: number, max: number) => { setPrecoMin(min); setPrecoMax(max); setPagina(1); };
  const handleCategoriaChange = (catId: string) => {
    setCategoriasSelecionadas(prev => prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]);
    setPagina(1);
  };

  const activeFilters = categoriasSelecionadas.length + (precoMin > 0 || precoMax < precoMaxGlobal ? 1 : 0);

  return (
    <main className="min-h-screen bg-white pb-24">
      
      {/* HERO DA LOJA */}
      <div className="bg-light border-b border-gray-mid py-16 md:py-20">
        <div className="main-container text-center">
          <h1 className="font-serif font-semibold text-4xl md:text-5xl text-dark-light tracking-wide mb-3">
            Nossa Coleção
          </h1>
          <p className="text-text-secondary text-sm md:text-base max-w-lg mx-auto">
            Explore nossos tecidos selecionados com a elegância que você merece.
          </p>
        </div>
      </div>

      <div className="main-container py-24 md:py-32">
        <div className="flex gap-8 lg:gap-12">
          
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

          <div className="flex-1 min-w-0">

            {/* BARRA DE CONTROLES */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 md:mb-12">
              <div className="w-full sm:max-w-xs">
                <SearchBar value={busca} onChange={v => { setBusca(v); setPagina(1); }} />
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setSidebarAberta(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-gray-mid rounded-button text-sm font-medium text-dark-light hover:bg-light hover:border-dark-light transition-all focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <SlidersHorizontal className="w-4 h-4" strokeWidth={2} />
                  Filtros
                  {activeFilters > 0 && (
                    <span className="w-5 h-5 rounded-full bg-dark-light text-white text-xs flex items-center justify-center font-bold">
                      {activeFilters}
                    </span>
                  )}
                </button>

                <p className="text-sm text-text-secondary font-medium whitespace-nowrap ml-auto sm:ml-0">
                  {produtosFiltrados.length} produto{produtosFiltrados.length !== 1 ? 's' : ''}
                </p>

                <select
                  value={ordenacao}
                  onChange={e => { setOrdenacao(e.target.value); setPagina(1); }}
                  className="border border-gray-mid rounded-button px-4 py-2.5 text-sm font-medium bg-white text-dark-light focus:outline-none focus:ring-2 focus:ring-gold transition"
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
                <button onClick={limparFiltros} className="text-sm font-semibold text-dark-light underline-offset-4 hover:text-gold hover:underline transition-colors">
                  Limpar filtros
                </button>
              </div>
            )}

            {/* GRID DE PRODUTOS */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {carregando ? (
                <div className="col-span-full flex justify-center items-center min-h-[50vh] py-12">
                  <div className="w-12 h-12 border-4 border-[#e8e3dc] border-t-[#C5A880] rounded-full animate-spin" />
                </div>
              ) : (
                paginaAtual.map(p => <ProductCard key={p._id} produto={p} />)
              )}
            </div>

            {/* PAGINAÇÃO */}
            {!carregando && totalPaginas > 1 && (
              <div className="mt-16 flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => { setPagina(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  disabled={pagina === 1}
                  className="px-5 py-2.5 text-sm font-medium text-dark-light border border-gray-mid rounded-button hover:bg-dark-light hover:text-white disabled:opacity-40 transition-all"
                >
                  ← Anterior
                </button>
                {Array.from({ length: totalPaginas }, (_, i) => i + 1)
                  .filter(n => totalPaginas <= 7 || n === 1 || n === totalPaginas || Math.abs(n - pagina) <= 2)
                  .map((num, idx, arr) => (
                    <span key={num} className="flex items-center">
                      {idx > 0 && arr[idx - 1] !== num - 1 && <span className="px-2 text-text-light">…</span>}
                      <button
                        onClick={() => { setPagina(num); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className={`w-10 h-10 rounded-button text-sm font-medium transition-all ${num === pagina ? 'bg-dark-light text-white' : 'text-text-secondary hover:bg-light hover:text-dark-light'}`}
                      >
                        {num}
                      </button>
                    </span>
                  ))
                }
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
      </div>

      {/* FILTRO MOBILE DRAWER */}
      {sidebarAberta && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarAberta(false)} />
          <div className="fixed left-0 top-0 h-full w-80 max-w-full bg-white shadow-xl-luxury z-50 flex flex-col lg:hidden">
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
              <button onClick={() => setSidebarAberta(false)} className="w-full py-3 bg-dark-light text-white rounded-button font-medium text-sm hover:bg-gold hover:text-dark-light transition-all">
                Ver {produtosFiltrados.length} produto{produtosFiltrados.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}