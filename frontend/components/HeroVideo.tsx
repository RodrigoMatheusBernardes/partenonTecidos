'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Volume2, VolumeX, PlayCircle } from 'lucide-react';

// ============================================================
// YouTube IFrame API
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
  }
}

// ============================================================
// VÍDEOS
// ============================================================

const DESKTOP_VIDEO_ID = '0OGYYD0XY9A';
const MOBILE_VIDEO_ID = 'BmLibpkdUeI';

const MOBILE_BREAKPOINT = 768;

// ============================================================
// HERO VIDEO
// ============================================================

export default function HeroVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const initializedRef = useRef(false);

  const [muted, setMuted] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // ==========================================================
  // Inicialização do YouTube
  // ==========================================================

  useEffect(() => {
    let cancelled = false;
    let apiCheck: ReturnType<typeof setInterval> | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    const getVideoId = () => {
      return window.innerWidth < MOBILE_BREAKPOINT
        ? MOBILE_VIDEO_ID
        : DESKTOP_VIDEO_ID;
    };

    const initializePlayer = () => {
      if (cancelled) {
        return;
      }

      if (!containerRef.current) {
        retryTimer = setTimeout(initializePlayer, 200);
        return;
      }

      if (!window.YT?.Player) {
        retryTimer = setTimeout(initializePlayer, 200);
        return;
      }

      if (initializedRef.current || playerRef.current) {
        return;
      }

      initializedRef.current = true;

      const videoId = getVideoId();

      console.log(
        '[HeroVideo] inicializando:',
        videoId
      );

      try {
        const player = new window.YT.Player(
          containerRef.current,
          {
            width: '100%',
            height: '100%',
            videoId,

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
              // =================================================
              // PLAYER PRONTO
              // =================================================

              onReady: (event: YT.OnReadyEvent) => {
                if (cancelled) {
                  return;
                }

                console.log('[HeroVideo] player pronto');

                event.target.mute();
                event.target.playVideo();

                setMuted(true);
                setPlayerReady(true);
                setLoading(false);
              },

              // =================================================
              // ERRO
              // =================================================

              onError: (event: YT.OnErrorEvent) => {
                if (cancelled) {
                  return;
                }

                console.error(
                  '[HeroVideo] erro YouTube:',
                  event.data
                );

                setError(true);
                setLoading(false);
              },

              // =================================================
              // VÍDEO TERMINOU
              // =================================================

              onStateChange: (
                event: YT.OnStateChangeEvent
              ) => {
                /*
                 * 0 = ENDED
                 *
                 * Quando terminar, repetimos o mesmo vídeo
                 * correspondente ao dispositivo.
                 *
                 * Não trocamos horizontal <-> vertical.
                 */

                if (event.data === 0 && !cancelled) {
                  event.target.playVideo();
                }
              },
            },
          }
        );

        playerRef.current = player;
      } catch (err) {
        console.error(
          '[HeroVideo] erro ao criar player:',
          err
        );

        initializedRef.current = false;

        setError(true);
        setLoading(false);
      }
    };

    const loadYouTubeAPI = () => {
      if (cancelled) {
        return;
      }

      // API já disponível
      if (window.YT?.Player) {
        initializePlayer();
        return;
      }

      // Script já existe
      const existingScript = document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]'
      );

      if (existingScript) {
        apiCheck = setInterval(() => {
          if (cancelled) {
            if (apiCheck) {
              clearInterval(apiCheck);
            }
            return;
          }

          if (window.YT?.Player) {
            if (apiCheck) {
              clearInterval(apiCheck);
            }

            initializePlayer();
          }
        }, 200);

        return;
      }

      // Cria o script uma única vez
      const script = document.createElement('script');

      script.src =
        'https://www.youtube.com/iframe_api';

      script.async = true;

      script.onerror = () => {
        if (cancelled) {
          return;
        }

        console.error(
          '[HeroVideo] não foi possível carregar a API do YouTube'
        );

        setError(true);
        setLoading(false);
      };

      document.body.appendChild(script);

      apiCheck = setInterval(() => {
        if (cancelled) {
          if (apiCheck) {
            clearInterval(apiCheck);
          }
          return;
        }

        if (window.YT?.Player) {
          if (apiCheck) {
            clearInterval(apiCheck);
          }

          initializePlayer();
        }
      }, 200);
    };

    loadYouTubeAPI();

    return () => {
      cancelled = true;

      if (apiCheck) {
        clearInterval(apiCheck);
      }

      if (retryTimer) {
        clearTimeout(retryTimer);
      }

      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          // Não interromper desmontagem
        }

        playerRef.current = null;
      }

      initializedRef.current = false;
    };
  }, []);

  // ==========================================================
  // MUTE
  // ==========================================================

  const toggleMute = () => {
    const player = playerRef.current;

    if (!player) {
      return;
    }

    if (muted) {
      player.unMute();
      setMuted(false);
    } else {
      player.mute();
      setMuted(true);
    }
  };

  // ==========================================================
  // ERRO
  // ==========================================================

  if (error) {
    return (
      <section className="relative w-full h-[85vh] min-h-[500px] bg-primary-dark flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-primary-dark/95" />

        <div className="relative z-20 text-center px-6">
          <h1 className="text-4xl md:text-7xl font-primary text-white">
            Parthenon
          </h1>

          <p className="mt-4 text-white/80">
            Não foi possível carregar o vídeo.
          </p>

          <Link
            href="/loja"
            className="inline-block mt-6 border border-gold text-gold px-8 py-3 text-xs tracking-[0.2em] uppercase hover:bg-gold hover:text-primary-dark transition-all"
          >
            Conhecer a coleção
          </Link>
        </div>
      </section>
    );
  }

  // ==========================================================
  // HERO
  // ==========================================================

  return (
    <section className="relative w-full h-[85vh] min-h-[500px] overflow-hidden bg-primary-dark group">

      {/* ======================================================
          VÍDEO
          ====================================================== */}

      <div
        ref={containerRef}
        className="hero-video-player"
        aria-hidden="true"
      />

      {/* ======================================================
          PLAYER CSS
          ====================================================== */}

      <style jsx global>{`
        .hero-video-player {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #000;
          pointer-events: none;
        }

        /*
         * DESKTOP
         *
         * O vídeo é 16:9.
         *
         * A largura acompanha a tela.
         * O excesso vertical é cortado pelo Hero.
         */

        @media (min-width: 768px) {
          .hero-video-player iframe {
            position: absolute !important;

            left: 50% !important;
            top: 50% !important;

            width: 100vw !important;
            height: 56.25vw !important;

            transform: translate(-50%, -50%) !important;

            max-width: none !important;
            max-height: none !important;

            border: 0 !important;
          }
        }

        /*
         * MOBILE
         *
         * O vídeo Shorts é vertical.
         *
         * A altura acompanha a tela.
         */

        @media (max-width: 767px) {
          .hero-video-player iframe {
            position: absolute !important;

            left: 50% !important;
            top: 50% !important;

            width: 56.25vh !important;
            height: 100vh !important;

            transform: translate(-50%, -50%) !important;

            max-width: none !important;
            max-height: none !important;

            border: 0 !important;
          }
        }
      `}</style>

      {/* ======================================================
          LOADING
          ====================================================== */}

      {loading && (
        <div className="absolute inset-0 z-10 bg-primary-dark flex items-center justify-center">
          <div className="text-center">
            <p className="text-gold text-sm tracking-[0.15em] uppercase">
              Carregando experiência...
            </p>
          </div>
        </div>
      )}

      {/* ======================================================
          OVERLAY
          ====================================================== */}

      <div
        className="
          absolute
          inset-0
          z-20
          pointer-events-none
          bg-gradient-to-t
          from-primary-dark/40
          via-transparent
          to-primary-dark/10
        "
      />

      {/* ======================================================
          TEXTO
          ====================================================== */}

      <div className="relative z-30 flex items-center justify-center h-full px-6 pointer-events-none">
        <div className="text-center max-w-2xl space-y-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">

          <p className="text-xs md:text-sm tracking-[0.3em] uppercase font-secondary font-medium text-white">
            Nova Coleção 2026
          </p>

          <h1 className="text-4xl md:text-7xl lg:text-8xl font-primary font-normal tracking-[0.15em] leading-[1.1] text-white">
            Parthenon
            <br />

            <span className="font-primary font-medium tracking-[0.05em]">
              Tecidos
            </span>
          </h1>

          <p className="text-xs md:text-sm tracking-[0.2em] uppercase font-secondary text-white">
            A elegância que tece histórias
          </p>

          <div className="pt-2 pointer-events-auto">
            <Link
              href="/loja"
              className="
                inline-block
                border
                border-gold
                text-gold
                px-10
                py-4
                text-xs
                tracking-[0.2em]
                uppercase
                font-secondary
                font-light
                hover:bg-gold
                hover:text-primary-dark
                transition-all
                duration-500
              "
            >
              Conhecer a coleção
            </Link>
          </div>

        </div>
      </div>

      {/* ======================================================
          ÁUDIO
          ====================================================== */}

      {playerReady && (
        <button
          type="button"
          onClick={toggleMute}
          aria-label={
            muted
              ? 'Ativar som do vídeo'
              : 'Desativar som do vídeo'
          }
          className="
            absolute
            bottom-6
            right-6
            z-40
            p-2
            rounded-full
            bg-white/10
            backdrop-blur-sm
            text-white
            hover:bg-white/20
            transition-colors
          "
        >
          {muted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>
      )}
    </section>
  );
}