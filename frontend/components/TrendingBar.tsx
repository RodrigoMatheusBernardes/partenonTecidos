'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';

interface ProdutoDestaque {
  _id: string;
  nome: string;
  preco: number;
  preco_original?: number;
  fotos?: string[];
  imagemUrl?: string;
  estoque?: number;
}

export default function TrendingBar() {
  const [produtos, setProdutos] = useState<ProdutoDestaque[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  useEffect(() => {
    const apiUrl = getApiUrl();
    axios.get(`${apiUrl}/api/produtos/destaques`)
      .then(res => {
        const dados = Array.isArray(res.data) ? res.data.slice(0, 8) : [];
        setProdutos(dados);
      })
      .catch(err => console.error('Erro ao carregar destaques:', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 768) setItemsPerView(2);
      else if (window.innerWidth < 1024) setItemsPerView(3);
      else setItemsPerView(4);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
  }, [produtos.length]);

  if (loading) {
    return (
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-light text-[#1a1a1a]">Produtos em Alta</h2>
            <p className="text-[#8a7a6a] font-light text-sm mt-2">Os favoritos da nossa comunidade</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="aspect-[3/4] bg-gray-200 animate-pulse rounded" />
                <div className="mt-4 h-3 bg-gray-200 animate-pulse rounded w-3/4" />
                <div className="mt-2 h-5 bg-gray-200 animate-pulse rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (produtos.length === 0) return null;

  const maxIndex = Math.max(0, produtos.length - itemsPerView);
  const produtosVisiveis = produtos.slice(currentIndex, currentIndex + itemsPerView);

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-light text-[#1a1a1a]">Produtos em Alta</h2>
          <p className="text-[#8a7a6a] font-light text-sm mt-2">Os favoritos da nossa comunidade</p>
        </div>

        <div className="relative">
          {produtos.length > itemsPerView && (
            <>
              <button
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white rounded-full shadow-md hover:shadow-lg disabled:opacity-40 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentIndex(Math.min(maxIndex, currentIndex + 1))}
                disabled={currentIndex >= maxIndex}
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white rounded-full shadow-md hover:shadow-lg disabled:opacity-40 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {produtosVisiveis.map((produto) => (
              <ProductCard key={produto._id} produto={produto} />
            ))}
          </div>
        </div>

        {maxIndex > 0 && (
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1 rounded-full transition-all ${
                  i === currentIndex ? 'w-8 bg-[#1a1a1a]' : 'w-4 bg-[#d4cec4]'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}