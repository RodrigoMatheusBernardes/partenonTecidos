'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import StarRating from './StarRating';
import Button from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';

interface AvaliacaoFormProps {
  produtoId: string;
  onSuccess: () => void;
}

export default function AvaliacaoForm({ produtoId, onSuccess }: AvaliacaoFormProps) {
  const [nota, setNota] = useState(0);
  const [nome, setNome] = useState('');
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nota === 0) {
      toast.error('Selecione uma nota');
      return;
    }
    setEnviando(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/produtos/${produtoId}/avaliar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cliente_nome: nome || 'Anônimo', nota, comentario })
      });
      if (res.ok) {
        toast.success('Avaliação enviada!');
        setNota(0);
        setNome('');
        setComentario('');
        onSuccess(); // recarrega a lista
      } else {
        const data = await res.json();
        toast.error(data.error || 'Erro ao enviar avaliação');
      }
    } catch {
      toast.error('Erro de conexão');
    } finally {
      setEnviando(false);
    }
  };

  const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-400";

  return (
    <div className="border-t pt-8 mt-8">
      <h3 className="text-xl font-semibold mb-5">Deixe sua avaliação</h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sua nota *</label>
          <StarRating nota={nota} tamanho="large" onClick={setNota} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Seu nome</label>
          <input
            type="text"
            placeholder="Como gostaria de ser chamado?"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Comentário (opcional)</label>
          <textarea
            placeholder="Conte sua experiência com este produto"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            rows={4}
            className={inputClass}
          />
        </div>
        {/* CORREÇÃO: isLoading removido, disabled adicionado, e spinner condicional */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={enviando}
          className="w-full md:w-auto"
        >
          {enviando ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Enviando...
            </span>
          ) : (
            'Enviar avaliação'
          )}
        </Button>
      </form>
    </div>
  );
}