'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart();
  const [animate, setAnimate] = useState(false);

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
    toast.success(`${nome} removido`, { className: 'toast-success' });
  };

  const handleUpdateQuantity = (id: string, quantidade: number) => {
    if (isNaN(quantidade) || quantidade < 1) return;
    updateQuantity(id, quantidade);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
        onClick={onClose}
      />
      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-xl z-50 flex flex-col transition-transform duration-300 ${
          animate ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Cabeçalho */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">
            🛒 Carrinho ({totalItems} {totalItems === 1 ? 'item' : 'itens'})
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">✕</button>
        </div>

        {/* Itens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Seu carrinho está vazio</p>
              <button onClick={onClose} className="mt-4 text-primary hover:underline">Continuar comprando</button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-3 border-b pb-3">
                {item.foto && (
                  <Image src={item.foto} alt={item.nome} width={60} height={60} className="object-cover rounded" />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{item.nome}</h3>
                  <p className="text-primary font-bold text-sm">R$ {item.preco.toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <select
                      value={item.quantidade}
                      onChange={e => handleUpdateQuantity(item.id, Number(e.target.value))}
                      className="border rounded px-1 py-0.5 text-sm"
                    >
                      {[...Array(Math.min(item.maxEstoque, 10))].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                    <button onClick={() => handleRemove(item.id, item.nome)} className="text-red-500 text-xs hover:underline">Remover</button>
                  </div>
                </div>
                <div className="text-right font-semibold text-sm">
                  R$ {(item.preco * item.quantidade).toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Rodapé */}
        {items.length > 0 && (
          <div className="border-t p-4">
            <div className="flex justify-between mb-4">
              <span className="font-semibold">Total:</span>
              <span className="text-xl font-bold text-primary">R$ {totalPrice.toFixed(2)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="w-full bg-primary text-white py-3 rounded-xl text-center block font-semibold hover:bg-green-700 transition active:scale-[0.98]"
            >
              Finalizar compra
            </Link>
            <button onClick={onClose} className="w-full mt-2 text-primary text-sm hover:underline">
              Continuar comprando
            </button>
          </div>
        )}
      </div>
    </>
  );
}