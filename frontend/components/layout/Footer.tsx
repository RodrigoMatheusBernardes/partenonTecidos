'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white pt-16 pb-6 border-t border-[#e5e5e5]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* Grid Principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-[#e5e5e5]">
          
          {/* Coluna 1: Logo e Slogan */}
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col">
              <span className="text-3xl font-serif font-medium tracking-wider text-[#1a1a1a]">
                PARTHENON
              </span>
              <span className="text-lg font-light tracking-widest text-[#666]">
                TECIDOS FINOS
              </span>
            </div>
            <p className="text-sm font-light text-[#8a7a6a] leading-relaxed max-w-xs">
              Elegância e sofisticação em cada metro.
            </p>
          </div>

          {/* Coluna 2: Navegação */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-sm font-medium uppercase tracking-wider text-[#1a1a1a] mb-1">
              Navegação
            </h4>
            <ul className="space-y-2 text-sm font-light text-[#8a7a6a]">
              <li>
                <Link href="/loja" className="hover:text-[#1a1a1a] transition-colors duration-300">
                  Loja
                </Link>
              </li>
              <li>
                <Link href="/novidades" className="hover:text-[#1a1a1a] transition-colors duration-300">
                  Novidades
                </Link>
              </li>
              <li>
                <Link href="/promocoes" className="hover:text-[#1a1a1a] transition-colors duration-300">
                  Promoções
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Contato */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-sm font-medium uppercase tracking-wider text-[#1a1a1a] mb-1">
              Contato
            </h4>
            <div className="space-y-2 text-sm font-light text-[#8a7a6a]">
              <p>Av. Martins Bastos, 1234 – Sarandi</p>
              <p>Porto Alegre, RS</p>
              <a href="mailto:contato@parthenon.com.br" className="block hover:text-[#1a1a1a] transition-colors duration-300">
                contato@parthenon.com.br
              </a>
              <a href="tel:5511999999999" className="block hover:text-[#1a1a1a] transition-colors duration-300">
                (11) 99999-9999
              </a>
            </div>
          </div>
        </div>

        {/* Linha Inferior (Copyright + Links Legais) */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 gap-4 md:gap-0">
          <p className="text-xs md:text-sm font-light text-[#8a7a6a]">
            &copy; 2026 Parthenon Tecidos. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4 text-xs md:text-sm font-light text-[#8a7a6a]">
            <Link href="/privacidade" className="hover:text-[#1a1a1a] transition-colors duration-300">
              Política de Privacidade
            </Link>
            <span className="text-[#e5e5e5]">|</span>
            <Link href="/termos" className="hover:text-[#1a1a1a] transition-colors duration-300">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}