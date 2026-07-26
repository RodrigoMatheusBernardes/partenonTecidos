'use client';

import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';

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

  const totalFiltrosAtivos = (precoMin > 0 || precoMax < precoMaxGlobal ? 1 : 0) + categoriasSelecionadas.length;

  return (
    <aside className="w-full flex flex-col gap-6 p-4 md:p-6 bg-white rounded-card border border-gray-mid">
      
      {/* HEADER */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-mid">
        <h2 className="font-serif font-semibold text-xl text-dark-light tracking-tight">
          Filtros
          {totalFiltrosAtivos > 0 && (
            <span className="ml-2 text-sm font-medium text-text-light">
              ({totalFiltrosAtivos})
            </span>
          )}
        </h2>
        <div className="flex items-center gap-3">
          {totalFiltrosAtivos > 0 && (
            <button
              onClick={limparFiltros}
              className="text-xs font-medium text-text-light hover:text-dark-light transition-colors"
            >
              Limpar
            </button>
          )}
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="text-dark-light hover:text-gold transition-colors"
              aria-label="Fechar filtros"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>

      {/* PREÇO */}
      <div>
        <h3 className="text-xs font-medium uppercase tracking-wider text-text-light mb-4">
          Preço
        </h3>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="number"
            value={minInput}
            onChange={(e) => setMinInput(e.target.value)}
            placeholder="Mín"
            className="w-16 border border-gray-mid rounded bg-white px-2 py-1.5 text-xs text-center text-dark-light placeholder:text-text-light focus:outline-none focus:ring-1 focus:ring-gold transition"
          />
          <span className="text-text-light text-xs">—</span>
          <input
            type="number"
            value={maxInput}
            onChange={(e) => setMaxInput(e.target.value)}
            placeholder="Máx"
            className="w-16 border border-gray-mid rounded bg-white px-2 py-1.5 text-xs text-center text-dark-light placeholder:text-text-light focus:outline-none focus:ring-1 focus:ring-gold transition"
          />
          <button
            onClick={handlePrecoManual}
            className="bg-dark-light text-white text-xs font-medium px-4 py-1.5 rounded hover:bg-gray-700 transition-colors"
          >
            OK
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {faixasPreco.map((faixa) => (
            <label key={faixa.label} className="flex items-center gap-2.5 text-sm text-text-secondary cursor-pointer group">
              <input
                type="radio"
                name="faixa-preco"
                checked={precoMin === faixa.min && precoMax === faixa.max}
                onChange={() => onPrecoChange(faixa.min, faixa.max)}
                className="hidden peer"
              />
              <span className="relative w-4 h-4 border border-gray-mid rounded-full bg-white flex items-center justify-center peer-checked:border-gold group-hover:border-gold transition-colors duration-200 flex-shrink-0">
                <span className="w-2 h-2 rounded-full bg-gold opacity-0 peer-checked:opacity-100 transition-opacity duration-200"></span>
              </span>
              <span className="text-sm font-light group-hover:font-medium transition-all">{faixa.label}</span>
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
              <span className="w-2 h-2 rounded-full bg-gold opacity-0 peer-checked:opacity-100 transition-opacity duration-200"></span>
            </span>
            <span className="text-sm font-light group-hover:font-medium transition-all">Todos os preços</span>
          </label>
        </div>
      </div>

      <div className="border-b border-gray-mid my-1" />

      {/* CATEGORIAS */}
      {categorias.length > 0 && (
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wider text-text-light mb-4">
            Categorias
          </h3>
          <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto pr-2">
            {categorias.map((cat) => (
              <label key={cat._id} className="flex items-center gap-2.5 text-sm text-text-secondary cursor-pointer group">
                <input
                  type="checkbox"
                  checked={categoriasSelecionadas.includes(cat._id)}
                  onChange={() => onCategoriaChange(cat._id)}
                  className="hidden peer"
                />
                <span className="w-4 h-4 border border-gray-mid rounded-sm bg-white flex items-center justify-center peer-checked:border-gold peer-checked:bg-gold group-hover:border-gold transition-colors duration-200 flex-shrink-0">
                  <Check className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200" strokeWidth={3} />
                </span>
                <span className="text-sm font-light group-hover:font-medium transition-all">{cat.nome}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}