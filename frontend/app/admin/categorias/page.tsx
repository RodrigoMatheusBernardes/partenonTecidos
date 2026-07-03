'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';

interface Categoria {
  _id?: string;
  nome: string;
  slug?: string;
  descricao: string;
  imagem: string;
  ordem: number;
  ativo: boolean;
}

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [form, setForm] = useState<Categoria>({ nome: '', descricao: '', imagem: '', ordem: 0, ativo: true });
  const [editando, setEditando] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const apiUrl = getApiUrl(); // ✅ usa a mesma lógica de produção
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';

  const carregarCategorias = async () => {
    try {
      setCarregando(true);
      const res = await axios.get(`${apiUrl}/api/categorias/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategorias(res.data);
    } catch (err: any) {
      console.error(err);
      setErro('Erro ao carregar categorias. Verifique se você está logado como admin.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editando) {
        await axios.put(`${apiUrl}/api/categorias/admin/${editando}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${apiUrl}/api/categorias/admin`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setForm({ nome: '', descricao: '', imagem: '', ordem: 0, ativo: true });
      setEditando(null);
      carregarCategorias();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar categoria');
    }
  };

  const handleEditar = (cat: Categoria) => {
    setForm({ nome: cat.nome, descricao: cat.descricao || '', imagem: cat.imagem || '', ordem: cat.ordem || 0, ativo: cat.ativo });
    setEditando(cat._id || null);
  };

  const handleExcluir = async (id: string) => {
    if (confirm('Excluir esta categoria?')) {
      await axios.delete(`${apiUrl}/api/categorias/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      carregarCategorias();
    }
  };

  if (carregando) return <p>Carregando categorias...</p>;
  if (erro) return <p className="text-red-600">{erro}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Categorias</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-8 space-y-4">
        <h2 className="text-xl font-semibold">{editando ? 'Editar categoria' : 'Nova categoria'}</h2>
        <input
          type="text"
          placeholder="Nome da categoria"
          value={form.nome}
          onChange={e => setForm({ ...form, nome: e.target.value })}
          required
          className="input-field"
        />
        <input
          type="text"
          placeholder="Descrição"
          value={form.descricao}
          onChange={e => setForm({ ...form, descricao: e.target.value })}
          className="input-field"
        />
        <input
          type="text"
          placeholder="URL da imagem (opcional)"
          value={form.imagem}
          onChange={e => setForm({ ...form, imagem: e.target.value })}
          className="input-field"
        />
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Ordem"
            value={form.ordem}
            onChange={e => setForm({ ...form, ordem: Number(e.target.value) })}
            className="input-field w-32"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.ativo}
              onChange={e => setForm({ ...form, ativo: e.target.checked })}
            />
            Ativo
          </label>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary">
            {editando ? 'Atualizar' : 'Criar'}
          </button>
          {editando && (
            <button type="button" onClick={() => { setEditando(null); setForm({ nome: '', descricao: '', imagem: '', ordem: 0, ativo: true }); }} className="btn-danger">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3">Nome</th>
              <th className="p-3">Descrição</th>
              <th className="p-3">Ordem</th>
              <th className="p-3">Ativo</th>
              <th className="p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map(cat => (
              <tr key={cat._id} className="border-t">
                <td className="p-3 font-medium">{cat.nome}</td>
                <td className="p-3 text-sm text-gray-600">{cat.descricao}</td>
                <td className="p-3">{cat.ordem}</td>
                <td className="p-3">{cat.ativo ? '✅' : '❌'}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => handleEditar(cat)} className="text-blue-600 hover:underline">Editar</button>
                  <button onClick={() => handleExcluir(cat._id!)} className="text-red-600 hover:underline">Excluir</button>
                </td>
              </tr>
            ))}
            {categorias.length === 0 && (
              <tr><td colSpan={5} className="p-3 text-center text-gray-500">Nenhuma categoria cadastrada.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}