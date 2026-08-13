'use client';

import { useEffect, useState } from 'react';

// ============================================================
// Definição dos tipos da YouTube IFrame API (para a página de teste)
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
    playVideo(): void;
    mute(): void;
    unMute(): void;
    destroy(): void;
    loadVideoById(videoId: string): void;
  }
}

// ============================================================
// Componente da página de teste
// ============================================================
export default function YouTubeTestPage() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const log = (msg: string) => setLogs((prev) => [...prev, msg]);

    log('🧪 Iniciando teste YouTube Embed...');
    log(`📍 window.location.origin: ${window.location.origin}`);
    log(`📄 document.referrer: ${document.referrer || '(vazio)'}`);

    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.onload = () => {
      log('✅ YouTube IFrame API carregada.');
      const checkYT = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(checkYT);
          log('✅ YT.Player disponível.');
          try {
            const player = new window.YT.Player('player-container', {
              height: '100%',
              width: '100%',
              videoId: 'rTJgUhVKUkU',
              playerVars: {
                autoplay: 1,
                mute: 1,
                playsinline: 1,
                controls: 1,
                enablejsapi: 1,
                origin: window.location.origin,
              },
              events: {
                onReady: () => log('✅ onReady disparado'),
                onStateChange: (event: YT.OnStateChangeEvent) =>
                  log(`🔄 Estado do player: ${event.data}`),
                onError: (event: YT.OnErrorEvent) => {
                  log(`❌ ERRO DO YOUTUBE: Código ${event.data}`);
                  if (event.data === 153) {
                    log('🔒 O erro 153 confirma a ausência de HTTP Referer.');
                  }
                },
              },
            });
            log('✅ Player criado com sucesso.');
          } catch (err) {
            log(`❌ Erro ao criar player: ${err}`);
          }
        }
      }, 200);
    };
    script.onerror = () => log('❌ Erro ao carregar script do YouTube.');
    document.body.appendChild(script);
  }, []);

  return (
    <div style={{ padding: '2rem', backgroundColor: '#0a1628', color: 'white', minHeight: '100vh' }}>
      <h1>🧪 Teste YouTube Embed / Erro 153</h1>
      <div style={{ marginBottom: '2rem' }}>
        <div id="player-container" style={{ width: '100%', height: '500px', backgroundColor: '#000' }} />
      </div>
      <div style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '8px', overflow: 'auto', maxHeight: '400px' }}>
        <pre style={{ color: '#0f0', margin: 0, fontSize: '0.85rem' }}>
          {logs.map((line, idx) => <div key={idx}>{line}</div>)}
        </pre>
      </div>
    </div>
  );
}