'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Heart } from 'lucide-react';
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
      <div className="
        relative flex flex-col h-full
        bg-white rounded-card overflow-hidden
        shadow-sm-luxury hover:shadow-xl-luxury
        transition-all duration-300
        hover:transform hover:-translate-y-1
      ">
        {/* IMAGEM DO PRODUTO */}
        <div className="
          relative w-full aspect-square
          bg-light overflow-hidden flex-shrink-0
        ">
          <Image
            src={imageSrc}
            alt={nome}
            fill
            className="
              object-cover w-full h-full
              transition-transform duration-500
              group-hover:scale-105
            "
            sizes="(max-width: 640px) calc(100vw - 32px),
                   (max-width: 1024px) calc(50vw - 24px),
                   calc(33.333vw - 20px)"
            onError={() => setImgError(true)}
            priority={false}
          />

          {/* BADGE DE ESTOQUE BAIXO */}
          {estoque > 0 && estoque <= 5 && (
            <div className="
              absolute top-3 left-3
              bg-error text-white text-xs font-medium
              uppercase tracking-widest px-3 py-1.5
              rounded-button animate-fade-in
            ">
              Últimas
            </div>
          )}

          {/* BADGE DE ESGOTADO */}
          {estoque <= 0 && (
            <div className="
              absolute inset-0 bg-black/30 backdrop-blur-sm
              flex items-center justify-center
            ">
              <span className="
                text-white font-medium text-lg
                uppercase tracking-widest
              ">
                Esgotado
              </span>
            </div>
          )}

          {/* BOTÃO FAVORITO */}
          <div className="
            absolute top-3 right-3
            opacity-0 group-hover:opacity-100
            transition-opacity duration-300
            z-10
          ">
            <FavoritoButton produtoId={id} />
          </div>
        </div>

        {/* INFORMAÇÕES DO PRODUTO */}
        <div className="
          flex flex-col flex-grow p-4
          gap-2
        ">
          {/* Nome */}
          <h3 className="
            font-serif font-medium
            text-dark-light
            text-sm md:text-base
            line-clamp-2
            group-hover:text-gold
            transition-colors duration-300
          ">
            {nome}
          </h3>

          {/* Preço */}
          <div className="flex items-baseline gap-2 mt-1">
            <span className="
              text-dark-light font-semibold
              text-base md:text-lg
            ">
              R$ {preco.toFixed(2)}
            </span>
            {produto.preco_original && produto.preco_original > preco && (
              <span className="
                text-text-light text-xs
                line-through
              ">
                R$ {produto.preco_original.toFixed(2)}
              </span>
            )}
          </div>

          {/* Descrição/Stock */}
          <p className="
            text-text-light text-xs
            uppercase tracking-widest font-medium
            mt-auto
          ">
            {estoque > 0 ? 'Peça por metro' : 'Indisponível'}
          </p>
        </div>

        {/* AÇÃO DE COMPRA */}
        <div className="
          px-4 pb-4 pt-2
          border-t border-gray-mid
        ">
          <button
            onClick={handleAddToCart}
            disabled={estoque <= 0}
            className="
              w-full
              py-2.5
              rounded-button
              bg-dark-light text-white
              border border-dark-light
              font-medium text-sm uppercase tracking-widest
              transition-all duration-300
              hover:bg-gold hover:text-dark-light hover:border-gold
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-dark-light disabled:hover:text-white disabled:hover:border-dark-light
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold
              flex items-center justify-center gap-2
            "
          >
            <ShoppingBag className="w-4 h-4" strokeWidth={2} />
            <span>Adicionar</span>
          </button>
        </div>
      </div>
    </Link>
  );
}