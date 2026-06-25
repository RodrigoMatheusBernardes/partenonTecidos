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

function getAvatarColor(nome: string) {
  const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500'];
  let hash = 0;
  for (let i = 0; i < nome.length; i++) hash = nome.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export default function AvaliacoesList({ produtoId, refreshKey }: { produtoId: string; refreshKey?: number }) {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [media, setMedia] = useState({ media: 0, total: 0 });

  const carregar = () => {
    const api = getApiUrl();
    fetch(`${api}/api/produtos/${produtoId}/avaliacoes`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAvaliacoes(data);
        else setAvaliacoes([]);
      })
      .catch(() => setAvaliacoes([]));

    fetch(`${api}/api/produtos/${produtoId}/media`)
      .then(res => res.json())
      .then(data => setMedia(data))
      .catch(() => setMedia({ media: 0, total: 0 }));
  };

  useEffect(() => {
    carregar();
  }, [produtoId, refreshKey]); // recarrega quando refreshKey muda

  if (avaliacoes.length === 0 && media.total === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl font-bold text-gray-800">{Number(media.media).toFixed(1)}</span>
        <StarRating nota={Math.round(Number(media.media))} tamanho="medium" />
        <span className="text-sm text-gray-500">({media.total} {media.total === 1 ? 'avaliação' : 'avaliações'})</span>
      </div>
      <div className="space-y-5">
        {avaliacoes.map(av => (
          <div key={av._id} className="flex gap-3">
            <div className={`w-10 h-10 rounded-full ${getAvatarColor(av.cliente_nome)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
              {av.cliente_nome.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800">{av.cliente_nome}</span>
                <StarRating nota={av.nota} tamanho="small" />
              </div>
              <p className="text-xs text-gray-400">{new Date(av.createdAt).toLocaleDateString('pt-BR')}</p>
              {av.comentario && <p className="text-gray-700 mt-2 text-sm">{av.comentario}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}