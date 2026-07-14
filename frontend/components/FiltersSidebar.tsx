'use client';

import { useState, useEffect } from 'react';

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
  // Novas props para uso mobile
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

  const handleFaixaChange = (min: number, max: number) => {
    onPrecoChange(min, max);
  };

  return (
    <aside className="w-full space-y-8">
      {/* Cabeçalho com botão de fechar (apenas mobile) */}
      <div className="flex items-center justify-between">
        <h2 className="font-serif font-light text-lg text-[#1a1a1a] tracking-wide">
          Filtros
        </h2>
        <div className="flex items-center gap-2">
          {(precoMin > 0 || precoMax < precoMaxGlobal || categoriasSelecionadas.length > 0) && (
            <button
              onClick={limparFiltros}
              className="text-sm text-[#8a7a6a] hover:text-[#1a1a1a] transition-colors font-light"
            >
              Limpar
            </button>
          )}
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="text-[#1a1a1a] hover:text-[#8a7a6a] transition-colors ml-2"
              aria-label="Fechar filtros"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Preço */}
      <div>
        <h3 className="font-serif font-light text-sm text-[#1a1a1a] tracking-wide mb-3">Preço</h3>
        <div className="flex gap-2 mb-4">
          <input
            type="number"
            value={minInput}
            onChange={(e) => setMinInput(e.target.value)}
            placeholder="Min"
            className="w-20 border border-[#e8e3dc] rounded-lg px-2 py-1.5 text-sm bg-white text-[#1a1a1a] font-light focus:outline-none focus:ring-1 focus:ring-[#C5A880]"
          />
          <span className="self-center text-[#8a7a6a]">-</span>
          <input
            type="number"
            value={maxInput}
            onChange={(e) => setMaxInput(e.target.value)}
            placeholder="Max"
            className="w-20 border border-[#e8e3dc] rounded-lg px-2 py-1.5 text-sm bg-white text-[#1a1a1a] font-light focus:outline-none focus:ring-1 focus:ring-[#C5A880]"
          />
          <button
            onClick={handlePrecoManual}
            className="bg-[#1a1a1a] text-white text-xs px-3 py-1.5 rounded-lg hover:bg-[#2d2d2d] transition-colors font-light"
          >
            OK
          </button>
        </div>

        <div className="space-y-2">
          {faixasPreco.map((faixa) => (
            <label
              key={faixa.label}
              className={`
                flex items-center gap-3 text-sm cursor-pointer p-1 rounded
                hover:bg-[#f5f2ee] transition-colors
                ${precoMin === faixa.min && precoMax === faixa.max ? 'font-medium text-[#1a1a1a]' : 'text-[#8a7a6a] font-light'}
              `}
            >
              <input
                type="radio"
                name="faixa-preco"
                checked={precoMin === faixa.min && precoMax === faixa.max}
                onChange={() => handleFaixaChange(faixa.min, faixa.max)}
                className="w-4 h-4 accent-[#C5A880] focus:ring-[#C5A880]"
              />
              {faixa.label}
            </label>
          ))}
          <label
            className={`
              flex items-center gap-3 text-sm cursor-pointer p-1 rounded
              hover:bg-[#f5f2ee] transition-colors
              ${precoMin === 0 && precoMax === precoMaxGlobal ? 'font-medium text-[#1a1a1a]' : 'text-[#8a7a6a] font-light'}
            `}
          >
            <input
              type="radio"
              name="faixa-preco"
              checked={precoMin === 0 && precoMax === precoMaxGlobal}
              onChange={() => handleFaixaChange(0, precoMaxGlobal)}
              className="w-4 h-4 accent-[#C5A880] focus:ring-[#C5A880]"
            />
            Todos os preços
          </label>
        </div>
      </div>

      {/* Categorias */}
      {categorias.length > 0 && (
        <div>
          <h3 className="font-serif font-light text-sm text-[#1a1a1a] tracking-wide mb-3">Categorias</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {categorias.map((cat) => (
              <label
                key={cat._id}
                className="flex items-center gap-3 text-sm cursor-pointer p-1 rounded hover:bg-[#f5f2ee] transition-colors"
              >
                <input
                  type="checkbox"
                  checked={categoriasSelecionadas.includes(cat._id)}
                  onChange={() => onCategoriaChange(cat._id)}
                  className="w-4 h-4 accent-[#C5A880] focus:ring-[#C5A880] rounded border-[#e8e3dc]"
                />
                <span className="text-[#8a7a6a] font-light">{cat.nome}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}