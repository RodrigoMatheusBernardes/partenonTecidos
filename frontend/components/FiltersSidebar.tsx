'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from 'lucide-react';

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

  return (
    <div className={`bg-white ${isMobile ? 'h-full overflow-y-auto p-6' : 'p-0'}`}>
      {/* Cabeçalho do Filtro (Título + Botão Fechar no Mobile) */}
      <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
        <h3 className="text-lg font-serif font-light tracking-wider text-[#1a1a1a]">Filtrar por</h3>
        {isMobile && (
          <button onClick={onClose} className="p-1 hover:opacity-60 transition">
            <X className="w-5 h-5 text-[#1a1a1a]" strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* Seção Preço */}
      <div className="mb-6 border-b border-gray-100 pb-6">
        <button
          onClick={() => setPrecoSectionOpen(!precoSectionOpen)}
          className="flex items-center justify-between w-full text-sm font-medium uppercase tracking-wider text-[#1a1a1a] mb-3"
        >
          <span>Preço</span>
          {precoSectionOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {precoSectionOpen && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={precoMaxGlobal}
                value={precoMin}
                onChange={(e) => onPrecoChange(Number(e.target.value), precoMax)}
                className="w-1/2 border border-gray-200 rounded-md px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] transition"
                placeholder="Mín"
              />
              <span className="text-gray-400">—</span>
              <input
                type="number"
                min={precoMin}
                max={precoMaxGlobal}
                value={precoMax}
                onChange={(e) => onPrecoChange(precoMin, Number(e.target.value))}
                className="w-1/2 border border-gray-200 rounded-md px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] transition"
                placeholder="Máx"
              />
            </div>
          </div>
        )}
      </div>

      {/* Seção Categorias */}
      <div className="mb-6 border-b border-gray-100 pb-6">
        <button
          onClick={() => setCategoriasSectionOpen(!categoriasSectionOpen)}
          className="flex items-center justify-between w-full text-sm font-medium uppercase tracking-wider text-[#1a1a1a] mb-3"
        >
          <span>Categorias</span>
          {categoriasSectionOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {categoriasSectionOpen && (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
            {categorias.map((cat) => (
              <label key={cat._id} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={categoriasSelecionadas.includes(cat._id)}
                  onChange={() => onCategoriaChange(cat._id)}
                  className="peer h-4 w-4 appearance-none rounded-sm border border-gray-300 checked:bg-[#1a1a1a] checked:border-[#1a1a1a] transition-all cursor-pointer"
                />
                <span className="text-sm font-light text-[#333] group-hover:text-[#1a1a1a] transition">
                  {cat.nome}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Botão Limpar Filtros */}
      <button
        onClick={limparFiltros}
        className="w-full py-3 text-sm font-light text-[#1a1a1a] border border-gray-200 rounded-md hover:bg-gray-50 transition"
      >
        Limpar Filtros
      </button>
    </div>
  );
}