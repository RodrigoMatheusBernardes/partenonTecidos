'use client';

import { useEffect, useState } from 'react';
import { getApiUrl } from '@/lib/api';
import StarRating from './StarRating';

interface Avaliacao {
  _id: string;
  cliente_nome: string;
  nota: number;
  comentario: string;
  createdAt: string;
}

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-emerald-500', 'bg-purple-500',
  'bg-amber-500', 'bg-rose-500', 'bg-cyan-500',
];

function getAvatarColor(nome: string) {
  let hash = 0;
  for (let i = 0; i < nome.length; i++) hash = nome.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function AvaliacoesList({
  produtoId,
  refreshKey,
}: {
  produtoId: string;
  refreshKey?: number;
}) {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [media, setMedia] = useState({ media: 0, total: 0 });

  useEffect(() => {
    const api = getApiUrl();
    fetch(`${api}/api/produtos/${produtoId}/avaliacoes`)
      .then(res => res.json())
      .then(data => setAvaliacoes(Array.isArray(data) ? data : []))
      .catch(() => setAvaliacoes([]));

    fetch(`${api}/api/produtos/${produtoId}/media`)
      .then(res => res.json())
      .then(data => setMedia(data))
      .catch(() => setMedia({ media: 0, total: 0 }));
  }, [produtoId, refreshKey]);

  if (avaliacoes.length === 0 && media.total === 0) return null;

  return (
    <div className="space-y-8">

      {/* RESUMO DA MÉDIA */}
      {media.total > 0 && (
        <div className="
          flex items-center gap-4 p-6
          bg-light rounded-card
          border border-gray-mid
        ">
          <span className="
            text-4xl font-serif font-semibold
            text-dark-light leading-none
          ">
            {Number(media.media).toFixed(1)}
          </span>
          <div className="space-y-1">
            <StarRating nota={Math.round(Number(media.media))} tamanho="md" />
            <p className="text-sm text-text-light font-medium">
              {media.total} {media.total === 1 ? 'avaliação' : 'avaliações'}
            </p>
          </div>
        </div>
      )}

      {/* LISTA DE AVALIAÇÕES */}
      <div className="space-y-4">
        {avaliacoes.map(av => (
          <div
            key={av._id}
            className="
              flex gap-4 p-5
              bg-white rounded-card
              border border-gray-mid
              hover:border-dark-light
              transition-colors duration-300
            "
          >
            {/* AVATAR */}
            <div className={`
              w-10 h-10 rounded-full flex-shrink-0
              flex items-center justify-center
              text-white font-bold text-sm
              ${getAvatarColor(av.cliente_nome)}
            `}>
              {av.cliente_nome.charAt(0).toUpperCase()}
            </div>

            {/* CONTEÚDO */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-semibold text-dark-light text-sm">
                  {av.cliente_nome}
                </span>
                <StarRating nota={av.nota} tamanho="sm" />
              </div>
              <p className="text-xs text-text-light mb-2">
                {new Date(av.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit', month: 'long', year: 'numeric'
                })}
              </p>
              {av.comentario && (
                <p className="text-sm text-text-secondary leading-relaxed">
                  {av.comentario}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}