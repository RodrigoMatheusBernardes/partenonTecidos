'use client';

export type {};

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link'; // ✅ Import adicionado
import { Volume2, VolumeX } from 'lucide-react';

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
    seekTo(seconds: number, allowSeekAhead: boolean): void;
  }
}

const VIDEO_IDS = ['0OGYYD0XY9A', 'nbU9EBZpbAo'];

// ============================================================
// Estado da máquina
// ============================================================
type HeroState = 'video1' | 'transition-video' | 'video2' | 'transition-banner' | 'final';

// ✅ Constante para o caminho do fundohome – ajuste a extensão conforme o arquivo real
const FUNDOHOME_IMAGE = '/img/fundohome.jpg'; // Altere para .png, .webp etc. se necessário

export default function HeroVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const currentIndexRef = useRef(0);
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [muted, setMuted] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showFallback, setShowFallback] = useState(false);

  // Estado único da máquina
  const [heroState, setHeroState] = useState<HeroState>('video1');

  // ============================================================
  // Lógica de dimensionamento do iframe (inalterada)
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
  // Carregamento da YouTube IFrame API (inalterado)
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

              if (state === 0) {
                if (heroState === 'video1') {
                  transitionToVideo(player, 1);
                } else if (heroState === 'video2') {
                  transitionToBanner();
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
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, [heroState]);

  // ============================================================
  // Funções de transição
  // ============================================================
  const transitionToVideo = (player: YT.Player, nextIndex: number) => {
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);

    setHeroState('transition-video');
    transitionTimerRef.current = setTimeout(() => {
      currentIndexRef.current = nextIndex;
      player.loadVideoById(VIDEO_IDS[nextIndex]);
      setHeroState(nextIndex === 0 ? 'video1' : 'video2');
      transitionTimerRef.current = null;
    }, 500);
  };

  const transitionToBanner = () => {
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);

    setHeroState('transition-banner');
    transitionTimerRef.current = setTimeout(() => {
      setHeroState('final');
      transitionTimerRef.current = null;
    }, 500);
  };

  const handleReplay = () => {
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    if (!playerRef.current) return;

    setHeroState('transition-banner');

    transitionTimerRef.current = setTimeout(() => {
      const player = playerRef.current!;
      currentIndexRef.current = 0;
      player.loadVideoById(VIDEO_IDS[0]);
      player.seekTo(0, true);
      player.playVideo();
      setHeroState('video1');
      transitionTimerRef.current = null;
    }, 500);
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
  // Renderização com máquina de estados
  // ============================================================
  const isVideoActive = heroState === 'video1' || heroState === 'video2';
  const isTransition = heroState === 'transition-video' || heroState === 'transition-banner';
  const isFinal = heroState === 'final';

  if (showFallback) {
    return (
      <section className="relative w-full aspect-[16/9] max-w-full overflow-hidden bg-primary-dark flex items-center justify-center">
        <div className="absolute inset-0 bg-primary-dark/90" />
        <div className="relative z-20 text-center px-6 max-w-2xl space-y-6">
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-primary font-normal tracking-[0.15em] leading-[1.1] text-white">
            Parthenon<br />
            <span className="font-primary font-medium tracking-[0.05em] text-white">Tecidos</span>
          </h1>
          <p className="text-xs md:text-sm tracking-[0.2em] uppercase font-secondary font-normal text-white">
            A elegância que tece histórias
          </p>
          <div className="pt-2">
            <Link href="/loja" className="inline-block border border-gold text-gold px-10 py-4 text-xs tracking-[0.2em] uppercase font-secondary font-light hover:bg-gold hover:text-primary-dark transition-all duration-500">
              Conhecer a coleção
            </Link>
          </div>
        </div>
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
      {/* Container do iframe */}
      <div
        ref={containerRef}
        className={`absolute inset-0 w-full h-full z-10 transition-opacity duration-500 ease-in-out ${isFinal || isTransition ? 'opacity-0' : 'opacity-100'}`}
        style={{ pointerEvents: 'none' }}
      />

      {/* OVERLAY DE TRANSIÇÃO (somente para fades) */}
      <div
        className={`absolute inset-0 z-20 bg-primary-dark/80 transition-opacity duration-500 ease-in-out ${
          isTransition ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ pointerEvents: 'none' }}
      />

      {/* BANNER FINAL (fundohome + textos brancos + botão) */}
      {isFinal && (
        <div className="absolute inset-0 z-30 animate-fade-in-up">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${FUNDOHOME_IMAGE}')`, // ✅ usa a constante
            }}
          />
          <div className="absolute inset-0 bg-black/10" />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 md:px-8 text-center text-white">
            <div className="max-w-4xl space-y-4 md:space-y-6">
              <h2 className="font-primary font-bold text-3xl md:text-5xl lg:text-6xl tracking-[0.2em] leading-tight drop-shadow-md">
                TÊXTIL PARTHENON
              </h2>
              <h3 className="font-secondary text-2xl md:text-4xl lg:text-5xl font-light tracking-wide drop-shadow-md">
                Tecidos que transformam espaços.
              </h3>
              <p className="text-sm md:text-lg lg:text-xl text-white/80 font-light tracking-widest drop-shadow-sm max-w-2xl mx-auto">
                Qualidade, textura e sofisticação em cada detalhe.
              </p>
              <div className="pt-6 md:pt-8">
                <button
                  onClick={handleReplay}
                  className="group inline-flex items-center gap-3 border-2 border-white/40 px-8 md:px-12 py-3 md:py-4 rounded-full text-sm md:text-base font-secondary font-medium tracking-widest uppercase text-white transition-all duration-500 hover:border-white/60 hover:text-white/80 hover:bg-white/10 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Assistir de Novo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 z-40 bg-primary-dark flex items-center justify-center">
          <div className="text-white text-center">
            <p className="text-gold">Carregando experiência...</p>
          </div>
        </div>
      )}

      {playerReady && isVideoActive && (
        <button
          onClick={toggleMute}
          aria-label={muted ? 'Ativar som do vídeo' : 'Desativar som do vídeo'}
          className="absolute bottom-6 right-6 z-50 p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
        >
          {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      )}

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
}