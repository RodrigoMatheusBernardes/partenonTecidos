'use client';

import { useState, useEffect } from 'react';
import { Check, X, Star } from 'lucide-react';
import Button from '@/components/ui/Button';

interface Categoria {
  _id: string;
  nome: string;
}

interface FiltersSidebarProps {
  precoMin: number;
  precoMax: number;
  precoMaxGlobal: number;
  categorias: Categoria[];
  categoriasSelecionadas: string[];
  onPrecoChange: (min: number, max: number) => void;
  onCategoriaChange: (categoriaId: string) => void;
  limparFiltros: () => void;
  isMobile?: boolean;
  onClose?: () => void;
  // Novos filtros
  avaliacao?: number;
  onAvaliacaoChange?: (avaliacao: number) => void;
  disponibilidade?: string[];
  onDisponibilidadeChange?: (opcao: string) => void;
  composicao?: string[];
  onComposicaoChange?: (comp: string) => void;
  somentePromocoes?: boolean;
  onPromocoesChange?: (value: boolean) => void;
}

const opcoesDisponibilidade = [
  { value: 'em_estoque', label: 'Em estoque' },
  { value: 'sob_encomenda', label: 'Sob encomenda' },
  { value: 'esgotado', label: 'Esgotado' },
];

const opcoesComposicao = [
  'Algodão',
  'Linho',
  'Poliéster',
  'Seda',
  'Lã',
  'Viscose',
  'Tencel',
  'Ramí',
  'Cânhamo',
];

const avaliacoes = [
  { value: 4, label: '★★★★☆ e acima' },
  { value: 3, label: '★★★☆☆ e acima' },
  { value: 2, label: '★★☆☆☆ e acima' },
  { value: 1, label: '★☆☆☆☆ e acima' },
];

