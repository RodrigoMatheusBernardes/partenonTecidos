// Skeleton com animação de loading elegante

export const SkeletonProduct = () => (
  <div className="
    flex flex-col h-full
    bg-white rounded-card
    shadow-sm-luxury
    overflow-hidden
    animate-pulse
  ">
    {/* IMAGEM */}
    <div className="
      relative w-full aspect-square
      bg-gradient-to-r from-gray-mid via-gray-light to-gray-mid
      animate-shimmer
    " />

    {/* CONTEÚDO */}
    <div className="flex flex-col flex-grow p-4 gap-3">
      {/* TÍTULO */}
      <div className="
        h-5 bg-gradient-to-r from-gray-mid via-gray-light to-gray-mid
        rounded-button w-3/4
        animate-shimmer
      " />

      {/* PREÇO */}
      <div className="
        h-6 bg-gradient-to-r from-gray-mid via-gray-light to-gray-mid
        rounded-button w-1/2
        animate-shimmer
      " />

      {/* DESCRIÇÃO */}
      <div className="
        h-3 bg-gradient-to-r from-gray-mid via-gray-light to-gray-mid
        rounded-button w-2/3 mt-auto
        animate-shimmer
      " />
    </div>

    {/* BOTÃO */}
    <div className="
      px-4 pb-4 pt-2
      border-t border-gray-mid
    ">
      <div className="
        h-10 bg-gradient-to-r from-gray-mid via-gray-light to-gray-mid
        rounded-button w-full
        animate-shimmer
      " />
    </div>
  </div>
);

// Skeleton genérico
export const SkeletonLine = ({ width = 'w-full' }) => (
  <div className={`
    h-4 bg-gradient-to-r from-gray-mid via-gray-light to-gray-mid
    rounded-button ${width}
    animate-shimmer
  `} />
);

// Skeleton para cards de texto
export const SkeletonCard = () => (
  <div className="
    bg-white rounded-card
    shadow-sm-luxury overflow-hidden
    p-6 space-y-4
    animate-pulse
  ">
    <SkeletonLine width="w-3/4" />
    <SkeletonLine width="w-full" />
    <SkeletonLine width="w-5/6" />
    <div className="pt-4">
      <SkeletonLine width="w-1/3" />
    </div>
  </div>
);
