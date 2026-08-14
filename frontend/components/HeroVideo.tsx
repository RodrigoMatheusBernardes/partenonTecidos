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
  }
}

// ============================================================
// VÍDEOS
// ============================================================
//
// Desktop:
//   Vídeo 1 = horizontal 16:9
//
// Mobile:
//   Vídeo 2 = vertical / Shorts
//
// ============================================================

const DESKTOP_VIDEO_ID = '0OGYYD0XY9A';
const MOBILE_VIDEO_ID = 'BmLibpkdUeI';

// ============================================================
// Componente
// ============================================================

export default function HeroVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);

  const [muted, setMuted] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showFallback, setShowFallback] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // ============================================================
  // Detecta desktop/mobile
  // ============================================================

  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };

    updateViewport();

    window.addEventListener('resize', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
    };
  }, []);

  // ============================================================
  // Carregamento da API do YouTube
  // ============================================================

  useEffect(() => {
    console.log('[HeroVideo] montado');

    const loadAPI = () => {
      if (window.YT?.Player) {
        tryInitialize();
        return;
      }

      const existingScript = document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]'
      );

      if (existingScript) {
        const check = setInterval(() => {
          if (window.YT?.Player) {
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
          if (window.YT?.Player) {
            clearInterval(check);
            tryInitialize();
          }
        }, 200);
      };

      script.onerror = () => {
        console.error(
          '[HeroVideo] erro ao carregar API do YouTube'
        );

        setError(true);
        setLoading(false);
        setShowFallback(true);
      };

      document.body.appendChild(script);
    };

    const tryInitialize = () => {
      if (!containerRef.current) {
        setTimeout(tryInitialize, 200);
        return;
      }

      if (!window.YT?.Player) {
        setTimeout(tryInitialize, 200);
        return;
      }

      if (playerRef.current) {
        return;
      }

      /*
       * Importante:
       *
       * O vídeo inicial é escolhido de acordo com o tamanho
       * da tela.
       *
       * Desktop -> horizontal
       * Mobile  -> Shorts
       */

      const initialVideoId =
        window.innerWidth < 768
          ? MOBILE_VIDEO_ID
          : DESKTOP_VIDEO_ID;

      try {
        const player = new window.YT.Player(
          containerRef.current,
          {
            /*
             * O tamanho final será controlado pelo CSS.
             */
            width: '100%',
            height: '100%',

            videoId: initialVideoId,

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
              // ==================================================
              // READY
              // ==================================================

              onReady: (event: YT.OnReadyEvent) => {
                console.log('[HeroVideo] player pronto');

                event.target.mute();
                event.target.playVideo();

                setMuted(true);
                setPlayerReady(true);
                setLoading(false);
              },

              // ==================================================
              // ERROR
              // ==================================================

              onError: (event: YT.OnErrorEvent) => {
                console.error(
                  '[HeroVideo] erro do YouTube:',
                  event.data
                );

                if (event.data === 153) {
                  console.warn(
                    '[HeroVideo] Erro 153: HTTP Referer ausente.'
                  );
                }

                setError(true);
                setLoading(false);
                setShowFallback(true);
              },

              // ==================================================
              // FIM DO VÍDEO
              // ==================================================

              onStateChange: (
                event: YT.OnStateChangeEvent
              ) => {
                /*
                 * Quando o vídeo termina:
                 *
                 * Desktop -> continua no vídeo horizontal
                 * Mobile  -> continua no Shorts
                 *
                 * Não alternamos para o formato errado.
                 */
                if (event.data === 0) {
                  const nextVideo =
                    window.innerWidth < 768
                      ? MOBILE_VIDEO_ID
                      : DESKTOP_VIDEO_ID;

                  event.target.loadVideoById(nextVideo);
                }
              },
            },
          }
        );

        playerRef.current = player;

        console.log(
          '[HeroVideo] player criado:',
          initialVideoId
        );
      } catch (err) {
        console.error(
          '[HeroVideo] erro ao criar player:',
          err
        );

        setError(true);
        setLoading(false);
        setShowFallback(true);
      }
    };

    loadAPI();

    // ==========================================================
    // Cleanup
    // ==========================================================

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          // Ignorar erro de desmontagem
        }

        playerRef.current = null;
      }
    };
  }, []);

  // ============================================================
  // Quando muda entre desktop/mobile
  // ============================================================

  useEffect(() => {
    if (!playerRef.current) {
      return;
    }

    const videoId = isMobile
      ? MOBILE_VIDEO_ID
      : DESKTOP_VIDEO_ID;

    try {
      playerRef.current.loadVideoById(videoId);
      playerRef.current.mute();

      setMuted(true);
    } catch (err) {
      console.warn(
        '[HeroVideo] não foi possível trocar o vídeo:',
        err
      );
    }
  }, [isMobile]);

  // ============================================================
  // Mute
  // ============================================================

  const toggleMute = () => {
    if (!playerRef.current) {
      return;
    }

    if (muted) {
      playerRef.current.unMute();
      setMuted(false);
    } else {
      playerRef.current.mute();
      setMuted(true);
    }
  };

  // ============================================================
  // FALLBACK
  // ============================================================

  if (showFallback) {
    return (
      <section className="relative w-full min-h-[500px] h-[85vh] bg-primary-dark flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-primary-dark/90" />

        <div className="relative z-20 text-center px-6 max-w-2xl space-y-6">
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-primary font-normal tracking-[0.15em] leading-[1.1] text-white">
            Parthenon
            <br />

            <span className="font-primary font-medium tracking-[0.05em] text-white">
              Tecidos
            </span>
          </h1>

          <p className="text-xs md:text-sm tracking-[0.2em] uppercase font-secondary text-white">
            A elegância que tece histórias
          </p>

          <div className="pt-2">
            <Link
              href="/loja"
              className="inline-block border border-gold text-gold px-10 py-4 text-xs tracking-[0.2em] uppercase font-secondary hover:bg-gold hover:text-primary-dark transition-all duration-500"
            >
              Conhecer a coleção
            </Link>
          </div>

          <div className="pt-6">
            <a
              href={`https://www.youtube.com/watch?v=${DESKTOP_VIDEO_ID}`}
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

  // ============================================================
  // ERRO
  // ============================================================

  if (error) {
    return (
      <section className="w-full h-[85vh] min-h-[500px] bg-primary-dark flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-red-500">
            Erro ao carregar o vídeo.
          </p>
        </div>
      </section>
    );
  }

  // ============================================================
  // HERO
  // ============================================================

  return (
    <section className="relative w-full h-[85vh] min-h-[500px] overflow-hidden bg-primary-dark group">

      {/* ======================================================
          PLAYER
          ====================================================== */}

      <div
        ref={containerRef}
        className="hero-video-container absolute inset-0"
        aria-hidden="true"
      />

      {/* ======================================================
          ESTILO DO PLAYER
          ====================================================== */}

      <style jsx global>{`
        /*
         * ======================================================
         * CONTAINER
         * ======================================================
         */

        .hero-video-container {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #000;
        }

        /*
         * ======================================================
         * DESKTOP
         *
         * Vídeo horizontal 16:9.
         *
         * O iframe fica maior verticalmente que o Hero.
         * Isso permite que o vídeo ocupe toda a largura sem
         * criar barras pretas laterais.
         * ======================================================
         */

        @media (min-width: 768px) {
          .hero-video-container iframe {
            position: absolute !important;

            top: 50% !important;
            left: 50% !important;

            width: 100vw !important;

            /*
             * Mantém a proporção 16:9.
             *
             * 100vw × 9/16
             */
            height: 56.25vw !important;

            max-width: none !important;
            max-height: none !important;

            transform: translate(-50%, -50%) !important;

            border: 0 !important;
          }
        }

        /*
         * ======================================================
         * MOBILE
         *
         * O segundo vídeo é vertical / Shorts.
         *
         * Aqui usamos 9:16 e fazemos o player preencher
         * completamente a altura disponível.
         * ======================================================
         */

        @media (max-width: 767px) {
          .hero-video-container iframe {
            position: absolute !important;

            top: 50% !important;
            left: 50% !important;

            /*
             * 9:16
             *
             * A altura acompanha o Hero.
             */
            width: 56.25vh !important;
            height: 100vh !important;

            max-width: none !important;
            max-height: none !important;

            transform: translate(-50%, -50%) !important;

            border: 0 !important;
          }
        }
      `}</style>

      {/* ======================================================
          LOADING
          ====================================================== */}

      {loading && (
        <div className="absolute inset-0 z-10 bg-primary-dark flex items-center justify-center">
          <div className="text-white text-center">
            <p className="text-gold">
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
          bg-gradient-to-t
          from-primary-dark/45
          via-primary-dark/10
          to-primary-dark/10
          pointer-events-none
        "
      />

      {/* ======================================================
          CONTEÚDO
          ====================================================== */}

      <div className="relative z-30 flex items-center justify-center h-full px-6">
        <div
          className="
            text-center
            max-w-2xl
            space-y-6
            drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]
          "
        >
          <p className="text-xs md:text-sm tracking-[0.3em] uppercase font-secondary font-medium text-white">
            Nova Coleção 2026
          </p>

          <h1 className="text-4xl md:text-7xl lg:text-8xl font-primary font-normal tracking-[0.15em] leading-[1.1] text-white">
            Parthenon
            <br />

            <span className="font-primary font-medium tracking-[0.05em] text-white">
              Tecidos
            </span>
          </h1>

          <p className="text-xs md:text-sm tracking-[0.2em] uppercase font-secondary font-normal text-white">
            A elegância que tece histórias
          </p>

          <div className="pt-2">
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
          BOTÃO DE ÁUDIO
          ====================================================== */}

      {playerReady && (
        <button
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