'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import toast from 'react-hot-toast';

interface ItemPedido {
  produtoId: string;
  nome: string;
  preco: number;
  quantidade: number;
}

interface Pedido {
  _id: string;
  cliente: {
    nome: string;
    email: string;
  };
  itens: ItemPedido[];
  total: number;
  status: string;
  createdAt: string;
}

const STATUS_OPCOES = ['pendente', 'confirmado', 'enviado', 'entregue', 'cancelado'];

export default function DetalhesPedidoPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [salvandoStatus, setSalvandoStatus] = useState(false);

  const carregarPedido = async () => {
    try {
      const apiUrl = getApiUrl();
      const token = localStorage.getItem('token');
      if (!token) { toast.error('Login necessário'); router.push('/login'); return; }
      const res = await axios.get(`${apiUrl}/api/pedidos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPedido(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao carregar pedido.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    carregarPedido();
  }, [id]);

  const handleStatusChange = async (novoStatus: string) => {
    if (!pedido || novoStatus === pedido.status) return;
    setSalvandoStatus(true);
    try {
      const apiUrl = getApiUrl();
      const token = localStorage.getItem('token');
      await axios.put(`${apiUrl}/api/pedidos/${id}`, 
        { status: novoStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPedido(prev => prev ? { ...prev, status: novoStatus } : null);
      toast.success(`Status atualizado para "${novoStatus}"!`);
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Erro ao atualizar status.';
      toast.error(msg);
    } finally {
      setSalvandoStatus(false);
    }
  };

  if (carregando) return <p className="p-8 text-center">Carregando pedido...</p>;
  if (!pedido) return <p className="p-8 text-center text-red-600">Pedido não encontrado.</p>;

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      pendente: 'bg-yellow-100 text-yellow-800',
      confirmado: 'bg-blue-100 text-blue-800',
      enviado: 'bg-purple-100 text-purple-800',
      entregue: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Pedido #{pedido._id.slice(-6)}</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div><span className="font-semibold">Cliente:</span> {pedido.cliente?.nome}</div>
          <div><span className="font-semibold">Email:</span> {pedido.cliente?.email}</div>
          <div><span className="font-semibold">Data:</span> {new Date(pedido.createdAt).toLocaleString('pt-BR')}</div>
          <div>
            <span className="font-semibold">Status:</span>
            <div className="flex items-center gap-2 mt-1">
              <select
                value={pedido.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={salvandoStatus}
                className="border rounded px-2 py-1 text-sm bg-white focus:ring-2 focus:ring-primary"
              >
                {STATUS_OPCOES.map(op => (
                  <option key={op} value={op}>{op}</option>
                ))}
              </select>
              {salvandoStatus && <span className="text-xs text-gray-500">Salvando...</span>}
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">Itens</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Produto</th>
              <th className="p-2 text-right">Qtd</th>
              <th className="p-2 text-right">Unitário</th>
              <th className="p-2 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {pedido.itens.map((item, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{item.nome}</td>
                <td className="p-2 text-right">{item.quantidade}</td>
                <td className="p-2 text-right">R$ {item.preco.toFixed(2)}</td>
                <td className="p-2 text-right">R$ {(item.preco * item.quantidade).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xl font-bold mt-4 text-right">Total: R$ {pedido.total.toFixed(2)}</p>
      </div>
    </div>
  );
}