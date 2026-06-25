'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

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
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500 text-lg mb-4">Seu carrinho está vazio.</p>
        <Link href="/" className="text-indigo-600 hover:underline">
          Continuar comprando
        </Link>
      </div>
    );
  }

  const totalFinal = totalPrice - (descontoCupom || 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Carrinho de Compras</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row items-center gap-4 border rounded-lg p-4 bg-white shadow-sm"
          >
            {item.foto ? (
              <img src={item.foto} alt={item.nome} className="w-20 h-20 object-cover rounded" />
            ) : (
              <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                📦
              </div>
            )}

            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-semibold">{item.nome}</h3>
              <p className="text-green-700 font-bold">R$ {item.preco.toFixed(2)}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantidade - 1)}
                disabled={item.quantidade <= 1}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                −
              </button>
              <span className="w-8 text-center font-medium">{item.quantidade}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                disabled={item.quantidade >= item.maxEstoque}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                +
              </button>
            </div>

            <p className="font-bold w-24 text-center">
              R$ {(item.preco * item.quantidade).toFixed(2)}
            </p>

            <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 transition">
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Cupom de desconto */}
      <div className="flex gap-2 mt-6">
        <input
          type="text"
          value={codigoCupom}
          onChange={(e) => setCodigoCupom(e.target.value)}
          placeholder="Código do cupom"
          className="border rounded px-3 py-2 flex-1"
        />
        <button
          onClick={async () => {
            try { await aplicarCupom(codigoCupom); } catch {}
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Aplicar
        </button>
      </div>

      {cupom && (
        <div className="flex justify-between text-green-600 mt-2">
          <span>Cupom {cupom.codigo} (-{cupom.desconto}%)</span>
          <button onClick={removerCupom} className="text-red-500">Remover</button>
        </div>
      )}

      {/* Total e ações */}
      <div className="mt-8 border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          {descontoCupom > 0 && (
            <p className="text-sm text-gray-500 line-through">R$ {totalPrice.toFixed(2)}</p>
          )}
          <p className="text-2xl font-bold">Total: R$ {totalFinal.toFixed(2)}</p>
        </div>
        <div className="flex gap-4">
          <Link href="/" className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300">
            Continuar Comprando
          </Link>
          <Link href="/checkout" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">
            Finalizar Pedido
          </Link>
        </div>
      </div>
    </div>
  );
}