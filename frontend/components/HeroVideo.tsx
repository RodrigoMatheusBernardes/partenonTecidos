'use client';

export type {};

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
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

const FUNDOHOME_IMAGE = '/img/fundohome.jpg';

const OVERSCAN = 1.2;

export default function HeroVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fallbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Refs para as máscaras
  const maskBottomRef = useRef<HTMLDivElement>(null);
  const maskTopRef = useRef<HTMLDivElement>(null);

  const [heroStage, setHeroStage] = useState<'video1' | 'video2' | 'final'>('video1');
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [error, setError] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const stageRef = useRef<'video1' | 'video2' | 'final'>('video1');
  const video2FinishedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !playerReady) return;

    const iframe = container.querySelector('iframe');
    if (!iframe) return;

    const updateIframeSize = () => {
      const rect = container.getBoundingClientRect();
      const containerWidth = rect.width;
      const containerHeight = rect.height;

      const baseScale = Math.max(containerWidth / 16, containerHeight / 9);
      const scale = baseScale * OVERSCAN;

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

      const isVideo2 = currentVideoIndex === 1;
      if (isVideo2) {
        iframe.style.transform = 'translate(-50%, -40%)';
      } else {
        iframe.style.transform = 'translate(-50%, -50%)';
      }

      // Cálculo das máscaras
      if (maskBottomRef.current) {
        maskBottomRef.current.style.left = `${containerWidth * 0.80}px`;
        maskBottomRef.current.style.top = `${containerHeight * 0.86}px`;
        maskBottomRef.current.style.width = `${containerWidth * 0.18}px`;
        maskBottomRef.current.style.height = `${containerHeight * 0.12}px`;
      }
      if (maskTopRef.current) {
        maskTopRef.current.style.left = `${containerWidth * 0.05}px`;
        maskTopRef.current.style.top = `${containerHeight * 0.02}px`;
        maskTopRef.current.style.width = `${containerWidth * 0.40}px`;
        maskTopRef.current.style.height = `${containerHeight * 0.10}px`;
      }
    };

    const resizeObserver = new ResizeObserver(updateIframeSize);
    resizeObserver.observe(container);
    updateIframeSize();

    return () => {
      resizeObserver.disconnect();
    };
  }, [playerReady, currentVideoIndex]);

  const startVideo = () => {
    if (!playerRef.current || videoStarted) return;
    playerRef.current.playVideo();
    setVideoStarted(true);
    setTimeout(() => setBannerVisible(false), 200);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (playerReady && !videoStarted) startVideo();
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [playerReady, videoStarted]);

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
        setError(true);
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
            autoplay: 0,
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
            onReady: (event) => {
              event.target.mute();
              setMuted(true);
              setPlayerReady(true);
              fallbackTimerRef.current = setTimeout(() => startVideo(), 5000);
            },
            onError: (event) => {
              setError(true);
              setShowFallback(true);
            },
            onStateChange: (event) => {
              const state = event.data;
              if (stageRef.current === 'final') return;
              if (state !== 0) return;

              if (stageRef.current === 'video1') {
                transitionToVideo(event.target, 1);
              } else if (stageRef.current === 'video2') {
                if (!video2FinishedRef.current) {
                  video2FinishedRef.current = true;
                  transitionToFinal();
                }
              }
            },
          },
        });
        playerRef.current = player;
      } catch (err) {
        setError(true);
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
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    };
  }, []);

  const transitionToVideo = (player: YT.Player, nextIndex: number) => {
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    setIsTransitioning(true);
    transitionTimerRef.current = setTimeout(() => {
      stageRef.current = nextIndex === 0 ? 'video1' : 'video2';
      setCurrentVideoIndex(nextIndex);
      setHeroStage(nextIndex === 0 ? 'video1' : 'video2');
      player.loadVideoById(VIDEO_IDS[nextIndex]);
      setIsTransitioning(false);
      transitionTimerRef.current = null;
    }, 500);
  };

  const transitionToFinal = () => {
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    setIsTransitioning(true);
    transitionTimerRef.current = setTimeout(() => {
      stageRef.current = 'final';
      setHeroStage('final');
      setIsTransitioning(false);
      transitionTimerRef.current = null;
    }, 500);
  };

  const handleReplay = () => {
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    if (!playerRef.current) return;
    setIsTransitioning(true);
    transitionTimerRef.current = setTimeout(() => {
      const player = playerRef.current!;
      stageRef.current = 'video1';
      video2FinishedRef.current = false;
      setCurrentVideoIndex(0);
      setHeroStage('video1');
      player.loadVideoById(VIDEO_IDS[0]);
      player.seekTo(0, true);
      player.playVideo();
      setIsTransitioning(false);
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

  const isVideoActive = heroStage === 'video1' || heroStage === 'video2';

  if (showFallback) {
    return (
      <section className="relative w-full aspect-[16/9] max-w-full overflow-hidden bg-primary-dark flex items-center justify-center">
        <div className="absolute inset-0 bg-primary-dark/90" />
        <div className="relative z-20 text-center px-6 max-w-2xl space-y-6">
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-primary font-normal tracking-[0.15em] leading-[1.1] text-white">
            Parthenon<br />
            <span className="font-primary font-medium tracking-[0.05em] text-white">Tecidos</span>
          </h1>
          <p className="text-xs md:text-sm tracking-[0.2em] uppercase font-secondary font-normal text-white">A elegância que tece histórias</p>
          <div className="pt-2">
            <Link href="/loja" className="inline-block border border-gold text-gold px-10 py-4 text-xs tracking-[0.2em] uppercase font-secondary font-light hover:bg-gold hover:text-primary-dark transition-all duration-500">Conhecer a coleção</Link>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full aspect-[16/9] max-w-full overflow-hidden bg-primary-dark flex items-center justify-center">
        <div className="text-white text-center"><p className="text-red-500">Erro ao carregar o vídeo.</p></div>
      </section>
    );
  }

  return (
    <section className="relative w-full aspect-[16/9] max-w-full overflow-hidden bg-primary-dark group">
      {/* Iframe do YouTube */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 10 }} />

      {/* Máscara inferior direita (logo YouTube) */}
      <div
        ref={maskBottomRef}
        className="absolute"
        style={{
          zIndex: 15,
          pointerEvents: 'none',
          backdropFilter: 'blur(3px)',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
        }}
      />

      {/* Máscara superior esquerda (título) */}
      <div
        ref={maskTopRef}
        className="absolute"
        style={{
          zIndex: 15,
          pointerEvents: 'none',
          backdropFilter: 'blur(3px)',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
        }}
      />

      {/* Banner inicial */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${bannerVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{
          backgroundImage: `url('${FUNDOHOME_IMAGE}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 20,
        }}
      />

      {/* Overlay de transição entre vídeos */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${isTransitioning ? 'opacity-100' : 'opacity-0'}`}
        style={{ pointerEvents: 'none', zIndex: 30 }}
      />

      {/* BANNER FINAL */}
      {heroStage === 'final' && (
        <div className="absolute inset-0 animate-fade-in-up" style={{ zIndex: 30 }}>
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${FUNDOHOME_IMAGE}')` }} />
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 md:px-8 text-center text-white">
            <div className="max-w-4xl space-y-4 md:space-y-6">
              <h2 className="font-primary font-bold text-3xl md:text-5xl lg:text-6xl tracking-[0.2em] leading-tight drop-shadow-md">TÊXTIL PARTHENON</h2>
              <h3 className="font-secondary text-2xl md:text-4xl lg:text-5xl font-light tracking-wide drop-shadow-md">Tecidos que transformam espaços.</h3>
              <p className="text-sm md:text-lg lg:text-xl text-white/80 font-light tracking-widest drop-shadow-sm max-w-2xl mx-auto">Qualidade, textura e sofisticação em cada detalhe.</p>
              <div className="pt-6 md:pt-8">
                <button onClick={handleReplay} className="group inline-flex items-center gap-3 border-2 border-white/40 px-8 md:px-12 py-3 md:py-4 rounded-full text-sm md:text-base font-secondary font-medium tracking-widest uppercase text-white transition-all duration-500 hover:border-white/60 hover:text-white/80 hover:bg-white/10 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2">
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  Assistir de Novo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Botão de mute */}
      {playerReady && videoStarted && isVideoActive && !bannerVisible && (
        <button onClick={toggleMute} aria-label={muted ? 'Ativar som do vídeo' : 'Desativar som do vídeo'} className="absolute bottom-6 right-6 p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors" style={{ zIndex: 40 }}>
          {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      )}

      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
      `}</style>
    </section>
  );
}