'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import Link from 'next/link';

interface ItemPedido {
  nome: string;
  quantidade: number;
  preco_unitario?: number;   // opcional para segurança
}

interface Pedido {
  _id: string;
  total: number;
  status: string;
  createdAt: string;
  itens: ItemPedido[];
}

export default function MeusPedidosPage() {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!user?.email) return;
    const apiUrl = getApiUrl();
    const token = localStorage.getItem('token');
    if (!token) {
      setErro('Você precisa estar logado.');
      setCarregando(false);
      return;
    }
    axios.get(`${apiUrl}/api/pedidos`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setPedidos(res.data))
      .catch(err => {
        console.error(err);
        setErro('Erro ao carregar pedidos.');
      })
      .finally(() => setCarregando(false));
  }, [user]);

  if (!user) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <p>Faça login para ver seus pedidos.</p>
      </main>
    );
  }

  if (carregando) {
    return <main className="max-w-4xl mx-auto px-4 py-8"><p>Carregando...</p></main>;
  }

  if (erro) {
    return <main className="max-w-4xl mx-auto px-4 py-8"><p className="text-red-600">{erro}</p></main>;
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Meus Pedidos</h1>
      {pedidos.length === 0 ? (
        <p className="text-gray-500">Nenhum pedido encontrado.</p>
      ) : (
        <div className="space-y-4">
          {pedidos.map(pedido => (
            <div key={pedido._id} className="border rounded-lg p-4 shadow-sm bg-white">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-800">Pedido #{pedido._id.slice(-8)}</span>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  pedido.status === 'pago' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {pedido.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {new Date(pedido.createdAt).toLocaleDateString()} - {pedido.itens.length} itens
              </p>
              <ul className="text-sm text-gray-700 mb-2 divide-y">
                {pedido.itens.map((item, i) => (
                  <li key={i} className="py-1">
                    {item.nome} x {item.quantidade} - R$ {(item.preco_unitario ?? 0).toFixed(2)}
                  </li>
                ))}
              </ul>
              <p className="font-bold text-lg text-primary">
                Total: R$ {(pedido.total ?? 0).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}
      <Link href="/" className="mt-6 inline-block text-primary hover:underline">← Continuar comprando</Link>
    </main>
  );
}