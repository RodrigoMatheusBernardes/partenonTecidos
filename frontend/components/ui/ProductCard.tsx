'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';
import FavoritoButton from '@/components/FavoritoButton';

const DEFAULT_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400"%3E%3Crect width="300" height="400" fill="%23f5f2ee"/%3E%3Ctext x="150" y="200" font-family="Inter, sans-serif" font-size="20" fill="%23999" text-anchor="middle"%3EProduto%3C/text%3E%3C/svg%3E';

// Função auxiliar para corrigir a URL da imagem (local)
function fixImageUrl(url: string): string {
  if (!url) return url;
  // Substitui localhost:5000 pela URL do Render
  return url.replace('http://localhost:5000', 'https://partenontecidos.onrender.com');
}

export default function ProductCard({ produto }: { produto?: any }) {
  const { addItem } = useCart();
  const [imgError, setImgError] = useState(false);

  if (!produto || typeof produto !== 'object') {
    return (
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm p-5">
        <div className="aspect-[3/4] bg-gray-100 rounded-xl flex items-center justify-center">
          <span className="text-gray-400 text-sm font-light">Sem imagem</span>
        </div>
        <div className="mt-4 h-4 bg-gray-200 rounded w-3/4" />
        <div className="mt-2 h-6 bg-gray-200 rounded w-1/2" />
      </div>
    );
  }

  const id = produto._id || '';
  const nome = produto.nome || 'Produto sem nome';
  const preco = typeof produto.preco === 'number' ? produto.preco : 0;
  const precoOriginal =
    typeof produto.preco_original === 'number' && produto.preco_original > preco
      ? produto.preco_original
      : null;
  const imagemPrincipal =
    (produto.fotos && produto.fotos[0]) ||
    produto.imagem ||
    produto.imagemUrl ||
    '';
  const imagemValida = (() => {
    if (imagemPrincipal && typeof imagemPrincipal === 'string' && imagemPrincipal.startsWith('http')) {
      return fixImageUrl(imagemPrincipal);
    }
    return DEFAULT_IMAGE;
  })();
  const estoque = typeof produto.estoque === 'number' ? produto.estoque : 0;

  const descontoPercentual =
    precoOriginal && precoOriginal > preco
      ? Math.round(((precoOriginal - preco) / precoOriginal) * 100)
      : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (estoque <= 0) {
      toast.error('Produto esgotado!');
      return;
    }

    addItem({
      id,
      nome,
      preco,
      quantidade: 1,
      maxEstoque: estoque,
    });
  };

  const imageSrc = imgError ? DEFAULT_IMAGE : imagemValida;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <Link href={`/produto/${id}`} className="block relative">
        <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f2ee]">
          <Image
            src={imageSrc}
            alt={nome}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImgError(true)}
          />

          {descontoPercentual > 0 && (
            <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-light px-3 py-1 rounded-full tracking-wide">
              -{descontoPercentual}%
            </div>
          )}

          {produto.badge && (
            <div
              className={`absolute z-10 bg-accent text-white text-xs font-light px-3 py-1 rounded-full shadow-lg ${
                descontoPercentual > 0 ? 'top-12 left-3' : 'top-3 left-3'
              }`}
            >
              {produto.badge}
            </div>
          )}

          {estoque <= 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
              <span className="text-white font-light text-sm uppercase tracking-wider">
                Esgotado
              </span>
            </div>
          )}

          <div
            className="absolute top-3 right-3 z-10"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <FavoritoButton produtoId={id} />
          </div>
        </div>

        <div className="p-5 md:p-6 flex flex-col flex-1 gap-3">
          <h3 className="font-medium text-[#1a1a1a] line-clamp-2 text-sm md:text-base font-light leading-relaxed min-h-[3.5rem]">
            {nome}
          </h3>

          <div>
            <span className="text-xl font-light text-[#1a1a1a]">
              R$ {preco.toFixed(2)}
            </span>
            {precoOriginal && (
              <span className="text-sm text-[#8a7a6a] line-through font-light ml-2">
                R$ {precoOriginal.toFixed(2)}
              </span>
            )}
            <p className="text-xs text-[#8a7a6a] font-light mt-0.5">
              ou 3x de R$ {(preco / 3).toFixed(2)}
            </p>
          </div>

          {estoque > 0 && estoque <= 5 && (
            <p className="text-xs text-red-500 font-medium">⚠️ Últimas unidades!</p>
          )}
          {estoque > 0 ? (
            <p className="text-xs text-green-600 font-light">Disponível: {estoque} m</p>
          ) : (
            <p className="text-xs text-red-500 font-light">Indisponível</p>
          )}

          <button
            onClick={handleAddToCart}
            disabled={estoque <= 0}
            className={`mt-auto w-full py-3 rounded-lg transition-all flex items-center justify-center gap-2 text-sm font-light tracking-wide ${
              estoque > 0
                ? 'bg-[#1a1a1a] text-white hover:bg-[#2d2d2d]'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
            {estoque > 0 ? 'Adicionar' : 'Esgotado'}
          </button>
        </div>
      </Link>
    </div>
  );
}