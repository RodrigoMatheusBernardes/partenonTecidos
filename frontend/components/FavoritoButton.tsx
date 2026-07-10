'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { Heart } from 'lucide-react';

interface FavoritoButtonProps {
  produtoId: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button';
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export default function FavoritoButton({
  produtoId,
  size = 'md',
  variant = 'icon',
}: FavoritoButtonProps) {
  const { isAuthenticated, user } = useAuth();
  const [isFavorito, setIsFavorito] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkFavorito = useCallback(async () => {
    if (!isAuthenticated || !user?.id) return;
    try {
      const apiUrl = getApiUrl();
      const res = await axios.get(`${apiUrl}/api/produtos/favoritos/check/${user.id}/${produtoId}`);
      setIsFavorito(res.data.isFavorito);
    } catch (err) {
      console.error('Erro ao verificar favorito:', err);
    }
  }, [isAuthenticated, user?.id, produtoId]);

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
    setIsFavorito(novoEstado);

    try {
      const apiUrl = getApiUrl();
      await axios.post(`${apiUrl}/api/produtos/favoritos`, {
        cliente_id: user.id,
        produto_id: produtoId,
      });
      setTimeout(() => {
        checkFavorito();
      }, 300);
    } catch (err) {
      setIsFavorito(!novoEstado);
      console.error(err);
      toast.error('Erro ao atualizar favorito.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  if (variant === 'icon') {
    return (
      <button
        onClick={toggle}
        disabled={loading}
        className={`
          p-2 rounded-button
          transition-all duration-300
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error
          ${isFavorito ? 'text-error' : 'text-text-light hover:text-error'}
          ${loading ? 'opacity-50 cursor-wait' : 'cursor-pointer hover:scale-110'}
        `}
        aria-label={isFavorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        title={isFavorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      >
        <Heart
          className={sizeMap[size]}
          strokeWidth={2}
          fill={isFavorito ? 'currentColor' : 'none'}
        />
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`
        px-4 py-2 rounded-button
        border transition-all duration-300
        ${isFavorito
          ? 'bg-error text-white border-error hover:bg-red-700'
          : 'border-dark-light text-dark-light hover:bg-dark-light hover:text-white'
        }
        font-medium text-sm
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error
        ${loading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
      `}
      aria-label={isFavorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <div className="flex items-center gap-2">
        <Heart
          className="w-4 h-4"
          strokeWidth={2}
          fill={isFavorito ? 'currentColor' : 'none'}
        />
        {isFavorito ? 'Nos Favoritos' : 'Adicionar'}
      </div>
    </button>
  );
}