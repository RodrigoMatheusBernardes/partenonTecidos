'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Voltar ao topo"
      className="
        fixed bottom-6 right-6 md:bottom-8 md:right-8
        z-30 w-12 h-12
        bg-dark-light text-white rounded-full
        shadow-lg-luxury
        flex items-center justify-center
        hover:bg-gold hover:text-dark-light
        transition-all duration-300
        animate-scale-up
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold
      "
    >
      <ArrowUp className="w-5 h-5" strokeWidth={2} />
    </button>
  );
}