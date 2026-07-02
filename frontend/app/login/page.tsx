'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Email e senha são obrigatórios.');
      return;
    }
    setLoading(true);
    try {
      const apiUrl = getApiUrl();
      const res = await axios.post(`${apiUrl}/api/auth/login`, { email, password });
      
      // ✅ Verifica se a API retornou erro
      if (res.data.error) {
        toast.error(res.data.error);
        return;
      }
      
      // ✅ Só prossegue se tiver token e user
      if (!res.data.token || !res.data.user) {
        toast.error('Resposta inválida do servidor.');
        return;
      }
      
      const { token, user } = res.data;
      login(user, token);
      toast.success('Login realizado!');
      
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/meus-pedidos');
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Erro ao fazer login';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold mb-6 text-center">Entrar</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Senha</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-primary text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50">
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Não tem conta? <Link href="/cadastro" className="text-primary hover:underline">Criar conta</Link>
      </p>
      <p className="text-center text-sm mt-2">
        <Link href="/esqueci-senha" className="text-gray-500 hover:underline">Esqueci minha senha</Link>
      </p>
    </main>
  );
}