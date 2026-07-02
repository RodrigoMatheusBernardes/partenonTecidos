'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import ProductCard from '@/components/ui/ProductCard';
import { getApiUrl } from '@/lib/api';

interface Produto {
  _id: string;
  nome: string;
  preco: number;
  fotos: string[];
  imagemUrl?: string;
  disponivel: number;
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

    // 1. Buscar a categoria pelo slug
    axios.get(`${apiUrl}/api/categorias/slug/${slug}`)
      .then(res => {
        setCategoria(res.data);
        catId = res.data._id;
        // 2. Buscar todos os produtos da vitrine
        return axios.get(`${apiUrl}/api/produtos/vitrine`);
      })
      .then(res => {
        // 3. Filtrar produtos que pertençam a essa categoria
        const filtrados = res.data.filter((p: any) => {
          const idCategoria = typeof p.categoria === 'object' ? p.categoria?._id : p.categoria;
          return idCategoria === catId;
        });
        setProdutos(filtrados);
      })
      .catch(console.error)
      .finally(() => setCarregando(false));
  }, [slug]);

  // ✅ Título dinâmico da aba (SEO)
  useEffect(() => {
    if (categoria) {
      document.title = `${categoria.nome} | Parthenon Tecidos`;
    }
  }, [categoria]);

  if (carregando) return <p className="p-8">Carregando...</p>;
  if (!categoria) return <p className="p-8 text-red-600">Categoria não encontrada.</p>;

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-primary">Loja</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{categoria.nome}</span>
      </div>
      <h1 className="text-3xl font-bold mb-8 font-heading">{categoria.nome}</h1>
      {produtos.length === 0 ? (
        <p className="text-gray-500">Nenhum produto nesta categoria ainda.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {produtos.map(produto => (
            <ProductCard
              key={produto._id}
              id={produto._id}
              nome={produto.nome}
              preco={produto.preco}
              imagem={produto.fotos?.[0] || produto.imagemUrl}
              estoque={produto.disponivel ?? 0}
            />
          ))}
        </div>
      )}
    </main>
  );
}