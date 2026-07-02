'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import toast from 'react-hot-toast';

export default function CadastroPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !email || !password) {
      toast.error('Preencha todos os campos.');
      return;
    }
    if (password.length < 6) {
      toast.error('Senha deve ter pelo menos 6 caracteres.');
      return;
    }
    setLoading(true);
    try {
      const apiUrl = getApiUrl();
      const res = await axios.post(`${apiUrl}/api/auth/registrar`, { nome, email, password });
      const { token, user } = res.data;
      login(user, token);
      toast.success('Conta criada com sucesso!');
      router.push('/meus-pedidos');
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Erro ao criar conta';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold mb-6 text-center">Criar conta</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nome completo</label>
          <input type="text" value={nome} onChange={e => setNome(e.target.value)} required
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Senha</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-primary text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50">
          {loading ? 'Criando...' : 'Cadastrar'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Já tem conta? <Link href="/login" className="text-primary hover:underline">Entrar</Link>
      </p>
    </main>
  );
}