export default function FiltersSidebar({
  precoMin,
  precoMax,
  precoMaxGlobal,
  categorias,
  categoriasSelecionadas,
  onPrecoChange,
  onCategoriaChange,
  limparFiltros,
  isMobile = false,
  onClose,
  avaliacao = 0,
  onAvaliacaoChange,
  disponibilidade = [],
  onDisponibilidadeChange,
  composicao = [],
  onComposicaoChange,
  somentePromocoes = false,
  onPromocoesChange,
}: FiltersSidebarProps) {
  const [minInput, setMinInput] = useState(precoMin.toString());
  const [maxInput, setMaxInput] = useState(precoMax.toString());

  useEffect(() => {
    setMinInput(precoMin.toString());
    setMaxInput(precoMax.toString());
  }, [precoMin, precoMax]);

  const faixasPreco = [
    { label: 'Até R$ 20', min: 0, max: 20 },
    { label: 'R$ 20 – R$ 50', min: 20, max: 50 },
    { label: 'R$ 50 – R$ 100', min: 50, max: 100 },
    { label: 'Acima de R$ 100', min: 100, max: precoMaxGlobal },
  ];

  const handlePrecoManual = () => {
    let min = parseFloat(minInput) || 0;
    let max = parseFloat(maxInput) || precoMaxGlobal;
    if (min < 0) min = 0;
    if (max > precoMaxGlobal) max = precoMaxGlobal;
    if (min > max) min = max;
    onPrecoChange(min, max);
  };

  const hasActiveFilters =
    precoMin > 0 ||
    precoMax < precoMaxGlobal ||
    categoriasSelecionadas.length > 0 ||
    avaliacao > 0 ||
    disponibilidade.length > 0 ||
    composicao.length > 0 ||
    somentePromocoes;

  return (
    <div className="flex flex-col w-full gap-8">
      
      {/* HEADER */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-mid">
        <h2 className="font-serif font-light text-2xl text-dark-light tracking-tight">
          Filtros
        </h2>
        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
              onClick={limparFiltros}
              className="text-xs text-text-light hover:text-dark-light transition-colors"
            >
              Limpar
            </button>
          )}
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="text-dark-light hover:text-gold transition-colors"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>

      {/* ===== PREÇO ===== */}
      <div>
        <h3 className="text-xs font-medium uppercase tracking-widest text-text-light mb-4">
          Preço
        </h3>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="number"
            value={minInput}
            onChange={(e) => setMinInput(e.target.value)}
            placeholder="Mín"
            className="w-16 border border-gray-mid rounded-button bg-transparent px-2 py-1.5 text-xs text-center text-dark-light placeholder:text-text-light focus:outline-none focus:border-gold transition-colors"
          />
          <span className="text-text-light text-xs">—</span>
          <input
            type="number"
            value={maxInput}
            onChange={(e) => setMaxInput(e.target.value)}
            placeholder="Máx"
            className="w-16 border border-gray-mid rounded-button bg-transparent px-2 py-1.5 text-xs text-center text-dark-light placeholder:text-text-light focus:outline-none focus:border-gold transition-colors"
          />
          <Button
            variant="primary"
            size="sm"
            onClick={handlePrecoManual}
            className="text-xs"
          >
            OK
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          {faixasPreco.map((faixa) => (
            <label
              key={faixa.label}
              className="flex items-center gap-2.5 text-sm text-text-secondary cursor-pointer group"
            >
              <input
                type="radio"
                name="faixa-preco"
                checked={precoMin === faixa.min && precoMax === faixa.max}
                onChange={() => onPrecoChange(faixa.min, faixa.max)}
                className="hidden peer"
              />
              <span className="relative w-4 h-4 border border-gray-mid rounded-full bg-white flex items-center justify-center peer-checked:border-gold group-hover:border-gold transition-colors duration-200 flex-shrink-0">
                <span className="w-2 h-2 rounded-full bg-gold opacity-0 peer-checked:opacity-100 transition-opacity duration-200" />
              </span>
              <span className="text-sm font-light group-hover:font-normal transition-all">
                {faixa.label}
              </span>
            </label>
          ))}
          <label className="flex items-center gap-2.5 text-sm text-text-secondary cursor-pointer group">
            <input
              type="radio"
              name="faixa-preco"
              checked={precoMin === 0 && precoMax === precoMaxGlobal}
              onChange={() => onPrecoChange(0, precoMaxGlobal)}
              className="hidden peer"
            />
            <span className="relative w-4 h-4 border border-gray-mid rounded-full bg-white flex items-center justify-center peer-checked:border-gold group-hover:border-gold transition-colors duration-200 flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-gold opacity-0 peer-checked:opacity-100 transition-opacity duration-200" />
            </span>
            <span className="text-sm font-light group-hover:font-normal transition-all">
              Todos os preços
            </span>
          </label>
        </div>
      </div>

      {/* ===== AVALIAÇÃO ===== */}
      {onAvaliacaoChange && (
        <div className="border-t border-gray-mid pt-4">
          <h3 className="text-xs font-medium uppercase tracking-widest text-text-light mb-4">
            Avaliação dos clientes
          </h3>
          <div className="flex flex-col gap-2">
            {avaliacoes.map((item) => (
              <label
                key={item.value}
                className="flex items-center gap-2.5 text-sm text-text-secondary cursor-pointer group"
              >
                <input
                  type="radio"
                  name="avaliacao"
                  checked={avaliacao === item.value}
                  onChange={() => onAvaliacaoChange(item.value)}
                  className="hidden peer"
                />
                <span className="relative w-4 h-4 border border-gray-mid rounded-full bg-white flex items-center justify-center peer-checked:border-gold group-hover:border-gold transition-colors duration-200 flex-shrink-0">
                  <span className="w-2 h-2 rounded-full bg-gold opacity-0 peer-checked:opacity-100 transition-opacity duration-200" />
                </span>
                <span className="text-sm font-light group-hover:font-normal transition-all flex items-center gap-1">
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ===== DISPONIBILIDADE ===== */}
      {onDisponibilidadeChange && (
        <div className="border-t border-gray-mid pt-4">
          <h3 className="text-xs font-medium uppercase tracking-widest text-text-light mb-4">
            Disponibilidade
          </h3>
          <div className="flex flex-col gap-2">
            {opcoesDisponibilidade.map((opcao) => (
              <label
                key={opcao.value}
                className="flex items-center gap-2.5 text-sm text-text-secondary cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={disponibilidade.includes(opcao.value)}
                  onChange={() => onDisponibilidadeChange(opcao.value)}
                  className="hidden peer"
                />
                <span className="w-4 h-4 border border-gray-mid rounded-sm bg-white flex items-center justify-center peer-checked:border-gold peer-checked:bg-gold group-hover:border-gold transition-colors duration-200 flex-shrink-0">
                  <Check className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200" strokeWidth={3} />
                </span>
                <span className="text-sm font-light group-hover:font-normal transition-all">
                  {opcao.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ===== COMPOSIÇÃO ===== */}
      {onComposicaoChange && (
        <div className="border-t border-gray-mid pt-4">
          <h3 className="text-xs font-medium uppercase tracking-widest text-text-light mb-4">
            Composição
          </h3>
          <div className="flex flex-wrap gap-2">
            {opcoesComposicao.map((comp) => (
              <button
                key={comp}
                onClick={() => onComposicaoChange(comp)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                  composicao.includes(comp)
                    ? 'bg-gold text-white'
                    : 'bg-light text-text-secondary hover:bg-gray-mid'
                }`}
              >
                {comp}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ===== PROMOÇÕES ===== */}
      {onPromocoesChange && (
        <div className="border-t border-gray-mid pt-4">
          <label className="flex items-center gap-2.5 text-sm text-text-secondary cursor-pointer group">
            <input
              type="checkbox"
              checked={somentePromocoes}
              onChange={(e) => onPromocoesChange(e.target.checked)}
              className="hidden peer"
            />
            <span className="w-4 h-4 border border-gray-mid rounded-sm bg-white flex items-center justify-center peer-checked:border-gold peer-checked:bg-gold group-hover:border-gold transition-colors duration-200 flex-shrink-0">
              <Check className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200" strokeWidth={3} />
            </span>
            <span className="text-sm font-light group-hover:font-normal transition-all flex items-center gap-1">
              🏷️ Ofertas e descontos
            </span>
          </label>
        </div>
      )}

      {/* ===== CATEGORIAS ===== */}
      {categorias.length > 0 && (
        <div className="border-t border-gray-mid pt-4">
          <h3 className="text-xs font-medium uppercase tracking-widest text-text-light mb-4">
            Categorias
          </h3>
          <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto pr-2">
            {categorias.map((cat) => (
              <label
                key={cat._id}
                className="flex items-center gap-2.5 text-sm text-text-secondary cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={categoriasSelecionadas.includes(cat._id)}
                  onChange={() => onCategoriaChange(cat._id)}
                  className="hidden peer"
                />
                <span className="w-4 h-4 border border-gray-mid rounded-sm bg-white flex items-center justify-center peer-checked:border-gold peer-checked:bg-gold group-hover:border-gold transition-colors duration-200 flex-shrink-0">
                  <Check className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200" strokeWidth={3} />
                </span>
                <span className="text-sm font-light group-hover:font-normal transition-all">
                  {cat.nome}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ===== SEÇÃO INFORMATIVA ABAIXO DOS FILTROS ===== */}
      <div className="border-t border-gray-mid pt-6 mt-2 space-y-4">
        <div className="bg-light/50 rounded-card p-4 text-center">
          <p className="text-xs text-text-light font-light uppercase tracking-wider">
            Precisa de ajuda?
          </p>
          <p className="text-xs text-text-secondary mt-1">
            Consulte nossa <a href="/faq" className="text-gold hover:underline">seção de ajuda</a> ou entre em contato conosco
          </p>
        </div>

        <div className="bg-gold/5 rounded-card p-4 text-center border border-gold/20">
          <p className="text-xs text-text-light font-light uppercase tracking-wider">
            Parcele em até 12x sem juros
          </p>
          <p className="text-xs text-text-secondary mt-1">
            Sem anuidade. Peça o seu.
          </p>
        </div>

        {!isMobile && (
          <div className="bg-light/30 rounded-card p-4">
            <p className="text-xs text-text-light font-light uppercase tracking-wider mb-2">
              Os clientes que viram os produtos também viram
            </p>
            <div className="flex flex-col gap-1 text-xs text-text-secondary">
              <span>• Tecidos de linho</span>
              <span>• Algodão egípcio</span>
              <span>• Seda natural</span>
              <span>• Malha fria</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}