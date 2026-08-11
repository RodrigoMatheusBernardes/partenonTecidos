'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';

interface HeroVideoProps {
  /**
   * Caminho para o vídeo principal.
   * @default '/videos/vid/ATENDIMENTO TEXTIL.mp4'
   */
  src?: string;
  /**
   * Caminho para uma imagem de fallback (usada quando o vídeo não carrega
   * ou quando o usuário prefere redução de movimento).
   * @default '/images/img/meio rosto.webp'
   */
  fallbackSrc?: string;
  /**
   * Altura do hero (pode ser em %, vh, px, etc.).
   * @default '85vh'
   */
  height?: string;
  /**
   * Altura mínima do hero.
   * @default '500px'
   */
  minHeight?: string;
  /**
   * Tipo de ajuste do vídeo (`cover` ou `contain`).
   * @default 'cover'
   */
  fit?: 'cover' | 'contain';
}

export default function HeroVideo({
  src = '/videos/vid/ATENDIMENTO TEXTIL.mp4',
  fallbackSrc = '/images/img/meio rosto.webp',
  height = '85vh',
  minHeight = '500px',
  fit = 'cover',
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Verifica preferência do usuário por redução de movimento
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Se o usuário prefere redução de movimento ou o vídeo falhou, usamos o fallback
  const shouldPlayVideo = !prefersReducedMotion && !hasError;

  return (
    <section
      className="relative w-full h-[85vh] min-h-[500px] overflow-hidden bg-primary-dark group"
      style={{ height, minHeight }}
    >
      {/* Vídeo principal (ou fallback) */}
      {shouldPlayVideo ? (
        <video
          ref={videoRef}
          src={src}
          autoPlay
          muted
          playsInline
          loop={false}
          controls={false}
          className={`w-full h-full object-${fit} object-center`}
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="absolute inset-0 w-full h-full">
          <img
            src={fallbackSrc}
            alt="Parthenon Tecidos"
            className="w-full h-full object-cover object-center"
          />
        </div>
      )}

      {/* Overlay escuro para legibilidade (mesmo do HomeBanner original) */}
      <div className="absolute inset-0 bg-primary-dark/20 z-20" />

      {/* Conteúdo textual e CTA (mesmo do HomeBanner original) */}
      <div className="relative z-30 flex items-center justify-center h-full px-6">
        <div className="text-center max-w-2xl space-y-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
          
          {/* Label - Nova Coleção */}
          <p className="text-xs md:text-sm tracking-[0.3em] uppercase font-secondary font-medium text-white">
            Nova Coleção 2026
          </p>

          {/* Título Principal - Parthenon */}
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-primary font-normal tracking-[0.15em] leading-[1.1] text-white">
            Parthenon <br />
            <span className="font-primary font-medium tracking-[0.05em] text-white">Tecidos</span>
          </h1>
          
          {/* Subtítulo */}
          <p className="text-xs md:text-sm tracking-[0.2em] uppercase font-secondary font-normal text-white">
            A elegância que tece histórias
          </p>

          {/* CTA - Botão */}
          <div className="pt-2">
            <Link
              href="/loja"
              className="inline-block border border-gold text-gold px-10 py-4 text-xs tracking-[0.2em] uppercase font-secondary font-light hover:bg-gold hover:text-primary-dark transition-all duration-500"
            >
              Conhecer a coleção
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}