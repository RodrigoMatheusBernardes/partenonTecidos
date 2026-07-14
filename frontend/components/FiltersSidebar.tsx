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
    <div className="flex flex-col w-full gap-6">
      
      {/* 1. Título e Botão Limpar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#e8e3dc]">
        <h2 className="font-serif font-light text-2xl text-[#1a1a1a] tracking-tight">Filtros</h2>
        <div className="flex items-center gap-3">
          {(precoMin > 0 || precoMax < precoMaxGlobal || categoriasSelecionadas.length > 0) && (
            <button
              onClick={limparFiltros}
              className="text-xs text-[#8a7a6a] hover:text-[#1a1a1a] transition-colors underline-offset-2 hover:underline"
            >
              Limpar
            </button>
          )}
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="text-[#1a1a1a] hover:text-[#C5A880] transition-colors ml-2"
              aria-label="Fechar filtros"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* 2. Categorias */}
      {categorias.length > 0 && (
        <div className="pt-2 pb-4 border-b border-[#e8e3dc]">
          <h3 className="text-[10px] font-medium uppercase tracking-widest text-[#8a7a6a] mb-4">Categorias</h3>
          <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto pr-2">
            {categorias.map((cat) => (
              <label 
                key={cat._id} 
                className="flex items-center gap-3 text-sm text-[#4a4a4a] cursor-pointer group transition-colors hover:text-[#1a1a1a]"
              >
                <input
                  type="checkbox"
                  checked={categoriasSelecionadas.includes(cat._id)}
                  onChange={() => onCategoriaChange(cat._id)}
                  className="w-4 h-4 rounded border-gray-300 accent-[#C5A880] focus:ring-[#C5A880] focus:ring-offset-1"
                />
                <span className="text-sm font-light group-hover:font-normal transition-all">{cat.nome}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* 3. Preço */}
      <div className="pt-2 pb-4 border-b border-[#e8e3dc]">
        <h3 className="text-[10px] font-medium uppercase tracking-widest text-[#8a7a6a] mb-4">Preço</h3>
        
        {/* Inputs de faixa manual */}
        <div className="flex items-center justify-between gap-2 mb-5">
          <input
            type="number"
            value={minInput}
            onChange={(e) => setMinInput(e.target.value)}
            placeholder="Mín"
            className="w-14 border border-[#e8e3dc] rounded bg-transparent px-2 py-1.5 text-xs text-center text-[#4a4a4a] placeholder:text-[#d4cec4] focus:outline-none focus:border-[#C5A880] transition-colors"
          />
          <span className="text-[#d4cec4] text-xs">—</span>
          <input
            type="number"
            value={maxInput}
            onChange={(e) => setMaxInput(e.target.value)}
            placeholder="Máx"
            className="w-14 border border-[#e8e3dc] rounded bg-transparent px-2 py-1.5 text-xs text-center text-[#4a4a4a] placeholder:text-[#d4cec4] focus:outline-none focus:border-[#C5A880] transition-colors"
          />
          <button
            onClick={handlePrecoManual}
            className="bg-[#1a1a1a] text-white text-[10px] font-medium px-4 py-1.5 rounded hover:bg-[#2d2d2d] transition-colors"
          >
            OK
          </button>
        </div>

        {/* Faixas pré-definidas */}
        <div className="flex flex-col gap-2">
          {faixasPreco.map((faixa) => (
            <label 
              key={faixa.label} 
              className="flex items-center gap-3 text-sm text-[#4a4a4a] cursor-pointer group transition-colors hover:text-[#1a1a1a]"
            >
              <input
                type="radio"
                name="faixa-preco"
                checked={precoMin === faixa.min && precoMax === faixa.max}
                onChange={() => onPrecoChange(faixa.min, faixa.max)}
                className="w-4 h-4 accent-[#C5A880] focus:ring-[#C5A880]"
              />
              <span className="text-sm font-light group-hover:font-normal transition-all">{faixa.label}</span>
            </label>
          ))}
          <label className="flex items-center gap-3 text-sm text-[#4a4a4a] cursor-pointer group transition-colors hover:text-[#1a1a1a]">
            <input
              type="radio"
              name="faixa-preco"
              checked={precoMin === 0 && precoMax === precoMaxGlobal}
              onChange={() => onPrecoChange(0, precoMaxGlobal)}
              className="w-4 h-4 accent-[#C5A880] focus:ring-[#C5A880]"
            />
            <span className="text-sm font-light group-hover:font-normal transition-all">Todos os preços</span>
          </label>
        </div>
      </div>

      {/* 4. Coleções (Estático para atender ao exemplo visual) */}
      <div className="pt-2">
        <h3 className="text-[10px] font-medium uppercase tracking-widest text-[#8a7a6a] mb-4">Coleções</h3>
        <div className="flex flex-col gap-2.5">
          <label className="flex items-center gap-3 text-sm text-[#4a4a4a] cursor-pointer group transition-colors hover:text-[#1a1a1a]">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-[#C5A880] focus:ring-[#C5A880]" />
            <span className="text-sm font-light group-hover:font-normal transition-all">Premium</span>
          </label>
          <label className="flex items-center gap-3 text-sm text-[#4a4a4a] cursor-pointer group transition-colors hover:text-[#1a1a1a]">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-[#C5A880] focus:ring-[#C5A880]" />
            <span className="text-sm font-light group-hover:font-normal transition-all">Promoções</span>
          </label>
        </div>
      </div>

    </div>
  );
}