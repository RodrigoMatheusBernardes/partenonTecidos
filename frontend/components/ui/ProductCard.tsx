'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Sparkles, Package } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';
import FavoritoButton from '@/components/FavoritoButton';

const DEFAULT_IMAGE = '/images/placeholder.jpg';

export default function ProductCard({ produto }: { produto: any }) {
  const { addItem } = useCart();
  const [imgError, setImgError] = useState(false);

  // Dados seguros
  const id = produto._id || '';
  const nome = produto.nome || 'Tecido';
  const preco = typeof produto.preco === 'number' ? produto.preco : 0;
  const imagem = (produto.fotos?.[0] || produto.imagemUrl || DEFAULT_IMAGE);
  const estoque = typeof produto.estoque === 'number' ? produto.estoque : 0;
  const isNovo = produto.isNovo || false;
  const avaliacao = produto.avaliacao || 0;
  const preco_original = produto.preco_original || 0;
  
  // Calcular desconto %
  const desconto = preco_original > preco 
    ? Math.round(((preco_original - preco) / preco_original) * 100)
    : 0;

  const imageSrc = imgError
    ? DEFAULT_IMAGE
    : imagem.replace('http://localhost:5000', 'https://partenontecidos.onrender.com');

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (estoque <= 0) {
      toast.error('Produto esgotado!');
      return;
    }
    addItem({ id, nome, preco, quantidade: 1, maxEstoque: estoque });
    toast.success(`${nome} adicionado ao carrinho!`);
  };

  return (
    <Link href={`/produto/${id}`} className="group block h-full">
      <div 
        className="
          relative flex flex-col h-full
          bg-white rounded-card border border-gray-mid overflow-hidden
          shadow-sm-luxury hover:shadow-lg-luxury
          transition-all duration-400 ease-out
          hover:-translate-y-2
        "
      >
        {/* IMAGEM DO PRODUTO - 4:3 proportion */}
        <div className="
          relative w-full aspect-video
          bg-gradient-to-br from-light via-light-mid to-gray-mid
          overflow-hidden flex-shrink-0
        ">
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <Image
            src={imageSrc}
            alt={nome}
            fill
            className="
              object-cover w-full h-full rounded-t-card
              transition-transform duration-700 ease-out
              group-hover:scale-110
            "
            sizes="(max-width: 640px) calc(100vw - 32px),
                   (max-width: 1024px) calc(50vw - 24px),
                   calc(25vw - 20px)"
            onError={() => setImgError(true)}
            priority={false}
          />

          {/* Badge "NOVO" */}
          {isNovo && (
            <div className="
              absolute top-3 left-3
              flex items-center gap-1
              bg-gold text-dark-light text-xs font-bold
              uppercase tracking-[0.1em] px-3 py-1.5
              rounded-full shadow-md-luxury
            ">
              <Sparkles className="w-3 h-3" strokeWidth={2.5} />
              Novo
            </div>
          )}

          {/* Badge DESCONTO % */}
          {desconto > 0 && (
            <div className="
              absolute top-3 right-3
              bg-error text-white text-xs font-bold
              px-2.5 py-1 rounded-full shadow-md-luxury
            ">
              -{desconto}%
            </div>
          )}

          {/* Overlay para Esgotado */}
          {estoque <= 0 && (
            <div className="
              absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent
              backdrop-blur-sm flex items-center justify-center rounded-t-card
            ">
              <span className="
                text-white font-serif font-bold text-base
                uppercase tracking-widest text-center
              ">
                Esgotado
              </span>
            </div>
          )}

          {/* Botão Favorito - SEMPRE VISÍVEL */}
          <div className="absolute top-3 right-3 z-20">
            <FavoritoButton produtoId={id} />
          </div>
        </div>

        {/* CONTEÚDO DO CARD */}
        <div className="flex flex-col flex-grow px-4 py-3 gap-2">
          
          {/* Nome do Produto */}
          <h3 className="
            font-serif font-bold
            text-dark-light text-sm
            line-clamp-2 leading-tight
            group-hover:text-gold
            transition-colors duration-300
          ">
            {nome}
          </h3>

          {/* Avaliação - SEMPRE VISÍVEL */}
          <div className="flex items-center gap-1">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`
                    text-xs transition-colors duration-300
                    ${i < Math.round(avaliacao) ? 'text-gold' : 'text-gray-mid'}
                  `}
                >
                  ★
                </span>
              ))}
            </div>
            {avaliacao > 0 && (
              <span className="text-xs text-text-secondary font-medium">
                ({avaliacao.toFixed(1)})
              </span>
            )}
          </div>

          {/* PREÇO GRANDE - DESTAQUE */}
          <div className="flex items-baseline gap-2 mt-1">
            {/* Preço Atual - GRANDE E BOLD */}
            <span className="
              text-dark-light font-black
              text-lg md:text-xl leading-none
            ">
              R$ {preco.toFixed(2).replace('.', ',')}
            </span>
            
            {/* Preço Original se houver desconto */}
            {preco_original > preco && (
              <span className="
                text-text-light text-xs
                line-through font-medium
              ">
                R$ {preco_original.toFixed(2).replace('.', ',')}
              </span>
            )}
          </div>

          {/* Frete Grátis / Estoque */}
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-1.5 text-success font-medium">
              <span>✓</span>
              <span>Frete Grátis</span>
            </div>
            
            {estoque > 0 && (
              <div className="flex items-center gap-1.5 text-text-secondary font-medium">
                <Package className="w-3 h-3" strokeWidth={2} />
                <span>{estoque}+ em estoque</span>
              </div>
            )}
          </div>
        </div>

        {/* BOTÃO COMPRA - GRANDE E PROEMINENTE */}
        <div className="
          px-4 py-3 mt-auto
          border-t border-gray-mid
          bg-gradient-to-r from-white/40 to-white/0
          group-hover:bg-gradient-to-r group-hover:from-gold/5 group-hover:to-white/0
          transition-all duration-300
        ">
          <button
            onClick={handleAddToCart}
            disabled={estoque <= 0}
            className={`
              w-full
              py-3
              rounded-button border-2
              font-bold text-xs uppercase tracking-wider
              transition-all duration-400 ease-out
              active:scale-95
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold
              flex items-center justify-center gap-2
              ${estoque <= 0
                ? 'bg-gray-mid/50 text-text-secondary border-gray-mid cursor-not-allowed'
                : 'bg-dark-light text-white border-dark-light hover:bg-gold hover:text-dark-light hover:border-gold hover:shadow-md-luxury'
              }
            `}
          >
            <ShoppingBag className="w-4 h-4" strokeWidth={2.5} />
            <span>Adicionar</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
