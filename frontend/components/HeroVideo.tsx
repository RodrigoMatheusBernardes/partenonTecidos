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
      console.log('🔍 [HeroVideo] Iniciando fetch...');
      try {
        const apiUrl = getApiUrl();
        console.log('📡 [HeroVideo] getApiUrl() retornou:', apiUrl);
        const url = `${apiUrl}/api/videos/hero`;
        console.log('🌐 [HeroVideo] URL final da requisição:', url);
        const res = await fetch(url);
        if (!res.ok) {
          console.error('❌ [HeroVideo] Resposta não OK:', res.status);
          throw new Error(`Erro na API: ${res.status}`);
        }
        const data = await res.json();
        console.log('✅ [HeroVideo] Dados recebidos:', data);
        setVideoUrl(data.url);
      } catch (err) {
        console.error('❌ [HeroVideo] Erro no fetch:', err);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, []);

  if (loading || hasError || !videoUrl) {
    return (
      <section className="w-full h-[85vh] min-h-[500px] bg-primary-dark flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-gold">
            {loading ? 'Carregando experiência...' : 'Erro ao carregar o vídeo.'}
          </p>
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
        className="w-full h-full object-cover object-center"
        onError={() => setHasError(true)}
      />
      {/* ... resto do texto e CTA ... */}
    </section>
  );
}