'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import ProductCard from '@/components/ui/ProductCard';
import { SkeletonProduct } from '@/components/Skeleton';

interface Produto {
  _id: string;
  nome: string;
  preco: number;
  fotos: string[];
  imagemUrl?: string;
  disponivel: number;
  estoque?: number;
}

export default function ProdutosRelacionados({ produtoAtualId }: { produtoAtualId: string }) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!produtoAtualId) return;
    const apiUrl = getApiUrl();
    axios
      .get(`${apiUrl}/api/produtos/vitrine`)
      .then(res => {
        const relacionados = (Array.isArray(res.data) ? res.data : [])
          .filter((p: Produto) => p._id !== produtoAtualId)
          .slice(0, 4);
        setProdutos(relacionados);
      })
      .catch(console.error)
      .finally(() => setCarregando(false));
  }, [produtoAtualId]);

  if (!carregando && produtos.length === 0) return null;

  return (
    <section className="
      mt-12 md:mt-20 pt-12 md:pt-16
      border-t border-gray-mid
    ">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="font-serif font-semibold text-2xl md:text-3xl text-dark-light">
          Você também pode gostar
        </h2>
        <p className="text-text-secondary text-sm mt-2">
          Produtos selecionados para você
        </p>
      </div>

      <div className="
        grid grid-cols-2 md:grid-cols-4
        gap-3 md:gap-6
      ">
        {carregando
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonProduct key={i} />)
          : produtos.map(produto => (
              <ProductCard key={produto._id} produto={produto} />
            ))
        }
      </div>
    </section>
  );
}