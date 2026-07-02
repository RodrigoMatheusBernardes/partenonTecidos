'use client';

import { useEffect, useState } from 'react';
import { getApiUrl } from '@/lib/api';
import toast from 'react-hot-toast';

interface Produto {
  _id: string;
  nome: string;
  estoque: number;
  reservado: number;
  disponivel: number;
}

export default function AdminEstoquePage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [quantidade, setQuantidade] = useState<Record<string, string>>({});

  const apiUrl = getApiUrl();

  const carregarProdutos = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/api/produtos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Erro ao carregar');
      const data = await res.json();
      
      // ✅ Garante que todos os campos existam
      const produtosCorrigidos = data.map((p: any) => ({
        ...p,
        estoque: p.estoque || 0,
        reservado: p.reservado || 0,
        disponivel: (p.estoque || 0) - (p.reservado || 0)
      }));
      
      setProdutos(produtosCorrigidos);
    } catch (err: any) {
      toast.error('Erro ao carregar produtos.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const atualizarEstoque = async (id: string, operacao: 'definir' | 'incrementar' | 'decrementar') => {
    const valor = Number(quantidade[id]) || 0;
    if (valor <= 0 && operacao !== 'decrementar') {
      toast.error('Informe um valor válido.');
      return;
    }
    const produto = produtos.find(p => p._id === id);
    if (!produto) return;

    let novoEstoque = produto.estoque;
    if (operacao === 'definir') novoEstoque = valor;
    else if (operacao === 'incrementar') novoEstoque += valor;
    else if (operacao === 'decrementar') novoEstoque = Math.max(0, novoEstoque - valor);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/api/produtos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ estoque: novoEstoque })
      });
      if (!res.ok) throw new Error('Erro ao atualizar');
      toast.success('Estoque atualizado!');
      setQuantidade(prev => ({ ...prev, [id]: '' }));
      carregarProdutos();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao atualizar estoque');
    }
  };

  const produtosFiltrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  if (carregando) return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Estoque</h1>
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full sm:w-64"
        />
      </div>

      {produtosFiltrados.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
          Nenhum produto encontrado.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Produto</th>
                <th className="p-3 text-center">Estoque Atual</th>
                <th className="p-3 text-center">Reservado</th>
                <th className="p-3 text-center">Disponível</th>
                <th className="p-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtosFiltrados.map(produto => (
                <tr key={produto._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{produto.nome}</td>
                  <td className="p-3 text-center">{produto.estoque}</td>
                  <td className="p-3 text-center">{produto.reservado}</td>
                  <td className="p-3 text-center font-semibold">{produto.disponivel}</td>
                  <td className="p-3">
                    <div className="flex justify-center gap-2 flex-wrap">
                      <input
                        type="number"
                        min="0"
                        placeholder="Qtd"
                        value={quantidade[produto._id] || ''}
                        onChange={(e) => setQuantidade(prev => ({ ...prev, [produto._id]: e.target.value }))}
                        className="border rounded px-2 py-1 w-20 text-center"
                      />
                      <button
                        onClick={() => atualizarEstoque(produto._id, 'definir')}
                        className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                      >
                        Definir
                      </button>
                      <button
                        onClick={() => atualizarEstoque(produto._id, 'incrementar')}
                        className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                      >
                        + Adicionar
                      </button>
                      <button
                        onClick={() => atualizarEstoque(produto._id, 'decrementar')}
                        className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                      >
                        - Remover
                      </button>
                    </div>
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