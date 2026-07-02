'use client';

import { useState } from 'react';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error('Informe seu e-mail.'); return; }
    setLoading(true);
    try {
      const apiUrl = getApiUrl();
      await axios.post(`${apiUrl}/api/auth/esqueci-senha`, { email });
      setEnviado(true);
      toast.success('Se o e-mail existir, um link de redefinição será enviado.');
    } catch (err) {
      toast.error('Erro ao solicitar redefinição.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold mb-6 text-center">Esqueci minha senha</h1>
      {enviado ? (
        <div className="text-center text-gray-600">
          <p>Verifique seu e-mail (e o console do servidor) para o link de redefinição.</p>
          <Link href="/login" className="text-primary hover:underline mt-4 block">Voltar ao login</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">E-mail cadastrado</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary text-white py-2 rounded-lg hover:bg-green-700 transition">
            {loading ? 'Enviando...' : 'Enviar link'}
          </button>
          <p className="text-center text-sm">
            Lembrou sua senha? <Link href="/login" className="text-primary hover:underline">Entrar</Link>
          </p>
        </form>
      )}
    </main>
  );
}