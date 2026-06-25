'use client';

import { useEffect, useState } from 'react';
import { getApiUrl } from '@/lib/api';
import toast from 'react-hot-toast';

interface Vendedor {
  _id: string;
  codigo: string;
  nome: string;
  email: string;
  telefone: string;
  comissao_percentual: number;
  ativo: boolean;
}

export default function AdminVendedoresPage() {
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState<Vendedor | null>(null);
  const [form, setForm] = useState({
    codigo: '',
    nome: '',
    email: '',
    telefone: '',
    comissao_percentual: '5',
    ativo: true,
  });

  const apiUrl = getApiUrl();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';

  const carregar = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/vendedores/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setVendedores(data);
    } catch (err) {
      toast.error('Erro ao carregar vendedores');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const abrirNovo = () => {
    setEditando(null);
    setForm({ codigo: '', nome: '', email: '', telefone: '', comissao_percentual: '5', ativo: true });
    setShowModal(true);
  };

  const abrirEditar = (v: Vendedor) => {
    setEditando(v);
    setForm({
      codigo: v.codigo,
      nome: v.nome,
      email: v.email || '',
      telefone: v.telefone || '',
      comissao_percentual: v.comissao_percentual.toString(),
      ativo: v.ativo,
    });
    setShowModal(true);
  };

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      codigo: form.codigo.toUpperCase(),
      nome: form.nome,
      email: form.email,
      telefone: form.telefone,
      comissao_percentual: parseFloat(form.comissao_percentual),
      ativo: form.ativo,
    };

    try {
      const method = editando ? 'PUT' : 'POST';
      const url = editando ? `${apiUrl}/api/vendedores/admin/${editando._id}` : `${apiUrl}/api/vendedores/admin`;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success(editando ? 'Vendedor atualizado!' : 'Vendedor criado!');
      setShowModal(false);
      carregar();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const excluir = async (id: string) => {
    if (!confirm('Excluir este vendedor?')) return;
    try {
      await fetch(`${apiUrl}/api/vendedores/admin/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Vendedor excluído');
      carregar();
    } catch (err) {
      toast.error('Erro ao excluir');
    }
  };

  if (carregando) return <p className="p-6 text-gray-500">Carregando...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Vendedores</h1>
        <button onClick={abrirNovo} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
          + Novo Vendedor
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Código</th>
              <th className="p-3 text-left">Nome</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Comissão</th>
              <th className="p-3 text-left">Ativo</th>
              <th className="p-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {vendedores.map(v => (
              <tr key={v._id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-mono">{v.codigo}</td>
                <td className="p-3">{v.nome}</td>
                <td className="p-3">{v.email || '-'}</td>
                <td className="p-3">{v.comissao_percentual}%</td>
                <td className="p-3">{v.ativo ? '✅' : '❌'}</td>
                <td className="p-3 text-center space-x-2">
                  <button onClick={() => abrirEditar(v)} className="text-primary hover:underline text-sm">Editar</button>
                  <button onClick={() => excluir(v._id)} className="text-red-600 hover:underline text-sm">Excluir</button>
                </td>
              </tr>
            ))}
            {vendedores.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-gray-400">Nenhum vendedor cadastrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editando ? 'Editar Vendedor' : 'Novo Vendedor'}</h2>
            <form onSubmit={salvar} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Código *</label>
                <input name="codigo" value={form.codigo} onChange={handleChange} required className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">Nome *</label>
                <input name="nome" value={form.nome} onChange={handleChange} required className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">Email</label>
                <input name="email" value={form.email} onChange={handleChange} className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">Telefone</label>
                <input name="telefone" value={form.telefone} onChange={handleChange} className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">Comissão (%) *</label>
                <input type="number" name="comissao_percentual" value={form.comissao_percentual} onChange={handleChange} min="0" max="100" step="0.1" required className="w-full border rounded-lg p-2" />
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="ativo" checked={form.ativo} onChange={handleChange} />
                <span className="text-sm">Ativo</span>
              </label>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-green-700 transition">Salvar</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 py-2 rounded-lg">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}