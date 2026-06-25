'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface VendaVendedor {
  vendedor_codigo: string;
  total_vendas: number;
  total_comissao: number;
  quantidade_pedidos: number;
}

export default function AdminRelatoriosPage() {
  const [dados, setDados] = useState<VendaVendedor[]>([]);
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

      const res = await axios.get(`${apiUrl}/api/admin/relatorios/comissoes`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setDados(res.data);
    } catch (err) {
      toast.error('Erro ao carregar relatório');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  // Totais gerais
  const totalVendas = dados.reduce((acc, d) => acc + d.total_vendas, 0);
  const totalComissao = dados.reduce((acc, d) => acc + d.total_comissao, 0);
  const totalPedidos = dados.reduce((acc, d) => acc + d.quantidade_pedidos, 0);

  const exportarCSV = () => {
    const rows = [
      ['Código Vendedor', 'Total Vendas (R$)', 'Comissão (R$)', 'Nº Pedidos'],
      ...dados.map(d => [
        d.vendedor_codigo,
        d.total_vendas.toFixed(2).replace('.', ','),
        d.total_comissao.toFixed(2).replace('.', ','),
        d.quantidade_pedidos.toString(),
      ]),
      ['TOTAL', totalVendas.toFixed(2).replace('.', ','), totalComissao.toFixed(2).replace('.', ','), totalPedidos.toString()],
    ];

    const csvContent = rows.map(row => row.join(';')).join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_comissoes_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Relatório exportado!');
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Relatórios de Comissões</h1>

      {/* Filtros */}
      <div className="flex flex-wrap items-end gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Data inicial</label>
          <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} className="border rounded-lg px-3 py-2 text-sm bg-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Data final</label>
          <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} className="border rounded-lg px-3 py-2 text-sm bg-white" />
        </div>
        <button onClick={carregar} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm">
          Filtrar
        </button>
        <button onClick={exportarCSV} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm">
          📥 Exportar CSV
        </button>
      </div>

      {/* Cards de resumo */}
      {!carregando && dados.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-sm text-gray-500">Total em Vendas</p>
            <p className="text-2xl font-bold text-primary">R$ {totalVendas.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-sm text-gray-500">Total em Comissões</p>
            <p className="text-2xl font-bold text-primary">R$ {totalComissao.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-sm text-gray-500">Nº de Pedidos</p>
            <p className="text-2xl font-bold text-primary">{totalPedidos}</p>
          </div>
        </div>
      )}

      {/* Tabela por vendedor */}
      {carregando ? (
        <p className="text-gray-500">Carregando...</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 font-semibold">Código Vendedor</th>
                <th className="p-3 font-semibold">Total em Vendas (R$)</th>
                <th className="p-3 font-semibold">Total Comissão (R$)</th>
                <th className="p-3 font-semibold">Nº Pedidos</th>
              </tr>
            </thead>
            <tbody>
              {dados.map(d => (
                <tr key={d.vendedor_codigo} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-mono">
  <div className="flex items-center gap-2">
    <Link
      href={`/admin/relatorios/vendedor/${d.vendedor_codigo}`}
      className="text-primary hover:underline"
    >
      {d.vendedor_codigo}
    </Link>
    <Link
      href={`/admin/relatorios/vendedor/${d.vendedor_codigo}`}
      className="text-xs bg-primary/10 text-primary px-2 py-1 rounded hover:bg-primary/20 transition"
    >
      📋 Ver vendas
    </Link>
  </div>
</td>
                  <td className="p-3">R$ {d.total_vendas.toFixed(2)}</td>
                  <td className="p-3">R$ {d.total_comissao.toFixed(2)}</td>
                  <td className="p-3">{d.quantidade_pedidos}</td>
                </tr>
              ))}
              {dados.length > 0 && (
                <tr className="border-t bg-gray-100 font-bold">
                  <td className="p-3">TOTAL</td>
                  <td className="p-3">R$ {totalVendas.toFixed(2)}</td>
                  <td className="p-3">R$ {totalComissao.toFixed(2)}</td>
                  <td className="p-3">{totalPedidos}</td>
                </tr>
              )}
              {dados.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-400">Nenhum resultado para o período selecionado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}