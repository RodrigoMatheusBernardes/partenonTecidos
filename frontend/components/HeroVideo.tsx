'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { Volume2, VolumeX } from 'lucide-react';

// YouTube IDs dos vídeos
const VIDEO_IDS = ['OZt0hp6tY_E', 'BmLibpkdUeI'];

// Declaração global para a API do YouTube
declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

let player: YT.Player | null = null;

export default function HeroVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);
  const [error, setError] = useState(false);

  // Carrega a API do YouTube apenas uma vez
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      // API já carregada
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
  }, []);

  // Inicializa o player quando a API estiver pronta
  const onYouTubeIframeAPIReady = useCallback(() => {
    if (!containerRef.current || player) return;

    try {
      player = new YT.Player(containerRef.current, {
        height: '100%',
        width: '100%',
        videoId: VIDEO_IDS[0],
        playerVars: {
          autoplay: 1,
          mute: 1,
          playsinline: 1,
          controls: 0,
          enablejsapi: 1,
          rel: 0,
          loop: 1,
          playlist: VIDEO_IDS.join(','), // playlist com os dois vídeos em loop
        },
        events: {
          onReady: (event) => {
            event.target.mute();
            setPlayerReady(true);
            event.target.playVideo();
          },
          onError: (event) => {
            console.error('YouTube player error:', event.data);
            setError(true);
          },
          onStateChange: (event) => {
            // O YouTube já cuida da transição entre os vídeos da playlist
          },
        },
      });
    } catch (err) {
      console.error('Erro ao criar player:', err);
      setError(true);
    }
  }, []);

  // Aguarda a API e inicializa
  useEffect(() => {
    if (window.YT && window.YT.Player && containerRef.current) {
      onYouTubeIframeAPIReady();
    } else {
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    }

    return () => {
      if (window.onYouTubeIframeAPIReady === onYouTubeIframeAPIReady) {
        window.onYouTubeIframeAPIReady = undefined;
      }
    };
  }, [onYouTubeIframeAPIReady]);

  const toggleMute = () => {
    if (!player) return;
    if (muted) {
      player.unMute();
      setMuted(false);
    } else {
      player.mute();
      setMuted(true);
    }
  };

  if (error) {
    return (
      <section className="w-full h-[85vh] min-h-[500px] bg-primary-dark flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-red-500">Erro ao carregar o vídeo.</p>
        </div>
      </section>
    );
  }

  if (!playerReady) {
    return (
      <section className="w-full h-[85vh] min-h-[500px] bg-primary-dark flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-gold">Carregando experiência...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full h-[85vh] min-h-[500px] overflow-hidden bg-primary-dark group">
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
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

      <button
        onClick={toggleMute}
        className="absolute bottom-6 right-6 z-40 p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
        aria-label={muted ? 'Ativar som' : 'Desativar som'}
      >
        {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>
    </section>
  );
}