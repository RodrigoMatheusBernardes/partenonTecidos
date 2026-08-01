'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import Link from 'next/link';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar
} from 'recharts';
import {
  TrendingUp, Package, ShoppingCart, Ticket, DollarSign,
  Clock, AlertCircle, Smartphone // ← NOVOS ÍCONES
} from 'lucide-react';

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
  // NOVOS CAMPOS FINANCEIROS
  totalRecebido: number;
  pagamentosPendentes: number;
  pagamentosExpirados: number;
  pagamentosCancelados: number;
  totalPix: number;
}

const CORES_PIZZA = ['#c2a56c', '#1a1a1a', '#d4a574', '#8b7355', '#5c4a3d', '#3d2817', '#2a1810'];
const CORES_STATUS: Record<string, string> = {
  pendente: '#FBBF24',
  confirmado: '#3B82F6',
  enviado: '#8B5CF6',
  entregue: '#10B981',
  cancelado: '#EF4444',
  AGUARDANDO_PAGAMENTO: '#FBBF24',
  PAGO: '#10B981',
  EXPIRADO: '#EF4444',
};

const statusBadgeVariant: Record<string, any> = {
  pendente: 'warning',
  confirmado: 'info',
  enviado: 'info',
  entregue: 'success',
  cancelado: 'error',
  AGUARDANDO_PAGAMENTO: 'warning',
  PAGO: 'success',
  EXPIRADO: 'error',
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

  if (loading) return (
    <div className="p-8 text-center">
      <p className="text-text-secondary font-medium">Carregando dashboard...</p>
    </div>
  );
  if (!data) return (
    <div className="p-8 text-center">
      <p className="text-error font-medium">Erro ao carregar dados.</p>
    </div>
  );

  // KPIs existentes
  const kpis = [
    {
      label: 'Faturamento',
      value: `R$ ${data.faturamento.toFixed(2).replace('.', ',')}`,
      icon: DollarSign,
      detail: 'Total acumulado'
    },
    {
      label: 'Pedidos Totais',
      value: data.totalPedidos,
      icon: ShoppingCart,
      detail: `${data.pedidosPendentes} pendentes`
    },
    {
      label: 'Ticket Médio',
      value: `R$ ${data.ticketMedio.toFixed(2).replace('.', ',')}`,
      icon: TrendingUp,
      detail: 'Ticket médio de vendas'
    },
    {
      label: 'Produtos',
      value: data.totalProdutos,
      icon: Package,
      detail: `${data.produtosBaixoEstoque} em estoque baixo`
    },
    {
      label: 'Cupons Ativos',
      value: data.totalCupons,
      icon: Ticket,
      detail: 'Promoções ativas'
    },
  ];

  // ✅ NOVOS CARDS FINANCEIROS
  const financeiroCards = [
    {
      label: 'Total Recebido',
      value: `R$ ${(data.totalRecebido || 0).toFixed(2).replace('.', ',')}`,
      icon: DollarSign,
      color: 'bg-green-50 text-green-700',
    },
    {
      label: 'Pagamentos Pendentes',
      value: data.pagamentosPendentes || 0,
      icon: Clock,
      color: 'bg-yellow-50 text-yellow-700',
    },
    {
      label: 'Pagamentos Expirados',
      value: data.pagamentosExpirados || 0,
      icon: AlertCircle,
      color: 'bg-red-50 text-red-700',
    },
    {
      label: 'Total PIX',
      value: data.totalPix || 0,
      icon: Smartphone,
      color: 'bg-blue-50 text-blue-700',
    },
  ];

  return (
    <div className="space-y-8">
      
      {/* HEADER */}
      <div>
        <h1 className="font-serif text-4xl font-bold text-dark-light mb-1">Dashboard</h1>
        <p className="text-text-secondary font-light">Visão geral do desempenho da loja</p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} variant="elevated" hoverable className="border-2">
              <CardHeader
                title={kpi.label}
                icon={<Icon className="w-5 h-5 text-gold" strokeWidth={2} />}
              />
              <CardContent>
                <div className="space-y-2">
                  <p className="font-black text-2xl text-dark-light">
                    {kpi.value}
                  </p>
                  <p className="text-xs text-text-secondary font-light">
                    {kpi.detail}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ✅ CARDS FINANCEIROS */}
      <div>
        <h2 className="font-serif text-2xl font-semibold text-dark-light mb-4">
          Financeiro
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {financeiroCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.label} variant="default" className="border-2">
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${card.color}`}>
                      <Icon className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">
                        {card.label}
                      </p>
                      <p className="text-xl font-bold text-dark-light">
                        {card.value}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* CHARTS AND ANALYTICS */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Sales Last 7 Days */}
        <Card variant="default" className="border-2">
          <CardHeader title="Vendas nos Últimos 7 Dias" />
          <CardContent>
            {data.vendasDiarias.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data.vendasDiarias}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="data" tick={{ fontSize: 11 }} stroke="#8a7a6a" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#8a7a6a" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #dcd9d4' }}
                    formatter={(value: any) => `R$ ${Number(value).toFixed(2)}`}
                  />
                  <Line type="monotone" dataKey="total" stroke="#c2a56c" strokeWidth={3} dot={{ fill: '#c2a56c', r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-text-secondary text-center py-12">Sem dados recentes</p>
            )}
          </CardContent>
        </Card>

        {/* Sales by Category */}
        <Card variant="default" className="border-2">
          <CardHeader title="Vendas por Categoria" />
          <CardContent>
            {data.vendasPorCategoria.length > 0 ? (
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="50%" height={220}>
                  <PieChart>
                    <Pie
                      data={data.vendasPorCategoria}
                      dataKey="total"
                      nameKey="_id"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={45}
                      paddingAngle={2}
                    >
                      {data.vendasPorCategoria.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CORES_PIZZA[index % CORES_PIZZA.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-1.5 text-xs">
                  {data.vendasPorCategoria.slice(0, 6).map((cat, i) => (
                    <div key={cat._id} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CORES_PIZZA[i % CORES_PIZZA.length] }} />
                        <span className="truncate font-medium text-text-secondary">{cat._id}</span>
                      </div>
                      <span className="font-bold text-dark-light">R$ {cat.total.toFixed(0)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-text-secondary text-center py-10">Sem dados</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ORDER STATUS AND RECENT ORDERS */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Order Status */}
        <Card variant="default" className="border-2">
          <CardHeader title="Status dos Pedidos" />
          <CardContent>
            {data.statusPedidos.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.statusPedidos}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="_id" tick={{ fontSize: 11 }} stroke="#8a7a6a" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#8a7a6a" />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #dcd9d4' }} />
                  <Bar dataKey="quantidade" radius={[8, 8, 0, 0]}>
                    {data.statusPedidos.map((entry) => (
                      <Cell key={entry._id} fill={CORES_STATUS[entry._id] || '#dcd9d4'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-text-secondary text-center py-12">Sem dados</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card variant="default" className="border-2">
          <CardHeader 
            title="Últimos Pedidos"
            icon={<Link href="/admin/pedidos" className="text-gold text-xs font-bold hover:underline">Ver Todos</Link>}
          />
          <CardContent>
            {data.ultimosPedidos.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-light border-b border-gray-mid">
                    <tr>
                      <th className="px-4 py-3 text-left font-bold text-text-secondary uppercase tracking-wider text-xs">ID</th>
                      <th className="px-4 py-3 text-left font-bold text-text-secondary uppercase tracking-wider text-xs">Cliente</th>
                      <th className="px-4 py-3 text-left font-bold text-text-secondary uppercase tracking-wider text-xs">Total</th>
                      <th className="px-4 py-3 text-left font-bold text-text-secondary uppercase tracking-wider text-xs">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-mid">
                    {data.ultimosPedidos.slice(0, 5).map(ped => (
                      <tr key={ped._id} className="hover:bg-light/50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-text-secondary">#{ped._id.slice(-6)}</td>
                        <td className="px-4 py-3 font-medium text-dark-light">{ped.cliente?.nome || 'N/A'}</td>
                        <td className="px-4 py-3 font-bold text-dark-light">R$ {(ped.total || 0).toFixed(2).replace('.', ',')}</td>
                        <td className="px-4 py-3">
                          <Badge 
                            variant={statusBadgeVariant[ped.status] || 'neutral'} 
                            size="sm"
                          >
                            {ped.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-text-secondary text-center py-8">Sem pedidos recentes</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}