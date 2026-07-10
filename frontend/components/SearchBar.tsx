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
  placeholder = 'Buscar tecidos...',
  className = '',
}: SearchBarProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const novoValor = e.target.value;
    if (onChange) onChange(novoValor);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const termo = value || '';
    if (onSearch) onSearch(termo);
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
        flex items-center gap-2
        bg-light rounded-full
        border border-gray-mid
        px-5 py-3
        transition-all duration-300
        focus-within:border-dark-light focus-within:shadow-md-luxury
        ${className}
      `}
    >
      <input
        type="text"
        value={value || ''}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="
          flex-1 bg-transparent
          text-sm font-medium
          outline-none
          placeholder:text-text-light
        "
        aria-label="Buscar produtos"
      />
      <button
        type="submit"
        className="
          p-2 text-dark-light hover:text-gold
          transition-colors duration-300
          focus:outline-none focus:ring-2 focus:ring-gold
          rounded-button
        "
        aria-label="Pesquisar"
      >
        <Search className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2} />
      </button>
    </form>
  );
}