'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  fallbackSrc?: string;
  width?: number;
  height?: number;
}

export default function ImageWithFallback({
  src,
  alt,
  fill = false,
  className = '',
  sizes = '100vw',
  fallbackSrc = '/placeholder.jpg',
  width,
  height,
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      className={className}
      sizes={sizes}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
}