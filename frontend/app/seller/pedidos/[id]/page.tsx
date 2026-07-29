'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getApiUrl } from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

interface Pedido {
  _id: string;
  cliente: { nome: string; email: string };
  itens: { nome: string; quantidade: number; preco: number }[];
  total: number;
  status: string;
  createdAt: string;
}

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

export default function SellerPedidoDetalhesPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchPedido = async () => {
    try {
      const apiUrl = getApiUrl();
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/api/pedidos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPedido(data);
      } else {
        router.push('/seller/pedidos');
      }
    } catch (err) {
      console.error('Erro ao carregar pedido:', err);
      router.push('/seller/pedidos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchPedido();
  }, [id, router]);

  const handleStatusChange = async (novoStatus: string) => {
    if (!pedido) return;
    setUpdating(true);
    try {
      const apiUrl = getApiUrl();
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/api/pedidos/${pedido._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: novoStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setPedido(data.pedido);
        toast.success('Status atualizado com sucesso!');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Erro ao atualizar status.');
      }
    } catch (err) {
      toast.error('Erro de conexão.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gold" />
      </div>
    );
  }

  if (!pedido) {
    return <p className="text-text-secondary">Pedido não encontrado.</p>;
  }

  return (
    <div>
      <Link
        href="/seller/pedidos"
        className="inline-flex items-center gap-2 text-text-secondary hover:text-dark-light transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={2} />
        Voltar
      </Link>

      <h1 className="font-serif text-3xl font-semibold text-dark-light mb-6">
        Pedido #{pedido._id.slice(-6)}
      </h1>

      <div className="bg-white rounded-card shadow-sm-luxury border border-gray-mid p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-text-light">Cliente</p>
            <p className="font-medium text-dark-light">{pedido.cliente?.nome}</p>
            <p className="text-sm text-text-secondary">{pedido.cliente?.email}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-text-light">Status</p>
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(pedido.status)}`}>
                {pedido.status}
              </span>
              {user?.role === 'seller' && (
                <select
                  value={pedido.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={updating}
                  className="border border-gray-mid rounded-button px-2 py-1 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <option value="pendente">Pendente</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="enviado">Enviado</option>
                  <option value="entregue">Entregue</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              )}
              {updating && <span className="text-xs text-text-light animate-pulse">Salvando...</span>}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-text-light">Data</p>
            <p className="text-sm text-text-secondary">
              {new Date(pedido.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-text-light">Total</p>
            <p className="text-2xl font-serif font-semibold text-dark-light">
              R$ {pedido.total.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-mid pt-6">
          <h3 className="font-serif text-lg font-semibold text-dark-light mb-4">Itens</h3>
          <table className="w-full text-left">
            <thead className="bg-light border-b border-gray-mid">
              <tr>
                <th className="p-3 text-xs font-medium uppercase tracking-wider text-text-light">Produto</th>
                <th className="p-3 text-xs font-medium uppercase tracking-wider text-text-light">Qtd</th>
                <th className="p-3 text-xs font-medium uppercase tracking-wider text-text-light">Preço</th>
                <th className="p-3 text-xs font-medium uppercase tracking-wider text-text-light">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-mid">
              {pedido.itens.map((item, idx) => (
                <tr key={idx}>
                  <td className="p-3 font-medium text-dark-light">{item.nome}</td>
                  <td className="p-3 text-text-secondary">{item.quantidade}</td>
                  <td className="p-3 text-text-secondary">R$ {item.preco.toFixed(2)}</td>
                  <td className="p-3 font-semibold text-dark-light">
                    R$ {(item.preco * item.quantidade).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}