'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Trash2, Plus, Minus } from 'lucide-react';

export default function CarrinhoPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    totalPrice,
    aplicarCupom,
    removerCupom,
    cupom,
    descontoCupom,
  } = useCart();

  const [codigoCupom, setCodigoCupom] = useState('');

  if (items.length === 0) {
    return (
      <div className="main-container py-16 md:py-20 text-center">
        <p className="text-text-secondary text-lg mb-4">Seu carrinho está vazio.</p>
        <Link href="/" className="text-gold hover:underline">
          Continuar comprando
        </Link>
      </div>
    );
  }

  const totalFinal = totalPrice - (descontoCupom || 0);

  return (
    <div className="main-container py-16 md:py-20">
      <h1 className="font-serif font-semibold text-3xl md:text-4xl text-dark-light mb-8">
        Carrinho de Compras
      </h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row items-center gap-4 border border-gray-mid rounded-card p-4 bg-white shadow-sm-luxury"
          >
            {item.foto ? (
              <img
                src={item.foto.replace('http://localhost:5000', 'https://partenontecidos.onrender.com')}
                alt={item.nome}
                className="w-20 h-20 object-cover rounded-card"
              />
            ) : (
              <div className="w-20 h-20 bg-light rounded-card flex items-center justify-center text-text-light">
                📦
              </div>
            )}

            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-serif font-medium text-dark-light">{item.nome}</h3>
              <p className="text-gold font-semibold">R$ {item.preco.toFixed(2)}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantidade - 1)}
                disabled={item.quantidade <= 1}
                className="w-8 h-8 rounded-full bg-light border border-gray-mid hover:bg-gray-200 disabled:opacity-40 transition"
              >
                <Minus className="w-3 h-3 mx-auto" strokeWidth={2} />
              </button>
              <span className="w-8 text-center font-medium text-dark-light">
                {item.quantidade}
              </span>
              <button
                onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                disabled={item.quantidade >= item.maxEstoque}
                className="w-8 h-8 rounded-full bg-light border border-gray-mid hover:bg-gray-200 disabled:opacity-40 transition"
              >
                <Plus className="w-3 h-3 mx-auto" strokeWidth={2} />
              </button>
            </div>

            <p className="font-semibold text-dark-light w-24 text-center">
              R$ {(item.preco * item.quantidade).toFixed(2)}
            </p>

            <button
              onClick={() => removeItem(item.id)}
              className="text-error hover:text-red-700 transition p-1"
              aria-label="Remover item"
            >
              <Trash2 className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>
        ))}
      </div>

      {/* Cupom de desconto */}
      <div className="flex flex-col sm:flex-row gap-2 mt-8 max-w-md">
        <input
          type="text"
          value={codigoCupom}
          onChange={(e) => setCodigoCupom(e.target.value)}
          placeholder="Código do cupom"
          className="flex-1 border border-gray-mid rounded-button px-4 py-2.5 text-sm bg-white text-dark-light placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-gold transition"
        />
        <Button
          variant="primary"
          size="sm"
          onClick={async () => {
            try { await aplicarCupom(codigoCupom); } catch {}
          }}
          className="whitespace-nowrap"
        >
          Aplicar
        </Button>
      </div>

      {cupom && (
        <div className="flex flex-wrap items-center justify-between text-success mt-2 text-sm">
          <span>Cupom <strong>{cupom.codigo}</strong> (-{cupom.desconto}%)</span>
          <button onClick={removerCupom} className="text-error hover:underline">Remover</button>
        </div>
      )}

      {/* Total e ações */}
      <div className="mt-12 border-t border-gray-mid pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          {descontoCupom > 0 && (
            <p className="text-sm text-text-light line-through">R$ {totalPrice.toFixed(2)}</p>
          )}
          <p className="text-2xl font-serif font-semibold text-dark-light">
            Total: R$ {totalFinal.toFixed(2)}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button href="/" variant="secondary" size="lg" className="w-full sm:w-auto">
            Continuar Comprando
          </Button>
          <Button href="/checkout" variant="primary" size="lg" className="w-full sm:w-auto">
            Finalizar Pedido
          </Button>
        </div>
      </div>
    </div>
  );
}