'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
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
      
      if (res.data.error) {
        toast.error(res.data.error);
        return;
      }
      
      if (!res.data.token || !res.data.user) {
        toast.error('Resposta inválida do servidor.');
        return;
      }
      
      const { token, user } = res.data;
      
      // ✅ Verifica se é admin
      if (user.role !== 'admin') {
        toast.error('Acesso restrito. Apenas administradores podem acessar esta área.');
        return;
      }
      
      // ✅ Força salvar o token
      localStorage.setItem('token', token);
      
      // Chama o login do contexto
      login(user, token);
      toast.success('Login realizado! Bem-vindo ao painel administrativo.');
      
      // Redireciona para o dashboard
      window.location.href = '/admin';
      
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Erro ao fazer login';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-primary">Painel Administrativo</h1>
          <p className="text-gray-500 mt-2">Acesso restrito a administradores</p>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary" 
              placeholder="admin@partenon.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Senha</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary" 
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar no Painel'}
          </button>
        </form>
        
        <p className="text-center text-sm mt-4 text-gray-500">
          <Link href="/" className="text-primary hover:underline">Voltar para a loja</Link>
        </p>
      </div>
    </div>
  );
}