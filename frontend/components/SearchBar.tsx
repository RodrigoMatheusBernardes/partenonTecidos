'use client';

import { useState } from 'react';

interface SearchBarProps {
  onSearch?: (termo: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [termo, setTermo] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setTermo(valor);
    if (onSearch) onSearch(valor);            // filtra em tempo real
  };

  const handleClick = () => {
    if (onSearch) onSearch(termo);            // também filtra ao clicar
  };

  return (
    <div className="flex w-full max-w-2xl">
      <input
        type="text"
        value={termo}
        onChange={handleChange}
        placeholder="Buscar tecidos, marcas, fibras naturais..."
        className="flex-1 bg-gray-100 border border-gray-300 rounded-l-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <button
        onClick={handleClick}
        className="bg-primary text-white px-6 rounded-r-full hover:bg-blue-700 transition"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>
  );
}