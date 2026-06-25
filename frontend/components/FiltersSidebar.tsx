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
}

export default function FiltersSidebar({
  precoMin,
  precoMax,
  precoMaxGlobal,
  categorias,
  categoriasSelecionadas,
  onPrecoChange,
  onCategoriaChange,
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

  // Handler local que garante que o onPrecoChange seja chamado com valores corretos
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
    <aside className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">Filtros</h2>
        {(precoMin > 0 || precoMax < precoMaxGlobal || categoriasSelecionadas.length > 0) && (
          <button
            onClick={() => {
              onPrecoChange(0, precoMaxGlobal);
              categoriasSelecionadas.forEach(id => onCategoriaChange(id));
            }}
            className="text-sm text-primary hover:underline"
          >
            Limpar
          </button>
        )}
      </div>

      {/* Preço */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Preço</h3>
        <div className="flex gap-2 mb-3">
          <input
            type="number"
            value={minInput}
            onChange={(e) => setMinInput(e.target.value)}
            placeholder="Min"
            className="w-20 border rounded p-1 text-sm"
          />
          <span className="self-center">-</span>
          <input
            type="number"
            value={maxInput}
            onChange={(e) => setMaxInput(e.target.value)}
            placeholder="Max"
            className="w-20 border rounded p-1 text-sm"
          />
          <button onClick={handlePrecoManual} className="bg-primary text-white text-xs px-3 py-1 rounded hover:bg-green-700">
            OK
          </button>
        </div>

        <div className="space-y-1">
          {faixasPreco.map((faixa) => (
            <label
              key={faixa.label}
              className={`flex items-center gap-2 text-sm cursor-pointer p-1 rounded hover:bg-gray-100 ${
                precoMin === faixa.min && precoMax === faixa.max ? 'font-medium text-primary' : 'text-gray-600'
              }`}
            >
              <input
                type="radio"
                name="faixa-preco"
                checked={precoMin === faixa.min && precoMax === faixa.max}
                onChange={() => handleFaixaChange(faixa.min, faixa.max)}
                className="w-4 h-4 text-primary focus:ring-primary"
              />
              {faixa.label}
            </label>
          ))}
          <label className="flex items-center gap-2 text-sm cursor-pointer p-1 rounded hover:bg-gray-100">
            <input
              type="radio"
              name="faixa-preco"
              checked={precoMin === 0 && precoMax === precoMaxGlobal}
              onChange={() => handleFaixaChange(0, precoMaxGlobal)}
              className="w-4 h-4 text-primary focus:ring-primary"
            />
            Todos os preços
          </label>
        </div>
      </div>

      {/* Categorias */}
      {categorias.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Categorias</h3>
          <div className="space-y-1 max-h-60 overflow-y-auto">
            {categorias.map(cat => (
              <label key={cat._id} className="flex items-center gap-2 text-sm cursor-pointer p-1 rounded hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={categoriasSelecionadas.includes(cat._id)}
                  onChange={() => onCategoriaChange(cat._id)}
                  className="w-4 h-4 text-primary rounded focus:ring-primary"
                />
                <span className="text-gray-700">{cat.nome}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}