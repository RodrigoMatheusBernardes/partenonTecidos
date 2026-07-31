'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getApiUrl } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Search, User, Mail, Phone, Calendar, ShoppingBag, Eye } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface Cliente {
  _id: string;
  nome: string;
  email: string;
  telefone?: string;
  createdAt: string;
  totalPedidos: number;
  ultimaCompra: string | null;
}

export default function AdminClientesPage() {
  const { user } = useAuth();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });
  const [debouncedBusca, setDebouncedBusca] = useState('');

  const apiUrl = getApiUrl();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  // Debounce para busca
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedBusca(busca), 500);
    return () => clearTimeout(timer);
  }, [busca]);

  const carregarClientes = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${apiUrl}/api/admin/clientes?busca=${encodeURIComponent(debouncedBusca)}&page=${page}&limit=20`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error('Erro ao carregar clientes');
      const data = await res.json();
      setClientes(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarClientes(1);
  }, [debouncedBusca]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-serif text-3xl font-semibold text-dark-light">Clientes</h1>
        <p className="text-text-secondary text-sm">
          Total: {pagination.total} clientes
        </p>
      </div>

      {/* Busca */}
      <div className="flex gap-4 max-w-md">
        <Input
          placeholder="Buscar por nome ou email..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          icon={<Search className="w-4 h-4" />}
          iconPosition="left"
        />
      </div>

      {/* Tabela */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      ) : (
        <div className="bg-white rounded-card shadow-sm-luxury border border-gray-mid overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-light border-b border-gray-mid">
              <tr>
                <th className="p-4 text-xs font-medium uppercase tracking-wider text-text-light">Cliente</th>
                <th className="p-4 text-xs font-medium uppercase tracking-wider text-text-light">Email</th>
                <th className="p-4 text-xs font-medium uppercase tracking-wider text-text-light">Telefone</th>
                <th className="p-4 text-xs font-medium uppercase tracking-wider text-text-light">Cadastro</th>
                <th className="p-4 text-xs font-medium uppercase tracking-wider text-text-light">Pedidos</th>
                <th className="p-4 text-xs font-medium uppercase tracking-wider text-text-light">Última compra</th>
                <th className="p-4 text-xs font-medium uppercase tracking-wider text-text-light">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-mid">
              {clientes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-text-light">
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              ) : (
                clientes.map((cliente) => (
                  <tr key={cliente._id} className="hover:bg-light/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-gold" strokeWidth={1.5} />
                        </div>
                        <Link
                          href={`/admin/clientes/${cliente._id}`}
                          className="font-medium text-dark-light hover:text-gold transition-colors"
                        >
                          {cliente.nome}
                        </Link>
                      </div>
                    </td>
                    <td className="p-4 text-text-secondary">{cliente.email}</td>
                    <td className="p-4 text-text-secondary">{cliente.telefone || '—'}</td>
                    <td className="p-4 text-text-secondary">
                      {new Date(cliente.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold/10 text-gold font-medium">
                        {cliente.totalPedidos}
                      </span>
                    </td>
                    <td className="p-4 text-text-secondary">
                      {cliente.ultimaCompra
                        ? new Date(cliente.ultimaCompra).toLocaleDateString('pt-BR')
                        : '—'}
                    </td>
                    <td className="p-4">
                      <Link
                        href={`/admin/clientes/${cliente._id}`}
                        className="inline-flex items-center gap-1 text-gold hover:text-gold/80 transition-colors text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" strokeWidth={1.5} />
                        Ver pedidos
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginação */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => carregarClientes(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-4 py-2 rounded-button text-sm text-text-secondary hover:bg-light disabled:opacity-40 transition"
          >
            ← Anterior
          </button>
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => carregarClientes(num)}
              className={`px-4 py-2 rounded-button text-sm transition ${
                num === pagination.page
                  ? 'bg-dark-light text-white'
                  : 'text-text-secondary hover:bg-light'
              }`}
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => carregarClientes(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="px-4 py-2 rounded-button text-sm text-text-secondary hover:bg-light disabled:opacity-40 transition"
          >
            Próximo →
          </button>
        </div>
      )}
    </div>
  );
}