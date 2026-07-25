'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';
import FavoritoButton from '@/components/FavoritoButton';
import Button from '@/components/ui/Button';

const DEFAULT_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400"%3E%3Crect width="300" height="400" fill="%23fcfcfc"/%3E%3Ctext x="150" y="200" font-family="Inter, sans-serif" font-size="20" fill="%23999" text-anchor="middle"%3EProduto%3C/text%3E%3C/svg%3E';

function fixImageUrl(url: string): string {
  if (!url) return url;
  let fixed = url.replace('http://localhost:5000', 'https://partenontecidos.onrender.com');
  if (fixed.startsWith('http://')) {
    fixed = fixed.replace('http://', 'https://');
  }
  return fixed;
}

export default function ProductCard({ produto }: { produto?: any }) {
  const { addItem } = useCart();
  const [imgError, setImgError] = useState(false);

  if (!produto || typeof produto !== 'object') {
    return (
      <div className="bg-white rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.05)] border border-[#f0f0f0] p-6">
        <div className="aspect-[3/4] bg-gray-100 rounded-t-2xl flex items-center justify-center">
          <span className="text-gray-400 text-sm font-light">Sem imagem</span>
        </div>
      </div>
    );
  }

  const id = produto._id || '';
  const nome = produto.nome || 'Produto sem nome';
  const preco = typeof produto.preco === 'number' ? produto.preco : 0;
  const precoOriginal = typeof produto.preco_original === 'number' && produto.preco_original > preco ? produto.preco_original : null;
  const imagemPrincipal = (produto.fotos && produto.fotos[0]) || produto.imagem || produto.imagemUrl || '';
  const imagemValida = fixImageUrl(imagemPrincipal) || DEFAULT_IMAGE;
  const estoque = typeof produto.estoque === 'number' ? produto.estoque : 0;
  const descontoPercentual = precoOriginal && precoOriginal > preco ? Math.round(((precoOriginal - preco) / precoOriginal) * 100) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (estoque <= 0) return toast.error('Produto esgotado!');
    addItem({ id, nome, preco, quantidade: 1, maxEstoque: estoque });
    toast.success('Adicionado!');
  };

  const displayImage = imgError ? DEFAULT_IMAGE : imagemValida;

  return (
    <div
      className="
        group bg-white rounded-2xl overflow-hidden
        shadow-[0_8px_30px_rgba(0,0,0,0.05)]
        border border-[#f0f0f0]
        hover:shadow-[0_16px_60px_rgba(0,0,0,0.1)]
        hover:-translate-y-[6px]
        transition-all duration-400 ease-out
        flex flex-col
      "
    >
      <Link href={`/produto/${id}`} className="block relative">
        <div className="relative aspect-[3/4] overflow-hidden bg-[#fcfcfc] rounded-t-2xl">
          <img
            src={displayImage}
            alt={nome}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />

          {/* Badge de desconto - Metallic Navy */}
          {descontoPercentual > 0 && (
            <div className="absolute top-3 left-3 z-10 bg-metallic-navy text-white text-[10px] font-medium px-2.5 py-1 rounded-md uppercase tracking-widest shadow-sm">
              -{descontoPercentual}%
            </div>
          )}

          {estoque <= 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
              <span className="text-white font-light text-sm uppercase tracking-wider">Esgotado</span>
            </div>
          )}

          <div
            className="absolute top-3 right-3 z-10"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          >
            <FavoritoButton produtoId={id} />
          </div>
        </div>

        <div className="p-6 md:p-8 flex flex-col flex-1 gap-5">
          {/* 
            CORREÇÃO: Nome do produto agora em cinza chumbo (text-lead-gray)
            Antes: text-metallic-navy
          */}
          <h3 className="font-serif font-light text-xl md:text-2xl leading-tight tracking-wide text-lead-gray line-clamp-2">
            {nome}
          </h3>

          {/* Preço - Metallic Navy (destacado) */}
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-metallic-navy">
                R$ {preco.toFixed(2)}
              </span>
              {precoOriginal && (
                <span className="text-sm text-[#8a7a6a] line-through font-light">
                  R$ {precoOriginal.toFixed(2)}
                </span>
              )}
            </div>
            <p className="text-xs text-[#8a7a6a] font-light mt-1">
              ou 3x de R$ {(preco / 3).toFixed(2)}
            </p>
          </div>

          {estoque > 0 && estoque <= 5 && (
            <p className="text-xs text-red-500 font-medium">⚠️ Últimas unidades!</p>
          )}

          <Button
            variant="secondary"
            size="lg"
            onClick={handleAddToCart}
            disabled={estoque <= 0}
            className={`mt-auto w-full text-sm ${
              estoque > 0
                ? ''
                : '!border-gray-200 !text-gray-400'
            }`}
          >
            <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
            {estoque > 0 ? 'Adicionar' : 'Esgotado'}
          </Button>
        </div>
      </Link>
    </div>
  );
}