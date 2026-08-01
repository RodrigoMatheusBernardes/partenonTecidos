'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import toast from 'react-hot-toast';

interface Pedido {
  _id: string;
  cliente: { nome: string; email: string };
  total: number;
  status: string;
  paymentStatus: string; // ← NOVO
  paymentMethod: string; // ← NOVO
  createdAt: string;
}

export default function AdminPedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const apiUrl = getApiUrl();
    const token = localStorage.getItem('token');
    axios.get(`${apiUrl}/api/pedidos/admin`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setPedidos(res.data))
      .catch(() => toast.error('Erro ao carregar'))
      .finally(() => setCarregando(false));
  }, []);

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      AGUARDANDO_PAGAMENTO: 'bg-yellow-100 text-yellow-800',
      PAGO: 'bg-green-100 text-green-800',
      pendente: 'bg-yellow-100 text-yellow-800',
      confirmado: 'bg-blue-100 text-blue-800',
      enviado: 'bg-purple-100 text-purple-800',
      entregue: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800',
      EXPIRADO: 'bg-red-100 text-red-800',
    };
    return map[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusBadge = (paymentStatus: string) => {
    const map: Record<string, string> = {
      PAGO: 'bg-green-100 text-green-800',
      AGUARDANDO_PAGAMENTO: 'bg-yellow-100 text-yellow-800',
      EXPIRADO: 'bg-red-100 text-red-800',
      CANCELADO: 'bg-red-100 text-red-800',
    };
    return map[paymentStatus] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusLabel = (paymentStatus: string) => {
    const map: Record<string, string> = {
      PAGO: '✅ Pago',
      AGUARDANDO_PAGAMENTO: '⏳ Aguardando',
      EXPIRADO: '❌ Expirado',
      CANCELADO: '🚫 Cancelado',
    };
    return map[paymentStatus] || paymentStatus || '⏳ Aguardando';
  };

  if (carregando) return <p className="p-6 text-text-secondary">Carregando...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Pedidos</h1>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3">Pedido</th>
              <th className="p-3">Cliente</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Pagamento</th> {/* ← NOVO */}
              <th className="p-3">Data</th>
              <th className="p-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map(ped => (
              <tr key={ped._id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-mono">#{ped._id.slice(-6)}</td>
                <td className="p-3">{ped.cliente?.nome}</td>
                <td className="p-3">R$ {ped.total?.toFixed(2)}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(ped.status)}`}>
                    {ped.status}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadge(ped.paymentStatus)}`}>
                    {getPaymentStatusLabel(ped.paymentStatus)}
                  </span>
                </td>
                <td className="p-3 text-sm">{new Date(ped.createdAt).toLocaleDateString('pt-BR')}</td>
                <td className="p-3 text-center">
                  <Link
                    href={`/admin/pedidos/${ped._id}`}
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    Detalhes
                  </Link>
                </td>
              </tr>
            ))}
            {pedidos.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-400">
                  Nenhum pedido.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}