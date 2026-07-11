'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import StarRating from './StarRating';
import { Button } from '@/components/ui/Button';

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
        body: JSON.stringify({
          cliente_nome: nome || 'Anônimo',
          nota,
          comentario,
        }),
      });
      if (res.ok) {
        toast.success('Avaliação enviada com sucesso!');
        setNota(0);
        setNome('');
        setComentario('');
        onSuccess();
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

  return (
    <div className="
      border-t border-gray-mid
      pt-8 md:pt-12 mt-8 md:mt-12
    ">
      <h3 className="
        font-serif text-2xl font-semibold
        text-dark-light mb-6 md:mb-8
      ">
        Deixe sua avaliação
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* NOTA */}
        <div>
          <label className="
            block text-sm font-semibold uppercase
            tracking-widest text-dark-light mb-4
          ">
            Sua nota <span className="text-error">*</span>
          </label>
          <StarRating
            nota={nota}
            tamanho="lg"
            onClick={setNota}
            interactive
          />
        </div>

        {/* NOME */}
        <div>
          <label className="
            block text-sm font-semibold uppercase
            tracking-widest text-dark-light mb-3
          ">
            Seu nome
          </label>
          <input
            type="text"
            placeholder="Como gostaria de ser chamado?"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            maxLength={100}
            className="
              w-full px-4 py-3
              border border-gray-mid rounded-button
              bg-light text-dark-light
              text-sm font-medium
              placeholder:text-text-light
              focus:outline-none focus:ring-2 focus:ring-gold
              focus:border-transparent
              transition-all duration-300
            "
          />
        </div>

        {/* COMENTÁRIO */}
        <div>
          <label className="
            block text-sm font-semibold uppercase
            tracking-widest text-dark-light mb-3
          ">
            Comentário <span className="text-text-light font-normal">(opcional)</span>
          </label>
          <textarea
            placeholder="Conte sua experiência com este produto"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            maxLength={500}
            rows={4}
            className="
              w-full px-4 py-3
              border border-gray-mid rounded-button
              bg-light text-dark-light
              text-sm font-medium
              placeholder:text-text-light
              focus:outline-none focus:ring-2 focus:ring-gold
              focus:border-transparent
              resize-none
              transition-all duration-300
            "
          />
          <p className="text-xs text-text-light mt-2">
            {comentario.length}/500 caracteres
          </p>
        </div>

        {/* SUBMIT */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={enviando}
          className="w-full md:w-auto"
        >
          Enviar avaliação
        </Button>
      </form>
    </div>
  );
}