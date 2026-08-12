'use client';

import { useRef, useEffect, useState } from 'react';
import { getApiUrl } from '@/config';

interface VideoSectionProps {
  /**
   * Caminho para uma imagem de fallback (caso o vídeo não carregue)
   * @default '/images/img/meio rosto.webp'
   */
  fallbackSrc?: string;
  /**
   * Altura da seção (pode ser %, vh, px)
   * @default '60vh'
   */
  height?: string;
  /**
   * Altura mínima
   * @default '400px'
   */
  minHeight?: string;
  /**
   * Tipo de ajuste do vídeo (`cover` ou `contain`)
   * @default 'cover'
   */
  fit?: 'cover' | 'contain';
}

export default function VideoSection({
  fallbackSrc = '/images/img/meio rosto.webp',
  height = '60vh',
  minHeight = '400px',
  fit = 'cover',
}: VideoSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Carrega a URL assinada do segundo vídeo
  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        const apiUrl = getApiUrl();
        const res = await fetch(`${apiUrl}/api/videos/second`);
        if (!res.ok) throw new Error('Falha ao carregar URL do segundo vídeo');
        const data = await res.json();
        setVideoUrl(data.url);
      } catch (err) {
        console.error('Erro ao carregar URL do segundo vídeo:', err);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchVideoUrl();
  }, []);

  const shouldPlayVideo = !prefersReducedMotion && !hasError && !loading && videoUrl;

  return (
    <section
      className="relative w-full overflow-hidden bg-primary-dark"
      style={{ height, minHeight }}
    >
      {shouldPlayVideo ? (
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay
          muted
          playsInline
          loop
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

      {/* Overlay opcional para legibilidade, se quiser adicionar texto futuro */}
      <div className="absolute inset-0 bg-primary-dark/10 z-20" />
    </section>
  );
}