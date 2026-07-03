'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import Link from 'next/link';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar, Legend
} from 'recharts';

interface DashboardData {
  totalProdutos: number;
  totalPedidos: number;
  pedidosPendentes: number;
  totalCupons: number;
  faturamento: number;
  ticketMedio: number;
  produtosBaixoEstoque: number;
  vendasDiarias: { data: string; total: number; quantidade: number }[];
  vendasPorCategoria: { _id: string; total: number }[];
  statusPedidos: { _id: string; quantidade: number }[];
  ultimosPedidos: { _id: string; cliente: { nome: string }; total: number; status: string; createdAt: string }[];
}

const CORES_PIZZA = ['#2C5F2D', '#D4A373', '#E76F51', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899'];
const CORES_STATUS: Record<string, string> = {
  pendente: '#FBBF24',
  confirmado: '#3B82F6',
  enviado: '#8B5CF6',
  entregue: '#10B981',
  cancelado: '#EF4444',
};

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = getApiUrl();
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.get(`${apiUrl}/api/admin/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-8 text-gray-500">Carregando dashboard...</p>;
  if (!data) return <p className="p-8 text-red-500">Erro ao carregar dados.</p>;

  const cards = [
    { titulo: 'Faturamento', valor: `R$ ${data.faturamento.toFixed(2)}`, icone: '💰', cor: 'bg-emerald-50 text-emerald-700' },
    { titulo: 'Pedidos', valor: data.totalPedidos, subtitulo: `${data.pedidosPendentes} pendentes`, icone: '📋', cor: 'bg-blue-50 text-blue-700' },
    { titulo: 'Ticket Médio', valor: `R$ ${data.ticketMedio.toFixed(2)}`, icone: '📊', cor: 'bg-purple-50 text-purple-700' },
    { titulo: 'Produtos', valor: data.totalProdutos, subtitulo: `${data.produtosBaixoEstoque} com estoque baixo`, icone: '📦', cor: 'bg-amber-50 text-amber-700' },
    { titulo: 'Cupons ativos', valor: data.totalCupons, icone: '🎫', cor: 'bg-rose-50 text-rose-700' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Cards de métricas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map(card => (
          <div key={card.titulo} className={`rounded-xl shadow-sm p-4 ${card.cor} border`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg">{card.icone}</span>
            </div>
            <p className="text-xs font-medium opacity-80">{card.titulo}</p>
            <p className="text-xl font-bold mt-1">{card.valor}</p>
            {card.subtitulo && (
              <p className="text-xs mt-1 opacity-70">{card.subtitulo}</p>
            )}
          </div>
        ))}
      </div>

      {/* Gráficos lado a lado */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Vendas diárias (linha) */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-semibold mb-4">📈 Vendas nos últimos 7 dias</h2>
          {data.vendasDiarias.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data.vendasDiarias}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="data" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
<Tooltip formatter={(value: any) => `R$ ${Number(value).toFixed(2)}`} />                <Line type="monotone" dataKey="total" stroke="#2C5F2D" strokeWidth={2} dot={{ fill: '#2C5F2D' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center py-10">Sem dados recentes.</p>
          )}
        </div>

        {/* Vendas por categoria (pizza) */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-semibold mb-4">🍕 Vendas por Categoria</h2>
          {data.vendasPorCategoria.length > 0 ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="55%" height={220}>
                <PieChart>
                  <Pie
                    data={data.vendasPorCategoria}
                    dataKey="total"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                    paddingAngle={3}
                  >
                    {data.vendasPorCategoria.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CORES_PIZZA[index % CORES_PIZZA.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2 text-sm">
                {data.vendasPorCategoria.map((cat, i) => (
                  <div key={cat._id} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: CORES_PIZZA[i % CORES_PIZZA.length] }}></span>
                    <span className="truncate">{cat._id}</span>
                    <span className="ml-auto font-medium">R$ {cat.total.toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-10">Sem dados.</p>
          )}
        </div>
      </div>

      {/* Status dos pedidos e Últimos pedidos */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Status dos pedidos (barras) */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-semibold mb-4">📊 Status dos Pedidos</h2>
          {data.statusPedidos.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.statusPedidos}>
                <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="quantidade" radius={[6, 6, 0, 0]}>
                  {data.statusPedidos.map((entry) => (
                    <Cell key={entry._id} fill={CORES_STATUS[entry._id] || '#9CA3AF'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center py-10">Sem dados.</p>
          )}
        </div>

        {/* Últimos pedidos (tabela) */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">🕒 Últimos Pedidos</h2>
            <Link href="/admin/pedidos" className="text-primary text-sm hover:underline">Ver todos →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2">Pedido</th>
                  <th className="p-2">Cliente</th>
                  <th className="p-2">Total</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.ultimosPedidos.map(ped => (
                  <tr key={ped._id} className="border-t hover:bg-gray-50">
                    <td className="p-2 font-mono text-xs">#{ped._id.slice(-6)}</td>
                    <td className="p-2">{ped.cliente?.nome || '—'}</td>
                    <td className="p-2">R$ {ped.total?.toFixed(2)}</td>
                    <td className="p-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium`} style={{ backgroundColor: CORES_STATUS[ped.status] || '#9CA3AF', color: '#fff' }}>
                        {ped.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {data.ultimosPedidos.length === 0 && (
                  <tr><td colSpan={4} className="p-4 text-center text-gray-400">Nenhum pedido recente.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}