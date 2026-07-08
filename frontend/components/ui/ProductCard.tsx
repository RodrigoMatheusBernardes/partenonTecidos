'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Heart } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';

const DEFAULT_IMAGE = '/images/placeholder.jpg'; // Certifique-se de ter uma imagem bonita padrão

export default function ProductCard({ produto }: { produto: any }) {
  const { addItem } = useCart();
  const [imgError, setImgError] = useState(false);

  // Dados seguros
  const id = produto._id || '';
  const nome = produto.nome || 'Tecido de Linho';
  const preco = typeof produto.preco === 'number' ? produto.preco : 0;
  const imagem = (produto.fotos?.[0] || produto.imagemUrl || DEFAULT_IMAGE);
  const estoque = typeof produto.estoque === 'number' ? produto.estoque : 0;

  // Se a imagem ainda tiver localhost, corrige automaticamente
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
    <Link href={`/produto/${id}`} className="group block">
      <div className="relative bg-white p-4 rounded-lg transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
        
        {/* IMAGEM DO PRODUTO (Área principal) */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-[#f5f2ee] mb-4">
          <Image
            src={imageSrc}
            alt={nome}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImgError(true)}
          />
          
          {/* Se tiver estoque baixo, um aviso sutil */}
          {estoque > 0 && estoque <= 5 && (
            <span className="absolute top-2 left-2 bg-[#1a1a1a] text-white text-[10px] uppercase tracking-widest px-2 py-1">
              Últimas unidades
            </span>
          )}
        </div>

        {/* INFORMAÇÕES DO PRODUTO */}
        <div className="text-center space-y-2">
          <h3 className="font-serif font-light text-[#1a1a1a] text-lg md:text-xl tracking-wide line-clamp-1">
            {nome}
          </h3>
          
          <div className="flex justify-center items-center gap-2">
            <span className="text-sm font-light text-[#1a1a1a]">
              R$ {preco.toFixed(2)}
            </span>
          </div>

          <p className="text-[10px] text-[#8a7a6a] font-light tracking-wider">
            {estoque > 0 ? 'Peça por metro' : 'Indisponível'}
          </p>
        </div>

        {/* AÇÃO DE COMPRA (Ícone minimalista) */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleAddToCart}
            disabled={estoque <= 0}
            className="w-10 h-10 rounded-full border border-[#1a1a1a] text-[#1a1a1a] flex items-center justify-center hover:bg-[#1a1a1a] hover:text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </Link>
  );
}