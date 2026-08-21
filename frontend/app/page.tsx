'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { extractDataArray, getApiUrl } from '@/lib/api';
import SearchBar from '@/components/SearchBar';
import FiltersSidebar from '@/components/FiltersSidebar';
import ProductCard from '@/components/ui/ProductCard';
import HeroVideo from '@/components/HeroVideo';
import TrendingBar from '@/components/TrendingBar';
import { SlidersHorizontal, Tag, Sparkles, Star } from 'lucide-react';

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
  const router = useRouter();

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
        const data = extractDataArray<Produto>(res.data);
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

  const handleSearch = (termo: string) => {
    if (termo.trim()) {
      router.push(`/loja?busca=${encodeURIComponent(termo.trim())}`);
    }
  };

  const temFiltroAtivo =
    busca.trim() !== '' ||
    categoriasSelecionadas.length > 0 ||
    precoMin > 0 ||
    precoMax < precoMaxGlobal ||
    ordenacao !== '';

  if (erro) return <div className="text-center py-20 text-red-600">{erro}</div>;

  return (
    <>
      <HeroVideo />

      <section className="w-full bg-[#F7F7F7] py-8 md:py-10">
        <div className="main-container">
          <div className="flex flex-col md:flex-row gap-8">
            
            {/* SIDEBAR */}
            <aside className="hidden md:block w-[280px] flex-shrink-0">
              <div className="sticky top-8">
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

                <div className="mt-8 pt-6 border-t border-gray-mid/30 space-y-6">
                  {categorias.length > 0 && (
                    <div>
                      <h4 className="text-xs font-primary font-medium uppercase tracking-wider text-text-light mb-3 flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5" strokeWidth={2} />
                        Categorias em Destaque
                      </h4>
                      <ul className="space-y-1.5">
                        {categorias.slice(0, 5).map((cat) => (
                          <li key={cat._id}>
                            <Link
                              href={`/categoria/${cat._id}`}
                              className="text-sm text-text-secondary hover:text-gold transition-colors font-light"
                            >
                              {cat.nome}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <h4 className="text-xs font-primary font-medium uppercase tracking-wider text-text-light mb-3 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5" strokeWidth={2} />
                      Mais Vendidos
                    </h4>
                    <div className="space-y-2">
                      {produtos.slice(0, 3).map((prod) => (
                        <Link
                          key={prod._id}
                          href={`/produto/${prod._id}`}
                          className="flex items-center gap-3 p-2 rounded-button hover:bg-light transition-colors group"
                        >
                          <div className="w-10 h-10 rounded overflow-hidden bg-gray-mid flex-shrink-0">
                            {prod.fotos?.[0] && (
                              <img
                                src={prod.fotos[0].replace('http://localhost:5000', 'https://partenontecidos.onrender.com')}
                                alt={prod.nome}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-dark-light truncate group-hover:text-gold transition-colors">
                              {prod.nome}
                            </p>
                            <p className="text-xs text-text-light">R$ {prod.preco.toFixed(2)}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <Link
                      href="/loja?ordenacao=mais-vendidos"
                      className="text-xs text-gold hover:underline font-medium mt-2 inline-block"
                    >
                      Ver todos →
                    </Link>
                  </div>

                  <div className="bg-gold/5 border border-gold/20 rounded-card p-4 text-center">
                    <Star className="w-5 h-5 text-gold mx-auto mb-1" strokeWidth={2} />
                    <p className="text-xs font-medium text-dark-light">Qualidade Premium</p>
                    <p className="text-[10px] text-text-light">Tecidos selecionados</p>
                  </div>
                </div>
              </div>
            </aside>

            <div className="flex-1">
              {!temFiltroAtivo && <TrendingBar />}

              <div className="text-center mb-5 md:mb-7">
                <h2 className="font-serif font-light text-[24px] md:text-[28px] text-metallic-navy">
                  Nossa Coleção
                </h2>
                <p className="text-text-secondary font-light text-sm mt-2 tracking-wide">
                  Explore nossos tecidos
                </p>
              </div>

              <div className="w-full">
                <SearchBar
                  value={busca}
                  onChange={setBusca}
                  onSearch={handleSearch}
                />
              </div>

              <div className="flex items-center justify-between gap-3 mt-5">
                <p className="text-sm text-text-secondary font-light whitespace-nowrap">
                  {produtosFiltrados.length} produto(s)
                </p>
                <select
                  value={ordenacao}
                  onChange={e => {
                    setOrdenacao(e.target.value);
                    setPagina(1);
                  }}
                  className="border border-gray-mid rounded-lg px-3 py-2 text-sm bg-white text-dark-light font-light focus:outline-none focus:ring-1 focus:ring-gold"
                >
                  <option value="">Mais relevantes</option>
                  <option value="menor-preco">Menor Preço</option>
                  <option value="maior-preco">Maior Preço</option>
                  <option value="nome">Nome (A-Z)</option>
                </select>
              </div>

              {carregando ? (
                <div className="col-span-full flex justify-center items-center min-h-[50vh] py-12">
                  <div className="w-12 h-12 border-4 border-[#e8e3dc] border-t-[#C5A880] rounded-full animate-spin" />
                </div>
              ) : produtosFiltrados.length === 0 ? (
                <div className="text-center py-12 bg-white/60 rounded-2xl mt-6">
                  <p className="text-text-secondary font-light">Nenhum produto encontrado.</p>
                  <button
                    onClick={limparFiltros}
                    className="mt-2 text-sm text-dark-light hover:underline font-light"
                  >
                    Limpar filtros
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-6">
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
                        className="px-4 py-2 text-sm font-light text-text-secondary border border-gray-mid rounded-button hover:bg-light hover:border-dark-light transition disabled:opacity-40"
                      >
                        Anterior
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
                                <span className="text-text-light px-2">…</span>
                              )}
                              <button
                                onClick={() => {
                                  setPagina(num);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className={`min-w-[2.5rem] h-9 px-3 rounded-button text-sm font-light transition ${
                                  num === pagina
                                    ? 'bg-dark-light text-white'
                                    : 'text-text-secondary hover:bg-light hover:text-dark-light'
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
                        className="px-4 py-2 text-sm font-light text-text-secondary border border-gray-mid rounded-button hover:bg-light hover:border-dark-light transition disabled:opacity-40"
                      >
                        Próximo
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 border-t border-gray-mid">
        <div className="main-container flex flex-col justify-center min-h-[300px] md:min-h-[400px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-serif font-medium text-xl text-dark-light mb-2">Qualidade Premium</h3>
              <p className="text-text-secondary font-light text-sm leading-relaxed max-w-xs mx-auto">
                Tecidos selecionados dos melhores fornecedores do mundo.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="font-serif font-medium text-xl text-dark-light mb-2">Entrega Rápida</h3>
              <p className="text-text-secondary font-light text-sm leading-relaxed max-w-xs mx-auto">
                Enviamos para todo o Brasil com agilidade e segurança.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="font-serif font-medium text-xl text-dark-light mb-2">Atendimento Especial</h3>
              <p className="text-text-secondary font-light text-sm leading-relaxed max-w-xs mx-auto">
                Suporte personalizado para suas necessidades.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="md:hidden fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setSidebarAberta(true)}
          className="bg-dark-light text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-metallic-navy transition-colors"
          aria-label="Abrir filtros"
        >
          <SlidersHorizontal className="w-6 h-6" strokeWidth={2} />
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
              isMobile
              onClose={() => setSidebarAberta(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}