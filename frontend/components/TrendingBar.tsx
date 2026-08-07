'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { extractDataArray, getApiUrl } from '@/lib/api';

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
        const dados = extractDataArray<ProdutoDestaque>(res.data).slice(0, 8);
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
      <div className="w-full py-16 md:py-20">
        <div className="main-container">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="font-primary font-bold text-2xl md:text-4xl text-metallic-navy">
              Produtos em Alta
            </h2>
            <p className="font-secondary text-text-secondary text-sm mt-2">
              Os favoritos da nossa comunidade
            </p>
          </div>
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-gray-mid border-t-gold rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (produtos.length === 0) return null;

  const maxIndex = Math.max(0, produtos.length - itemsPerView);
  const produtosVisiveis = produtos.slice(currentIndex, currentIndex + itemsPerView);

  return (
    <div className="w-full py-16 md:py-20">
      <div className="main-container">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="font-primary font-bold text-2xl md:text-4xl text-metallic-navy">
            Produtos em Alta
          </h2>
          <p className="font-secondary text-text-secondary text-sm mt-2">
            Os favoritos da nossa comunidade
          </p>
        </div>

        <div className="relative">
          {/* Setas de navegação */}
          {produtos.length > itemsPerView && (
            <>
              <button
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className="
                  absolute left-1 md:left-2 top-1/2 -translate-y-1/2 z-10
                  p-2 md:p-3 bg-white/90 backdrop-blur-sm
                  border border-gray-mid rounded-full shadow-sm
                  hover:border-primary-dark hover:shadow-md hover:scale-105
                  disabled:opacity-40 disabled:hover:scale-100 disabled:hover:border-gray-mid
                  transition-all duration-300
                "
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-primary-dark" />
              </button>
              <button
                onClick={() => setCurrentIndex(Math.min(maxIndex, currentIndex + 1))}
                disabled={currentIndex >= maxIndex}
                className="
                  absolute right-1 md:right-2 top-1/2 -translate-y-1/2 z-10
                  p-2 md:p-3 bg-white/90 backdrop-blur-sm
                  border border-gray-mid rounded-full shadow-sm
                  hover:border-primary-dark hover:shadow-md hover:scale-105
                  disabled:opacity-40 disabled:hover:scale-100 disabled:hover:border-gray-mid
                  transition-all duration-300
                "
              >
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-primary-dark" />
              </button>
            </>
          )}

          {/* Grid de produtos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
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
                  i === currentIndex ? 'w-8 bg-primary-dark' : 'w-4 bg-gray-mid'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}