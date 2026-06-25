'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import toast from 'react-hot-toast';

interface Produto {
  _id: string;
  nome: string;
  preco: number;
  estoque: number;
  ativo: boolean;
  createdAt: string;
}

export default function AdminProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregar = async () => {
    try {
      const api = getApiUrl();
      const token = localStorage.getItem('token');
      const res = await axios.get(`${api}/api/produtos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProdutos(res.data);
    } catch (err) {
      toast.error('Erro ao carregar produtos');
    } finally {
      setCarregando(false);
    }
  };

  const deletar = async (id: string) => {
    if (!confirm('Excluir este produto?')) return;
    try {
      const api = getApiUrl();
      const token = localStorage.getItem('token');
      await axios.delete(`${api}/api/produtos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Produto excluído');
      carregar();
    } catch (err) {
      toast.error('Erro ao excluir');
    }
  };

  useEffect(() => { carregar(); }, []);

  if (carregando) return <p className="p-6 text-gray-500">Carregando produtos...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Produtos</h1>
        <Link
          href="/admin/produtos/novo"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          + Novo Produto
        </Link>
      </div>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3">Nome</th>
              <th className="p-3">Preço</th>
              <th className="p-3">Estoque</th>
              <th className="p-3">Ativo</th>
              <th className="p-3">Criado em</th>
              <th className="p-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map(prod => (
              <tr key={prod._id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{prod.nome}</td>
                <td className="p-3">R$ {prod.preco?.toFixed(2)}</td>
                <td className="p-3">{prod.estoque}</td>
                <td className="p-3">{prod.ativo ? '✅' : '❌'}</td>
                <td className="p-3 text-sm">{new Date(prod.createdAt).toLocaleDateString()}</td>
                <td className="p-3 text-center space-x-2">
                  <Link
                    href={`/admin/produtos/editar/${prod._id}`}
                    className="text-primary hover:underline text-sm"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => deletar(prod._id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {produtos.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-400">
                  Nenhum produto cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}