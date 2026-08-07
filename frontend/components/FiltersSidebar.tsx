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
    <div className="w-full flex flex-col gap-6">
      
      {/* HEADER - Filtros */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-mid/30">
        <h2 className="font-primary font-bold text-base text-primary-dark flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-text-light" strokeWidth={1.5} />
          Filtros
        </h2>
        <div className="flex items-center gap-3">
          {(precoMin > 0 || precoMax < precoMaxGlobal || categoriasSelecionadas.length > 0) && (
            <button
              onClick={limparFiltros}
              className="text-xs text-text-light hover:text-gold transition-colors font-secondary font-normal tracking-wide"
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
        <h3 className="font-primary font-medium text-sm text-primary-dark tracking-wide flex items-center gap-2">
          <DollarSign className="w-3.5 h-3.5 text-text-light" strokeWidth={1.5} />
          Preço
        </h3>
        
        <div className="flex items-center gap-2 mb-2">
          <input
            type="number"
            value={minInput}
            onChange={(e) => setMinInput(e.target.value)}
            placeholder="Mín"
            className="w-16 border border-gray-mid/60 rounded-button bg-transparent px-2 py-1.5 text-sm text-dark-light placeholder:text-text-light/70 focus:outline-none focus:border-gold transition-colors"
          />
          <span className="text-text-light text-xs">—</span>
          <input
            type="number"
            value={maxInput}
            onChange={(e) => setMaxInput(e.target.value)}
            placeholder="Máx"
            className="w-16 border border-gray-mid/60 rounded-button bg-transparent px-2 py-1.5 text-sm text-dark-light placeholder:text-text-light/70 focus:outline-none focus:border-gold transition-colors"
          />
          <button
            onClick={handlePrecoManual}
            className="bg-primary-dark text-white text-xs font-primary font-medium px-2.5 py-1.5 rounded-button hover:bg-primary-dark/80 transition-colors"
          >
            OK
          </button>
        </div>

        <div className="flex flex-col gap-2 pl-1">
          {faixasPreco.map((faixa) => (
            <label key={faixa.label} className="flex items-center gap-2.5 text-sm text-dark-light/80 font-secondary font-normal cursor-pointer group transition-all duration-200">
              <input
                type="radio"
                name="faixa-preco"
                checked={precoMin === faixa.min && precoMax === faixa.max}
                onChange={() => onPrecoChange(faixa.min, faixa.max)}
                className="hidden peer"
              />
              <span className="relative w-4 h-4 border border-gray-mid/70 rounded-full bg-white flex items-center justify-center peer-checked:border-gold group-hover:border-gold transition-colors duration-200 flex-shrink-0">
                <span className="w-2 h-2 rounded-full bg-gold opacity-0 peer-checked:opacity-100 transition-opacity duration-200"></span>
              </span>
              <span className="text-sm font-secondary font-normal group-hover:text-primary-dark transition-colors">{faixa.label}</span>
            </label>
          ))}
          <label className="flex items-center gap-2.5 text-sm text-dark-light/80 font-secondary font-normal cursor-pointer group transition-all duration-200">
            <input
              type="radio"
              name="faixa-preco"
              checked={precoMin === 0 && precoMax === precoMaxGlobal}
              onChange={() => onPrecoChange(0, precoMaxGlobal)}
              className="hidden peer"
            />
            <span className="relative w-4 h-4 border border-gray-mid/70 rounded-full bg-white flex items-center justify-center peer-checked:border-gold group-hover:border-gold transition-colors duration-200 flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-gold opacity-0 peer-checked:opacity-100 transition-opacity duration-200"></span>
            </span>
            <span className="text-sm font-secondary font-normal group-hover:text-primary-dark transition-colors">Todos os preços</span>
          </label>
        </div>
      </div>

      {/* DIVISOR SUTIL */}
      <div className="border-b border-gray-mid/30" />

      {/* CATEGORIAS */}
      <div className="flex flex-col gap-2">
        <h3 className="font-primary font-medium text-sm text-primary-dark tracking-wide flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-text-light" strokeWidth={1.5} />
          Categorias
        </h3>
        <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto pr-1 pl-1">
          {categorias.map((cat) => (
            <label key={cat._id} className="flex items-center gap-2.5 text-sm text-dark-light/80 font-secondary font-normal cursor-pointer group transition-all duration-200">
              <input
                type="checkbox"
                checked={categoriasSelecionadas.includes(cat._id)}
                onChange={() => onCategoriaChange(cat._id)}
                className="hidden peer"
              />
              <span className="w-4 h-4 border border-gray-mid/70 rounded-sm bg-white flex items-center justify-center peer-checked:border-gold peer-checked:bg-gold group-hover:border-gold transition-colors duration-200 flex-shrink-0">
                <Check className="w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200" strokeWidth={3} />
              </span>
              <span className="text-sm font-secondary font-normal group-hover:text-primary-dark transition-colors">{cat.nome}</span>
            </label>
          ))}
        </div>
      </div>

      {/* DIVISOR SUTIL */}
      <div className="border-b border-gray-mid/30" />

      {/* COLEÇÕES */}
      <div className="flex flex-col gap-2">
        <h3 className="font-primary font-medium text-sm text-primary-dark tracking-wide flex items-center gap-2">
          <Tag className="w-3.5 h-3.5 text-text-light" strokeWidth={1.5} />
          Coleções
        </h3>
        <div className="flex flex-col gap-1.5 pl-1">
          <label className="flex items-center gap-2.5 text-sm text-dark-light/80 font-secondary font-normal cursor-pointer group transition-all duration-200">
            <input type="checkbox" className="hidden peer" />
            <span className="w-4 h-4 border border-gray-mid/70 rounded-sm bg-white flex items-center justify-center peer-checked:border-gold peer-checked:bg-gold group-hover:border-gold transition-colors duration-200 flex-shrink-0">
              <Check className="w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200" strokeWidth={3} />
            </span>
            <span className="text-sm font-secondary font-normal group-hover:text-primary-dark transition-colors">Premium</span>
          </label>
          <label className="flex items-center gap-2.5 text-sm text-dark-light/80 font-secondary font-normal cursor-pointer group transition-all duration-200">
            <input type="checkbox" className="hidden peer" />
            <span className="w-4 h-4 border border-gray-mid/70 rounded-sm bg-white flex items-center justify-center peer-checked:border-gold peer-checked:bg-gold group-hover:border-gold transition-colors duration-200 flex-shrink-0">
              <Check className="w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200" strokeWidth={3} />
            </span>
            <span className="text-sm font-secondary font-normal group-hover:text-primary-dark transition-colors">Promoções</span>
          </label>
        </div>
      </div>
    </div>
  );
}