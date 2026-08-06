'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { authGet } from '@/lib/auth';
import Link from 'next/link';

interface Pedido {
  _id: string;
  cliente: { nome: string; email: string };
  total: number;
  status: string;
  createdAt: string;
  itens: { nome: string; quantidade: number; preco: number }[];
}

export default function SellerPedidosPage() {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const res = await authGet(`/api/pedidos`);
        setPedidos(res.data);
      } catch (err) {
        console.error('Erro ao carregar pedidos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      pendente: 'bg-yellow-100 text-yellow-800',
      confirmado: 'bg-blue-100 text-blue-800',
      enviado: 'bg-purple-100 text-purple-800',
      entregue: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800',
    };
    return map[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gold" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold text-dark-light mb-6">Meus Pedidos</h1>

      {pedidos.length === 0 ? (
        <p className="text-text-secondary text-center py-12">Nenhum pedido encontrado.</p>
      ) : (
        <div className="bg-white rounded-card shadow-sm-luxury border border-gray-mid overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-light border-b border-gray-mid">
              <tr>
                <th className="p-4 text-xs font-medium uppercase tracking-wider text-text-light">Pedido</th>
                <th className="p-4 text-xs font-medium uppercase tracking-wider text-text-light">Cliente</th>
                <th className="p-4 text-xs font-medium uppercase tracking-wider text-text-light">Total</th>
                <th className="p-4 text-xs font-medium uppercase tracking-wider text-text-light">Status</th>
                <th className="p-4 text-xs font-medium uppercase tracking-wider text-text-light">Data</th>
                <th className="p-4 text-xs font-medium uppercase tracking-wider text-text-light">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-mid">
              {pedidos.map((pedido) => (
                <tr key={pedido._id} className="hover:bg-light/50 transition-colors">
                  <td className="p-4 font-mono text-sm text-text-secondary">#{pedido._id.slice(-6)}</td>
                  <td className="p-4">
                    <p className="font-medium text-dark-light">{pedido.cliente?.nome || 'N/A'}</p>
                    <p className="text-xs text-text-light">{pedido.cliente?.email || ''}</p>
                  </td>
                  <td className="p-4 font-semibold text-dark-light">R$ {pedido.total.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(pedido.status)}`}>
                      {pedido.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-text-secondary">
                    {new Date(pedido.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-4">
                    <Link
                      href={`/seller/pedidos/${pedido._id}`}
                      className="text-gold hover:underline text-sm font-medium"
                    >
                      Detalhes
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}