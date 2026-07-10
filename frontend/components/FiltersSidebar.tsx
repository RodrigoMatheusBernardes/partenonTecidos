'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

interface FiltersSidebarProps {
  precoMin: number;
  precoMax: number;
  precoMaxGlobal: number;
  categorias: { _id: string; nome: string }[];
  categoriasSelecionadas: string[];
  onPrecoChange: (min: number, max: number) => void;
  onCategoriaChange: (catId: string) => void;
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
  const [precoSectionOpen, setPrecoSectionOpen] = useState(true);
  const [categoriasSectionOpen, setCategoriasSectionOpen] = useState(true);

  const activeCount = categoriasSelecionadas.length +
    (precoMin > 0 || precoMax < precoMaxGlobal ? 1 : 0);

  return (
    <div className={`bg-white ${isMobile ? 'h-full overflow-y-auto p-6' : 'p-0'}`}>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-mid">
        <div className="flex items-center gap-2">
          <h3 className="font-serif font-semibold text-dark-light tracking-wide">Filtros</h3>
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-dark-light text-white text-xs font-bold">
              {activeCount}
            </span>
          )}
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            className="p-2 hover:text-gold transition-colors duration-300 rounded-button focus:outline-none focus:ring-2 focus:ring-gold"
            aria-label="Fechar filtros"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        )}
      </div>

      {/* SEÇÃO PREÇO */}
      <div className="mb-6 pb-6 border-b border-gray-mid">
        <button
          onClick={() => setPrecoSectionOpen(!precoSectionOpen)}
          className="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-widest text-dark-light mb-4 hover:text-gold transition-colors"
          aria-expanded={precoSectionOpen}
        >
          <span>Preço</span>
          {precoSectionOpen
            ? <ChevronUp className="w-4 h-4" strokeWidth={2} />
            : <ChevronDown className="w-4 h-4" strokeWidth={2} />
          }
        </button>

        {precoSectionOpen && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={precoMaxGlobal}
                value={precoMin}
                onChange={(e) => onPrecoChange(Number(e.target.value), precoMax)}
                className="w-1/2 bg-light border border-gray-mid rounded-button px-3 py-2 text-sm font-medium text-dark-light focus:outline-none focus:ring-2 focus:ring-gold transition"
                placeholder="Min"
                aria-label="Preço mínimo"
              />
              <span className="text-text-light font-light">—</span>
              <input
                type="number"
                min={precoMin}
                max={precoMaxGlobal}
                value={precoMax}
                onChange={(e) => onPrecoChange(precoMin, Number(e.target.value))}
                className="w-1/2 bg-light border border-gray-mid rounded-button px-3 py-2 text-sm font-medium text-dark-light focus:outline-none focus:ring-2 focus:ring-gold transition"
                placeholder="Max"
                aria-label="Preço máximo"
              />
            </div>
            <p className="text-xs text-text-light">
              R$ {precoMin.toFixed(0)} – R$ {precoMax.toFixed(0)}
            </p>
          </div>
        )}
      </div>

      {/* SEÇÃO CATEGORIAS */}
      {categorias.length > 0 && (
        <div className="mb-6 pb-6 border-b border-gray-mid">
          <button
            onClick={() => setCategoriasSectionOpen(!categoriasSectionOpen)}
            className="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-widest text-dark-light mb-4 hover:text-gold transition-colors"
            aria-expanded={categoriasSectionOpen}
          >
            <span>Categorias</span>
            {categoriasSectionOpen
              ? <ChevronUp className="w-4 h-4" strokeWidth={2} />
              : <ChevronDown className="w-4 h-4" strokeWidth={2} />
            }
          </button>

          {categoriasSectionOpen && (
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {categorias.map((cat) => (
                <label key={cat._id} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={categoriasSelecionadas.includes(cat._id)}
                    onChange={() => onCategoriaChange(cat._id)}
                    className="
                      h-4 w-4 appearance-none rounded-sm
                      border-2 border-gray-mid cursor-pointer
                      checked:bg-dark-light checked:border-dark-light
                      hover:border-dark-light
                      transition-all duration-300
                      focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gold
                    "
                    aria-label={cat.nome}
                  />
                  <span className="
                    text-sm font-medium text-text-secondary
                    group-hover:text-dark-light
                    transition-colors duration-300
                  ">
                    {cat.nome}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* LIMPAR FILTROS */}
      <button
        onClick={limparFiltros}
        disabled={activeCount === 0}
        className="
          w-full py-2.5 text-sm font-medium
          text-dark-light border border-dark-light rounded-button
          hover:bg-dark-light hover:text-white
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-all duration-300
          focus:outline-none focus:ring-2 focus:ring-gold
        "
      >
        Limpar {activeCount > 0 ? `(${activeCount})` : 'Filtros'}
      </button>
    </div>
  );
}