'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { authFetch } from '@/lib/auth';
import { ArrowLeft, Loader2, ShoppingBag, Calendar } from 'lucide-react';
import Link from 'next/link';

interface Pedido {
  _id: string;
  total: number;
  status: string;
  createdAt: string;
  itens: { nome: string; quantidade: number; preco: number }[];
  cliente: { nome: string; email: string };
}

export default function ClienteDetalhesPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [cliente, setCliente] = useState<{ nome: string; email: string } | null>(null);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const res = await authFetch(`/api/admin/clientes/${id}/pedidos`);
        if (!res.ok) throw new Error('Erro ao carregar dados');
        const data = await res.json();
        setCliente(data.cliente);
        setPedidos(data.pedidos);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) carregarDados();
  }, [id]);

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
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!cliente) {
    return <p className="text-text-secondary">Cliente não encontrado.</p>;
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="text-text-secondary hover:text-dark-light transition-colors"
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={2} />
        </button>
        <div>
          <h1 className="font-serif text-3xl font-semibold text-dark-light">{cliente.nome}</h1>
          <p className="text-text-secondary text-sm">{cliente.email}</p>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-light rounded-card border border-gray-mid p-4 flex items-center gap-3">
          <ShoppingBag className="w-5 h-5 text-gold" strokeWidth={1.5} />
          <div>
            <p className="text-xs text-text-light">Total de Pedidos</p>
            <p className="text-xl font-semibold text-dark-light">{pedidos.length}</p>
          </div>
        </div>
        {pedidos.length > 0 && (
          <div className="bg-light rounded-card border border-gray-mid p-4 flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gold" strokeWidth={1.5} />
            <div>
              <p className="text-xs text-text-light">Última compra</p>
              <p className="text-sm font-medium text-dark-light">
                {new Date(pedidos[0].createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Lista de pedidos */}
      {pedidos.length === 0 ? (
        <p className="text-text-secondary text-center py-12">Este cliente ainda não fez nenhum pedido.</p>
      ) : (
        <div className="bg-white rounded-card shadow-sm-luxury border border-gray-mid overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-light border-b border-gray-mid">
              <tr>
                <th className="p-4 text-xs font-medium uppercase tracking-wider text-text-light">Pedido</th>
                <th className="p-4 text-xs font-medium uppercase tracking-wider text-text-light">Itens</th>
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
                  <td className="p-4 text-sm text-text-secondary">
                    {pedido.itens.length} {pedido.itens.length === 1 ? 'item' : 'itens'}
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
                      href={`/admin/pedidos/${pedido._id}`}
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