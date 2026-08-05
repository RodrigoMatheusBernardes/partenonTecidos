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
    <aside className="w-full flex flex-col gap-8">
      
      {/* HEADER */}
      <div className="flex items-center justify-between pb-4 border-b border-[#e8e3dc]">
        <h2 className="font-serif font-light text-xl text-[#1a1a1a] tracking-wide">Filtros</h2>
        <div className="flex items-center gap-3">
          {(precoMin > 0 || precoMax < precoMaxGlobal || categoriasSelecionadas.length > 0) && (
            <button
              onClick={limparFiltros}
              className="text-xs text-[#8a7a6a] hover:text-[#1a1a1a] transition-colors"
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

      {/* PREÇO SECTION */}
      <div>
        <h3 className="text-[10px] font-medium uppercase tracking-widest text-[#8a7a6a] mb-4">Preço</h3>
        <div className="flex items-center gap-2 mb-4">
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

        {/* CUSTOM RADIOS */}
        <div className="flex flex-col gap-2.5">
          {faixasPreco.map((faixa) => (
            <label key={faixa.label} className="flex items-center gap-2.5 text-sm text-[#4a4a4a] cursor-pointer group">
              <input
                type="radio"
                name="faixa-preco"
                checked={precoMin === faixa.min && precoMax === faixa.max}
                onChange={() => onPrecoChange(faixa.min, faixa.max)}
                className="hidden peer"
              />
              <span className="relative w-4 h-4 border border-[#d4cec4] rounded-full bg-white flex items-center justify-center peer-checked:border-[#C5A880] group-hover:border-[#C5A880] transition-colors duration-200 flex-shrink-0">
                <span className="w-2 h-2 rounded-full bg-[#C5A880] opacity-0 peer-checked:opacity-100 transition-opacity duration-200"></span>
              </span>
              <span className="text-sm font-light group-hover:font-normal transition-all">{faixa.label}</span>
            </label>
          ))}
          <label className="flex items-center gap-2.5 text-sm text-[#4a4a4a] cursor-pointer group">
            <input
              type="radio"
              name="faixa-preco"
              checked={precoMin === 0 && precoMax === precoMaxGlobal}
              onChange={() => onPrecoChange(0, precoMaxGlobal)}
              className="hidden peer"
            />
            <span className="relative w-4 h-4 border border-[#d4cec4] rounded-full bg-white flex items-center justify-center peer-checked:border-[#C5A880] group-hover:border-[#C5A880] transition-colors duration-200 flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#C5A880] opacity-0 peer-checked:opacity-100 transition-opacity duration-200"></span>
            </span>
            <span className="text-sm font-light group-hover:font-normal transition-all">Todos os preços</span>
          </label>
        </div>
      </div>

      {/* DIVISÓRIA */}
      <div className="border-b border-[#e8e3dc] my-1" />

      {/* CATEGORIAS SECTION */}
      {categorias.length > 0 && (
        <div>
          <h3 className="text-[10px] font-medium uppercase tracking-widest text-[#8a7a6a] mb-4">Categorias</h3>
          <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto pr-2">
            {categorias.map((cat) => (
              <label key={cat._id} className="flex items-center gap-2.5 text-sm text-[#4a4a4a] cursor-pointer group">
                <input
                  type="checkbox"
                  checked={categoriasSelecionadas.includes(cat._id)}
                  onChange={() => onCategoriaChange(cat._id)}
                  className="hidden peer"
                />
                <span className="w-4 h-4 border border-[#d4cec4] rounded-sm bg-white flex items-center justify-center peer-checked:border-[#C5A880] peer-checked:bg-[#C5A880] group-hover:border-[#C5A880] transition-colors duration-200 flex-shrink-0">
                  <Check className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200" strokeWidth={3} />
                </span>
                <span className="text-sm font-light group-hover:font-normal transition-all">{cat.nome}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
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
    <aside className="w-full flex flex-col gap-8">
      
      {/* HEADER */}
      <div className="flex items-center justify-between pb-4 border-b border-[#e8e3dc]">
        <h2 className="font-serif font-light text-xl text-[#1a1a1a] tracking-wide">Filtros</h2>
        <div className="flex items-center gap-3">
          {(precoMin > 0 || precoMax < precoMaxGlobal || categoriasSelecionadas.length > 0) && (
            <button
              onClick={limparFiltros}
              className="text-xs text-[#8a7a6a] hover:text-[#1a1a1a] transition-colors"
            >
              Limpar
            </button>
          )}
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="text-[#1a1a1a] hover:text-[#C5A880] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* PREÇO SECTION */}
      <div>
        <h3 className="text-[10px] font-medium uppercase tracking-widest text-[#8a7a6a] mb-4">Preço</h3>
        <div className="flex items-center gap-2 mb-4">
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

        <div className="flex flex-col gap-2">
          {faixasPreco.map((faixa) => (
            <label
              key={faixa.label}
              className="flex items-center gap-2 text-sm text-[#4a4a4a] cursor-pointer group transition-colors hover:text-[#1a1a1a]"
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
          <label className="flex items-center gap-2 text-sm text-[#4a4a4a] cursor-pointer group transition-colors hover:text-[#1a1a1a]">
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

      <div className="border-b border-[#e8e3dc] my-1" />

      {/* CATEGORIAS SECTION */}
      {categorias.length > 0 && (
        <div>
          <h3 className="text-[10px] font-medium uppercase tracking-widest text-[#8a7a6a] mb-4">
            Categorias
          </h3>
          <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-2">
            {categorias.map((cat) => (
              <label
                key={cat._id}
                className="flex items-center gap-2 text-sm text-[#4a4a4a] cursor-pointer group transition-colors hover:text-[#1a1a1a]"
              >
                <input
                  type="checkbox"
                  checked={categoriasSelecionadas.includes(cat._id)}
                  onChange={() => onCategoriaChange(cat._id)}
                  className="w-4 h-4 accent-[#C5A880] focus:ring-[#C5A880] rounded"
                />
                <span className="text-sm font-light group-hover:font-normal transition-all">{cat.nome}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================
         NOVO BLOCO INSTITUCIONAL – ABAIXO DOS FILTROS (Desktop)
         ============================================================ */}
      <div className="mt-auto pt-6 border-t border-[#e8e3dc]">
        {/* Selo de Confiança */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#0B1F33] text-white flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-[#1a1a1a]">Compra Segura</p>
            <p className="text-xs text-[#8a7a6a]">Ambiente protegido e criptografado</p>
          </div>
        </div>

        {/* Links de Atendimento */}
        <div className="flex flex-col gap-2 text-sm text-[#8a7a6a]">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#C5A880]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <a href="tel:5511999999999" className="hover:text-[#1a1a1a] transition-colors">(11) 99999-9999</a>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#C5A880]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <a href="mailto:contato@parthenon.com.br" className="hover:text-[#1a1a1a] transition-colors">contato@parthenon.com.br</a>
          </div>
        </div>
      </div>
      {/* ============================================================ */}

    </aside>
  );
}