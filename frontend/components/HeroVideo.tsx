'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { getApiUrl } from '@/config';

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        console.log('🔍 Iniciando fetch...');
        const apiUrl = getApiUrl();
        console.log('📡 API URL:', apiUrl);
        const response = await fetch(`${apiUrl}/api/videos/hero`);
        console.log('📦 Status da resposta:', response.status);
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const data = await response.json();
        console.log('✅ Dados recebidos:', data);
        if (data.url) {
          setVideoUrl(data.url);
          console.log('🎬 URL do vídeo definida:', data.url);
        } else {
          throw new Error('Resposta sem URL');
        }
      } catch (err) {
        console.error('❌ Erro no fetch:', err);
        setHasError(true);
      } finally {
        setLoading(false);
        console.log('⏳ Loading finalizado');
      }
    };

    fetchVideo();
  }, []);

  // Quando a URL mudar, carregue o vídeo imediatamente
  useEffect(() => {
    if (videoUrl && videoRef.current) {
      // Força o recarregamento do vídeo com a nova URL
      videoRef.current.src = videoUrl;
      videoRef.current.load();
      // Tenta reproduzir
      videoRef.current.play().catch(e => console.warn('Autoplay bloqueado:', e));
    }
  }, [videoUrl]);

  console.log('📌 Estado atual:', { loading, hasError, videoUrl });

  if (loading) {
    return (
      <section className="w-full h-[85vh] min-h-[500px] bg-primary-dark flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-gold">Carregando experiência...</p>
        </div>
      </section>
    );
  }

  if (hasError || !videoUrl) {
    return (
      <section className="w-full h-[85vh] min-h-[500px] bg-primary-dark flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-red-500">Erro ao carregar o vídeo.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full h-[85vh] min-h-[500px] overflow-hidden bg-primary-dark group">
      <video
        ref={videoRef}
        src={videoUrl}
        autoPlay
        muted
        playsInline
        loop={false}
        controls={false}
        preload="auto"
        className="w-full h-full object-cover object-center"
        onError={(e) => {
          console.error('🔥 Erro no elemento video:', e);
          setHasError(true);
        }}
      />
      <div className="absolute inset-0 bg-primary-dark/20 z-20" />
      <div className="relative z-30 flex items-center justify-center h-full px-6">
        <div className="text-center max-w-2xl space-y-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
          <p className="text-xs md:text-sm tracking-[0.3em] uppercase font-secondary font-medium text-white">
            Nova Coleção 2026
          </p>
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-primary font-normal tracking-[0.15em] leading-[1.1] text-white">
            Parthenon <br />
            <span className="font-primary font-medium tracking-[0.05em] text-white">Tecidos</span>
          </h1>
          <p className="text-xs md:text-sm tracking-[0.2em] uppercase font-secondary font-normal text-white">
            A elegância que tece histórias
          </p>
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