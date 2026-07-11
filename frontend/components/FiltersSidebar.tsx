'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface FiltersSidebarProps {
  precoMin: number;
  precoMax: number;
  precoMaxGlobal: number;
  categorias: { _id: string; nome: string; count?: number }[];
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
  const [tempMinValue, setTempMinValue] = useState(precoMin);
  const [tempMaxValue, setTempMaxValue] = useState(precoMax);

  const activeCount = categoriasSelecionadas.length +
    (precoMin > 0 || precoMax < precoMaxGlobal ? 1 : 0);

  const handlePriceApply = () => {
    onPrecoChange(tempMinValue, tempMaxValue);
  };

  const selectedCategoriesNames = categorias
    .filter(cat => categoriasSelecionadas.includes(cat._id))
    .map(cat => cat.nome);

  return (
    <div className={`bg-white ${isMobile ? 'h-full overflow-y-auto p-6' : 'p-0'}`}>

      {/* HEADER com Badge de Filtros Ativos */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-mid">
        <div className="flex items-center gap-2">
          <h3 className="font-serif font-semibold text-dark-light tracking-wide text-sm md:text-base">Filtros</h3>
          {activeCount > 0 && (
            <Badge variant="gold" size="sm">
              {activeCount}
            </Badge>
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

      {/* FILTROS APLICADOS - Pills com X para remover */}
      {activeCount > 0 && (
        <div className="mb-6 pb-6 border-b border-gray-mid">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary mb-3">Filtros Aplicados</p>
          <div className="flex flex-wrap gap-2">
            {/* Preço */}
            {(precoMin > 0 || precoMax < precoMaxGlobal) && (
              <button
                onClick={() => onPrecoChange(0, precoMaxGlobal)}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold/20 border border-gold/30 rounded-full text-xs font-medium text-dark-light hover:bg-gold/30 transition-colors duration-300 group"
              >
                <span>R$ {precoMin.toFixed(0)} - R$ {precoMax.toFixed(0)}</span>
                <X className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={3} />
              </button>
            )}

            {/* Categorias */}
            {selectedCategoriesNames.map((catName, idx) => (
              <button
                key={`${catName}-${idx}`}
                onClick={() => {
                  const catId = categorias.find(c => c.nome === catName)?._id;
                  if (catId) onCategoriaChange(catId);
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-dark-light/10 border border-dark-light/20 rounded-full text-xs font-medium text-dark-light hover:bg-dark-light/20 transition-colors duration-300 group"
              >
                <span>{catName}</span>
                <X className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={3} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SEÇÃO PREÇO com Range Slider */}
      <div className="mb-6 pb-6 border-b border-gray-mid">
        <button
          onClick={() => setPrecoSectionOpen(!precoSectionOpen)}
          className="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-widest text-dark-light mb-4 hover:text-gold transition-colors"
          aria-expanded={precoSectionOpen}
        >
          <span>💰 Preço</span>
          {precoSectionOpen
            ? <ChevronUp className="w-4 h-4" strokeWidth={2} />
            : <ChevronDown className="w-4 h-4" strokeWidth={2} />
          }
        </button>

        {precoSectionOpen && (
          <div className="space-y-4">
            {/* Range Slider Visual */}
            <div className="bg-light p-4 rounded-button border border-gray-mid">
              <div className="flex gap-2 mb-3">
                <div className="flex-1">
                  <label className="text-xs text-text-secondary font-semibold mb-1 block">Mínimo</label>
                  <input
                    type="range"
                    min={0}
                    max={precoMaxGlobal}
                    value={tempMinValue}
                    onChange={(e) => setTempMinValue(Math.min(Number(e.target.value), tempMaxValue))}
                    className="w-full h-2 bg-gray-mid rounded-full cursor-pointer accent-gold"
                  />
                  <input
                    type="number"
                    min={0}
                    max={precoMaxGlobal}
                    value={tempMinValue}
                    onChange={(e) => setTempMinValue(Number(e.target.value))}
                    className="w-full mt-2 bg-white border border-gray-mid rounded-button px-2 py-1 text-sm text-dark-light focus:outline-none focus:ring-2 focus:ring-gold transition"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-text-secondary font-semibold mb-1 block">Máximo</label>
                  <input
                    type="range"
                    min={0}
                    max={precoMaxGlobal}
                    value={tempMaxValue}
                    onChange={(e) => setTempMaxValue(Math.max(Number(e.target.value), tempMinValue))}
                    className="w-full h-2 bg-gray-mid rounded-full cursor-pointer accent-gold"
                  />
                  <input
                    type="number"
                    min={0}
                    max={precoMaxGlobal}
                    value={tempMaxValue}
                    onChange={(e) => setTempMaxValue(Number(e.target.value))}
                    className="w-full mt-2 bg-white border border-gray-mid rounded-button px-2 py-1 text-sm text-dark-light focus:outline-none focus:ring-2 focus:ring-gold transition"
                  />
                </div>
              </div>

              {/* Botão Aplicar */}
              <button
                onClick={handlePriceApply}
                className="w-full py-2 text-xs font-bold uppercase tracking-wider bg-dark-light text-white rounded-button hover:bg-dark-light/90 transition-colors duration-300"
              >
                Aplicar
              </button>
            </div>

            {/* Display do range ativo */}
            <div className="flex items-center justify-between p-3 bg-gold/10 rounded-button border border-gold/20">
              <span className="text-sm font-semibold text-dark-light">
                R$ {precoMin.toFixed(0)} – R$ {precoMax.toFixed(0)}
              </span>
              <span className="text-xs text-text-secondary font-light">Filtro ativo</span>
            </div>
          </div>
        )}
      </div>

      {/* SEÇÃO CATEGORIAS com Quantidade */}
      {categorias.length > 0 && (
        <div className="mb-6 pb-6 border-b border-gray-mid">
          <button
            onClick={() => setCategoriasSectionOpen(!categoriasSectionOpen)}
            className="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-widest text-dark-light mb-4 hover:text-gold transition-colors"
            aria-expanded={categoriasSectionOpen}
          >
            <span>📂 Categorias</span>
            {categoriasSectionOpen
              ? <ChevronUp className="w-4 h-4" strokeWidth={2} />
              : <ChevronDown className="w-4 h-4" strokeWidth={2} />
            }
          </button>

          {categoriasSectionOpen && (
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {categorias.map((cat) => (
                <label key={cat._id} className="flex items-center justify-between gap-3 cursor-pointer group hover:bg-light p-2 rounded-button transition-colors">
                  <div className="flex items-center gap-3">
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
                  </div>
                  {cat.count !== undefined && (
                    <Badge variant="neutral" size="sm" className="ml-auto">
                      {cat.count}
                    </Badge>
                  )}
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* BOTÃO LIMPAR TUDO - Sempre visível quando houver filtros */}
      <button
        onClick={limparFiltros}
        disabled={activeCount === 0}
        className="
          w-full py-2.5 text-sm font-bold uppercase tracking-wider
          border-2 border-dark-light text-dark-light rounded-button
          hover:bg-dark-light hover:text-white
          disabled:opacity-30 disabled:cursor-not-allowed disabled:border-gray-mid
          transition-all duration-300
          focus:outline-none focus:ring-2 focus:ring-gold
        "
      >
        🗑️ Limpar Tudo {activeCount > 0 && `(${activeCount})`}
      </button>
    </div>
  );
}