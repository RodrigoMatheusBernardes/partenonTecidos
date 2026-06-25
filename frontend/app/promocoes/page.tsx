'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import FavoritoButton from '@/components/FavoritoButton';
import ProductCard from '@/components/ui/ProductCard';

interface Produto {
  _id: string;
  nome: string;
  preco: number;
  preco_original: number | null;
  fotos: string[];
  imagemUrl?: string;
  disponivel: number;
}

export default function PromocoesPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const apiUrl = getApiUrl();
    axios.get(`${apiUrl}/api/produtos/vitrine`)
      .then(res => {
        // Filtra produtos com preco_original > preco (promoção ativa)
        const promos = res.data.filter((p: any) => p.preco_original && p.preco_original > p.preco);
        setProdutos(promos);
      })
      .catch(console.error)
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Tecidos em Promoção</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (<ProductCard key={i} id="" nome="" preco={0} estoque={0} />))}
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tecidos em Promoção</h1>
      {produtos.length === 0 ? (
        <p className="text-gray-500">Nenhum produto em promoção no momento.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {produtos.map(produto => (
            <div key={produto._id} className="relative group">
              <ProductCard
                id={produto._id}
                nome={produto.nome}
                preco={produto.preco}
                imagem={produto.fotos?.[0] || produto.imagemUrl}
                estoque={produto.disponivel ?? 0}
                precoOriginal={produto.preco_original}   // ← agora o desconto aparece
              />
              <div className="absolute top-2 right-2 z-10">
                <FavoritoButton produtoId={produto._id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}