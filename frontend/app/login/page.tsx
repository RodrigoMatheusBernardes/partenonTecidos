'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Lê o parâmetro redirect da URL (ex: ?redirect=/checkout)
  const redirectUrl = searchParams.get('redirect') || localStorage.getItem('redirectAfterLogin') || '/meus-pedidos';

  // Limpa o localStorage após usar
  useEffect(() => {
    if (redirectUrl) {
      localStorage.removeItem('redirectAfterLogin');
    }
  }, []);

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

      // Salva token e atualiza contexto
      localStorage.setItem('token', token);
      login(user, token);

      toast.success('Login realizado!');

      // Redireciona para a página salva ou padrão
      router.push(redirectUrl);
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
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary"
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
            'Entrar'
          )}
        </Button>
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