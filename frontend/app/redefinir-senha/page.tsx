'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import toast from 'react-hot-toast';

export default function RedefinirSenhaPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmacao) { toast.error('Preencha todos os campos.'); return; }
    if (password !== confirmacao) { toast.error('As senhas não conferem.'); return; }
    if (password.length < 6) { toast.error('A senha deve ter pelo menos 6 caracteres.'); return; }
    if (!token) { toast.error('Token inválido.'); return; }

    setLoading(true);
    try {
      const apiUrl = getApiUrl();
      await axios.post(`${apiUrl}/api/auth/redefinir-senha`, { token, newPassword: password });
      toast.success('Senha redefinida com sucesso!');
      router.push('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erro ao redefinir senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold mb-6 text-center">Nova senha</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Nova senha</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="w-full border rounded-lg p-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">Confirme a nova senha</label>
          <input type="password" value={confirmacao} onChange={e => setConfirmacao(e.target.value)} required minLength={6} className="w-full border rounded-lg p-2" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-primary text-white py-2 rounded-lg hover:bg-green-700 transition">
          {loading ? 'Salvando...' : 'Redefinir senha'}
        </button>
      </form>
      
    </main>
  );
}