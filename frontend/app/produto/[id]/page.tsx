'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Shield, ChevronRight } from 'lucide-react';
import ProdutosRelacionados from '@/components/ProdutosRelacionados';
import AvaliacoesList from '@/components/AvaliacoesList';
import AvaliacaoForm from '@/components/AvaliacaoForm';
import FavoritoButton from '@/components/FavoritoButton';
import Button from '@/components/ui/Button'; // <-- CORREÇÃO 1: Importação correta (sem {})

interface Produto {
  _id: string;
  nome: string;
  preco: number;
  preco_original?: number;
  descricao: string;
  fotos: string[];
  imagemUrl?: string;
  disponivel: number;
  estoque?: number;
  categoria?: { _id: string; nome: string };
  atributos?: {
    composicao?: string;
    largura_metro?: number;
    gramatura?: number;
    cuidados?: string;
  };
}

const PLACEHOLDER = '/images/placeholder.jpg';

export default function ProdutoPage() {
  const { id } = useParams<{ id: string }>();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [imagemAtiva, setImagemAtiva] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [refreshAvaliacoes, setRefreshAvaliacoes] = useState(0);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    if (!id) return;
    axios.get(`${getApiUrl()}/api/produtos/${id}`)
      .then(res => setProduto(res.data))
      .catch(() => setErro('Produto não encontrado.'))
      .finally(() => setCarregando(false));
  }, [id]);

  useEffect(() => {
    if (produto) document.title = `${produto.nome} | Parthenon Tecidos`;
  }, [produto]);

  if (carregando) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-dark-light border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (erro || !produto) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-error font-medium">{erro || 'Produto não encontrado'}</p>
      <Link href="/loja" className="text-sm font-semibold text-dark-light hover:text-gold transition-colors underline">
        Voltar para a loja
      </Link>
    </div>
  );

  const estoque = produto.disponivel ?? produto.estoque ?? 0;
  const imagemSrc = imgError
    ? PLACEHOLDER
    : (produto.fotos?.[imagemAtiva] || produto.imagemUrl || PLACEHOLDER)
        .replace('http://localhost:5000', 'https://partenontecidos.onrender.com');

  const handleAddToCart = () => {
    addItem({
      id: produto._id,
      nome: produto.nome,
      preco: produto.preco,
      maxEstoque: estoque,
      foto: produto.fotos?.[0] || produto.imagemUrl,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="container-main py-6 md:py-12">

        {/* BREADCRUMB */}
        <nav className="flex items-center gap-2 text-sm text-text-light mb-6 md:mb-10" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" strokeWidth={2} />
          <Link href="/loja" className="hover:text-gold transition-colors">Loja</Link>
          {produto.categoria?.nome && (
            <>
              <ChevronRight className="w-3 h-3" strokeWidth={2} />
              <span className="hover:text-gold transition-colors">{produto.categoria.nome}</span>
            </>
          )}
          <ChevronRight className="w-3 h-3" strokeWidth={2} />
          <span className="text-dark-light font-medium line-clamp-1">{produto.nome}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">

          {/* GALERIA */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-light rounded-card overflow-hidden">
              <Image
                src={imagemSrc}
                alt={produto.nome}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                onError={() => setImgError(true)}
              />
              {estoque <= 0 && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <span className="text-white font-semibold text-xl uppercase tracking-widest">Esgotado</span>
                </div>
              )}
              {/* Favorito */}
              <div className="absolute top-4 right-4">
                <FavoritoButton produtoId={produto._id} size="lg" />
              </div>
            </div>

            {/* THUMBNAILS */}
            {produto.fotos && produto.fotos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {produto.fotos.map((foto, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setImagemAtiva(idx); setImgError(false); }}
                    className={`
                      w-16 h-16 flex-shrink-0 rounded-card overflow-hidden
                      border-2 transition-all duration-300
                      focus:outline-none focus:ring-2 focus:ring-gold
                      ${idx === imagemAtiva ? 'border-dark-light' : 'border-gray-mid hover:border-text-light'}
                    `}
                    aria-label={`Ver foto ${idx + 1}`}
                  >
                    <Image
                      src={foto.replace('http://localhost:5000', 'https://partenontecidos.onrender.com')}
                      alt=""
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INFORMAÇÕES */}
          <div className="flex flex-col gap-6">

            {/* CATEGORIA */}
            {produto.categoria?.nome && (
              <span className="text-xs font-semibold uppercase tracking-widest text-gold">
                {produto.categoria.nome}
              </span>
            )}

            {/* NOME */}
            <h1 className="font-serif font-semibold text-3xl md:text-4xl text-dark-light leading-tight">
              {produto.nome}
            </h1>

            {/* PREÇO */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-serif font-semibold text-dark-light">
                R$ {produto.preco.toFixed(2)}
              </span>
              {produto.preco_original && produto.preco_original > produto.preco && (
                <span className="text-text-light text-base line-through">
                  R$ {produto.preco_original.toFixed(2)}
                </span>
              )}
              <span className="text-text-light text-sm">/metro</span>
            </div>

            {/* STATUS */}
            <div className="flex items-center gap-2">
              {estoque > 0 ? (
                <span className="inline-flex items-center gap-2 text-sm font-medium text-success bg-green-50 px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-success" />
                  {estoque} m disponível
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 text-sm font-medium text-error bg-red-50 px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-error" />
                  Indisponível
                </span>
              )}
            </div>

            {/* DIVISOR */}
            <div className="border-t border-gray-mid" />

            {/* DESCRIÇÃO */}
            {produto.descricao && (
              <p className="text-text-secondary leading-relaxed">{produto.descricao}</p>
            )}

            {/* ATRIBUTOS */}
            {produto.atributos && Object.values(produto.atributos).some(v => v) && (
              <div className="grid grid-cols-2 gap-3 p-4 bg-light rounded-card border border-gray-mid text-sm">
                {produto.atributos.composicao && (
                  <div>
                    <span className="text-text-light uppercase tracking-widest text-xs block mb-1">Composição</span>
                    <span className="text-dark-light font-medium">{produto.atributos.composicao}</span>
                  </div>
                )}
                {(produto.atributos.largura_metro ?? 0) > 0 && (
                  <div>
                    <span className="text-text-light uppercase tracking-widest text-xs block mb-1">Largura</span>
                    <span className="text-dark-light font-medium">{produto.atributos.largura_metro} m</span>
                  </div>
                )}
                {(produto.atributos.gramatura ?? 0) > 0 && (
                  <div>
                    <span className="text-text-light uppercase tracking-widest text-xs block mb-1">Gramatura</span>
                    <span className="text-dark-light font-medium">{produto.atributos.gramatura} g/m²</span>
                  </div>
                )}
                {produto.atributos.cuidados && (
                  <div className="col-span-2">
                    <span className="text-text-light uppercase tracking-widest text-xs block mb-1">Cuidados</span>
                    <span className="text-dark-light font-medium">{produto.atributos.cuidados}</span>
                  </div>
                )}
              </div>
            )}

            {/* CTA */}
            <div className="space-y-3 pt-2">
              {/* 
                CORREÇÃO 2: 
                A prop 'icon' foi removida.
                O ícone e o texto foram passados como children do componente Button.
                Isso garante que o ícone apareça corretamente.
              */}
              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                disabled={estoque <= 0}
                className="w-full"
              >
                <ShoppingBag className="w-5 h-5" strokeWidth={2} />
                {added ? '✓ Adicionado ao carrinho!' : estoque <= 0 ? 'Produto Indisponível' : 'Adicionar ao Carrinho'}
              </Button>

              {/* SEGURANÇA */}
              <div className="flex items-center justify-center gap-2 text-xs text-text-light font-medium">
                <Shield className="w-4 h-4" strokeWidth={2} />
                Compra 100% segura
              </div>
            </div>
          </div>
        </div>

        {/* AVALIAÇÕES */}
        <section className="mt-12 md:mt-20 pt-12 border-t border-gray-mid">
          <h2 className="font-serif font-semibold text-2xl md:text-3xl text-dark-light mb-8">
            Avaliações
          </h2>
          <AvaliacoesList produtoId={id} refreshKey={refreshAvaliacoes} />
          <AvaliacaoForm produtoId={id} onSuccess={() => setRefreshAvaliacoes(c => c + 1)} />
        </section>

        {/* RELACIONADOS */}
        <ProdutosRelacionados produtoAtualId={id} />
      </div>
    </main>
  );
}