'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import toast from 'react-hot-toast';

interface Concorrente {
  _id: string;
  nome: string;
  link: string;
  produto: string;
  preco: number;
  data_coleta: string;
}

export default function AdminConcorrentesPage() {
  const [lista, setLista] = useState<Concorrente[]>([]);
  const [form, setForm] = useState({ nome: '', link: '', produto: '', preco: '' });
  const [carregando, setCarregando] = useState(true);

  const apiUrl = getApiUrl();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';

  const carregar = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/concorrentes/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLista(res.data);
    } catch (err) {
      toast.error('Erro ao carregar');
    } finally {
      setCarregando(false);
    }
  };

  const adicionar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.produto || !form.preco) return;
    try {
      await axios.post(`${apiUrl}/api/concorrentes/admin`, {
        nome: form.nome,
        link: form.link,
        produto: form.produto,
        preco: parseFloat(form.preco),
      }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Concorrente adicionado!');
      setForm({ nome: '', link: '', produto: '', preco: '' });
      carregar();
    } catch (err) {
      toast.error('Erro ao adicionar');
    }
  };

  const excluir = async (id: string) => {
    if (!confirm('Excluir?')) return;
    try {
      await axios.delete(`${apiUrl}/api/concorrentes/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Excluído!');
      carregar();
    } catch (err) {
      toast.error('Erro ao excluir');
    }
  };

  useEffect(() => { carregar(); }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">📊 Concorrentes</h1>

      {/* Formulário */}
      <form onSubmit={adicionar} className="bg-white rounded-xl shadow p-4 space-y-3 max-w-xl">
        <input type="text" placeholder="Nome do concorrente" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} required className="border p-2 rounded w-full" />
        <input type="text" placeholder="Link (opcional)" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} className="border p-2 rounded w-full" />
        <input type="text" placeholder="Nome do produto" value={form.produto} onChange={e => setForm({ ...form, produto: e.target.value })} required className="border p-2 rounded w-full" />
        <input type="number" step="0.01" placeholder="Preço (R$)" value={form.preco} onChange={e => setForm({ ...form, preco: e.target.value })} required className="border p-2 rounded w-full" />
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-green-700">Adicionar</button>
      </form>

      {/* Tabela */}
      {carregando ? <p>Carregando...</p> : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2">Concorrente</th>
                <th className="p-2">Produto</th>
                <th className="p-2">Preço</th>
                <th className="p-2">Data</th>
                <th className="p-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {lista.map(c => (
                <tr key={c._id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{c.nome}</td>
                  <td className="p-2">{c.produto}</td>
                  <td className="p-2">R$ {c.preco.toFixed(2)}</td>
                  <td className="p-2 text-xs">{new Date(c.data_coleta).toLocaleDateString()}</td>
                  <td className="p-2">
                    <button onClick={() => excluir(c._id)} className="text-red-600 text-sm hover:underline">Excluir</button>
                  </td>
                </tr>
              ))}
              {lista.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-gray-400">Nenhum concorrente cadastrado.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}