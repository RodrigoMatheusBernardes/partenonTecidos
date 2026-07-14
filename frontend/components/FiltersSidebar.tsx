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

  // Custom checkbox component to ensure consistency
  const CustomCheckbox = ({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) => (
    <label className="flex items-center gap-3 cursor-pointer group">
      <input type="checkbox" checked={checked} onChange={onChange} className="hidden peer" />
      <span
        className="
          w-5 h-5 border border-[#d4cec4] rounded-sm bg-white flex items-center justify-center
          transition-all duration-200
          peer-checked:border-[#C5A880] peer-checked:bg-[#C5A880]
          group-hover:border-[#C5A880]
        "
      >
        <Check className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200" strokeWidth={4} />
      </span>
      <span className="text-sm font-light text-[#4a4a4a] group-hover:text-[#1a1a1a] transition-colors">{label}</span>
    </label>
  );

  // Custom radio component for price brackets
  const CustomRadio = ({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) => (
    <label className="flex items-center gap-3 cursor-pointer group">
      <input type="radio" checked={checked} onChange={onChange} className="hidden peer" />
      <span
        className="
          w-5 h-5 border border-[#d4cec4] rounded-full bg-white flex items-center justify-center
          transition-all duration-200
          peer-checked:border-[#C5A880]
          group-hover:border-[#C5A880]
        "
      >
        <div className="w-2.5 h-2.5 rounded-full bg-[#C5A880] opacity-0 peer-checked:opacity-100 transition-opacity duration-200" />
      </span>
      <span className="text-sm font-light text-[#4a4a4a] group-hover:text-[#1a1a1a] transition-colors">{label}</span>
    </label>
  );

  return (
    // Applying !important overrides to neutralize the parent wrapper div in app/page.tsx
    <div className="!bg-transparent !border-none !shadow-none !p-0 w-full flex flex-col gap-10">
      
      {/* Header Section */}
      <div className="flex items-center justify-between pb-2 border-b border-[#e8e3dc]">
        <h2 className="font-serif font-light text-2xl text-[#1a1a1a] tracking-tight">Filtros</h2>
        <div className="flex items-center gap-3">
          {(precoMin > 0 || precoMax < precoMaxGlobal || categoriasSelecionadas.length > 0) && (
            <button
              onClick={limparFiltros}
              className="text-xs text-[#8a7a6a] hover:text-[#1a1a1a] transition-colors font-light underline-offset-2 hover:underline"
            >
              Limpar
            </button>
          )}
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="text-[#1a1a1a] hover:text-[#C5A880] transition-colors"
              aria-label="Fechar filtros"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>

      {/* Preço Section */}
      <div className="flex flex-col gap-6">
        <h3 className="font-serif font-light text-xs tracking-widest uppercase text-[#8a7a6a]">Preço</h3>
        
        {/* Clean Inputs with underline accent */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <input
              type="number"
              value={minInput}
              onChange={(e) => setMinInput(e.target.value)}
              placeholder="Mín"
              className="w-full border-b border-[#d4cec4] bg-transparent py-2 text-sm text-[#1a1a1a] placeholder:text-[#8a7a6a] focus:outline-none focus:border-[#C5A880] transition-colors text-center"
            />
          </div>
          <span className="text-[#8a7a6a] font-light text-sm">—</span>
          <div className="flex-1">
            <input
              type="number"
              value={maxInput}
              onChange={(e) => setMaxInput(e.target.value)}
              placeholder="Máx"
              className="w-full border-b border-[#d4cec4] bg-transparent py-2 text-sm text-[#1a1a1a] placeholder:text-[#8a7a6a] focus:outline-none focus:border-[#C5A880] transition-colors text-center"
            />
          </div>
          <button
            onClick={handlePrecoManual}
            className="text-xs text-[#C5A880] hover:text-[#0B0C10] transition-colors font-medium tracking-wide ml-1 hover:underline"
          >
            OK
          </button>
        </div>

        {/* Price Brackets with Custom Radio */}
        <div className="flex flex-col gap-2.5 pt-1">
          {faixasPreco.map((faixa) => (
            <CustomRadio
              key={faixa.label}
              checked={precoMin === faixa.min && precoMax === faixa.max}
              onChange={() => onPrecoChange(faixa.min, faixa.max)}
              label={faixa.label}
            />
          ))}
          <CustomRadio
            checked={precoMin === 0 && precoMax === precoMaxGlobal}
            onChange={() => onPrecoChange(0, precoMaxGlobal)}
            label="Todos os preços"
          />
        </div>
      </div>

      {/* Categorias Section */}
      {categorias.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="font-serif font-light text-xs tracking-widest uppercase text-[#8a7a6a]">Categorias</h3>
          <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto pr-2">
            {categorias.map((cat) => (
              <CustomCheckbox
                key={cat._id}
                checked={categoriasSelecionadas.includes(cat._id)}
                onChange={() => onCategoriaChange(cat._id)}
                label={cat.nome}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}