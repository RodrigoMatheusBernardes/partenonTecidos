'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import ProductCard from '@/components/ui/ProductCard';
import FavoritoButton from '@/components/FavoritoButton';
import toast from 'react-hot-toast';

interface ProdutoFavorito {
  _id: string;
  produto_id: {
    _id: string;
    nome: string;
    preco: number;
    fotos: string[];
    imagemUrl?: string;
    disponivel: number;
    preco_original?: number | null;
  };
}

export default function FavoritosPage() {
  const { user, isAuthenticated } = useAuth();
  const [favoritos, setFavoritos] = useState<ProdutoFavorito[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarFavoritos = () => {
    if (!isAuthenticated || !user?.id) return;
    const apiUrl = getApiUrl();
    axios.get(`${apiUrl}/api/produtos/favoritos/${user.id}`)
      .then(res => setFavoritos(res.data))
      .catch(console.error)
      .finally(() => setCarregando(false));
  };

  useEffect(() => {
    carregarFavoritos();
  }, [isAuthenticated, user]);

  const removerFavorito = async (produtoId: string) => {
    // Garantia extra para o TypeScript
    if (!user) {
      toast.error('Faça login para gerenciar favoritos.');
      return;
    }
    try {
      const apiUrl = getApiUrl();
      await axios.post(`${apiUrl}/api/produtos/favoritos`, {
        cliente_id: user.id,
        produto_id: produtoId,
      });
      // Remove o item da lista local
      setFavoritos(prev => prev.filter(fav => fav.produto_id._id !== produtoId));
    } catch (err) {
      console.error(err);
      toast.error('Erro ao remover favorito.');
    }
  };

  if (!isAuthenticated) {
    return <main className="p-8 text-center">Faça login para ver seus favoritos.</main>;
  }

  if (carregando) return <main className="p-8 text-center">Carregando...</main>;

  const favoritosValidos = favoritos.filter(fav => fav.produto_id && fav.produto_id.nome);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Meus Favoritos</h1>
      {favoritosValidos.length === 0 ? (
        <p className="text-gray-500">Nenhum favorito ainda.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favoritosValidos.map((fav) => {
            const prod = fav.produto_id;
            // Monta um objeto compatível com ProductCard
            const produtoCompativel = {
              _id: prod._id,
              nome: prod.nome,
              preco: prod.preco ?? 0,
              fotos: prod.fotos,
              imagemUrl: prod.imagemUrl,
              estoque: prod.disponivel ?? 0,
              preco_original: prod.preco_original,
            };
            return (
              <div key={fav._id} className="relative group">
                <ProductCard produto={produtoCompativel} />
                <div className="absolute top-2 right-2 z-10">
                  <FavoritoButton produtoId={prod._id} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}