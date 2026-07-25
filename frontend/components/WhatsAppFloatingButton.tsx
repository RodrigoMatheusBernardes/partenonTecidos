'use client';

import { useEffect, useState } from 'react';

export default function WhatsAppFloatingButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = () => {
    const message = encodeURIComponent('Olá! Gostaria de mais informações sobre os tecidos da Parthenon.');
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
  };

  if (!visible) return null;

  return (
    <button
      onClick={handleClick}
      aria-label="Falar no WhatsApp"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg flex items-center justify-center hover:scale-105 transition-all duration-300 hover:shadow-xl"
    >
      {/* 
        ✅ SOLUÇÃO MAIS SIMPLES: 
        Usando uma imagem externa do logotipo oficial do WhatsApp 
        hospedada na Wikipedia (CDN confiável).
        Isso evita qualquer erro de string malformada no build.
      */}
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp"
        className="w-8 h-8"
      />
    </button>
  );
}