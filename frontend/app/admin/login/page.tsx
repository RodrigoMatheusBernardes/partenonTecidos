'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

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

      // Verifica se é admin (reforço de segurança)
      if (user.role !== 'admin') {
        toast.error('Acesso restrito. Apenas administradores podem acessar esta área.');
        return;
      }

      // Salva token e atualiza contexto
      localStorage.setItem('token', token);
      login(user, token);

      toast.success('Login realizado! Bem-vindo ao painel administrativo.');

      // Redireciona para o dashboard admin
      router.push('/admin');
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Erro ao fazer login';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-semibold text-dark-light">Painel Administrativo</h1>
          <p className="text-text-secondary text-sm mt-2">Acesso restrito a administradores</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-card shadow-md-luxury border border-gray-mid p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-dark-light mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-mid rounded-button px-4 py-2.5 text-sm bg-white text-dark-light placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-gold transition"
              placeholder="admin@parthenon.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-light mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-mid rounded-button px-4 py-2.5 text-sm bg-white text-dark-light placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-gold transition"
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Entrando...
              </span>
            ) : (
              'Entrar no Painel'
            )}
          </Button>
        </form>

        <p className="text-center text-sm mt-4 text-text-light">
          <Link href="/" className="text-gold hover:underline">
            Voltar para a loja
          </Link>
        </p>
      </div>
    </div>
  );
}