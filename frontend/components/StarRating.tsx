'use client';

import { Star } from 'lucide-react';

interface StarRatingProps {
  nota: number;
  total?: number;
  tamanho?: 'sm' | 'md' | 'lg';
  onClick?: (nota: number) => void;
  interactive?: boolean;
}

const sizeMap = {
  sm: 'w-3 h-3 md:w-4 md:h-4',
  md: 'w-5 h-5 md:w-6 md:h-6',
  lg: 'w-6 h-6 md:w-7 md:h-7',
};

const textSizeMap = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export default function StarRating({
  nota,
  total,
  tamanho = 'md',
  onClick,
  interactive = false,
}: StarRatingProps) {
  const isInteractive = interactive && onClick;

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => isInteractive && onClick?.(star)}
            disabled={!isInteractive}
            className={`
              p-1 rounded-button
              transition-all duration-300
              ${isInteractive ? 'cursor-pointer hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gold' : 'cursor-default'}
              ${!isInteractive && 'disabled:cursor-default'}
            `}
            aria-label={`${star} estrela${star > 1 ? 's' : ''}`}
            tabIndex={isInteractive ? 0 : -1}
          >
            <Star
              className={`
                ${sizeMap[tamanho]}
                transition-all duration-300
                ${star <= nota ? 'fill-gold text-gold' : 'fill-gray-mid text-gray-mid'}
              `}
              strokeWidth={1.5}
            />
          </button>
        ))}
      </div>

      {total !== undefined && (
        <span className={`
          ${textSizeMap[tamanho]}
          text-text-light
          ml-1 whitespace-nowrap
          font-medium
        `}>
          ({total} {total === 1 ? 'avaliação' : 'avaliações'})
        </span>
      )}
    </div>
  );
}