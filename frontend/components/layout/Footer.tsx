'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="
      bg-dark-light text-white
      border-t border-gray-mid
    ">
      <div className="container-main">
        {/* MAIN GRID */}
        <div className="
          grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4
          gap-8 lg:gap-12
          py-12 md:py-16
          border-b border-gray-mid
        ">
          {/* BRAND */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex flex-col gap-1">
              <h2 className="
                text-3xl md:text-4xl font-serif
                font-semibold tracking-wider
              ">
                PARTHENON
              </h2>
              <p className="
                text-sm font-light tracking-widest
                text-gold
              ">
                TECIDOS FINOS
              </p>
            </div>
            <p className="
              text-sm leading-relaxed
              text-gray-mid max-w-xs
            ">
              Elegância e sofisticação em cada metro de tecido fino premium.
            </p>
            
            {/* REDES SOCIAIS */}
            <div className="flex items-center gap-4 pt-4">
              <a
                href="https://instagram.com"
                className="p-2 rounded-button hover:bg-gold hover:text-dark-light transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a
                href="https://facebook.com"
                className="p-2 rounded-button hover:bg-gold hover:text-dark-light transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            </div>
          </div>

          {/* NAVEGAÇÃO */}
          <div className="space-y-4">
            <h3 className="
              text-sm font-semibold uppercase
              tracking-widest text-gold
            ">
              Navegação
            </h3>
            <nav className="space-y-3 text-sm">
              <Link
                href="/loja"
                className="
                  block hover:text-gold
                  transition-colors duration-300
                "
              >
                Coleção
              </Link>
              <Link
                href="/novidades"
                className="
                  block hover:text-gold
                  transition-colors duration-300
                "
              >
                Novidades
              </Link>
              <Link
                href="/promocoes"
                className="
                  block hover:text-gold
                  transition-colors duration-300
                "
              >
                Promoções
              </Link>
              <Link
                href="/favoritos"
                className="
                  block hover:text-gold
                  transition-colors duration-300
                "
              >
                Favoritos
              </Link>
            </nav>
          </div>

          {/* SUPORTE */}
          <div className="space-y-4">
            <h3 className="
              text-sm font-semibold uppercase
              tracking-widest text-gold
            ">
              Suporte
            </h3>
            <nav className="space-y-3 text-sm">
              <Link
                href="/contato"
                className="
                  block hover:text-gold
                  transition-colors duration-300
                "
              >
                Entre em contato
              </Link>
              <Link
                href="/faq"
                className="
                  block hover:text-gold
                  transition-colors duration-300
                "
              >
                Perguntas Frequentes
              </Link>
              <Link
                href="/politica"
                className="
                  block hover:text-gold
                  transition-colors duration-300
                "
              >
                Política de Privacidade
              </Link>
              <Link
                href="/termos"
                className="
                  block hover:text-gold
                  transition-colors duration-300
                "
              >
                Termos de Uso
              </Link>
            </nav>
          </div>

          {/* CONTATO */}
          <div className="space-y-4">
            <h3 className="
              text-sm font-semibold uppercase
              tracking-widest text-gold
            ">
              Contato
            </h3>
            <div className="space-y-4 text-sm">
              <a
                href="mailto:contato@parthenon.com.br"
                className="
                  flex items-start gap-3
                  hover:text-gold transition-colors duration-300
                  group
                "
              >
                <Mail className="
                  w-5 h-5 flex-shrink-0 mt-0.5
                  group-hover:text-gold
                  transition-colors duration-300
                " strokeWidth={2} />
                <span>contato@parthenon.com.br</span>
              </a>

              <a
                href="tel:+5511999999999"
                className="
                  flex items-start gap-3
                  hover:text-gold transition-colors duration-300
                  group
                "
              >
                <Phone className="
                  w-5 h-5 flex-shrink-0 mt-0.5
                  group-hover:text-gold
                  transition-colors duration-300
                " strokeWidth={2} />
                <span>(11) 99999-9999</span>
              </a>

              <div className="
                flex items-start gap-3
                group
              ">
                <MapPin className="
                  w-5 h-5 flex-shrink-0 mt-0.5
                  text-gold
                " strokeWidth={2} />
                <div className="text-sm">
                  <p>Av. Martins Bastos, 1234</p>
                  <p>Sarandi, Porto Alegre, RS</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="
          flex flex-col md:flex-row
          justify-between items-center
          gap-6 py-8
          text-sm text-gray-mid
        ">
          <p className="text-center md:text-left">
            &copy; {currentYear} Parthenon Tecidos. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6 text-xs md:text-sm">
            <Link
              href="/politica"
              className="
                hover:text-gold transition-colors duration-300
              "
            >
              Privacidade
            </Link>
            <span className="text-gray-mid/50">•</span>
            <Link
              href="/termos"
              className="
                hover:text-gold transition-colors duration-300
              "
            >
              Termos
            </Link>
            <span className="text-gray-mid/50">•</span>
            <span className="text-gray-mid">
              Desenvolvido com ❤️
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}