'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';
import FavoritoButton from '@/components/FavoritoButton';

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

  const id = String(produto._id || '');
  const nome = produto.nome || 'Produto sem nome';
  const preco = typeof produto.preco === 'number' ? produto.preco : 0;
  const precoOriginal = typeof produto.preco_original === 'number' && produto.preco_original > preco ? produto.preco_original : null;
  const imagemPrincipal = (produto.fotos && produto.fotos[0]) || produto.imagem || produto.imagemUrl || '';
  const imagemValida = fixImageUrl(imagemPrincipal) || DEFAULT_IMAGE;
  const estoque = typeof produto.estoque === 'number' ? produto.estoque : 0;
  const descontoPercentual = precoOriginal && precoOriginal > preco ? Math.round(((precoOriginal - preco) / precoOriginal) * 100) : 0;

  const isObjectId = (str: string) => /^[0-9a-fA-F]{24}$/.test(str);
  let categoriaLabel = null;
  if (produto.categoria && typeof produto.categoria === 'object') {
    categoriaLabel = produto.categoria.nome || null;
  } else if (typeof produto.categoria === 'string') {
    if (!isObjectId(produto.categoria)) {
      categoriaLabel = produto.categoria;
    }
  }

  const composicao = produto.atributos?.composicao || null;

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
        hover:-translate-y-[4px]
        transition-all duration-300 ease-out
        flex flex-col
        w-full max-w-full
      "
    >
      <Link href={`/produto/${id}`} className="block relative flex flex-col flex-1">
        {/* Imagem - aspect ajustado para [4/5] */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[#fcfcfc] rounded-t-2xl flex-shrink-0">
          <img
            src={displayImage}
            alt={nome}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />

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

        {/* Conteúdo - padding reduzido e espaçamentos ajustados */}
        <div className="p-4 md:p-5 flex flex-col flex-1">
          {/* Categoria */}
          {categoriaLabel && (
            <span className="text-[11px] uppercase tracking-wider text-text-light font-medium mb-1">
              {categoriaLabel}
            </span>
          )}

          {/* Nome */}
          <h3 className="font-serif font-normal text-[15px] md:text-[16px] leading-tight tracking-wide text-primary-dark !text-primary-dark line-clamp-2 mb-1">
            {nome}
          </h3>

          {/* Composição */}
          {composicao && (
            <p className="text-[12px] text-text-secondary font-light mb-2.5">
              {composicao}
            </p>
          )}

          {/* Grupo de preço */}
          <div className="flex flex-col gap-0.5 mb-1">
            {precoOriginal && (
              <span className="text-[13px] text-text-light line-through font-light">
                R$ {precoOriginal.toFixed(2)}
              </span>
            )}
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="font-serif text-[20px] md:text-[22px] font-bold text-metallic-navy">
                R$ {preco.toFixed(2)}
              </span>
              {descontoPercentual > 0 && (
                <span className="text-[14px] font-medium text-error bg-error/5 px-2 py-0.5 rounded">
                  −{descontoPercentual}%
                </span>
              )}
            </div>
          </div>

          {/* Parcelamento */}
          <p className="text-[13px] text-text-light font-light">
            3x de R$ {(preco / 3).toFixed(2)}
          </p>

          {/* Disponibilidade */}
          {estoque > 0 && estoque <= 5 && (
            <p className="text-[12px] text-error font-medium mt-1.5">
              Últimas unidades
            </p>
          )}

          {/* Botão - altura e padding ajustados */}
          <div className="mt-auto pt-2.5" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleAddToCart}
              disabled={estoque <= 0}
              className={`
                w-full text-[13px] font-medium tracking-wide
                py-2.5 px-4 rounded-full
                border-2 border-primary-dark
                bg-transparent text-primary-dark
                hover:bg-primary-dark hover:text-white
                hover:-translate-y-0.5 hover:shadow-md
                transition-all duration-300 ease-out
                flex items-center justify-center gap-2
                ${estoque <= 0 ? '!border-gray-200 !text-gray-400 cursor-not-allowed hover:!translate-y-0 hover:!shadow-none' : ''}
                relative z-10
              `}
            >
              <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
              <span>
                {estoque > 0 ? 'Adicionar' : 'Esgotado'}
              </span>
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}