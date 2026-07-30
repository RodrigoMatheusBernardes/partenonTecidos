import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Mail, Phone, Play } from 'lucide-react'; // só mantém os que funcionam

export const metadata: Metadata = {
  title: 'Sobre - Parthenon Tecidos',
  description: 'Conheça a história da Parthenon Tecidos, nossa missão, valores e como nos encontrar.',
};

export default function SobrePage() {
  const whatsappNumber = '5511999999999';
  const whatsappMessage = encodeURIComponent(
    'Olá! Gostaria de mais informações sobre os tecidos da Parthenon.'
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <main className="bg-white">
      {/* Fundo com textura */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none bg-repeat"
          style={{ backgroundImage: "url('/uploads/sobre/texture-linen.png')" }}
        />

        {/* HERO */}
        <section className="relative py-20 md:py-28 bg-dark-light text-white">
          <div className="main-container text-center">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-wide">
              Sobre a Parthenon
            </h1>
            <div className="w-20 h-1 bg-gold mx-auto mt-4 mb-6" />
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light">
              A elegância que tece histórias — desde 2010.
            </p>
          </div>
        </section>

        {/* NOSSA HISTÓRIA (mantido) */}

        {/* MISSÃO, VISÃO E VALORES (mantido) */}

        {/* VÍDEO INSTITUCIONAL (mantido) */}

        {/* CONTATO E REDES SOCIAIS */}
        <section className="py-16 md:py-24">
          <div className="main-container">
            <h2 className="font-serif text-3xl md:text-4xl text-dark-light text-center mb-12">
              Fale Conosco
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                {/* ... informações de contato ... */}
              </div>

              <div className="space-y-6">
                <p className="font-medium text-dark-light">Nossas Redes Sociais</p>
                <div className="flex gap-6">
                  {/* Ícones SVG inline (mesmos do Footer) */}
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-secondary hover:text-gold transition-colors duration-300"
                  >
                    <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-secondary hover:text-gold transition-colors duration-300"
                  >
                    <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0-2.88 1.44 1.44 0 0 0 0 2.88z"/>
                    </svg>
                  </a>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-secondary hover:text-gold transition-colors duration-300"
                  >
                    <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                      <path d="M12.02 22c-.847 0-1.67-.114-2.452-.332l-4.62 1.635 1.572-4.627A9.93 9.93 0 0 1 2 12.02C2 6.496 6.476 2 12.02 2S22 6.496 22 12.02 17.524 22 12.02 22z"/>
                    </svg>
                  </a>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-secondary hover:text-gold transition-colors duration-300"
                  >
                    <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.104c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63A9.936 9.936 0 0024 4.59z"/>
                    </svg>
                  </a>
                </div>
                <p className="text-text-secondary text-sm">
                  Acompanhe nosso trabalho e inspire-se com novidades, lançamentos e dicas de moda.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}