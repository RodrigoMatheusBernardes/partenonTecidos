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
  const [hasContainer, setHasContainer] = useState(false);
  const [apiReady, setApiReady] = useState(false);
  const currentVideoIndexRef = useRef(0);

  // 1. Componente monta
  console.log('[HeroVideo] 1. Componente montado');

  // Função para carregar a API do YouTube via Promise
  const loadYouTubeAPI = useCallback(() => {
    return new Promise<void>((resolve) => {
      if (window.YT && window.YT.Player) {
        console.log('[HeroVideo] 2. API já disponível (window.YT e YT.Player existem)');
        setApiReady(true);
        resolve();
        return;
      }

      console.log('[HeroVideo] 3. Carregando YouTube API (script)');
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.onload = () => {
        console.log('[HeroVideo] 4. Script carregado, aguardando YT.Player...');
        const checkYT = setInterval(() => {
          if (window.YT && window.YT.Player) {
            clearInterval(checkYT);
            console.log('[HeroVideo] 5. YT.Player disponível (API pronta)');
            setApiReady(true);
            resolve();
          }
        }, 100);
      };
      script.onerror = () => {
        console.error('[HeroVideo] 6. ERRO ao carregar script da YouTube API');
        setError(true);
      };
      document.body.appendChild(script);
    });
  }, []);

  // Efeito para carregar a API na montagem
  useEffect(() => {
    console.log('[HeroVideo] 7. useEffect (loadYouTubeAPI) executado');
    loadYouTubeAPI().catch(() => {});
  }, [loadYouTubeAPI]);

  // Efeito para detectar quando o container estiver disponível
  useEffect(() => {
    if (containerRef.current) {
      console.log('[HeroVideo] 8. Container disponível (containerRef.current definido)');
      setHasContainer(true);
    } else {
      console.log('[HeroVideo] 8. Container AINDA não disponível (containerRef.current nulo)');
    }
  }, [containerRef.current]);

  // Efeito que inicializa o player quando API e container estiverem prontos
  useEffect(() => {
    console.log('[HeroVideo] 9. useEffect de inicialização do player executado');
    console.log(`[HeroVideo] 9. Estado atual -> apiReady: ${apiReady}, hasContainer: ${hasContainer}, playerRef.current: ${playerRef.current ? 'já existe' : 'null'}`);

    if (!apiReady || !hasContainer || playerRef.current) {
      if (!apiReady) console.log('[HeroVideo] 9. Aguardando apiReady...');
      if (!hasContainer) console.log('[HeroVideo] 9. Aguardando hasContainer...');
      if (playerRef.current) console.log('[HeroVideo] 9. playerRef.current já existe, não recriando');
      return;
    }

    const container = containerRef.current;
    if (!container) {
      console.warn('[HeroVideo] 10. containerRef.current é nulo no momento da criação');
      return;
    }

    console.log('[HeroVideo] 11. Criando YT.Player...');

    try {
      playerRef.current = new window.YT!.Player(container, {
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
            console.log('[HeroVideo] 12. EVENTO onReady disparado');
            console.log('[HeroVideo] 12. Player está pronto para reprodução');
            event.target.mute();
            setPlayerReady(true);
            setIsLoading(false);
            console.log('[HeroVideo] 12. Chamando playVideo()');
            event.target.playVideo();
          },
          onError: (event) => {
            console.error('[HeroVideo] 13. EVENTO onError disparado');
            console.error('[HeroVideo] 13. Código do erro:', event.data);
            setError(true);
            setIsLoading(false);
          },
          onStateChange: (event) => {
            const state = event.data;
            // state: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
            console.log(`[HeroVideo] 14. EVENTO onStateChange: estado = ${state}`);
            if (state === 0) {
              console.log('[HeroVideo] 14. Vídeo terminou (state=0). Carregando próximo vídeo...');
              const nextIndex = (currentVideoIndexRef.current + 1) % VIDEO_IDS.length;
              currentVideoIndexRef.current = nextIndex;
              console.log(`[HeroVideo] 14. Carregando vídeo ID: ${VIDEO_IDS[nextIndex]}`);
              event.target.loadVideoById(VIDEO_IDS[nextIndex]);
            }
          },
        },
      });
      console.log('[HeroVideo] 15. YT.Player criado com sucesso');
    } catch (err) {
      console.error('[HeroVideo] 16. ERRO ao criar YT.Player:', err);
      setError(true);
      setIsLoading(false);
    }
  }, [apiReady, hasContainer]);

  // Cleanup na desmontagem
  useEffect(() => {
    return () => {
      console.log('[HeroVideo] 17. Cleanup: componente desmontado');
      if (playerRef.current) {
        console.log('[HeroVideo] 17. Destruindo player existente');
        try {
          playerRef.current.destroy();
          playerRef.current = null;
        } catch {
          console.warn('[HeroVideo] 17. Erro ao destruir player');
        }
      }
    };
  }, []);

  // Alterna o mute
  const toggleMute = () => {
    console.log('[HeroVideo] 18. Botão de áudio clicado');
    if (!playerRef.current) {
      console.warn('[HeroVideo] 18. player não existe');
      return;
    }
    if (muted) {
      console.log('[HeroVideo] 18. Desmutando player');
      playerRef.current.unMute();
      setMuted(false);
    } else {
      console.log('[HeroVideo] 18. Mutando player');
      playerRef.current.mute();
      setMuted(true);
    }
  };

  // Estados visuais
  if (error) {
    console.log('[HeroVideo] 19. Exibindo estado de erro');
    return (
      <section className="w-full h-[85vh] min-h-[500px] bg-primary-dark flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-red-500">Erro ao carregar o vídeo.</p>
        </div>
      </section>
    );
  }

  if (!playerReady || isLoading) {
    console.log(`[HeroVideo] 20. Exibindo loading. playerReady: ${playerReady}, isLoading: ${isLoading}`);
    return (
      <section className="w-full h-[85vh] min-h-[500px] bg-primary-dark flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-gold">Carregando experiência...</p>
        </div>
      </section>
    );
  }

  console.log('[HeroVideo] 21. Renderizando player (estado OK)');
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