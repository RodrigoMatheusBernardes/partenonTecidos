'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';
import FavoritoButton from '@/components/FavoritoButton';

const DEFAULT_IMAGE = '/images/placeholder.jpg';

export default function ProductCard({ produto }: { produto: any }) {
  const { addItem } = useCart();
  const [imgError, setImgError] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Dados seguros
  const id = produto._id || '';
  const nome = produto.nome || 'Tecido';
  const preco = typeof produto.preco === 'number' ? produto.preco : 0;
  const imagem = (produto.fotos?.[0] || produto.imagemUrl || DEFAULT_IMAGE);
  const estoque = typeof produto.estoque === 'number' ? produto.estoque : 0;
  const isNovo = produto.isNovo || false;
  const avaliacao = produto.avaliacao || 0;

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
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* IMAGEM DO PRODUTO */}
        <div className="
          relative w-full aspect-square
          bg-gradient-to-br from-light via-light-mid to-gray-mid
          overflow-hidden flex-shrink-0
        ">
          {/* Background shimmer effect em carregamento */}
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
                   calc(33.333vw - 20px)"
            onError={() => setImgError(true)}
            priority={false}
          />

          {/* INDICADOR "NOVO" */}
          {isNovo && (
            <div className="
              absolute top-4 left-4
              flex items-center gap-1.5
              bg-gold text-dark-light text-xs font-bold
              uppercase tracking-[0.1em] px-3.5 py-2
              rounded-full animate-fade-in
              shadow-md-luxury
            ">
              <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} />
              Novo
            </div>
          )}

          {/* BADGE DE ESTOQUE BAIXO */}
          {!isNovo && estoque > 0 && estoque <= 5 && (
            <div className="
              absolute top-4 left-4
              bg-error/90 text-white text-xs font-bold
              uppercase tracking-[0.08em] px-3 py-1.5
              rounded-full animate-fade-in
              shadow-md-luxury
            ">
              Últimas
            </div>
          )}

          {/* BADGE DE ESGOTADO */}
          {estoque <= 0 && (
            <div className="
              absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent
              backdrop-blur-sm flex items-center justify-center
              rounded-t-card group-hover:from-black/60
              transition-colors duration-300
            ">
              <span className="
                text-white font-serif font-semibold text-lg
                uppercase tracking-widest
              ">
                Esgotado
              </span>
            </div>
          )}

          {/* BOTÃO FAVORITO */}
          <div className="
            absolute top-4 right-4
            opacity-0 group-hover:opacity-100
            transition-opacity duration-300 ease-out
            z-10
          ">
            <FavoritoButton produtoId={id} />
          </div>

          {/* Overlay hover sutil - glow effect */}
          {isHovering && (
            <div className="
              absolute inset-0 rounded-t-card
              bg-gradient-to-br from-gold/0 via-transparent to-dark-light/0
              pointer-events-none opacity-20
              transition-opacity duration-400
            " />
          )}
        </div>

        {/* INFORMAÇÕES DO PRODUTO */}
        <div className="
          flex flex-col flex-grow px-4 pt-5 pb-3
          gap-2.5
        ">
          {/* Nome - Hierarquia 1 */}
          <h3 className="
            font-serif font-semibold
            text-dark-light
            text-sm md:text-base
            line-clamp-2 leading-tight
            group-hover:text-gold
            transition-colors duration-300
          ">
            {nome}
          </h3>

          {/* Rating - Se disponível */}
          {avaliacao > 0 && (
            <div className="flex items-center gap-1.5 mt-0.5">
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
              <span className="text-xs text-text-secondary font-medium">
                ({avaliacao.toFixed(1)})
              </span>
            </div>
          )}

          {/* Preço - Hierarquia 2 */}
          <div className="flex items-baseline gap-2.5 mt-1">
            <span className="
              text-dark-light font-bold
              text-base md:text-lg leading-none
            ">
              R$ {preco.toFixed(2)}
            </span>
            {produto.preco_original && produto.preco_original > preco && (
              <span className="
                text-text-light text-xs
                line-through font-medium
              ">
                R$ {produto.preco_original.toFixed(2)}
              </span>
            )}
          </div>

          {/* Descrição/Stock - Hierarquia 3 */}
          <p className="
            text-text-secondary text-xs
            uppercase tracking-widest font-medium
            mt-1
          ">
            {estoque > 0 ? 'Peça por metro' : 'Indisponível'}
          </p>
        </div>

        {/* AÇÃO DE COMPRA */}
        <div className="
          px-4 pb-4 pt-3
          border-t border-gray-mid
          bg-gradient-to-r from-white/40 to-white/0
          group-hover:bg-gradient-to-r group-hover:from-gold/5 group-hover:to-white/0
          transition-all duration-300
        ">
          <button
            onClick={handleAddToCart}
            disabled={estoque <= 0}
            className="
              w-full
              py-3
              rounded-button
              bg-dark-light text-white
              border-2 border-dark-light
              font-semibold text-xs uppercase tracking-wider
              transition-all duration-400 ease-out
              hover:bg-gold hover:text-dark-light hover:border-gold
              hover:shadow-md-luxury
              active:scale-95
              disabled:opacity-40 disabled:cursor-not-allowed 
              disabled:hover:bg-dark-light disabled:hover:text-white 
              disabled:hover:border-dark-light disabled:hover:shadow-sm-luxury
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold
              flex items-center justify-center gap-2.5
            "
          >
            <ShoppingBag className="w-4 h-4" strokeWidth={2.5} />
            <span>Adicionar</span>
          </button>
        </div>
      </div>
    </Link>
  );
}