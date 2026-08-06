'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { authGet } from '@/lib/auth';
import { ShoppingBag, Users, DollarSign } from 'lucide-react';

interface Stats {
  totalPedidos: number;
  totalClientes: number;
  totalVendas: number;
  pedidosPendentes: number;
}

export default function SellerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalPedidos: 0,
    totalClientes: 0,
    totalVendas: 0,
    pedidosPendentes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await authGet(`/api/seller/stats`);
        setStats(res.data);
      } catch (err) {
        console.error('Erro ao carregar estatísticas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      label: 'Total de Pedidos',
      value: stats.totalPedidos,
      icon: ShoppingBag,
      color: 'bg-blue-50 text-blue-700',
    },
    {
      label: 'Clientes Atendidos',
      value: stats.totalClientes,
      icon: Users,
      color: 'bg-green-50 text-green-700',
    },
    {
      label: 'Vendas (R$)',
      value: `R$ ${stats.totalVendas.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-gold/10 text-gold',
    },
    {
      label: 'Pedidos Pendentes',
      value: stats.pedidosPendentes,
      icon: ShoppingBag,
      color: 'bg-yellow-50 text-yellow-700',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-dark-light">
          Bem-vindo, {user?.nome || 'Vendedor'} 👋
        </h1>
        <p className="text-text-secondary text-sm">Acompanhe seu desempenho e pedidos.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-card shadow-sm-luxury border border-gray-mid p-5 flex items-center gap-4"
            >
              <div className={`p-3 rounded-full ${card.color}`}>
                <Icon className="w-6 h-6" strokeWidth={2} />
              </div>
              <div>
                <p className="text-text-secondary text-xs font-medium uppercase tracking-wider">
                  {card.label}
                </p>
                <p className="text-2xl font-serif font-semibold text-dark-light">
                  {card.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-card shadow-sm-luxury border border-gray-mid p-6">
        <h2 className="font-serif text-xl font-semibold text-dark-light mb-4">
          Últimos Pedidos
        </h2>
        <p className="text-text-secondary text-sm">
          Em breve você poderá ver seus pedidos recentes aqui.
        </p>
      </div>
    </div>
  );
}