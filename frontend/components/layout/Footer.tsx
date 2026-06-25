'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#f8f6f2] border-t border-[#e8e3dc]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* 🔹 LOGO */}
          <div>
            <h3 className="font-serif font-light text-2xl tracking-[0.1em] text-[#1a1a1a]">
              PARTHENON
              <span className="block text-sm font-light text-[#8a7a6a] tracking-[0.05em]">TECIDOS FINOS</span>
            </h3>
            <p className="mt-4 text-sm text-[#4a4a4a] font-light leading-relaxed">
              Tecidos de alta qualidade para moda e decoração. 
              Elegância e sofisticação em cada metro.
            </p>
          </div>

          {/* 🔹 NAVEGAÇÃO */}
          <div>
            <h4 className="text-xs tracking-[0.1em] uppercase text-[#1a1a1a] font-light mb-4">
              Navegação
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/loja" className="text-[#4a4a4a] hover:text-[#1a1a1a] transition-colors font-light">
                  Loja
                </Link>
              </li>
              <li>
                <Link href="/novidades" className="text-[#4a4a4a] hover:text-[#1a1a1a] transition-colors font-light">
                  Novidades
                </Link>
              </li>
              <li>
                <Link href="/promocoes" className="text-[#4a4a4a] hover:text-[#1a1a1a] transition-colors font-light">
                  Promoções
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-[#4a4a4a] hover:text-[#1a1a1a] transition-colors font-light">
                  Sobre Nós
                </Link>
              </li>
            </ul>
          </div>

          {/* 🔹 ATENDIMENTO - ÍCONES SVG INLINE */}
          <div>
            <h4 className="text-xs tracking-[0.1em] uppercase text-[#1a1a1a] font-light mb-4">
              Atendimento
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2 text-[#4a4a4a] font-light">
                {/* 🔹 ÍCONE TELEFONE - SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a7a6a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>(11) 99999-9999</span>
              </li>
              <li className="flex items-start gap-2 text-[#4a4a4a] font-light">
                {/* 🔹 ÍCONE EMAIL - SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a7a6a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span>contato@parthenon.com.br</span>
              </li>
              <li className="flex items-start gap-2 text-[#4a4a4a] font-light">
                {/* 🔹 ÍCONE LOCALIZAÇÃO - SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a7a6a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>São Paulo, SP</span>
              </li>
            </ul>
          </div>

          {/* 🔹 REDES SOCIAIS - TODOS SVG INLINE */}
          <div>
            <h4 className="text-xs tracking-[0.1em] uppercase text-[#1a1a1a] font-light mb-4">
              Redes Sociais
            </h4>
            <div className="flex gap-4">
              {/* 🔹 INSTAGRAM */}
              <a 
                href="#" 
                className="w-10 h-10 flex items-center justify-center border border-[#d4cec4] rounded-full hover:border-[#1a1a1a] transition-colors text-[#8a7a6a] hover:text-[#1a1a1a]"
                aria-label="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* 🔹 YOUTUBE */}
              <a 
                href="#" 
                className="w-10 h-10 flex items-center justify-center border border-[#d4cec4] rounded-full hover:border-[#1a1a1a] transition-colors text-[#8a7a6a] hover:text-[#1a1a1a]"
                aria-label="YouTube"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                </svg>
              </a>

              {/* 🔹 FACEBOOK */}
              <a 
                href="#" 
                className="w-10 h-10 flex items-center justify-center border border-[#d4cec4] rounded-full hover:border-[#1a1a1a] transition-colors text-[#8a7a6a] hover:text-[#1a1a1a]"
                aria-label="Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </div>
            <p className="mt-4 text-xs text-[#8a7a6a] font-light">
              Siga-nos e acompanhe as novidades
            </p>
          </div>
        </div>
      </div>

      {/* 🔹 RODAPÉ INFERIOR */}
      <div className="border-t border-[#e8e3dc] py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-[#8a7a6a] font-light">
            <p>
              &copy; {new Date().getFullYear()} Parthenon Tecidos. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/politica-privacidade" className="hover:text-[#1a1a1a] transition-colors">
                Política de Privacidade
              </Link>
              <span className="text-[#d4cec4]">|</span>
              <Link href="/termos" className="hover:text-[#1a1a1a] transition-colors">
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}