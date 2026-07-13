'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  src: string;
  alt: string;
}

const DEFAULT_SLIDES: Slide[] = [
  { src: '/images/img/meio rosto.webp', alt: 'Modelo Parthenon' },
  { src: '/images/img/meio rosto.webp', alt: 'Meio Rosto' },
  { src: '/images/img/modelo.jpg', alt: 'Modelo linho' },
  { src: '/images/img/morena rosto.jpg', alt: 'Alfaiataria' },
  { src: '/images/img/olhos verdes.avif', alt: 'Fluidez' },
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

  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, total]);

  useEffect(() => {
    const timeout = setTimeout(() => setIsTransitioning(false), 700);
    return () => clearTimeout(timeout);
  }, [current]);

  return (
    <section className="relative w-full h-[85vh] min-h-[500px] overflow-hidden bg-zinc-900 group">
      
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
              className="object-cover object-center sepia-[0.3] brightness-[1.05] contrast-[1.0]"
              priority={index === 0}
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-black/20 z-20" />

      <div className="relative z-30 flex items-center justify-center h-full px-6">
        <div className="text-center max-w-2xl space-y-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
          
          {/* 
            CORREÇÃO 1: 
            "Nova Coleção 2026" – mudado de font-normal para font-medium
          */}
          <p className="text-xs md:text-sm tracking-[0.3em] uppercase font-medium font-sans text-white">
            Nova Coleção 2026
          </p>

          {/* 
            CORREÇÃO 2: 
            "Parthenon" – mudado de font-light para font-normal.
            "Tecidos" mantém font-medium para ancorar o título.
          */}
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-normal tracking-[0.15em] leading-[1.1] font-serif text-white">
            Parthenon <br />
            <span className="font-medium tracking-[0.05em] text-white">Tecidos</span>
          </h1>
          
          {/* 
            CORREÇÃO 3: 
            "A elegância que tece histórias" – mudado de text-[#EAEAEB] para text-white
          */}
          <p className="text-xs md:text-sm tracking-[0.2em] uppercase font-normal font-sans text-white">
            A elegância que tece histórias
          </p>

          {/* CTA (inalterado) */}
          <div className="pt-2">
            <Link
              href="/loja"
              className="inline-block border border-[#C5A880] text-[#C5A880] px-10 py-4 text-xs tracking-[0.2em] uppercase font-light hover:bg-[#C5A880] hover:text-[#0B0C10] transition-all duration-500"
            >
              Conhecer a coleção
            </Link>
          </div>
        </div>
      </div>

      {/* Controles (inalterados) */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-40 p-3 bg-white/20 backdrop-blur-sm rounded-full shadow-md hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-40 p-3 bg-white/20 backdrop-blur-sm rounded-full shadow-md hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Próximo"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`h-1 rounded-full transition-all ${
                  index === current ? 'w-8 bg-white' : 'w-4 bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}