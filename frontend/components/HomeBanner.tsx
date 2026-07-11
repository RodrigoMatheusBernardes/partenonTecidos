'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';

interface Slide {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
  buttonHref?: string;
  badge?: string;
  overlayOpacity?: 'light' | 'medium' | 'dark';
  description?: string; // Adicionado para descrição adicional (novo)
}

// Slides padrão - REDESIGN PREMIUM
const DEFAULT_SLIDES: Slide[] = [
  {
    src: '/images/img/meio rosto.webp',
    alt: 'Modelo Parthenon',
    title: 'Sofisticação em Tecido',
    subtitle: 'Descubra tecidos premium selecionados com precisão',
    description: 'Tecidos escolhidos com rigor, combinando tradição com inovação',
    buttonLabel: 'Explorar Coleção',
    buttonHref: '/loja',
    badge: 'COLEÇÃO EXCLUSIVA',
    overlayOpacity: 'light',
  },
  {
    src: '/images/img/meio rosto.webp',
    alt: 'Qualidade Suprema',
    title: 'Qualidade Inigualável',
    subtitle: 'Cada fio escolhido para excelência',
    description: 'Seleção rigorosa de matérias-primas premium',
    buttonLabel: 'Ver Coleção Premium',
    buttonHref: '/loja',
    badge: 'QUALIDADE SUPREMA',
    overlayOpacity: 'medium',
  },
  {
    src: '/images/img/modelo.jpg',
    alt: 'Elegância Natural',
    title: 'Elegância Natural',
    subtitle: 'Linhos e algodões que respiram sofisticação',
    description: 'Fibras naturais que transmitem elegância e conforto',
    buttonLabel: 'Conhecer Linhos',
    buttonHref: '/loja',
    badge: 'NATUREZA PURA',
    overlayOpacity: 'light',
  },
  {
    src: '/images/img/morena rosto.jpg',
    alt: 'Confecção Artesanal',
    title: 'Arte em Cada Fio',
    subtitle: 'Tecidos para criações extraordinárias',
    description: 'Perfeição artesanal em cada detalhe confeccionado',
    buttonLabel: 'Ver Inspirações',
    buttonHref: '/loja',
    badge: 'MAESTRIA ARTESANAL',
    overlayOpacity: 'medium',
  },
  {
    src: '/images/img/olhos verdes.avif',
    alt: 'Conforto Premium',
    title: 'Conforto que Inspira',
    subtitle: 'Sensação de luxo em cada uso',
    description: 'Investimento em qualidade que perdura ao longo do tempo',
    buttonLabel: 'Descobrir Conforto',
    buttonHref: '/loja',
    badge: 'LUXO E CONFORTO',
    overlayOpacity: 'light',
  },
];

interface HomeBannerProps {
  slides?: Slide[];
}

