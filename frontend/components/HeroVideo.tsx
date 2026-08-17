'use client';

export type {};

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Volume2, VolumeX, PlayCircle } from 'lucide-react';

declare global {
  interface Window {
    YT?: {
      Player: new (element: HTMLElement, options: YT.PlayerOptions) => YT.Player;
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
    iv_load_policy?: 3;
    start?: number;
    end?: number;
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
    loadVideoById(videoId: string, startSeconds?: number, endSeconds?: number): void;
  }
}

const VIDEO_IDS = ['0OGYYD0XY9A', 'nbU9EBZpbAo'];

// ============================================================
// CONFIGURAÇÃO DO LOOP
// ============================================================
const LOOP_DURATION_MS = 10000;

export default function HeroVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const currentIndexRef = useRef(0);
  
  const [muted, setMuted] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showFallback, setShowFallback] = useState(false);

  // Estados do loop e transição
  const [isLooping, setIsLooping] = useState(false);
  const loopTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ============================================================
  // Lógica de dimensionamento do iframe (INALTERADA)
  // ============================================================
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !playerReady) return;

    const iframe = container.querySelector('iframe');
    if (!iframe) return;

    const updateIframeSize = () => {
      const rect = container.getBoundingClientRect();
      const containerWidth = rect.width;
      const containerHeight = rect.height;

      const scale = Math.max(containerWidth / 16, containerHeight / 9);
      const videoWidth = 16 * scale;
      const videoHeight = 9 * scale;

      iframe.style.width = `${videoWidth}px`;
      iframe.style.height = `${videoHeight}px`;
      iframe.style.position = 'absolute';
      iframe.style.top = '50%';
      iframe.style.left = '50%';
      iframe.style.maxWidth = 'none';
      iframe.style.maxHeight = 'none';
      iframe.style.border = '0';

      const isVideo2 = currentIndexRef.current === 1;
      if (isVideo2) {
        iframe.style.transform = 'translate(-50%, -40%) scale(1.05)';
      } else {
        iframe.style.transform = 'translate(-50%, -50%)';
      }
    };

    const resizeObserver = new ResizeObserver(updateIframeSize);
    resizeObserver.observe(container);
    updateIframeSize();

    return () => {
      resizeObserver.disconnect();
    };
  }, [playerReady, currentIndexRef.current]);

  // ============================================================
  // Carregamento da YouTube IFrame API (INALTERADO)
  // ============================================================
  useEffect(() => {
    const loadAPI = () => {
      if (window.YT && window.YT.Player) {
        tryInitialize();
        return;
      }

      const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
      if (existingScript) {
        const check = setInterval(() => {
          if (window.YT && window.YT.Player) {
            clearInterval(check);
            tryInitialize();
          }
        }, 200);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;

      script.onload = () => {
        const check = setInterval(() => {
          if (window.YT && window.YT.Player) {
            clearInterval(check);
            tryInitialize();
          }
        }, 200);
      };

      script.onerror = () => {
        console.error('[HeroVideo] erro ao carregar script do YouTube');
        setError(true);
        setLoading(false);
        setShowFallback(true);
      };

      document.body.appendChild(script);
    };

    const tryInitialize = () => {
      if (!containerRef.current) {
        setTimeout(tryInitialize, 300);
        return;
      }

      if (playerRef.current) return;

      if (!window.YT || !window.YT.Player) {
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
            modestbranding: 1,
            iv_load_policy: 3,
          },
          events: {
            onReady: (event: YT.OnReadyEvent) => {
              event.target.mute();
              setMuted(true);
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
              const state = event.data;
              const player = event.target;

              // Estado 0 = vídeo terminou
              if (state === 0) {
                // Se o vídeo 2 terminou e não estamos em loop, inicia o Loop
                if (currentIndexRef.current === 1 && !isLooping) {
                  startLoop(player);
                } 
                // Se o vídeo 1 terminou (e não estávamos no loop), vai para o vídeo 2
                else if (currentIndexRef.current === 0) {
                  currentIndexRef.current = 1;
                  player.loadVideoById(VIDEO_IDS[1]);
                }
              }
            },
          },
        });

        playerRef.current = player;
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
      if (loopTimerRef.current) clearTimeout(loopTimerRef.current);
    };
  }, []);

  // ============================================================
  // Lógica do Loop
  // ============================================================
  const startLoop = (player: YT.Player) => {
    setIsLooping(true);

    // Aguarda a duração do loop e reinicia o vídeo 1
    loopTimerRef.current = setTimeout(() => {
      setIsLooping(false);
      currentIndexRef.current = 0; 
      player.loadVideoById(VIDEO_IDS[0]);
    }, LOOP_DURATION_MS);
  };

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

  // ============================================================
  // Renderização (com REMOÇÃO DOS TÍTULOS/TEXTOS)
  // ============================================================
  if (showFallback) {
    return (
      <section className="relative w-full aspect-[16/9] max-w-full overflow-hidden bg-primary-dark flex items-center justify-center">
        <div className="absolute inset-0 bg-primary-dark/90" />
        {/* Fallback sem texto */}
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full aspect-[16/9] max-w-full overflow-hidden bg-primary-dark flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-red-500">Erro ao carregar o vídeo.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full aspect-[16/9] max-w-full overflow-hidden bg-primary-dark group">
      {/* Container do iframe do YouTube */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full z-10"
        style={{ pointerEvents: isLooping ? 'none' : 'none' }}
      />

      {/* ======================================================
          CAMADA DE LOOP (Sobreposto ao iframe quando ativo)
      ====================================================== */}
      <div
        className={`absolute inset-0 z-20 transition-opacity duration-1000 ease-in-out ${
          isLooping ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 w-full h-full bg-primary-dark overflow-hidden">
          <div
            className="w-full h-full bg-cover bg-center animate-slow-zoom"
            style={{
              backgroundImage: "url('/images/img/meio rosto.webp')", // Placeholder
            }}
          />
        </div>
      </div>

      {/* ANIMAÇÃO CSS PARA ZOOM LENTO */}
      <style jsx global>{`
        @keyframes slowZoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.04); }
        }
        .animate-slow-zoom {
          animation: slowZoom 10s ease-in-out infinite alternate;
        }
      `}</style>

      {loading && (
        <div className="absolute inset-0 z-30 bg-primary-dark flex items-center justify-center">
          <div className="text-white text-center">
            <p className="text-gold">Carregando experiência...</p>
          </div>
        </div>
      )}

      {/* Overlay sutil */}
      <div className="absolute inset-0 bg-primary-dark/20 z-40" />

      {/* REMOVIDOS: Texto "Nova Coleção 2026", "Parthenon Tecidos", "A elegância que tece histórias" e botão "Conhecer a coleção" */}

      {playerReady && (
        <button
          onClick={toggleMute}
          aria-label={muted ? 'Ativar som do vídeo' : 'Desativar som do vídeo'}
          className="absolute bottom-6 right-6 z-50 p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
        >
          {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      )}
    </section>
  );
}