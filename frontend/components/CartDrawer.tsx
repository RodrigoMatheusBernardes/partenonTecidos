'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const router = useRouter();
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart();
  const [animate, setAnimate] = useState(false);

  // Fecha o drawer ao navegar para outra página
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a') && isOpen) {
        setTimeout(onClose, 100);
      }
    };
    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setAnimate(true);
      document.body.style.overflow = 'hidden';
    } else {
      setAnimate(false);
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleRemove = (id: string, nome: string) => {
    removeItem(id);
    toast.success(`${nome} removido do carrinho`);
  };

  const handleUpdateQuantity = (id: string, quantidade: number, maxEstoque: number) => {
    if (isNaN(quantidade) || quantidade < 1 || quantidade > maxEstoque) return;
    updateQuantity(id, quantidade);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* OVERLAY – mais suave */}
      <div
        className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* DRAWER – vidro fosco com transparência ajustada */}
      <div
        className={`
          fixed top-0 right-0 h-full w-full max-w-md
          bg-white/60 backdrop-blur-lg shadow-xl-luxury z-50
          flex flex-col transition-transform duration-300
          ${animate ? 'translate-x-0' : 'translate-x-full'}
          border-l border-white/30
        `}
      >
        {/* HEADER */}
        <div className="
          flex items-center justify-between
          p-6 border-b border-gray-mid/20
          bg-light/30
        ">
          <h2 className="font-serif text-2xl font-semibold text-dark-light">
            Carrinho
          </h2>
          <span className="
            inline-flex items-center justify-center
            bg-dark-light text-white
            w-7 h-7 rounded-full
            text-xs font-bold
          ">
            {totalItems}
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Fechar carrinho"
            className="!p-2 !h-auto !w-auto"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </Button>
        </div>

        {/* ITEMS */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="
              h-full flex flex-col items-center justify-center
              p-8 text-center
            ">
              <div className="
                w-16 h-16 rounded-card
                bg-light/30 backdrop-blur-sm flex items-center justify-center
                mb-4
              ">
                <svg className="w-8 h-8 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-text-secondary font-medium mb-4">Seu carrinho está vazio</p>
              <Button
                variant="primary"
                size="md"
                onClick={onClose}
              >
                Continuar comprando
              </Button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {items.map(item => (
                <div
                  key={item.id}
                  className="
                    flex gap-4 p-4
                    bg-white/50 backdrop-blur-sm rounded-card
                    border border-gray-mid/20
                    transition-all duration-300
                    hover:border-dark-light
                  "
                >
                  {/* IMAGEM */}
                  {item.foto && (
                    <div className="
                      relative w-20 h-20 flex-shrink-0
                      rounded-card overflow-hidden
                      bg-gray-mid
                    ">
                      <Image
                        src={item.foto.replace('http://localhost:5000', 'https://partenontecidos.onrender.com')}
                        alt={item.nome}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  )}

                  {/* INFO */}
                  <div className="flex-1 min-w-0">
                    <h3 className="
                      font-serif font-medium text-dark-light
                      text-sm md:text-base
                      line-clamp-2 mb-2
                    ">
                      {item.nome}
                    </h3>
                    <p className="text-gold font-semibold text-sm md:text-base mb-3">
                      R$ {item.preco.toFixed(2)}
                    </p>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="!w-8 !h-8 !p-0 border border-[#e8e3dc] hover:bg-[#f5f2ee] rounded-full"
                        onClick={() => handleUpdateQuantity(item.id, item.quantidade - 1, item.maxEstoque)}
                        disabled={item.quantidade <= 1}
                      >
                        <Minus className="w-3 h-3" strokeWidth={2} />
                      </Button>

                      {/* QUANTIDADE – cor escura */}
                      <span className="w-8 text-center font-medium text-sm text-dark-light">
                        {item.quantidade}
                      </span>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="!w-8 !h-8 !p-0 border border-[#e8e3dc] hover:bg-[#f5f2ee] rounded-full"
                        onClick={() => handleUpdateQuantity(item.id, item.quantidade + 1, item.maxEstoque)}
                        disabled={item.quantidade >= item.maxEstoque}
                      >
                        <Plus className="w-3 h-3" strokeWidth={2} />
                      </Button>

                      {/* SUBTOTAL DO ITEM – cor escura */}
                      <span className="ml-auto text-right text-sm font-semibold text-dark-light">
                        R$ {(item.preco * item.quantidade).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="!p-2 !h-auto !w-auto text-red-500 hover:bg-red-50"
                    onClick={() => handleRemove(item.id, item.nome)}
                    aria-label={`Remover ${item.nome} do carrinho`}
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={2} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        {items.length > 0 && (
          <div className="
            border-t border-gray-mid/20
            p-6 bg-light/30 backdrop-blur-sm space-y-4
          ">
            <div className="
              flex items-center justify-between
              pb-4 border-b border-gray-mid/20
            ">
              <span className="text-text-secondary font-medium">Subtotal:</span>
              <span className="text-2xl font-serif font-semibold text-dark-light">
                R$ {totalPrice.toFixed(2)}
              </span>
            </div>

            <div className="space-y-3">
              <Button
                href="/checkout"
                variant="primary"
                size="lg"
                className="w-full"
                onClick={onClose}
              >
                Finalizar Compra
              </Button>

              <Button
                variant="secondary"
                size="lg"
                className="w-full"
                onClick={onClose}
              >
                Continuar Comprando
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}