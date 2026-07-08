'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import ProductCard from '@/components/ui/ProductCard';
import FiltersSidebar from '@/components/FiltersSidebar';
import { SlidersHorizontal } from 'lucide-react';

interface Produto {
  _id: string;
  nome: string;
  preco: number;
  fotos: string[];
  imagemUrl?: string;
  disponivel: number;
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

  // Filtros
  const [precoMin, setPrecoMin] = useState(0);
  const [precoMax, setPrecoMax] = useState(1000);
  const [precoMaxGlobal, setPrecoMaxGlobal] = useState(1000);
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<string[]>([]);
  const [ordenacao, setOrdenacao] = useState('');
  const [busca, setBusca] = useState('');

  // Paginação e Mobile
  const [pagina, setPagina] = useState(1);
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const ITENS_POR_PAGINA = 12;

  useEffect(() => {
    const apiUrl = getApiUrl();
    const carregarDados = async () => {
      try {
        const [resProdutos, resCategorias] = await Promise.all([
          axios.get(`${apiUrl}/api/produtos/vitrine`),
          axios.get(`${apiUrl}/api/categorias`)
        ]);
        const produtosData = resProdutos.data;
        const categoriasData = resCategorias.data;

        setProdutos(produtosData);
        setCategorias(categoriasData);
        const maxPreco = Math.max(...produtosData.map((p: Produto) => p.preco), 100);
        setPrecoMaxGlobal(maxPreco);
        setPrecoMax(maxPreco);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setCarregando(false);
      }
    };
    carregarDados();
  }, []);

  // Lógica de filtro
  const produtosFiltrados = produtos
    .filter(p => {
      if (busca.trim()) {
        const termo = busca.toLowerCase();
        if (!p.nome.toLowerCase().includes(termo)) return false;
      }
      if (p.preco < precoMin || p.preco > precoMax) return false;
      if (categoriasSelecionadas.length > 0) {
        const idCat = typeof p.categoria === 'object' ? p.categoria?._id : p.categoria;
        if (!idCat || !categoriasSelecionadas.includes(idCat.toString())) return false;
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

  const handleCategoriaChange = (catId: string) => {
    setCategoriasSelecionadas(prev =>
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
    setPagina(1);
  };

  const handlePrecoChange = (min: number, max: number) => {
    setPrecoMin(min);
    setPrecoMax(max);
    setPagina(1);
  };

  if (carregando) {
    return (
      <main className="min-h-screen bg-white pb-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a1a1a]"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-24">
      {/* Título Centralizado */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 pt-16 pb-8 text-center border-b border-gray-100">
        <h1 className="text-4xl md:text-5xl font-serif font-light tracking-wider text-[#1a1a1a] mb-2">
          Nossa Coleção
        </h1>
        <p className="text-sm font-light text-[#8a7a6a] tracking-wide">
          Explore nossos tecidos selecionados com a elegância que você merece.
        </p>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-8 flex gap-12">
        {/* Filtro Desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
         <FiltersSidebar
  precoMin={precoMin}
  precoMax={precoMax}
  precoMaxGlobal={precoMaxGlobal}
  categorias={categorias}
  categoriasSelecionadas={categoriasSelecionadas}
  onPrecoChange={(min, max) => { setPrecoMin(min); setPrecoMax(max); setPagina(1); }}
  onCategoriaChange={catId => {
    setCategoriasSelecionadas(prev => prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]);
    setPagina(1);
  }}
  limparFiltros={limparFiltros}   // ← ADICIONE ESTA LINHA
/>
        </aside>

        {/* Conteúdo Principal */}
        <div className="flex-1">
          {/* Barra de controle */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <p className="text-sm font-light text-[#8a7a6a]">
              {produtosFiltrados.length} produto{produtosFiltrados.length !== 1 ? 's' : ''}
            </p>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              {/* Botão Filtro Mobile */}
              <button
                onClick={() => setSidebarAberta(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm font-light text-[#1a1a1a] hover:bg-gray-50 transition"
              >
                <SlidersHorizontal className="w-4 h-4" strokeWidth={1.5} />
                Filtros
              </button>

              <select
                value={ordenacao}
                onChange={(e) => { setOrdenacao(e.target.value); setPagina(1); }}
                className="w-full sm:w-auto border border-gray-200 rounded-full px-4 py-2 text-sm font-light text-[#1a1a1a] focus:outline-none bg-transparent"
              >
                <option value="">Mais relevantes</option>
                <option value="menor-preco">Menor Preço</option>
                <option value="maior-preco">Maior Preço</option>
                <option value="nome">Nome (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Grid de Produtos */}
          {produtosFiltrados.length === 0 ? (
            <div className="text-center py-20 text-[#8a7a6a]">
              <p className="text-lg font-light">Nenhum produto encontrado.</p>
              <button
                onClick={limparFiltros}
                className="mt-4 text-sm underline hover:text-[#1a1a1a] transition"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {paginaAtual.map((produto) => (
                  <ProductCard key={produto._id} produto={produto} />
                ))}
              </div>

              {/* Paginação */}
              {totalPaginas > 1 && (
                <div className="mt-12 flex justify-center items-center gap-2">
                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(num => (
                    <button
                      key={num}
                      onClick={() => { setPagina(num); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className={`min-w-[2rem] h-8 px-2 rounded-md text-sm font-light transition ${
                        num === pagina
                          ? 'bg-[#1a1a1a] text-white'
                          : 'text-[#1a1a1a] hover:bg-gray-100'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Drawer Mobile de Filtros */}
      {sidebarAberta && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setSidebarAberta(false)} />
      )}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 lg:hidden ${
          sidebarAberta ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <FiltersSidebar
  precoMin={precoMin}
  precoMax={precoMax}
  precoMaxGlobal={precoMaxGlobal}
  categorias={categorias}
  categoriasSelecionadas={categoriasSelecionadas}
  onPrecoChange={(min, max) => { setPrecoMin(min); setPrecoMax(max); setPagina(1); }}
  onCategoriaChange={catId => {
    setCategoriasSelecionadas(prev => prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]);
    setPagina(1);
  }}
  limparFiltros={limparFiltros}   // ← ADICIONE ESTA LINHA
/>
      </div>
    </main>
  );
}