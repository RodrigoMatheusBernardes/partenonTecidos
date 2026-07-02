'use client';

import { useEffect, useState } from 'react';
import { getApiUrl } from '@/lib/api';
import toast from 'react-hot-toast';

interface Cupom {
  _id: string;
  codigo: string;
  descricao: string;
  tipo: 'percentual' | 'fixo';
  valor: number;
  valor_minimo: number;
  quantidade: number;
  usados: number;
  ativo: boolean;
  validade: string;
}

export default function AdminCuponsPage() {
  const [cupons, setCupons] = useState<Cupom[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    codigo: '',
    descricao: '',
    tipo: 'percentual' as 'percentual' | 'fixo',
    valor: '',
    valor_minimo: '',
    quantidade: '',
    validade: '',
    ativo: true,
  });

  const apiUrl = getApiUrl();

  const carregarCupons = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiUrl}/api/cupons/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Erro ao carregar');
      const data = await res.json();
      setCupons(data);
    } catch (err) {
      toast.error('Erro ao carregar cupons');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarCupons();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const criarCupom = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiUrl}/api/cupons/admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          codigo: form.codigo.toUpperCase(),
          descricao: form.descricao,
          tipo: form.tipo,
          valor: parseFloat(form.valor),
          valor_minimo: parseFloat(form.valor_minimo) || 0,
          quantidade: parseInt(form.quantidade) || 1,
          validade: form.validade || null,
          ativo: form.ativo,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success('Cupom criado!');
      setShowModal(false);
      setForm({
        codigo: '',
        descricao: '',
        tipo: 'percentual',
        valor: '',
        valor_minimo: '',
        quantidade: '',
        validade: '',
        ativo: true,
      });
      carregarCupons();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const deletarCupom = async (id: string) => {
    if (!confirm('Excluir este cupom?')) return;
    const token = localStorage.getItem('token');
    try {
      // Ajuste: rota DELETE também precisa de /admin
      await fetch(`${apiUrl}/api/cupons/admin/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Cupom excluído');
      carregarCupons();
    } catch (err) {
      toast.error('Erro ao excluir');
    }
  };

  if (carregando) return <div className="p-8 text-center">Carregando...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Cupons</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Novo Cupom
        </button>
      </div>

      {cupons.length === 0 ? (
        <p className="text-gray-500 text-center py-12">Nenhum cupom cadastrado.</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Código</th>
                <th className="p-3 text-left">Tipo</th>
                <th className="p-3 text-left">Valor</th>
                <th className="p-3 text-left">Valor Mín.</th>
                <th className="p-3 text-left">Usos</th>
                <th className="p-3 text-left">Validade</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {cupons.map((cupom) => (
                <tr key={cupom._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-mono">{cupom.codigo}</td>
                  <td className="p-3">{cupom.tipo === 'percentual' ? 'Percentual' : 'Fixo'}</td>
                  <td className="p-3 text-green-600 font-bold">
                    {cupom.tipo === 'percentual'
                      ? `${cupom.valor ?? 0}%`
                      : `R$ ${(cupom.valor ?? 0).toFixed(2)}`}
                  </td>
                  <td className="p-3">R$ {(cupom.valor_minimo ?? 0).toFixed(2)}</td>
                  <td className="p-3">{cupom.usados}/{cupom.quantidade}</td>
                  <td className="p-3">
                    {cupom.validade ? new Date(cupom.validade).toLocaleDateString() : '–'}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        cupom.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {cupom.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => deletarCupom(cupom._id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de criação */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Novo Cupom</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500">✕</button>
            </div>
            <form onSubmit={criarCupom} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Código *</label>
                <input name="codigo" value={form.codigo} onChange={handleChange} required className="w-full border rounded-lg p-2" placeholder="DESCONTO10" />
              </div>
              <div>
                <label className="block text-sm mb-1">Descrição</label>
                <input name="descricao" value={form.descricao} onChange={handleChange} className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">Tipo *</label>
                <select name="tipo" value={form.tipo} onChange={handleChange} className="w-full border rounded-lg p-2">
                  <option value="percentual">Percentual (%)</option>
                  <option value="fixo">Fixo (R$)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">
                  {form.tipo === 'percentual' ? 'Valor (%) *' : 'Valor (R$) *'}
                </label>
                <input type="number" name="valor" value={form.valor} onChange={handleChange} required min="0" step="0.01" className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">Valor mínimo (R$)</label>
                <input type="number" name="valor_minimo" value={form.valor_minimo} onChange={handleChange} min="0" step="0.01" className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">Quantidade *</label>
                <input type="number" name="quantidade" value={form.quantidade} onChange={handleChange} required min="1" className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">Validade</label>
                <input type="date" name="validade" value={form.validade} onChange={handleChange} className="w-full border rounded-lg p-2" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="ativo" checked={form.ativo} onChange={handleChange} className="w-4 h-4" />
                <label className="text-sm">Ativo</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700">Criar</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-300 py-2 rounded">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}