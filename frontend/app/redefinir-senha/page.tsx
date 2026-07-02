'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import { useRouter } from 'next/navigation';

// Diretiva para evitar pré-renderização
export const dynamic = 'force-dynamic';

// Componente que usa useSearchParams (deve ficar dentro do Suspense)
function RedefinirSenhaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Verifica se os parâmetros estão presentes
  useEffect(() => {
    if (!token || !email) {
      setErro('Link de redefinição inválido ou expirado.');
    }
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (novaSenha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }
    if (novaSenha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setCarregando(true);
    setErro('');
    setMensagem('');

    try {
      const apiUrl = getApiUrl();
      const res = await axios.post(`${apiUrl}/api/auth/redefinir-senha`, {
        token,
        email,
        novaSenha,
      });
      setMensagem(res.data.message || 'Senha redefinida com sucesso!');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      setErro(err.response?.data?.message || 'Erro ao redefinir a senha.');
    } finally {
      setCarregando(false);
    }
  };

  if (erro && !token) {
    return <div className="text-center py-12 text-red-600">{erro}</div>;
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6 text-center">Redefinir senha</h1>
      <p className="text-gray-600 text-center mb-6">
        Digite sua nova senha para o e-mail <strong>{email}</strong>.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="novaSenha" className="block text-sm font-medium text-gray-700">
            Nova senha
          </label>
          <input
            type="password"
            id="novaSenha"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            className="mt-1 w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
            required
            minLength={6}
          />
        </div>
        <div>
          <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700">
            Confirmar senha
          </label>
          <input
            type="password"
            id="confirmarSenha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            className="mt-1 w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
            required
          />
        </div>
        {erro && <p className="text-red-600 text-sm">{erro}</p>}
        {mensagem && <p className="text-green-600 text-sm">{mensagem}</p>}
        <button
          type="submit"
          disabled={carregando}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition disabled:opacity-50"
        >
          {carregando ? 'Redefinindo...' : 'Redefinir senha'}
        </button>
      </form>
    </div>
  );
}

// Página principal envolvida em Suspense
export default function RedefinirSenhaPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Carregando...</div>}>
      <RedefinirSenhaContent />
    </Suspense>
  );
}