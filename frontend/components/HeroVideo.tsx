'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { Volume2, VolumeX } from 'lucide-react';

// ============================================================
// Definições manuais dos tipos da YouTube IFrame API
// ============================================================
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
    new (element: HTMLElement, options: PlayerOptions): Player;
    playVideo(): void;
    mute(): void;
    unMute(): void;
    destroy(): void;
    loadVideoById(videoId: string): void;
    getCurrentTime(): number;
    getDuration(): number;
    getPlayerState(): number;
  }
}

declare global {
  interface Window {
    YT?: {
      Player: new (element: HTMLElement, options: YT.PlayerOptions) => YT.Player;
    };
  }
}

// ============================================================
// IDs dos vídeos do YouTube
// ============================================================
const VIDEO_IDS = ['OZt0hp6tY_E', 'BmLibpkdUeI'];

let playerInstance: YT.Player | null = null;
let currentVideoIndex = 0;

// ============================================================
// Componente HeroVideo
// ============================================================
export default function HeroVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega a API do YouTube de forma assíncrona (Promise)
  const loadYouTubeAPI = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      if (window.YT && window.YT.Player) {
        console.log('[HeroVideo] YouTube API já carregada');
        resolve();
        return;
      }

      console.log('[HeroVideo] Carregando YouTube API...');
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.onload = () => {
        // Aguarda a definição do YT.Player (pode demorar alguns milissegundos)
        const checkYT = setInterval(() => {
          if (window.YT && window.YT.Player) {
            clearInterval(checkYT);
            console.log('[HeroVideo] YouTube API carregada com sucesso');
            resolve();
          }
        }, 100);
      };
      script.onerror = () => {
        console.error('[HeroVideo] Falha ao carregar YouTube API');
        reject(new Error('Falha ao carregar YouTube API'));
      };
      document.body.appendChild(script);
    });
  }, []);

  // Inicializa o player após a API estar pronta
  const createPlayer = useCallback(() => {
    if (!containerRef.current) {
      console.warn('[HeroVideo] containerRef.current não está disponível');
      return;
    }
    if (playerInstance) {
      console.warn('[HeroVideo] Player já existe');
      return;
    }

    console.log('[HeroVideo] Criando player...');
    try {
      playerInstance = new window.YT!.Player(containerRef.current, {
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
            console.log('[HeroVideo] onReady disparado');
            event.target.mute();
            setPlayerReady(true);
            setIsLoading(false);
            event.target.playVideo();
          },
          onError: (event) => {
            console.error('[HeroVideo] Erro do player:', event.data);
            setError(true);
            setIsLoading(false);
          },
          onStateChange: (event) => {
            const state = event.data;
            console.log(`[HeroVideo] onStateChange: ${state}`);
            // state = 0 (ended), 1 (playing), 5 (buffering), etc.
            if (state === 0) {
              // Vídeo terminou -> próximo
              const nextIndex = (currentVideoIndex + 1) % VIDEO_IDS.length;
              currentVideoIndex = nextIndex;
              event.target.loadVideoById(VIDEO_IDS[nextIndex]);
            }
          },
        },
      });
      console.log('[HeroVideo] Player criado');
    } catch (err) {
      console.error('[HeroVideo] Erro ao criar player:', err);
      setError(true);
      setIsLoading(false);
    }
  }, []);

  // Efeito principal: carrega API, cria player
  useEffect(() => {
    console.log('[HeroVideo] Componente montado');

    const init = async () => {
      try {
        await loadYouTubeAPI();
        // Aguarda um tick para garantir que o ref esteja atualizado
        setTimeout(() => {
          if (containerRef.current) {
            createPlayer();
          } else {
            console.warn('[HeroVideo] containerRef.current ainda nulo');
          }
        }, 100);
      } catch (err) {
        console.error('[HeroVideo] Erro na inicialização:', err);
        setError(true);
        setIsLoading(false);
      }
    };

    init();

    return () => {
      console.log('[HeroVideo] Componente desmontado');
      if (playerInstance) {
        try {
          playerInstance.destroy();
        } catch {
          /* ignore */
        }
        playerInstance = null;
      }
      currentVideoIndex = 0;
    };
  }, [loadYouTubeAPI, createPlayer]);

  // Alterna mute
  const toggleMute = () => {
    if (!playerInstance) return;
    if (muted) {
      playerInstance.unMute();
      setMuted(false);
    } else {
      playerInstance.mute();
      setMuted(true);
    }
  };

  // Estados visuais
  if (error) {
    return (
      <section className="w-full h-[85vh] min-h-[500px] bg-primary-dark flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-red-500">Erro ao carregar o vídeo.</p>
        </div>
      </section>
    );
  }

  if (!playerReady || isLoading) {
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