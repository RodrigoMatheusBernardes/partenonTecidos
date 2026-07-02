'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import Link from 'next/link';

interface PedidoDetalhe {
  _id: string;
  total: number;
  comissao_valor: number;
  createdAt: string;
  cliente: { nome: string; email: string };
  itens: { nome: string; quantidade: number; preco: number }[];
}

export default function VendasVendedorPage() {
  const { codigo } = useParams<{ codigo: string }>();
  const [pedidos, setPedidos] = useState<PedidoDetalhe[]>([]);
  const [totalVendas, setTotalVendas] = useState(0);
  const [totalComissao, setTotalComissao] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const apiUrl = getApiUrl();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';

  const carregar = async () => {
    setCarregando(true);
    try {
      const params: Record<string, string> = {};
      if (dataInicio) params.inicio = dataInicio;
      if (dataFim) params.fim = dataFim;

      const res = await axios.get(`${apiUrl}/api/admin/relatorios/vendas-por-vendedor/${codigo}`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setPedidos(res.data.pedidos);
      setTotalVendas(res.data.totalVendas);
      setTotalComissao(res.data.totalComissao);
    } catch (err) {
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregar();
  }, [codigo]);

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/relatorios" className="text-primary hover:underline text-sm">← Voltar</Link>
        <h1 className="text-3xl font-bold">Vendas de {codigo}</h1>
      </div>

      <div className="flex flex-wrap items-end gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Data inicial</label>
          <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Data final</label>
          <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
        </div>
        <button onClick={carregar} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm">Filtrar</button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-sm text-gray-500">Total em Vendas</p>
          <p className="text-2xl font-bold text-primary">R$ {totalVendas.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-sm text-gray-500">Total Comissão</p>
          <p className="text-2xl font-bold text-primary">R$ {totalComissao.toFixed(2)}</p>
        </div>
      </div>

      {carregando ? (
        <p className="text-gray-500">Carregando...</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3">Pedido</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Itens</th>
                <th className="p-3">Total</th>
                <th className="p-3">Comissão</th>
                <th className="p-3">Data</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map(p => (
                <tr key={p._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-mono text-xs">#{p._id.slice(-6)}</td>
                  <td className="p-3">{p.cliente?.nome}</td>
                  <td className="p-3 text-xs">
                    {p.itens.map(i => `${i.nome} x${i.quantidade}`).join(', ')}
                  </td>
                  <td className="p-3">R$ {p.total.toFixed(2)}</td>
                  <td className="p-3">R$ {(p.comissao_valor || 0).toFixed(2)}</td>
                  <td className="p-3 text-xs">{new Date(p.createdAt).toLocaleString('pt-BR')}</td>
                </tr>
              ))}
              {pedidos.length === 0 && (
                <tr><td colSpan={6} className="p-6 text-center text-gray-400">Nenhum pedido encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}