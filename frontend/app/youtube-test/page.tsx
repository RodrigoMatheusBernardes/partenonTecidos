'use client';

import { useEffect, useState } from 'react';

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
                onStateChange: (event) => log(`🔄 Estado do player: ${event.data}`),
                onError: (event) => {
                  log(`❌ ERRO DO YOUTUBE: Código ${event.data}`);
                  if (event.data === 153) {
                    log('🔒 O erro 153 confirmou a ausência de Referer.');
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