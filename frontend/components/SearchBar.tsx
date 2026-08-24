'use client';

import { Search } from 'lucide-react';

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (termo: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = 'Buscar tecidos, coleções...',
  className = '',
}: SearchBarProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const termo = value || '';
    if (onSearch && termo.trim()) {
      onSearch(termo);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`
        flex items-center
        bg-white
        border border-[#d1d1d1]
        rounded-full
        px-3 md:px-4
        py-2 md:py-2.5
        transition-colors duration-200
        focus-within:border-[#0B1742]
        ${className}
      `}
    >
      <button
        type="submit"
        className="flex-shrink-0 text-[#8a8a8a] hover:text-[#0B1742] transition-colors duration-200 mr-2"
        aria-label="Pesquisar"
      >
        <Search className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2} />
      </button>

      <input
        type="text"
        value={value || ''}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="
          flex-1
          bg-transparent
          border-none
          outline-none
          text-sm
          font-medium
          text-[#1a1a1a]
          placeholder:text-[#8a8a8a]
          min-w-0
        "
        aria-label="Buscar produtos"
      />
    </form>
  );
}