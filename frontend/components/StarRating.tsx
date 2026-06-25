'use client';

interface StarRatingProps {
  nota: number;
  total?: number;
  tamanho?: 'small' | 'medium' | 'large';
  onClick?: (nota: number) => void;
}

export default function StarRating({ nota, total, tamanho = 'medium', onClick }: StarRatingProps) {
  const tamanhos = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-7 h-7'
  };

  const tamanhoTexto = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onClick?.(star)}
            disabled={!onClick}
            className={`${onClick ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform p-0.5`}
            aria-label={`${star} estrela${star > 1 ? 's' : ''}`}
          >
            <svg
              className={`${tamanhos[tamanho]} ${
                star <= nota ? 'text-amber-400 drop-shadow-sm' : 'text-gray-300'
              } fill-current transition-colors`}
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        ))}
      </div>
      {total !== undefined && (
        <span className={`${tamanhoTexto[tamanho]} text-gray-500 ml-1 whitespace-nowrap`}>
          ({total} {total === 1 ? 'avaliação' : 'avaliações'})
        </span>
      )}
    </div>
  );
}