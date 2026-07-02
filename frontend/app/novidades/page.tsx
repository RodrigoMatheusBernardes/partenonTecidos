'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import FavoritoButton from '@/components/FavoritoButton';
import ProductCard from '@/components/ui/ProductCard';

interface Produto {
  _id: string;
  nome: string;
  preco: number;
  fotos: string[];
  imagemUrl?: string;
  disponivel: number;
  createdAt: string;
}

export default function NovidadesPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const apiUrl = getApiUrl();
    // Buscar todos os produtos e ordenar pelos mais recentes
    axios.get(`${apiUrl}/api/produtos/vitrine`)
      .then(res => {
        const ordenados = res.data.sort(
          (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setProdutos(ordenados.slice(0, 12)); // pega os 12 mais recentes
      })
      .catch(console.error)
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Novidades</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Novidades</h1>
      {produtos.length === 0 ? (
        <p className="text-gray-500">Nenhum produto encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {produtos.map(produto => (
            <div key={produto._id} className="relative group">
              <ProductCard
                id={produto._id}
                nome={produto.nome}
                preco={produto.preco}
                imagem={produto.fotos?.[0] || produto.imagemUrl}
                estoque={produto.disponivel ?? 0}
              />
              <div className="absolute top-2 right-2 z-10">
                <FavoritoButton produtoId={produto._id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}