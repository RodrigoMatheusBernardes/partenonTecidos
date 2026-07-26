'use client';

import { Search } from 'lucide-react';
import Button from '@/components/ui/Button';

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
        flex items-center gap-3
        bg-light rounded-full
        border border-gray-mid
        px-4 py-2.5 md:px-5 md:py-3
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
        className="flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-text-light"
        aria-label="Buscar produtos"
      />
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className="!p-2 !h-auto !w-auto text-text-secondary hover:text-gold"
        aria-label="Pesquisar"
      >
        <Search className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2} />
      </Button>
    </form>
  );
}