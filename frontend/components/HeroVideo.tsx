'use client';

import { useRef, useEffect, useState } from 'react';

interface HeroVideoProps {
  /**
   * Caminho para o vídeo principal.
   * @default '/videos/vd ATENDIMENTO TEXTIL.mp4'
   */
  src?: string;
  /**
   * Caminho para uma imagem de fallback (usada quando o vídeo não carrega
   * ou quando o usuário prefere redução de movimento).
   * @default undefined (exibe apenas fundo escuro)
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
  src = '/videos/vid/ ATENDIMENTO TEXTIL.mp4',
  fallbackSrc,
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

  // Se o usuário prefere redução de movimento, não tentamos reproduzir o vídeo
  const shouldPlayVideo = !prefersReducedMotion && !hasError;

  return (
    <section
      className="relative w-full overflow-hidden bg-primary-dark"
      style={{ height, minHeight }}
    >
      {/* Vídeo principal */}
      {shouldPlayVideo ? (
        <video
          ref={videoRef}
          src={encodeURIComponent(src)}
          autoPlay
          muted
          playsInline
          loop={false}
          controls={false}
          className={`w-full h-full object-${fit} object-center`}
          onError={() => setHasError(true)}
        />
      ) : (
        // Fallback estático (imagem ou fundo escuro)
        <div className="absolute inset-0 w-full h-full bg-primary-dark/80 flex items-center justify-center">
          {fallbackSrc ? (
            <img
              src={fallbackSrc}
              alt="Parthenon Tecidos"
              className="w-full h-full object-cover object-center"
            />
          ) : (
            // Fundo escuro simples (sem quebrar o layout)
            <div className="w-full h-full bg-primary-dark" />
          )}
        </div>
      )}

      {/* Gradiente sutil para suavizar as bordas laterais (opcional) */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-primary-dark/20 via-transparent to-primary-dark/20" />
    </section>
  );
}