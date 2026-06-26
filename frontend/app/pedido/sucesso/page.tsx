'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getApiUrl } from '@/lib/api';
import axios from 'axios';

// Essa diretiva força a página a ser dinâmica (não tenta pré-renderizar)
export const dynamic = 'force-dynamic';

// Componente separado que usa useSearchParams (deve ficar dentro do Suspense)
function PedidoSucessoContent() {
  const searchParams = useSearchParams();
  const [pedido, setPedido] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (!orderId) {
      setErro('ID do pedido não encontrado.');
      setCarregando(false);
      return;
    }

    const apiUrl = getApiUrl();
    axios.get(`${apiUrl}/api/pedidos/${orderId}`)
      .then(res => setPedido(res.data))
      .catch(err => {
        console.error(err);
        setErro('Erro ao carregar os detalhes do pedido.');
      })
      .finally(() => setCarregando(false));
  }, [orderId]);

  if (carregando) return <div className="text-center py-12">Carregando detalhes do pedido...</div>;
  if (erro) return <div className="text-center py-12 text-red-600">{erro}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-10 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
          ✓
        </div>
        <h1 className="text-3xl font-bold mb-2">Pedido realizado com sucesso!</h1>
        <p className="text-gray-600 mb-6">Obrigado pela sua compra. Em breve você receberá um e-mail com os detalhes.</p>
        <div className="border-t border-gray-200 pt-6 mb-6">
          <p className="text-sm text-gray-500">Número do pedido: <span className="font-medium text-gray-800">{pedido?._id || orderId}</span></p>
          <p className="text-sm text-gray-500 mt-1">Total: <span className="font-medium text-gray-800">R$ {pedido?.total ? pedido.total.toFixed(2) : '0,00'}</span></p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/loja" className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition">
            Continuar comprando
          </Link>
          <Link href="/pedidos" className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition">
            Ver meus pedidos
          </Link>
        </div>
      </div>
    </div>
  );
}

// Página principal envolvida em Suspense
export default function PedidoSucessoPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Carregando...</div>}>
      <PedidoSucessoContent />
    </Suspense>
  );
}