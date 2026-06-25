'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import toast from 'react-hot-toast';

export default function MeuPerfilPage() {
  const { user, isAuthenticated, login } = useAuth();
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user) {
      setNome(user.nome || '');
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const apiUrl = getApiUrl();
      const token = localStorage.getItem('token');
      const res = await axios.put(`${apiUrl}/api/auth/perfil`, {
        nome: nome || undefined,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Atualizar o contexto com os novos dados
      login({ ...user!, nome: nome || user!.nome }, token!);
      toast.success('Perfil atualizado!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erro ao atualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) return null; // será redirecionado pelo useEffect

  return (
    <main className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Meu Perfil</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Nome</label>
          <input
            type="text"
            value={nome}
            onChange={e => setNome(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <p className="text-sm text-gray-500">Deixe em branco para não alterar a senha.</p>
        <div>
          <label className="block text-sm mb-1">Senha atual</label>
          <input
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Nova senha (mín. 6 caracteres)</label>
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <button type="submit" disabled={saving} className="w-full bg-primary text-white py-2 rounded-lg hover:bg-green-700 transition">
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </main>
  );
}