'use client';

import { useEffect, useState } from 'react';
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

export default function ProdutosRelacionados({ produtoAtualId }: { produtoAtualId: string }) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!produtoAtualId) return;
    const apiUrl = getApiUrl();
    axios.get(`${apiUrl}/api/produtos/vitrine`)
      .then(response => {
        const todos = response.data as Produto[];
        // Filtra o produto atual e pega até 4
        const outros = todos
          .filter(p => p._id !== produtoAtualId)
          .slice(0, 4);
        setProdutos(outros);
      })
      .catch(err => console.error('Erro ao buscar relacionados:', err))
      .finally(() => setCarregando(false));
  }, [produtoAtualId]);

  if (carregando) return null;

  if (produtos.length === 0) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4 font-heading text-gray-800">Você também pode gostar</h2>
        <p className="text-gray-500">Nenhum produto relacionado no momento.</p>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6 font-heading text-gray-800">Você também pode gostar</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
    </div>
  );
}