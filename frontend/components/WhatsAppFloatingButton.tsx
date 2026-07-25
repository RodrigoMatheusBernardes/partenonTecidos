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
      <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.02 22c-.847 0-1.67-.114-2.452-.332l-4.62 1.635 1.572-4.627A9.93 9.93 0 0 1 2 12.02C2 6.496 6.476 2 12.02 2S22 6.496 22 12.02 17.524 22 12.02 22z"/>
      </svg>
    </button>
  );
}