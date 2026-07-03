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
}

export default function ProdutosRelacionados({ produtoAtualId }: { produtoAtualId: string }) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!produtoAtualId) return;
    const apiUrl = getApiUrl();
    axios.get(`${apiUrl}/api/produtos/vitrine`)
      .then(res => {
        // Filtra removendo o produto atual e pega até 4 relacionados
        const relacionados = res.data
          .filter((p: any) => p._id !== produtoAtualId)
          .slice(0, 4);
        setProdutos(relacionados);
      })
      .catch(console.error)
      .finally(() => setCarregando(false));
  }, [produtoAtualId]);

  if (carregando) {
    return (
      <div className="mt-16 border-t pt-10">
        <h2 className="text-2xl font-heading font-bold mb-6">Produtos Relacionados</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (produtos.length === 0) return null;

  return (
    <div className="mt-16 border-t pt-10">
      <h2 className="text-2xl font-heading font-bold mb-6">Produtos Relacionados</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {produtos.map(produto => (
          <ProductCard key={produto._id} produto={produto} />
        ))}
      </div>
    </div>
  );
}