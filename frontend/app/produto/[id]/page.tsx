'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import ProdutosRelacionados from '@/components/ProdutosRelacionados';
import AvaliacoesList from '@/components/AvaliacoesList';
import AvaliacaoForm from '@/components/AvaliacaoForm';

interface Produto {
  _id: string;
  nome: string;
  preco: number;
  descricao: string;
  fotos: string[];
  imagemUrl?: string;
  disponivel: number;
  categoria?: { _id: string; nome: string };
  atributos?: {
    composicao?: string;
    largura_metro?: number;
    gramatura?: number;
    cuidados?: string;
  };
}

export default function ProdutoPage() {
  const { id } = useParams<{ id: string }>();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [imagemAtiva, setImagemAtiva] = useState(0);
  const [refreshAvaliacoes, setRefreshAvaliacoes] = useState(0);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    if (!id) return;
    const apiUrl = getApiUrl();
    axios.get(`${apiUrl}/api/produtos/${id}`)
      .then(res => setProduto(res.data))
      .catch(err => { console.error(err); setErro('Produto não encontrado.'); })
      .finally(() => setCarregando(false));
  }, [id]);

  // Título dinâmico da aba (SEO)
  useEffect(() => {
    if (produto) {
      document.title = `${produto.nome} | Parthenon Tecidos`;
    }
  }, [produto]);

  if (carregando) return <div className="flex justify-center py-20"><p>Carregando...</p></div>;
  if (erro || !produto) return <div className="text-center py-20 text-red-600">{erro || 'Produto não encontrado'}</div>;

  const imagemPrincipal = produto.fotos?.[imagemAtiva] || produto.imagemUrl;

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 md:py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        {produto.categoria?.nome && (
          <>
            <Link href={`/categoria/${produto.categoria.nome.toLowerCase()}`} className="hover:text-primary">
              {produto.categoria.nome}
            </Link>
            <span className="mx-2">/</span>
          </>
        )}
        <span className="text-gray-800">{produto.nome}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Galeria */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4">
            {imagemPrincipal ? (
              <img src={imagemPrincipal} alt={produto.nome} className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-6xl">📦</div>
            )}
          </div>
          {produto.fotos && produto.fotos.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {produto.fotos.map((foto, idx) => (
                <button
                  key={idx}
                  onClick={() => setImagemAtiva(idx)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                    idx === imagemAtiva ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <img src={foto} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Informações */}
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900">{produto.nome}</h1>
          <p className="text-3xl font-bold text-primary mt-4">R$ {produto.preco.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">ou 3x de R$ {(produto.preco / 3).toFixed(2)}</p>

          {/* Status estoque */}
          <div className="mt-4">
            {produto.disponivel > 0 ? (
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                ✅ Em estoque — {produto.disponivel} m disponível
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                ❌ Indisponível
              </span>
            )}
          </div>

          {/* CTA */}
          <div className="mt-6">
            {produto.disponivel > 0 ? (
              <>
                <button
                  onClick={() => {
                    addItem({
                      id: produto._id,
                      nome: produto.nome,
                      preco: produto.preco,
                      maxEstoque: produto.disponivel,
                      foto: produto.fotos?.[0] || produto.imagemUrl
                    });
                    setAdded(true);
                    setTimeout(() => setAdded(false), 1500);
                  }}
                  className="w-full bg-accent text-white py-4 rounded-xl text-lg font-bold hover:bg-orange-600 active:scale-[0.98] transition flex items-center justify-center gap-2"
                >
                  🛒 {added ? 'Adicionado!' : 'Comprar agora'}
                </button>
                <p className="text-center text-xs text-gray-500 mt-3 flex items-center justify-center gap-1">
                  🔒 Compra 100% segura
                </p>
              </>
            ) : (
              <button disabled className="w-full bg-gray-300 text-gray-600 py-4 rounded-xl text-lg font-semibold cursor-not-allowed">
                Produto Indisponível
              </button>
            )}
          </div>

          {/* Descrição */}
          {produto.descricao && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-1">Descrição</h3>
              <p className="text-gray-600 leading-relaxed">{produto.descricao}</p>
            </div>
          )}

          {/* Atributos – corrigidos para evitar undefined */}
          {produto.atributos && Object.values(produto.atributos).some(v => v) && (
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {produto.atributos.composicao && <div><span className="text-gray-500">Composição:</span> {produto.atributos.composicao}</div>}
              {(produto.atributos.largura_metro ?? 0) > 0 && <div><span className="text-gray-500">Largura:</span> {produto.atributos.largura_metro} m</div>}
              {(produto.atributos.gramatura ?? 0) > 0 && <div><span className="text-gray-500">Gramatura:</span> {produto.atributos.gramatura} g/m²</div>}
              {produto.atributos.cuidados && <div className="col-span-2"><span className="text-gray-500">Cuidados:</span> {produto.atributos.cuidados}</div>}
            </div>
          )}
        </div>
      </div>

      {/* Avaliações */}
      <div className="mt-16 border-t pt-10">
        <h2 className="text-2xl font-heading font-bold mb-6">Avaliações</h2>
        <AvaliacoesList produtoId={id} refreshKey={refreshAvaliacoes} />
        <AvaliacaoForm produtoId={id} onSuccess={() => setRefreshAvaliacoes(c => c + 1)} />
      </div>

      {/* Produtos Relacionados */}
      <ProdutosRelacionados produtoAtualId={id} />
    </main>
  );
}