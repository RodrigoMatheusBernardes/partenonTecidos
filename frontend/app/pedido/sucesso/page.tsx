'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SucessoPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const total = searchParams.get('total');
  const desconto = searchParams.get('desconto');
  const cupom = searchParams.get('cupom');

  return (
    <main className="max-w-lg mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-bold text-primary mb-4">Pedido realizado com sucesso!</h1>
      <p className="text-gray-600 mb-2">Pedido #{id?.slice(-6)}</p>
      {cupom && (
        <p className="text-sm text-green-600">
          Cupom {cupom} aplicado: -R$ {parseFloat(desconto || '0').toFixed(2)}
        </p>
      )}
      <p className="text-2xl font-bold mt-4">Total: R$ {parseFloat(total || '0').toFixed(2)}</p>
      <Link href="/" className="mt-6 inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
        Continuar comprando
      </Link>
    </main>
  );
}