'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Volume2, VolumeX } from 'lucide-react';

// ============================================================
// Tipos mínimos para a YouTube IFrame API
// ============================================================
declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement,
        options: YTPlayerOptions
      ) => YTPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTPlayerOptions {
  height: string;
  width: string;
  videoId: string;
  playerVars?: {
    autoplay?: 0 | 1;
    mute?: 0 | 1;
    playsinline?: 0 | 1;
    controls?: 0 | 1;
    enablejsapi?: 0 | 1;
    rel?: 0 | 1;
    loop?: 0 | 1;
    playlist?: string;
    origin?: string;
  };
  events?: {
    onReady?: (event: { target: YTPlayer }) => void;
    onStateChange?: (event: { target: YTPlayer; data: number }) => void;
    onError?: (event: { target: YTPlayer; data: number }) => void;
  };
}

interface YTPlayer {
  playVideo(): void;
  mute(): void;
  unMute(): void;
  destroy(): void;
  loadVideoById(videoId: string): void;
}

// ============================================================
// IDs dos vídeos do YouTube
// ============================================================
const VIDEO_IDS = ['OZt0hp6tY_E', 'BmLibpkdUeI'];

// ============================================================
// Componente Principal
// ============================================================
export default function HeroVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const currentIndexRef = useRef(0);
  const [muted, setMuted] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Carrega a API do YouTube uma única vez
  useEffect(() => {
    console.log('[HeroVideo] componente montado');

    if (window.YT && window.YT.Player) {
      console.log('[HeroVideo] API já disponível');
      tryInitialize();
      return;
    }

    console.log('[HeroVideo] carregando API');
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.onload = () => {
      console.log('[HeroVideo] script carregado');
      // A API ainda pode não estar pronta, então aguardamos um pouco
      const checkReady = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(checkReady);
          console.log('[HeroVideo] API pronta');
          tryInitialize();
        }
      }, 100);
    };
    script.onerror = () => {
      console.error('[HeroVideo] erro ao carregar script');
      setError(true);
      setLoading(false);
    };
    document.body.appendChild(script);

    // Define o callback global para quando a API estiver pronta
    window.onYouTubeIframeAPIReady = () => {
      console.log('[HeroVideo] onYouTubeIframeAPIReady chamado');
      tryInitialize();
    };

    return () => {
      console.log('[HeroVideo] componente desmontado');
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          // ignore
        }
        playerRef.current = null;
      }
      // Remove o callback para evitar vazamento
      if (window.onYouTubeIframeAPIReady) {
        window.onYouTubeIframeAPIReady = undefined;
      }
    };
  }, []);

  // Função que tenta criar o player
  const tryInitialize = () => {
    if (playerRef.current) {
      console.log('[HeroVideo] player já criado');
      return;
    }

    if (!containerRef.current) {
      console.log('[HeroVideo] container ainda não disponível');
      return;
    }

    if (!window.YT || !window.YT.Player) {
      console.log('[HeroVideo] API ainda não pronta');
      return;
    }

    console.log('[HeroVideo] container pronto, criando player');
    try {
      const player = new window.YT.Player(containerRef.current, {
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
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            console.log('[HeroVideo] player pronto');
            event.target.mute();
            setPlayerReady(true);
            setLoading(false);
            event.target.playVideo();
          },
          onStateChange: (event) => {
            const state = event.data;
            console.log(`[HeroVideo] estado do player: ${state}`);
            if (state === 0) {
              // Vídeo terminou, carrega o próximo
              const nextIndex = (currentIndexRef.current + 1) % VIDEO_IDS.length;
              currentIndexRef.current = nextIndex;
              event.target.loadVideoById(VIDEO_IDS[nextIndex]);
              console.log(`[HeroVideo] trocando para vídeo ${nextIndex + 1}`);
            }
          },
          onError: (event) => {
            console.error(`[HeroVideo] erro do YouTube: ${event.data}`);
            setError(true);
            setLoading(false);
          },
        },
      });
      playerRef.current = player;
      console.log('[HeroVideo] player criado');
    } catch (err) {
      console.error('[HeroVideo] erro ao criar player:', err);
      setError(true);
      setLoading(false);
    }
  };

  // Alterna o mute
  const toggleMute = () => {
    if (!playerRef.current) return;
    if (muted) {
      playerRef.current.unMute();
      setMuted(false);
    } else {
      playerRef.current.mute();
      setMuted(true);
    }
  };

  // Fallback em caso de erro
  if (error) {
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
      {/* Container do player – SEMPRE presente */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
      />

      {/* Loading sobreposto */}
      {loading && (
        <div className="absolute inset-0 z-10 bg-primary-dark flex items-center justify-center">
          <div className="text-white text-center">
            <p className="text-gold">Carregando experiência...</p>
          </div>
        </div>
      )}

      {/* Overlay de texto e CTA */}
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

      {/* Botão de áudio – aparece apenas quando o player está pronto */}
      {playerReady && (
        <button
          onClick={toggleMute}
          className="absolute bottom-6 right-6 z-40 p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
          aria-label={muted ? 'Ativar som' : 'Desativar som'}
        >
          {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      )}
    </section>
  );
}