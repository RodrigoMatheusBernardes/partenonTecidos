'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import FavoritoButton from '@/components/FavoritoButton';
import FiltersSidebar from '@/components/FiltersSidebar';
import { SkeletonProduct } from '@/components/Skeleton';
import ProductCard from '@/components/ui/ProductCard';

// Essa diretiva garante que o Next.js não tente pré-renderizar essa página no build
export const dynamic = 'force-dynamic';

interface Categoria { _id: string; nome: string; }
interface Produto {
  _id: string; nome: string; preco: number; fotos: string[];
  imagemUrl?: string; disponivel: number; preco_original?: number | null;
  categoria?: Categoria | string;
}

// Componente que usa useSearchParams (isolado para ficar dentro do Suspense)
function SearchParamsHandler({ setBusca }: { setBusca: (val: string) => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const termo = searchParams.get('busca');
    if (termo) setBusca(termo);
  }, [searchParams, setBusca]);
  return null;
}

// Componente principal da loja (onde fica toda a lógica de produtos)
function LojaContent() {
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

  const removerAcentos = (texto: string) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Carregar produtos
  useEffect(() => {
    const apiUrl = getApiUrl();
    axios.get(`${apiUrl}/api/produtos/vitrine`)
      .then(res => {
        const data = res.data;
        setProdutos(data);
        const maxPreco = Math.max(...data.map(p => p.preco ?? 0), 100);
        setPrecoMaxGlobal(maxPreco);
        setPrecoMax(maxPreco);
      })
      .catch(err => { console.error(err); setErro('Erro ao carregar produtos.'); })
      .finally(() => setCarregando(false));
  }, []);

  // Carregar categorias
  useEffect(() => {
    axios.get(`${getApiUrl()}/api/categorias`)
      .then(res => setCategorias(res.data))
      .catch(console.error);
  }, []);

  const filtrar = (lista: Produto[]) => {
    return lista.filter(p => {
      if (busca.trim() !== '') {
        const buscaNorm = removerAcentos(busca.toLowerCase());
        if (!removerAcentos(p.nome.toLowerCase()).includes(buscaNorm)) return false;
      }
      if ((p.preco ?? 0) < precoMin || (p.preco ?? 0) > precoMax) return false;
      if (categoriasSelecionadas.length > 0) {
        const idCategoria = typeof p.categoria === 'object' ? p.categoria?._id : p.categoria;
        if (!idCategoria || !categoriasSelecionadas.includes(idCategoria.toString())) return false;
      }
      return true;
    });
  };

  const ordenar = (lista: Produto[]) => {
    const copia = [...lista];
    if (ordenacao === 'menor-preco') copia.sort((a, b) => (a.preco ?? 0) - (b.preco ?? 0));
    else if (ordenacao === 'maior-preco') copia.sort((a, b) => (b.preco ?? 0) - (a.preco ?? 0));
    else if (ordenacao === 'nome') copia.sort((a, b) => a.nome.localeCompare(b.nome));
    return copia;
  };

  const produtosFiltrados = ordenar(filtrar(produtos));
  const totalPaginas = Math.ceil(produtosFiltrados.length / ITENS_POR_PAGINA);
  const paginaAtual = produtosFiltrados.slice((pagina - 1) * ITENS_POR_PAGINA, pagina * ITENS_POR_PAGINA);

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
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Loja</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (<SkeletonProduct key={i} />))}
        </div>
      </main>
    );
  }

  if (erro) return <main className="text-center py-20 text-red-600">{erro}</main>;

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Loja</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="hidden md:block w-64 flex-shrink-0">
          <FiltersSidebar
            precoMin={precoMin} precoMax={precoMax} precoMaxGlobal={precoMaxGlobal}
            categorias={categorias} categoriasSelecionadas={categoriasSelecionadas}
            onPrecoChange={(min, max) => { setPrecoMin(min); setPrecoMax(max); setPagina(1); }}
            onCategoriaChange={(catId) => {
              setCategoriasSelecionadas(prev => prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]);
              setPagina(1);
            }}
          />
          <button onClick={limparFiltros} className="mt-4 w-full text-sm text-primary hover:underline">Limpar filtros</button>
        </aside>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-500">{produtosFiltrados.length} produto(s)</p>
            <select value={ordenacao} onChange={e => { setOrdenacao(e.target.value); setPagina(1); }} className="border rounded-lg px-3 py-2 text-sm bg-white">
              <option value="">Mais relevantes</option>
              <option value="menor-preco">Menor Preço</option>
              <option value="maior-preco">Maior Preço</option>
              <option value="nome">Nome (A-Z)</option>
            </select>
          </div>

          {produtosFiltrados.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Nenhum produto encontrado.</p>
              <button onClick={limparFiltros} className="mt-2 text-primary hover:underline">Limpar filtros</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {paginaAtual.map(produto => (
                  <div key={produto._id} className="relative group">
                    <ProductCard
                      id={produto._id}
                      nome={produto.nome}
                      preco={produto.preco ?? 0}
                      imagem={produto.fotos?.[0] || produto.imagemUrl}
                      estoque={produto.disponivel ?? 0}
                      precoOriginal={produto.preco_original}
                    />
                    <div className="absolute top-2 right-2 z-10">
                      <FavoritoButton produtoId={produto._id} />
                    </div>
                  </div>
                ))}
              </div>

              {totalPaginas > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(num => (
                    <button
                      key={num}
                      onClick={() => { setPagina(num); window.scrollTo(0, 0); }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${num === pagina ? 'bg-primary text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                    >{num}</button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Filtro mobile */}
      <div className="md:hidden fixed bottom-6 right-6 z-30">
        <button onClick={() => setSidebarAberta(true)} className="bg-primary text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl">⚙️</button>
      </div>
      {sidebarAberta && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setSidebarAberta(false)}>
          <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <FiltersSidebar
              precoMin={precoMin} precoMax={precoMax} precoMaxGlobal={precoMaxGlobal}
              categorias={categorias} categoriasSelecionadas={categoriasSelecionadas}
              onPrecoChange={(min, max) => { setPrecoMin(min); setPrecoMax(max); setPagina(1); }}
              onCategoriaChange={(catId) => {
                setCategoriasSelecionadas(prev => prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]);
                setPagina(1);
              }}
            />
            <button onClick={() => setSidebarAberta(false)} className="mt-6 w-full bg-gray-200 py-2 rounded-lg text-sm">Fechar</button>
            <button onClick={() => { limparFiltros(); setSidebarAberta(false); }} className="mt-2 w-full text-sm text-primary hover:underline">Limpar filtros</button>
          </div>
        </div>
      )}
    </main>
  );
}

// A página exportada envolve o conteúdo em um Suspense
export default function LojaPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Carregando busca...</div>}>
      <SearchParamsHandler setBusca={(val) => { /* O estado será atualizado pelo setBusca passado para o componente filho */ }} />
      <LojaContent />
    </Suspense>
  );
}