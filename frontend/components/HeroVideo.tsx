'use client';
export type {};

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Volume2, VolumeX, PlayCircle } from 'lucide-react';

// ============================================================
// Definição dos tipos da YouTube IFrame API
// ============================================================
declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement,
        options: YT.PlayerOptions
      ) => YT.Player;
    };
  }
}

declare namespace YT {
  interface PlayerVars {
    autoplay?: 0 | 1;
    mute?: 0 | 1;
    playsinline?: 0 | 1;
    controls?: 0 | 1;
    enablejsapi?: 0 | 1;
    rel?: 0 | 1;
    loop?: 0 | 1;
    playlist?: string;
    origin?: string;
    modestbranding?: 0 | 1;
    iv_load_policy?: 3; // desabilita anotações
  }

  interface PlayerEvent {
    target: Player;
    data: number;
  }

  interface OnReadyEvent extends PlayerEvent {}
  interface OnStateChangeEvent extends PlayerEvent {}
  interface OnErrorEvent extends PlayerEvent {}

  interface PlayerOptions {
    height: string;
    width: string;
    videoId: string;
    playerVars?: PlayerVars;
    events?: {
      onReady?: (event: OnReadyEvent) => void;
      onStateChange?: (event: OnStateChangeEvent) => void;
      onError?: (event: OnErrorEvent) => void;
    };
  }

  interface Player {
    playVideo(): void;
    mute(): void;
    unMute(): void;
    destroy(): void;
    loadVideoById(videoId: string): void;
  }
}

// ============================================================
// IDs dos vídeos do YouTube
// ============================================================
const VIDEO_IDS = ['OZt0hp6tY_E', 'BmLibpkdUeI'];

export default function HeroVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const currentIndexRef = useRef(0);
  const [muted, setMuted] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    console.log('[HeroVideo] montado');

    const loadAPI = () => {
      if (window.YT && window.YT.Player) {
        tryInitialize();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.onload = () => {
        const check = setInterval(() => {
          if (window.YT && window.YT.Player) {
            clearInterval(check);
            tryInitialize();
          }
        }, 200);
      };
      script.onerror = () => {
        console.error('[HeroVideo] erro ao carregar script');
        setError(true);
        setLoading(false);
        setShowFallback(true);
      };
      document.body.appendChild(script);
    };

    const tryInitialize = () => {
      if (!containerRef.current) {
        console.log('[HeroVideo] aguardando container');
        setTimeout(tryInitialize, 300);
        return;
      }
      if (playerRef.current) return;
      if (!window.YT || !window.YT.Player) {
        console.log('[HeroVideo] aguardando API');
        setTimeout(tryInitialize, 300);
        return;
      }

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
            modestbranding: 1,       // minimiza o logotipo do YouTube
            iv_load_policy: 3,       // desabilita anotações
          },
          events: {
            onReady: (event: YT.OnReadyEvent) => {
              event.target.mute();
              setPlayerReady(true);
              setLoading(false);
              event.target.playVideo();
            },
            onError: (event: YT.OnErrorEvent) => {
              console.error('[HeroVideo] erro do YouTube:', event.data);
              if (event.data === 153) {
                console.warn('[HeroVideo] Erro 153: HTTP Referer ausente. Verifique a política de referrer.');
              }
              setError(true);
              setLoading(false);
              setShowFallback(true);
            },
            onStateChange: (event: YT.OnStateChangeEvent) => {
              if (event.data === 0) {
                const next = (currentIndexRef.current + 1) % VIDEO_IDS.length;
                currentIndexRef.current = next;
                event.target.loadVideoById(VIDEO_IDS[next]);
              }
            },
          },
        });
        playerRef.current = player;
        console.log('[HeroVideo] player criado');
      } catch (err) {
        console.error('[HeroVideo] erro ao criar player:', err);
        setError(true);
        setLoading(false);
        setShowFallback(true);
      }
    };

    loadAPI();

    return () => {
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch {}
        playerRef.current = null;
      }
    };
  }, []);

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

  if (showFallback) {
    return (
      <section className="relative w-full h-[85vh] min-h-[500px] bg-primary-dark flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-primary-dark/90" />
        <div className="relative z-20 text-center px-6 max-w-2xl space-y-6">
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
          <div className="pt-6">
            <a
              href={`https://www.youtube.com/watch?v=${VIDEO_IDS[0]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gold hover:text-gold/80 transition-colors text-sm md:text-base"
            >
              <PlayCircle className="w-5 h-5" />
              Assistir no YouTube
            </a>
          </div>
        </div>
      </section>
    );
  }

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
      {/* Container do player – ocupa 100% do Hero */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full flex items-center justify-center"
        style={{ pointerEvents: 'none' }}
      />

      {/* Gradiente escuro nas laterais para preencher visualmente o espaço vazio */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/80 via-transparent to-primary-dark/80 pointer-events-none" />

      {/* Overlay de loading */}
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

      {/* Botão de áudio */}
      {playerReady && (
        <button
          onClick={toggleMute}
          className="absolute bottom-6 right-6 z-40 p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
        >
          {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      )}
    </section>
  );
}