export default function HomeBanner({ slides = DEFAULT_SLIDES }: HomeBannerProps) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const total = slides.length;

  const currentSlide = slides[current];
  const overlayOpacity = currentSlide?.overlayOpacity || 'medium';
  
  // Mapa de opacidades de overlay
  const overlayMap = {
    light: 'bg-gradient-to-t from-black/20 via-black/10 to-transparent',
    medium: 'bg-gradient-to-t from-black/35 via-black/20 to-transparent',
    dark: 'bg-gradient-to-t from-black/50 via-black/30 to-transparent',
  };

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

  // Autoplay 6.5 segundos
  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(next, 6500);
    return () => clearInterval(timer);
  }, [next, total]);

  // Libera trava após transição
  useEffect(() => {
    const timeout = setTimeout(() => setIsTransitioning(false), 900);
    return () => clearTimeout(timeout);
  }, [current]);

  return (
    <section className="relative w-full overflow-hidden group">
      {/* HERO CONTAINER - Altura Premium */}
      <div className="relative w-full h-56 sm:h-80 md:h-96 lg:h-[600px] xl:h-[700px] bg-dark-light">

        {/* BACKGROUND SLIDES */}
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

        {/* OVERLAY GRADIENTE - Variável por Slide */}
        <div className={`absolute inset-0 ${overlayMap[overlayOpacity as keyof typeof overlayMap]} z-20 transition-opacity duration-1000`} />

        {/* CONTEÚDO PRINCIPAL - Centralizado com espaço responsivo */}
        <div className="relative z-30 flex items-center justify-center h-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          
          {/* Centered Content Block - Centralizado em todas as resoluções */}
          <div className="w-full md:w-3/4 lg:w-2/3 text-white space-y-4 md:space-y-6 lg:space-y-8 animate-fade-in max-w-2xl">
            
            {/* BACKGROUND SEMI-TRANSPARENTE PREMIUM - Garante legibilidade */}
            <div className="absolute -inset-8 bg-gradient-to-r from-black/40 via-black/25 to-transparent rounded-lg z-0 pointer-events-none" />
            
            {/* CONTENT WRAPPER - Posicionamento relativo para estar acima do background */}
            <div className="relative z-10 space-y-4 md:space-y-6 lg:space-y-8">
            
              {/* LABEL PREMIUM - Com ícone e linha visual (style 471674c), textos brancos legíveis */}
              {currentSlide?.badge && (
                <div className="flex items-center gap-3">
                  <div className="h-0.5 w-12 bg-white shadow-lg" />
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-white drop-shadow-lg" strokeWidth={2.5} />
                    <p className="text-xs md:text-sm tracking-widest uppercase font-bold text-white drop-shadow-lg"
                       style={{
                         textShadow: '0 3px 8px rgba(0,0,0,0.8), 0 6px 16px rgba(0,0,0,0.4)',
                       }}>
                      {currentSlide.badge}
                    </p>
                  </div>
                </div>
              )}

              {/* TÍTULO PRINCIPAL - Branco PURO, peso bold, text-shadow máximo contraste */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold leading-tight tracking-tight text-white"
                  style={{
                    textShadow: '0 4px 16px rgba(0,0,0,0.9), 0 8px 32px rgba(0,0,0,0.5), 0 12px 48px rgba(0,0,0,0.3)',
                    WebkitTextStroke: '0.5px rgba(0,0,0,0.3)',
                  }}>
                {currentSlide?.title || 'Parthenon Tecidos'}
              </h1>

              {/* SUBTÍTULO - Branco PURO, extremamente legível */}
              <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white max-w-md leading-relaxed"
                 style={{
                   textShadow: '0 3px 12px rgba(0,0,0,0.8), 0 6px 20px rgba(0,0,0,0.4)',
                   WebkitTextStroke: '0.3px rgba(0,0,0,0.2)',
                 }}>
                {currentSlide?.subtitle || 'Qualidade e sofisticação em cada fio'}
              </p>

              {/* DESCRIÇÃO ADICIONAL - Branco, máxima legibilidade */}
              {currentSlide?.description && (
                <p className="text-sm md:text-base font-semibold text-white max-w-md leading-relaxed"
                   style={{
                     textShadow: '0 3px 12px rgba(0,0,0,0.8), 0 6px 18px rgba(0,0,0,0.4)',
                     WebkitTextStroke: '0.2px rgba(0,0,0,0.15)',
                   }}>
                  {currentSlide.description}
                </p>
              )}

            {/* CTA BOTÃO - Terra Bruciata Premium */}
            <div className="pt-2 md:pt-4 lg:pt-6">
              <Link
                href={currentSlide?.buttonHref || '/loja'}
                className="
                  inline-flex items-center justify-center gap-2.5
                  px-6 sm:px-8 md:px-10 lg:px-12 py-3 md:py-3.5 lg:py-4
                  bg-parthenon-brown text-white
                  rounded-button font-semibold text-sm md:text-base lg:text-lg
                  uppercase tracking-wider
                  shadow-md-luxury hover:shadow-lg-luxury
                  hover:bg-parthenon-brown-dark 
                  transition-all duration-300 hover:scale-105
                  focus:outline-none focus:ring-2 focus:ring-parthenon-brown focus:ring-offset-2 focus:ring-offset-black/30
                  group/cta
                "
              >
                {currentSlide?.buttonLabel || 'Explorar Coleção'}
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover/cta:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            {/* Fechamento do Content Wrapper */}
            </div>
          </div>
        </div>

        {/* CONTROLES DE NAVEGAÇÃO - Premium refinado */}
        {total > 1 && (
          <>
            {/* Botão Anterior - Esquerda */}
            <button
              onClick={prev}
              className="
                absolute left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-40
                p-2.5 md:p-3 lg:p-3.5
                bg-white/15 hover:bg-white/30
                rounded-full border border-white/30 hover:border-white/60
                transition-all duration-300 hover:scale-110 hover:shadow-lg-luxury
                focus:outline-none focus:ring-2 focus:ring-white/50
                hidden sm:flex items-center justify-center
                group/nav
              "
              aria-label="Slide anterior"
              title="Slide anterior"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white group-hover/nav:scale-125 transition-transform" strokeWidth={2} />
            </button>

            {/* Botão Próximo - Direita */}
            <button
              onClick={next}
              className="
                absolute right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-40
                p-2.5 md:p-3 lg:p-3.5
                bg-white/15 hover:bg-white/30
                rounded-full border border-white/30 hover:border-white/60
                transition-all duration-300 hover:scale-110 hover:shadow-lg-luxury
                focus:outline-none focus:ring-2 focus:ring-white/50
                hidden sm:flex items-center justify-center
                group/nav
              "
              aria-label="Próximo slide"
              title="Próximo slide"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white group-hover/nav:scale-125 transition-transform" strokeWidth={2} />
            </button>

            {/* INDICADORES DE SLIDES - Bottom, discreto e elegante */}
            <div className="absolute bottom-4 md:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-2.5 md:gap-3" role="tablist" aria-label="Navegação de slides">
              {slides.map((_, index) => (
                <button
                  key={index}
                  role="tab"
                  aria-selected={index === current}
                  aria-label={`Ir para slide ${index + 1}`}
                  onClick={() => !isTransitioning && setCurrent(index)}
                  className={`
                    h-2 rounded-full transition-all duration-400 cursor-pointer
                    focus:outline-none focus:ring-1 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black/30
                    ${index === current 
                      ? 'w-8 md:w-10 bg-parthenon-brown shadow-lg-luxury' 
                      : 'w-2 bg-white/40 hover:bg-white/60'
                    }
                  `}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}