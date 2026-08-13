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

// ============================================================
// Componente HeroVideo
// ============================================================
export default function HeroVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const [muted, setMuted] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiReady, setApiReady] = useState(false);
  const currentVideoIndexRef = useRef(0);
  const initializationAttemptedRef = useRef(false);

  // 1. Função para carregar a API do YouTube
  const loadYouTubeAPI = useCallback(() => {
    return new Promise<void>((resolve) => {
      if (window.YT && window.YT.Player) {
        console.log('[HeroVideo] YouTube API já disponível');
        setApiReady(true);
        resolve();
        return;
      }

      console.log('[HeroVideo] Carregando YouTube API...');
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.onload = () => {
        const checkYT = setInterval(() => {
          if (window.YT && window.YT.Player) {
            clearInterval(checkYT);
            console.log('[HeroVideo] YouTube API carregada');
            setApiReady(true);
            resolve();
          }
        }, 100);
      };
      script.onerror = () => {
        console.error('[HeroVideo] Falha ao carregar YouTube API');
        setError(true);
      };
      document.body.appendChild(script);
    });
  }, []);

  // 2. Função para inicializar o player
  const initializePlayer = useCallback(() => {
    console.log('[HeroVideo] Tentando inicializar player...');

    if (!containerRef.current) {
      console.warn('[HeroVideo] Aguardando container (containerRef.current nulo)');
      return;
    }

    if (!window.YT?.Player) {
      console.warn('[HeroVideo] Aguardando YouTube API');
      return;
    }

    if (playerRef.current) {
      console.warn('[HeroVideo] Player já inicializado');
      return;
    }

    if (initializationAttemptedRef.current) {
      console.warn('[HeroVideo] Inicialização já foi tentada');
      return;
    }

    initializationAttemptedRef.current = true;

    console.log('[HeroVideo] Container e API disponíveis. Criando player...');

    try {
      playerRef.current = new window.YT.Player(containerRef.current, {
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
            console.log(`[HeroVideo] Estado do player: ${state}`);
            if (state === 0) {
              const nextIndex = (currentVideoIndexRef.current + 1) % VIDEO_IDS.length;
              currentVideoIndexRef.current = nextIndex;
              event.target.loadVideoById(VIDEO_IDS[nextIndex]);
            }
          },
        },
      });
      console.log('[HeroVideo] Player criado com sucesso');
    } catch (err) {
      console.error('[HeroVideo] Erro ao criar player:', err);
      setError(true);
      setIsLoading(false);
    }
  }, []);

  // 3. Carregar API na montagem
  useEffect(() => {
    console.log('[HeroVideo] Componente montado');
    loadYouTubeAPI().catch(() => {});
  }, [loadYouTubeAPI]);

  // 4. Verificar container e API, e inicializar
  useEffect(() => {
    console.log(`[HeroVideo] Verificação: apiReady=${apiReady}, container=${!!containerRef.current}, player=${!!playerRef.current}`);

    if (!containerRef.current) {
      console.log('[HeroVideo] Aguardando container');
      return;
    }

    if (!apiReady || !window.YT?.Player) {
      console.log('[HeroVideo] Aguardando YouTube API');
      return;
    }

    initializePlayer();
  }, [apiReady, containerRef.current, initializePlayer]);

  // 5. Callback global para quando a API estiver pronta
  useEffect(() => {
    const onYouTubeReady = () => {
      console.log('[HeroVideo] Callback onYouTubeIframeAPIReady chamado');
      setApiReady(true);
      if (containerRef.current) {
        initializePlayer();
      }
    };

    window.onYouTubeIframeAPIReady = onYouTubeReady;

    return () => {
      if (window.onYouTubeIframeAPIReady === onYouTubeReady) {
        delete window.onYouTubeIframeAPIReady;
      }
    };
  }, [initializePlayer]);

  // 6. Cleanup do player
  useEffect(() => {
    return () => {
      console.log('[HeroVideo] Desmontando componente');
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
          playerRef.current = null;
        } catch {
          // ignorar
        }
      }
    };
  }, []);

  // 7. Alternar mute
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

  // 8. Estados visuais
  if (error) {
    return (
      <section className="relative w-full h-[85vh] min-h-[500px] overflow-hidden bg-primary-dark flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-red-500">Erro ao carregar o vídeo.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full h-[85vh] min-h-[500px] overflow-hidden bg-primary-dark group">
      {/* Container do player (sempre presente) */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }} />

      {/* Overlay de loading (sobreposto ao container) */}
      {(!playerReady || isLoading) && (
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

      {/* Botão de áudio (só aparece quando o player está pronto) */}
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