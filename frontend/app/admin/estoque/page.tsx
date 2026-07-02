'use client';

import { useEffect, useState } from 'react';
import { getApiUrl } from '@/lib/api';

interface Produto {
  _id: string;
  nome: string;
  estoque: number;
  reservado?: number;
  disponivel?: number;
}

export default function AdminEstoquePage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const apiUrl = getApiUrl();

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${apiUrl}/api/produtos`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Falha ao carregar');
        return res.json();
      })
      .then((data: Produto[]) => {
        // Garantir que todos os campos tenham valor padrão
        const corrigidos = data.map(p => ({
          ...p,
          estoque: p.estoque || 0,
          reservado: p.reservado || 0,
          disponivel: (p.estoque || 0) - (p.reservado || 0)
        }));
        setProdutos(corrigidos);
        setCarregando(false);
      })
      .catch(err => {
        setErro(err.message);
        setCarregando(false);
      });
  }, [apiUrl]);

  if (carregando) {
    return <p className="text-center py-12">Carregando...</p>;
  }

  if (erro) {
    return <p className="text-center py-12 text-red-600">Erro: {erro}</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Estoque</h1>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Produto</th>
              <th className="p-3 text-center">Estoque</th>
              <th className="p-3 text-center">Reservado</th>
              <th className="p-3 text-center">Disponível</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map(produto => (
              <tr key={produto._id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{produto.nome}</td>
                <td className="p-3 text-center">{produto.estoque}</td>
                <td className="p-3 text-center">{produto.reservado}</td>
                <td className="p-3 text-center font-semibold">{produto.disponivel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}