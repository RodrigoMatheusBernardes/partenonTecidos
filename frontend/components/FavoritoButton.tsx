'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

interface FavoritoButtonProps {
  produtoId: string;
}

export default function FavoritoButton({ produtoId }: FavoritoButtonProps) {
  const { isAuthenticated, user } = useAuth();
  const [isFavorito, setIsFavorito] = useState(false);
  const [loading, setLoading] = useState(false);

  // Buscar o estado inicial do favorito
  const checkFavorito = useCallback(async () => {
    if (!isAuthenticated || !user?.id) return;
    try {
      const apiUrl = getApiUrl();
      const res = await axios.get(`${apiUrl}/api/produtos/favoritos/check/${user.id}/${produtoId}`);
      setIsFavorito(res.data.isFavorito);
    } catch (err) {
      console.error('Erro ao verificar favorito:', err);
    }
  }, [isAuthenticated, user, produtoId]);

  useEffect(() => {
    checkFavorito();
  }, [checkFavorito]);

  const toggle = async () => {
    if (!isAuthenticated || !user) {
      toast.error('Faça login para adicionar favoritos.');
      return;
    }
    if (loading) return;

    setLoading(true);
    const novoEstado = !isFavorito;
    setIsFavorito(novoEstado); // otimista: muda antes da resposta

    try {
      const apiUrl = getApiUrl();
      await axios.post(`${apiUrl}/api/produtos/favoritos`, {
        cliente_id: user.id,
        produto_id: produtoId,
      });
      // Pequeno delay para garantir que a mudança foi persistida
      setTimeout(() => {
        checkFavorito();
      }, 300);
    } catch (err) {
      // Reverte se falhar
      setIsFavorito(!novoEstado);
      console.error(err);
      toast.error('Erro ao atualizar favorito.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`p-1.5 rounded-full transition-all duration-300 ${
        isFavorito
          ? 'text-red-500 scale-110'
          : 'text-gray-400 hover:text-red-400 hover:scale-105'
      } ${loading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
      aria-label={isFavorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      title={isFavorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill={isFavorito ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
  );
}