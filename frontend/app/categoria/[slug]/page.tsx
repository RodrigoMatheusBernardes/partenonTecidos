'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import ProductCard from '@/components/ui/ProductCard';
import { getApiUrl } from '@/lib/api';
import { Home, ChevronRight } from 'lucide-react';

interface Produto {
  _id: string;
  nome: string;
  preco: number;
  fotos: string[];
  imagemUrl?: string;
  disponivel: number;
  preco_original?: number;
  estoque?: number;
}

export default function CategoriaPage() {
  const { slug } = useParams<{ slug: string }>();
  const [categoria, setCategoria] = useState<any>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const apiUrl = getApiUrl();
    let catId: string;

    axios
      .get(`${apiUrl}/api/categorias/slug/${slug}`)
      .then(res => {
        setCategoria(res.data);
        catId = res.data._id;
        return axios.get(`${apiUrl}/api/produtos/vitrine`);
      })
      .then(res => {
        const filtrados = res.data.filter((p: any) => {
          const idCategoria = typeof p.categoria === 'object' ? p.categoria?._id : p.categoria;
          return idCategoria === catId;
        });
        setProdutos(filtrados);
      })
      .catch(console.error)
      .finally(() => setCarregando(false));
  }, [slug]);

  useEffect(() => {
    if (categoria) {
      document.title = `${categoria.nome} | Parthenon Tecidos`;
    }
  }, [categoria]);

  if (carregando) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-[#e8e3dc] border-t-[#C5A880] rounded-full animate-spin" />
      </div>
    );
  }

  if (!categoria) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-lg">Categoria não encontrada.</p>
        <Link href="/loja" className="text-blue-600 hover:underline mt-4 inline-block">
          Ver todas as categorias
        </Link>
      </div>
    );
  }

  return (
    <main>
      {/* Cabeçalho da categoria */}
      <div className="bg-[#0a1628] text-white py-16 md:py-20">
        <div className="main-container">
          <div className="flex items-center gap-2 text-sm text-white/60 mb-4">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              Loja
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{categoria.nome}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-light tracking-wide">
            {categoria.nome}
          </h1>
          {produtos.length > 0 && (
            <p className="text-white/50 mt-2 text-sm">
              {produtos.length} {produtos.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
            </p>
          )}
        </div>
      </div>

      {/* Grid de produtos */}
      <div className="main-container py-24 md:py-32">
        {produtos.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500 text-lg">Nenhum produto nesta categoria ainda.</p>
            <Link
              href="/loja"
              className="inline-block mt-6 bg-[#0a1628] text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-[#1a2a44] transition"
            >
              Explorar outros produtos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {produtos.map(produto => (
              <ProductCard key={produto._id} produto={produto} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}