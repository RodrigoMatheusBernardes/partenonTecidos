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
    <section className="relative w-full h-screen min-h-[500px] max-h-[900px] overflow-hidden bg-dark-light group">
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
              quality={90}
            />
          </div>
        ))}
      </div>

      {/* Overlay gradiente sofisticado */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/10 z-20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-20" />

      {/* Conteúdo do slide */}
      <div className="relative z-30 flex items-center justify-center h-full px-4 md:px-6">
        <div className="w-full max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            
            {/* Texto e CTAs */}
            <div className="space-y-6 md:space-y-8 text-white animate-fade-in">
              {/* Label */}
              <div className="flex items-center gap-3">
                <div className="h-0.5 w-12 bg-gold" />
                <p className="text-xs md:text-sm tracking-[0.2em] uppercase font-light">
                  Coleção Exclusiva
                </p>
              </div>

              {/* Título com animação */}
              <div className="space-y-2">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light leading-tight tracking-tight">
                  {slides[current]?.title || 'Parthenon'}
                </h1>
                <div className="h-1 w-16 bg-gold" />
              </div>

              {/* Subtítulo */}
              <p className="text-base md:text-lg font-light leading-relaxed max-w-md opacity-95">
                {slides[current]?.subtitle || 'A elegância que tece histórias'}
              </p>

              {/* Descrição adicional */}
              <p className="text-sm md:text-base font-light opacity-80 leading-relaxed">
                Tecidos selecionados com rigor, combinando tradição com inovação.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {/* CTA Primário */}
                <Link
                  href="/loja"
                  className="
                    group/cta inline-flex items-center justify-center gap-2
                    px-8 md:px-10 py-4 md:py-5
                    bg-gold text-dark-light
                    rounded-button font-semibold text-sm md:text-base
                    uppercase tracking-wider
                    hover:bg-white transition-all duration-300
                    focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-black/20
                    hover:shadow-xl
                  "
                >
                  Ver Coleção
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover/cta:translate-x-1 transition-transform duration-300" />
                </Link>

                {/* CTA Secundário */}
                <Link
                  href="/sobre"
                  className="
                    inline-flex items-center justify-center
                    px-8 md:px-10 py-4 md:py-5
                    border-2 border-white/60 text-white
                    rounded-button font-semibold text-sm md:text-base
                    uppercase tracking-wider
                    hover:border-white hover:bg-white/10 transition-all duration-300
                    focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/20
                  "
                >
                  Sobre Nós
                </Link>
              </div>
            </div>

            {/* Imagem de destaque (aparece em md+) */}
            <div className="hidden md:flex items-end justify-end h-full">
              <div className="relative w-full aspect-square max-w-md">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
                <Image
                  src={slides[current]?.src || '/images/img/meio rosto.webp'}
                  alt="Destaque do slide"
                  fill
                  className="object-cover object-center rounded-lg"
                  quality={90}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTROLES - Sempre visíveis */}
      {total > 1 && (
        <>
          {/* Botões de navegação */}
          <button
            onClick={prev}
            className="
              absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-40
              p-3 md:p-4 bg-white/10 backdrop-blur-sm rounded-full
              border border-white/30
              hover:bg-white/20 hover:border-white/50 transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-white/50
              group-hover:scale-110
            "
            aria-label="Slide anterior"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={2.5} />
          </button>

          <button
            onClick={next}
            className="
              absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-40
              p-3 md:p-4 bg-white/10 backdrop-blur-sm rounded-full
              border border-white/30
              hover:bg-white/20 hover:border-white/50 transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-white/50
              group-hover:scale-110
            "
            aria-label="Próximo slide"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={2.5} />
          </button>

          {/* Indicadores - Sempre visíveis com estilo premium */}
          <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-3" role="tablist" aria-label="Navegação de slides">
            {slides.map((_, index) => (
              <button
                key={index}
                role="tab"
                aria-selected={index === current}
                onClick={() => !isTransitioning && setCurrent(index)}
                className={`
                  h-2 rounded-full transition-all duration-400 cursor-pointer
                  focus:outline-none focus:ring-2 focus:ring-white/50
                  ${index === current 
                    ? 'w-8 bg-gold' 
                    : 'w-2 bg-white/50 hover:bg-white/75'
                  }
                `}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Contador de slides */}
          <div className="absolute top-6 md:top-8 right-6 md:right-8 z-40">
            <p className="text-white text-sm font-light tracking-wider">
              <span className="text-gold font-semibold">{String(current + 1).padStart(2, '0')}</span>
              <span className="opacity-50"> / {String(total).padStart(2, '0')}</span>
            </p>
          </div>
        </>
      )}
    </section>
  );
}