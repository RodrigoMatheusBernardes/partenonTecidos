'use client';

import { useState, useEffect } from 'react';
import { Check, X, SlidersHorizontal, Tag, DollarSign, Layers } from 'lucide-react';

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
}

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

  return (
    <div className="w-full flex flex-col gap-6 p-4">
      {/* HEADER - Título "Filtros" em 16px, sem uppercase */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-mid/30">
        <h2 className="font-primary font-bold text-[16px] text-primary-dark flex items-center gap-2 tracking-tight">
          <SlidersHorizontal className="w-4 h-4 text-text-light" strokeWidth={1.5} />
          Filtros
        </h2>
        <div className="flex items-center gap-3">
          {(precoMin > 0 || precoMax < precoMaxGlobal || categoriasSelecionadas.length > 0) && (
            <button
              onClick={limparFiltros}
              className="text-[13px] font-normal text-text-light hover:text-gold transition-colors"
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

      {/* PREÇO */}
      <div className="flex flex-col gap-2">
        <h3 className="font-primary font-semibold text-[13px] uppercase tracking-wider text-primary-dark flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-text-light" strokeWidth={1.5} />
          Preço
        </h3>

        <div className="flex items-center gap-2 mb-1">
          <input
            type="number"
            value={minInput}
            onChange={(e) => setMinInput(e.target.value)}
            placeholder="Mín"
            className="w-20 border border-gray-mid/60 rounded-button bg-transparent px-2 py-1.5 text-[14px] font-normal text-dark-light placeholder:text-text-light/70 focus:outline-none focus:border-gold transition-colors"
          />
          <span className="text-[14px] text-text-light">—</span>
          <input
            type="number"
            value={maxInput}
            onChange={(e) => setMaxInput(e.target.value)}
            placeholder="Máx"
            className="w-20 border border-gray-mid/60 rounded-button bg-transparent px-2 py-1.5 text-[14px] font-normal text-dark-light placeholder:text-text-light/70 focus:outline-none focus:border-gold transition-colors"
          />
          <button
            onClick={handlePrecoManual}
            className="bg-primary-dark text-white text-[13px] font-medium px-3 py-1.5 rounded-button hover:bg-primary-dark/80 transition-colors"
          >
            OK
          </button>
        </div>

        <div className="flex flex-col gap-1.5 pl-1">
          {faixasPreco.map((faixa) => (
            <label key={faixa.label} className="flex items-center gap-2.5 text-[14px] font-normal text-text-secondary cursor-pointer group transition-colors duration-200 hover:text-primary-dark">
              <input
                type="radio"
                name="faixa-preco"
                checked={precoMin === faixa.min && precoMax === faixa.max}
                onChange={() => onPrecoChange(faixa.min, faixa.max)}
                className="hidden peer"
              />
              <span className="relative w-4 h-4 border border-gray-mid/70 rounded-full bg-white flex items-center justify-center peer-checked:border-gold peer-checked:bg-gold group-hover:border-gold transition-colors duration-200 flex-shrink-0">
                <span className="w-2 h-2 rounded-full bg-gold opacity-0 peer-checked:opacity-100 transition-opacity duration-200" />
              </span>
              <span>{faixa.label}</span>
            </label>
          ))}
          <label className="flex items-center gap-2.5 text-[14px] font-normal text-text-secondary cursor-pointer group transition-colors duration-200 hover:text-primary-dark">
            <input
              type="radio"
              name="faixa-preco"
              checked={precoMin === 0 && precoMax === precoMaxGlobal}
              onChange={() => onPrecoChange(0, precoMaxGlobal)}
              className="hidden peer"
            />
            <span className="relative w-4 h-4 border border-gray-mid/70 rounded-full bg-white flex items-center justify-center peer-checked:border-gold peer-checked:bg-gold group-hover:border-gold transition-colors duration-200 flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-gold opacity-0 peer-checked:opacity-100 transition-opacity duration-200" />
            </span>
            <span>Todos os preços</span>
          </label>
        </div>
      </div>

      {/* CATEGORIAS */}
      <div className="flex flex-col gap-2">
        <h3 className="font-primary font-semibold text-[13px] uppercase tracking-wider text-primary-dark flex items-center gap-2">
          <Layers className="w-4 h-4 text-text-light" strokeWidth={1.5} />
          Categorias
        </h3>
        <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto pr-1 pl-1">
          {categorias.map((cat) => (
            <label key={cat._id} className="flex items-center gap-2.5 text-[14px] font-normal text-text-secondary cursor-pointer group transition-colors duration-200 hover:text-primary-dark">
              <input
                type="checkbox"
                checked={categoriasSelecionadas.includes(cat._id)}
                onChange={() => onCategoriaChange(cat._id)}
                className="hidden peer"
              />
              <span className="w-4 h-4 border border-gray-mid/70 rounded-sm bg-white flex items-center justify-center peer-checked:border-gold peer-checked:bg-gold group-hover:border-gold transition-colors duration-200 flex-shrink-0">
                <Check className="w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200" strokeWidth={3} />
              </span>
              <span>{cat.nome}</span>
            </label>
          ))}
        </div>
      </div>

      {/* COLEÇÕES */}
      <div className="flex flex-col gap-2">
        <h3 className="font-primary font-semibold text-[13px] uppercase tracking-wider text-primary-dark flex items-center gap-2">
          <Tag className="w-4 h-4 text-text-light" strokeWidth={1.5} />
          Coleções
        </h3>
        <div className="flex flex-col gap-1.5 pl-1">
          <label className="flex items-center gap-2.5 text-[14px] font-normal text-text-secondary cursor-pointer group transition-colors duration-200 hover:text-primary-dark">
            <input type="checkbox" className="hidden peer" />
            <span className="w-4 h-4 border border-gray-mid/70 rounded-sm bg-white flex items-center justify-center peer-checked:border-gold peer-checked:bg-gold group-hover:border-gold transition-colors duration-200 flex-shrink-0">
              <Check className="w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200" strokeWidth={3} />
            </span>
            <span>Premium</span>
          </label>
          <label className="flex items-center gap-2.5 text-[14px] font-normal text-text-secondary cursor-pointer group transition-colors duration-200 hover:text-primary-dark">
            <input type="checkbox" className="hidden peer" />
            <span className="w-4 h-4 border border-gray-mid/70 rounded-sm bg-white flex items-center justify-center peer-checked:border-gold peer-checked:bg-gold group-hover:border-gold transition-colors duration-200 flex-shrink-0">
              <Check className="w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200" strokeWidth={3} />
            </span>
            <span>Promoções</span>
          </label>
        </div>
      </div>
    </div>
  );
}