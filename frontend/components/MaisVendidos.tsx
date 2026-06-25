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

export default function MaisVendidos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const apiUrl = getApiUrl();
    axios.get(`${apiUrl}/api/produtos/destaques`)
      .then(res => setProdutos(res.data))
      .catch(console.error)
      .finally(() => setCarregando(false));
  }, []);

  if (carregando || produtos.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6 font-heading text-gray-800">
        🔥 Mais Vendidos
      </h2>
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
    </section>
  );
}