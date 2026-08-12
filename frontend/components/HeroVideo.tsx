'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { getApiUrl } from '@/config';
import { Volume2, VolumeX } from 'lucide-react';

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [url1, setUrl1] = useState<string | null>(null); // URL do partenon1
  const [url2, setUrl2] = useState<string | null>(null); // URL do partenon2 (opcional)
  const [current, setCurrent] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [muted, setMuted] = useState(true);

  // Função para buscar as URLs – com tratamento individual
  const fetchVideoUrls = async () => {
    try {
      const apiUrl = getApiUrl();

      // Busca o primeiro vídeo (obrigatório)
      const res1 = await fetch(`${apiUrl}/api/videos/hero`);
      if (!res1.ok) {
        throw new Error(`Falha no primeiro vídeo: ${res1.status}`);
      }
      const data1 = await res1.json();
      if (!data1.url) {
        throw new Error('Primeiro vídeo não retornou URL');
      }
      setUrl1(data1.url);

      // Busca o segundo vídeo (opcional)
      try {
        const res2 = await fetch(`${apiUrl}/api/videos/second`);
        if (res2.ok) {
          const data2 = await res2.json();
          if (data2.url) {
            setUrl2(data2.url);
            console.log('✅ Segundo vídeo carregado com sucesso');
          } else {
            console.warn('⚠️ Segundo vídeo: URL não encontrada na resposta');
          }
        } else {
          console.warn(`⚠️ Segundo vídeo indisponível (status ${res2.status})`);
        }
      } catch (err2) {
        console.warn('⚠️ Erro ao carregar segundo vídeo:', err2.message);
      }

      // Se não tiver o primeiro, lança erro
      if (!url1) {
        throw new Error('Nenhum vídeo disponível');
      }
    } catch (err) {
      console.error('❌ Erro crítico ao carregar vídeos:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideoUrls();
  }, []);

  // Troca de vídeo ao finalizar (só se o segundo estiver disponível)
  const handleEnded = () => {
    if (current === 1 && url2) {
      setCurrent(2);
    } else if (current === 2 && url1) {
      setCurrent(1);
    } else {
      // Se não houver segundo, reinicia o primeiro
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    }
  };

  // Renderização condicional
  if (loading) {
    return (
      <section className="w-full h-[85vh] min-h-[500px] bg-primary-dark flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-gold">Carregando experiência...</p>
        </div>
      </section>
    );
  }

  if (error || !url1) {
    return (
      <section className="w-full h-[85vh] min-h-[500px] bg-primary-dark flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-red-500">Erro ao carregar o vídeo principal.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full h-[85vh] min-h-[500px] overflow-hidden bg-primary-dark group">
      <video
        ref={videoRef}
        src={current === 1 ? url1 : (url2 || url1)} // se url2 não existir, cai para url1
        autoPlay
        muted={muted}
        playsInline
        loop={false}
        controls={false}
        preload="metadata"
        className="w-full h-full object-cover object-center"
        onEnded={handleEnded}
        onError={(e) => {
          console.error('❌ Erro no elemento <video>:', e);
          // Se o vídeo atual falhar, tenta voltar para o primeiro
          if (current === 2 && url1) {
            setCurrent(1);
          } else {
            setError(true);
          }
        }}
      />

      {/* Overlay e conteúdo textual (inalterados) */}
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

      {/* Controle de áudio */}
      <button
        onClick={() => setMuted(!muted)}
        className="absolute bottom-6 right-6 z-40 p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
        aria-label={muted ? 'Ativar som' : 'Desativar som'}
      >
        {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>
    </section>
  );
}