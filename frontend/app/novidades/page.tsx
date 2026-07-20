'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import ProductCard from '@/components/ui/ProductCard';

interface Produto {
  _id: string;
  nome: string;
  preco: number;
  fotos: string[];
  imagemUrl?: string;
  disponivel: number;
  createdAt: string;
  preco_original?: number | null;
  estoque?: number;
}

export default function NovidadesPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const apiUrl = getApiUrl();
    axios.get(`${apiUrl}/api/produtos/vitrine`)
      .then(res => {
        const ordenados = res.data.sort(
          (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setProdutos(ordenados.slice(0, 12));
      })
      .catch(console.error)
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) {
    return (
      <main className="main-container py-8">
        {/* ALTERAÇÃO: max-w-7xl mx-auto px-4 substituído por main-container */}
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
    <main className="main-container py-8">
      {/* ALTERAÇÃO: max-w-7xl mx-auto px-4 substituído por main-container */}
      <h1 className="text-3xl font-bold mb-8">Novidades</h1>
      {produtos.length === 0 ? (
        <p className="text-gray-500">Nenhum produto encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {produtos.map(produto => (
            <ProductCard key={produto._id} produto={produto} />
          ))}
        </div>
      )}
    </main>
  );
}