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

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Cabeçalho com título e botão limpar */}
      <div className="flex items-center justify-between border-b border-[#e8e3dc] pb-3">
        <h2 className="font-serif font-light text-xl text-[#1a1a1a]">Filtros</h2>
        <div className="flex items-center gap-3">
          {(precoMin > 0 || precoMax < precoMaxGlobal || categoriasSelecionadas.length > 0) && (
            <button
              onClick={limparFiltros}
              className="text-sm text-[#8a7a6a] hover:text-[#1a1a1a] transition-colors"
            >
              Limpar
            </button>
          )}
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="text-[#1a1a1a] hover:text-[#C5A880] transition-colors"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>

      {/* Seção Preço */}
      <div>
        <h3 className="text-xs font-medium uppercase tracking-widest text-[#8a7a6a] mb-3">
          Preço
        </h3>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="number"
            value={minInput}
            onChange={(e) => setMinInput(e.target.value)}
            placeholder="Mín"
            className="w-16 border border-[#d4cec4] rounded bg-transparent px-2 py-1 text-sm focus:outline-none focus:border-[#C5A880] transition-colors"
          />
          <span className="text-[#8a7a6a]">—</span>
          <input
            type="number"
            value={maxInput}
            onChange={(e) => setMaxInput(e.target.value)}
            placeholder="Máx"
            className="w-16 border border-[#d4cec4] rounded bg-transparent px-2 py-1 text-sm focus:outline-none focus:border-[#C5A880] transition-colors"
          />
          <button
            onClick={handlePrecoManual}
            className="bg-[#1a1a1a] text-white text-xs px-3 py-1 rounded hover:bg-[#2d2d2d] transition-colors"
          >
            OK
          </button>
        </div>

        <div className="space-y-2">
          {faixasPreco.map((faixa) => (
            <label
              key={faixa.label}
              className="flex items-center gap-2 text-sm cursor-pointer group"
            >
              <input
                type="radio"
                name="faixa-preco"
                checked={precoMin === faixa.min && precoMax === faixa.max}
                onChange={() => onPrecoChange(faixa.min, faixa.max)}
                className="w-4 h-4 accent-[#C5A880] focus:ring-[#C5A880]"
              />
              <span className="text-[#4a4a4a] group-hover:text-[#1a1a1a] transition-colors">
                {faixa.label}
              </span>
            </label>
          ))}
          <label className="flex items-center gap-2 text-sm cursor-pointer group">
            <input
              type="radio"
              name="faixa-preco"
              checked={precoMin === 0 && precoMax === precoMaxGlobal}
              onChange={() => onPrecoChange(0, precoMaxGlobal)}
              className="w-4 h-4 accent-[#C5A880] focus:ring-[#C5A880]"
            />
            <span className="text-[#4a4a4a] group-hover:text-[#1a1a1a] transition-colors">
              Todos os preços
            </span>
          </label>
        </div>
      </div>

      {/* Divisória sutil */}
      <div className="border-b border-[#e8e3dc] my-1"></div>

      {/* Seção Categorias */}
      {categorias.length > 0 && (
        <div>
          <h3 className="text-xs font-medium uppercase tracking-widest text-[#8a7a6a] mb-3">
            Categorias
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {categorias.map((cat) => (
              <label
                key={cat._id}
                className="flex items-center gap-2 text-sm cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={categoriasSelecionadas.includes(cat._id)}
                  onChange={() => onCategoriaChange(cat._id)}
                  className="w-4 h-4 accent-[#C5A880] focus:ring-[#C5A880] rounded"
                />
                <span className="text-[#4a4a4a] group-hover:text-[#1a1a1a] transition-colors">
                  {cat.nome}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}