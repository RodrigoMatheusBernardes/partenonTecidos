'use client';

import { useEffect, useState } from 'react';
import { getApiUrl } from '@/lib/api';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState<Vendedor | null>(null);
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    codigo: '',
    comissao_percentual: '5',
    password: '',
    confirmPassword: '',
    ativo: true,
  });
  const [saving, setSaving] = useState(false);

  const apiUrl = getApiUrl();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';

  const carregarVendedores = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/vendedores/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setVendedores(data.data || []);
    } catch (err) {
      toast.error('Erro ao carregar vendedores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarVendedores();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const abrirNovo = () => {
    setEditando(null);
    setForm({
      nome: '',
      email: '',
      telefone: '',
      codigo: '',
      comissao_percentual: '5',
      password: '',
      confirmPassword: '',
      ativo: true,
    });
    setShowModal(true);
  };

  const abrirEditar = (v: Vendedor) => {
    setEditando(v);
    setForm({
      nome: v.nome,
      email: v.email || '',
      telefone: v.telefone || '',
      codigo: v.codigo,
      comissao_percentual: v.comissao_percentual.toString(),
      password: '',
      confirmPassword: '',
      ativo: v.ativo,
    });
    setShowModal(true);
  };

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.email) {
      toast.error('Nome e email são obrigatórios.');
      return;
    }

    // Se estiver criando (sem editando), exige senha
    if (!editando && (!form.password || form.password.length < 6)) {
      toast.error('Senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (form.password && form.password !== form.confirmPassword) {
      toast.error('Senhas não coincidem.');
      return;
    }

    setSaving(true);
    try {
      if (editando) {
        // Atualizar vendedor (coleção Vendedor)
        const res = await fetch(`${apiUrl}/api/vendedores/admin/${editando._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nome: form.nome,
            email: form.email,
            telefone: form.telefone,
            codigo: form.codigo.toUpperCase(),
            comissao_percentual: parseFloat(form.comissao_percentual),
            ativo: form.ativo,
          }),
        });
        if (!res.ok) throw new Error('Erro ao atualizar');
        toast.success('Vendedor atualizado!');
      } else {
        // Criar vendedor (User com role seller)
        const resUser = await fetch(`${apiUrl}/api/auth/criar-vendedor`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nome: form.nome,
            email: form.email,
            password: form.password,
          }),
        });
        if (!resUser.ok) {
          const err = await resUser.json();
          throw new Error(err.error || 'Erro ao criar vendedor');
        }
        const userData = await resUser.json();

        // Criar registro na coleção Vendedor (com código e comissão)
        const resVendedor = await fetch(`${apiUrl}/api/vendedores/admin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            codigo: form.codigo.toUpperCase() || userData.user.id.slice(-6).toUpperCase(),
            nome: form.nome,
            email: form.email,
            telefone: form.telefone,
            comissao_percentual: parseFloat(form.comissao_percentual),
            ativo: form.ativo,
          }),
        });
        if (!resVendedor.ok) throw new Error('Erro ao criar registro de vendedor');
        toast.success('Vendedor criado com sucesso!');
      }
      setShowModal(false);
      carregarVendedores();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar');
    } finally {
      setSaving(false);
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
      carregarVendedores();
    } catch (err) {
      toast.error('Erro ao excluir');
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Carregando...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Vendedores</h1>
        <Button variant="primary" onClick={abrirNovo}>
          + Novo Vendedor
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3">Código</th>
              <th className="p-3">Nome</th>
              <th className="p-3">Email</th>
              <th className="p-3">Comissão</th>
              <th className="p-3">Ativo</th>
              <th className="p-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {vendedores.map((v) => (
              <tr key={v._id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-mono">{v.codigo}</td>
                <td className="p-3">{v.nome}</td>
                <td className="p-3">{v.email || '-'}</td>
                <td className="p-3">{v.comissao_percentual}%</td>
                <td className="p-3">{v.ativo ? '✅' : '❌'}</td>
                <td className="p-3 text-center space-x-2">
                  <button onClick={() => abrirEditar(v)} className="text-primary hover:underline text-sm">
                    Editar
                  </button>
                  <button onClick={() => excluir(v._id)} className="text-red-600 hover:underline text-sm">
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {vendedores.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-400">
                  Nenhum vendedor cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de criação/edição */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editando ? 'Editar Vendedor' : 'Novo Vendedor'}</h2>
            <form onSubmit={salvar} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Código *</label>
                <input
                  name="codigo"
                  value={form.codigo}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-2"
                  placeholder="Ex: VEND001"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Nome *</label>
                <input
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Email *</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Telefone</label>
                <input
                  name="telefone"
                  value={form.telefone}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                />
              </div>
              {!editando && (
                <>
                  <div>
                    <label className="block text-sm mb-1">Senha *</label>
                    <input
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      required={!editando}
                      minLength={6}
                      className="w-full border rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Confirmar Senha</label>
                    <input
                      name="confirmPassword"
                      type="password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className="w-full border rounded-lg p-2"
                    />
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm mb-1">Comissão (%) *</label>
                <input
                  type="number"
                  name="comissao_percentual"
                  value={form.comissao_percentual}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.1"
                  required
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="ativo"
                  checked={form.ativo}
                  onChange={handleChange}
                />
                <span className="text-sm">Ativo</span>
              </label>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Salvar'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 py-2 rounded-lg"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}