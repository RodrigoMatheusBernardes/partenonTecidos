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
  // Outros campos que o ProductCard espera
}

export default function TrendingBar() {
  const [produtos, setProdutos] = useState<ProdutoDestaque[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  // Fetch dos produtos em destaque (mesma rota do original)
  useEffect(() => {
    const apiUrl = getApiUrl();
    axios.get(`${apiUrl}/api/produtos/destaques`)
      .then(res => {
        const dados = Array.isArray(res.data) ? res.data.slice(0, 8) : []; // até 8 para carrossel
        setProdutos(dados);
      })
      .catch(err => console.error('Erro ao carregar destaques:', err))
      .finally(() => setLoading(false));
  }, []);

  // Responsividade – quantos itens por vez
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

  // Reset ao mudar a lista de produtos
  useEffect(() => {
    setCurrentIndex(0);
  }, [produtos.length]);

  // Estados de carregamento
  if (loading) {
    return (
      <section className="py-12 md:py-20 bg-light">
        <div className="container-main">
          <div className="text-center mb-8 md:mb-12">
            <div className="h-8 bg-gradient-to-r from-gray-mid via-light-mid to-gray-mid rounded-button w-56 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-card shadow-sm-luxury overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-mid" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-mid rounded-button w-3/4" />
                  <div className="h-5 bg-gray-mid rounded-button w-1/2" />
                </div>
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
    <section className="py-12 md:py-20 bg-light border-y border-gray-mid">
      <div className="container-main">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="font-serif font-semibold text-2xl md:text-4xl text-dark-light">
            Produtos em Alta
          </h2>
          <p className="text-text-secondary text-sm mt-3">
            Os favoritos da nossa comunidade
          </p>
        </div>

        <div className="relative">
          {produtos.length > itemsPerView && (
            <>
              <button
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                aria-label="Ver produtos anteriores"
                className="
                  absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10
                  w-11 h-11 bg-white rounded-full
                  border border-gray-mid shadow-md-luxury
                  flex items-center justify-center
                  hover:bg-dark-light hover:text-white hover:border-dark-light
                  disabled:opacity-40 disabled:cursor-not-allowed
                  transition-all duration-300
                  focus:outline-none focus:ring-2 focus:ring-gold
                "
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={2} />
              </button>
              <button
                onClick={() => setCurrentIndex(Math.min(maxIndex, currentIndex + 1))}
                disabled={currentIndex >= maxIndex}
                aria-label="Ver próximos produtos"
                className="
                  absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10
                  w-11 h-11 bg-white rounded-full
                  border border-gray-mid shadow-md-luxury
                  flex items-center justify-center
                  hover:bg-dark-light hover:text-white hover:border-dark-light
                  disabled:opacity-40 disabled:cursor-not-allowed
                  transition-all duration-300
                  focus:outline-none focus:ring-2 focus:ring-gold
                "
              >
                <ChevronRight className="w-4 h-4" strokeWidth={2} />
              </button>
            </>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {produtosVisiveis.map((produto) => (
              <ProductCard key={produto._id} produto={produto} />
            ))}
          </div>
        </div>

        {maxIndex > 0 && (
          <div className="flex justify-center mt-8 gap-2" role="tablist">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === currentIndex}
                onClick={() => setCurrentIndex(i)}
                className={`
                  h-1 rounded-full transition-all duration-300
                  ${i === currentIndex ? 'w-8 bg-dark-light' : 'w-4 bg-gray-mid hover:bg-text-light'}
                `}
                aria-label={`Página ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}