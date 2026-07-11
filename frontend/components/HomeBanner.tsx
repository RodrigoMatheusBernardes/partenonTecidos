'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface Slide {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
}

// Slides padrão (caso não sejam passados)
const DEFAULT_SLIDES: Slide[] = [
  { src: '/images/img/meio rosto.webp', alt: 'Modelo Parthenon', title: 'Sofisticação em Tecido', subtitle: 'Conheça nossa coleção premium' },
  { src: '/images/img/meio rosto.webp', alt: 'Meio Rosto', title: 'Qualidade Inigualável', subtitle: 'Tecidos selecionados com precisão' },
  { src: '/images/img/modelo.jpg', alt: 'Modelo linho', title: 'Elegância Natural', subtitle: 'Linhos e algodões exclusivos' },
  { src: '/images/img/morena rosto.jpg', alt: 'Alfaiataria', title: 'Arte e Confecção', subtitle: 'Tecidos para criações incríveis' },
  { src: '/images/img/olhos verdes.avif', alt: 'Fluidez', title: 'Fluidez e Conforto', subtitle: 'Sensação premium em cada fio' },
];

interface HomeBannerProps {
  slides?: Slide[];
}

export default function HomeBanner({ slides = DEFAULT_SLIDES }: HomeBannerProps) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const total = slides.length;

  const next = useCallback(() => {
    if (isTransitioning || total <= 1) return;
    setIsTransitioning(true);
    setCurrent((prev) => (prev + 1) % total);
  }, [total, isTransitioning]);

  const prev = useCallback(() => {
    if (isTransitioning || total <= 1) return;
    setIsTransitioning(true);
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total, isTransitioning]);

  // Troca automática a cada 6.5 segundos
  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(next, 6500);
    return () => clearInterval(timer);
  }, [next, total]);

  // Libera a trava de transição após a animação
  useEffect(() => {
    const timeout = setTimeout(() => setIsTransitioning(false), 900);
    return () => clearTimeout(timeout);
  }, [current]);

  return (
    <section className="relative w-full bg-dark-light group h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden">
      {/* Slides de fundo */}
      <div className="absolute inset-0 w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className="object-cover object-center"
              priority={index === 0}
              sizes="100vw"
              quality={85}
            />
          </div>
        ))}
      </div>

      {/* Overlay gradiente profissional */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/25 to-transparent z-20" />

      {/* Conteúdo centralizado e simples */}
      <div className="relative z-30 flex items-center justify-center h-full px-4 md:px-6">
        <div className="text-center text-white space-y-3 md:space-y-4 animate-fade-in">
          {/* Título principal */}
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-serif font-light leading-tight tracking-tight">
            {slides[current]?.title || 'Parthenon Tecidos'}
          </h1>

          {/* Subtítulo */}
          <p className="text-xs sm:text-sm md:text-base font-light opacity-90">
            {slides[current]?.subtitle || 'Qualidade e sofisticação em cada fio'}
          </p>

          {/* CTA Principal */}
          <div className="pt-2 md:pt-4">
            <Link
              href="/loja"
              className="
                inline-flex items-center justify-center gap-2
                px-6 md:px-8 py-2.5 md:py-3
                bg-gold text-dark-light
                rounded-button font-semibold text-xs sm:text-sm md:text-base
                uppercase tracking-wider
                hover:bg-white transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-black/30
                hover:shadow-lg
              "
            >
              Explorar Coleção
              <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover/cta:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>

      {/* Controles minimizados - apenas indicadores discretos */}
      {total > 1 && (
        <>
          {/* Botões de navegação discretos */}
          <button
            onClick={prev}
            className="
              absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-40
              p-2 md:p-2.5 bg-white/5 hover:bg-white/15
              rounded-full border border-white/20 hover:border-white/40
              transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-white/30
              hidden sm:flex items-center justify-center
            "
            aria-label="Slide anterior"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-white" strokeWidth={2} />
          </button>

          <button
            onClick={next}
            className="
              absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-40
              p-2 md:p-2.5 bg-white/5 hover:bg-white/15
              rounded-full border border-white/20 hover:border-white/40
              transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-white/30
              hidden sm:flex items-center justify-center
            "
            aria-label="Próximo slide"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-white" strokeWidth={2} />
          </button>

          {/* Indicadores discretos - Bottom */}
          <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-40 flex gap-2" role="tablist" aria-label="Navegação de slides">
            {slides.map((_, index) => (
              <button
                key={index}
                role="tab"
                aria-selected={index === current}
                onClick={() => !isTransitioning && setCurrent(index)}
                className={`
                  h-1.5 rounded-full transition-all duration-400 cursor-pointer
                  focus:outline-none focus:ring-1 focus:ring-white/50
                  ${index === current 
                    ? 'w-6 bg-gold' 
                    : 'w-1.5 bg-white/40 hover:bg-white/60'
                  }
                `}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}