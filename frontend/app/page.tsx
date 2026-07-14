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

interface Categoria { _id: string; nome: string; }
interface Produto {
  _id: string;
  nome: string;
  preco: number;
  fotos: string[];
  imagemUrl?: string;
  disponivel: number;
  categoria?: Categoria | string;
  preco_original?: number;
  vendas?: number;
  destaque?: boolean;
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
    axios
      .get(`${apiUrl}/api/produtos/vitrine`)
      .then(res => {
        const data = res.data;
        setProdutos(data);
        const maxPreco = Math.max(...data.map((p: Produto) => p.preco), 100);
        setPrecoMaxGlobal(maxPreco);
        setPrecoMax(maxPreco);
      })
      .catch(err => {
        console.error(err);
        setErro('Erro ao carregar produtos.');
      })
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    axios
      .get(`${getApiUrl()}/api/categorias`)
      .then(res => setCategorias(res.data))
      .catch(console.error);
  }, []);

  const filtrar = (lista: Produto[]) => {
    return lista.filter(p => {
      if (busca.trim()) {
        const termo = removerAcentos(busca.toLowerCase());
        if (!removerAcentos(p.nome.toLowerCase()).includes(termo)) return false;
      }
      if (p.preco < precoMin || p.preco > precoMax) return false;
      if (categoriasSelecionadas.length) {
        const idCat =
          typeof p.categoria === 'object' ? p.categoria?._id : p.categoria;
        if (!idCat || !categoriasSelecionadas.includes(idCat.toString()))
          return false;
      }
      return true;
    });
  };

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

  if (carregando) {
    return (
      <div className="main-container py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonProduct key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (erro) return <div className="text-center py-20 text-red-600">{erro}</div>;

  return (
    <>
      <HomeBanner />

      <section className="w-full bg-[#F7F7F7] py-16 md:py-20">
        <div className="main-container">
          
          {/* Produtos em Alta – Já possui seu próprio alinhamento interno perfeito */}
          <TrendingBar />

          {/* 
            CORREÇÃO DO ITEM 3.1:
            A 'flex row' ganhou um 'mt-8' para preservar o espaçamento vertical 
            que existia antes do título.
            O título foi movido para DENTRO do 'flex-1'.
          */}
          <div className="flex flex-col md:flex-row gap-8 mt-8">
            <aside className="hidden md:block w-64 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-[#e8e3dc] p-6">
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
              </div>
            </aside>

            <div className="flex-1">
              {/* Título movido para cá. Agora compartilha o mesmo container que a grade! */}
              <div className="text-center mb-8 md:mb-10">
                <h2 className="font-serif font-light text-3xl md:text-4xl text-[#1a1a1a]">
                  Nossa Coleção
                </h2>
                <p className="text-[#8a7a6a] font-light text-sm mt-2 tracking-wide">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {paginaAtual.map(produto => (
                      <ProductCard key={produto._id} produto={produto} />
                    ))}
                  </div>

                  {totalPaginas > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setPagina(prev => Math.max(1, prev - 1));
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={pagina === 1}
                        className="px-3 py-2 text-sm font-light text-gray-400 hover:text-gray-600 disabled:opacity-30 transition"
                        aria-label="Anterior"
                      >
                        ‹ Anterior
                      </button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPaginas }, (_, i) => i + 1)
                          .filter(
                            num =>
                              totalPaginas <= 5 ||
                              num === 1 ||
                              num === totalPaginas ||
                              Math.abs(num - pagina) <= 1
                          )
                          .map((num, idx, arr) => (
                            <React.Fragment key={num}>
                              {idx > 0 && arr[idx - 1] !== num - 1 && (
                                <span className="text-gray-400 px-2">…</span>
                              )}
                              <button
                                onClick={() => {
                                  setPagina(num);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className={`min-w-[2rem] h-8 px-2 rounded-md text-sm font-light transition ${
                                  num === pagina
                                    ? 'bg-[#1a1a1a] text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                {num}
                              </button>
                            </React.Fragment>
                          ))}
                      </div>

                      <button
                        onClick={() => {
                          setPagina(prev => Math.min(totalPaginas, prev + 1));
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={pagina === totalPaginas}
                        className="px-3 py-2 text-sm font-light text-gray-400 hover:text-gray-600 disabled:opacity-30 transition"
                        aria-label="Próximo"
                      >
                        Próximo ›
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <section className="mt-24 md:mt-32 py-16 md:py-24 border-t border-[#e8e3dc]">
            <div className="grid md:grid-cols-3 gap-12 md:gap-20 text-center">
              <div>
                <h3 className="font-serif font-light text-xl text-[#1a1a1a] mb-3">
                  Qualidade Premium
                </h3>
                <p className="text-[#8a7a6a] font-light text-sm leading-relaxed max-w-xs mx-auto">
                  Tecidos selecionados dos melhores fornecedores
                </p>
              </div>
              <div>
                <h3 className="font-serif font-light text-xl text-[#1a1a1a] mb-3">
                  Entrega Rápida
                </h3>
                <p className="text-[#8a7a6a] font-light text-sm leading-relaxed max-w-xs mx-auto">
                  Enviamos para todo o Brasil com agilidade
                </p>
              </div>
              <div>
                <h3 className="font-serif font-light text-xl text-[#1a1a1a] mb-3">
                  Atendimento Especial
                </h3>
                <p className="text-[#8a7a6a] font-light text-sm leading-relaxed max-w-xs mx-auto">
                  Suporte personalizado para suas necessidades
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* Filtro mobile (mantido) */}
      <div className="md:hidden fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setSidebarAberta(true)}
          className="bg-[#1a1a1a] text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-[#2d2d2d] transition-colors"
        >
          ⚙️
        </button>
      </div>
      {sidebarAberta && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setSidebarAberta(false)}>
          <div
            className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
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
                  prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
                );
                setPagina(1);
              }}
              limparFiltros={limparFiltros}
            />
            <button
              onClick={() => setSidebarAberta(false)}
              className="mt-6 w-full bg-[#f8f6f2] py-2.5 rounded-lg text-sm text-[#1a1a1a] font-light hover:bg-[#e8e3dc] transition-colors"
            >
              Fechar
            </button>
            <button
              onClick={() => { limparFiltros(); setSidebarAberta(false); }}
              className="mt-2 w-full text-sm text-[#8a7a6a] hover:text-[#1a1a1a] transition-colors font-light"
            >
              Limpar filtros
            </button>
          </div>
        </div>
      )}
    </>
  );
}