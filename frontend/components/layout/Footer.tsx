'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#e8e3dc] mt-16 md:mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-16">
          
          {/* Coluna 1 - Logo */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <h3 className="font-serif font-light text-2xl tracking-[0.1em] text-[#1a1a1a]">
              PARTHENON
              <span className="block text-sm font-light text-[#8a7a6a] tracking-[0.05em] mt-1">
                TECIDOS FINOS
              </span>
            </h3>
            <p className="mt-6 text-sm text-[#8a7a6a] font-light leading-relaxed max-w-xs">
              Elegância e sofisticação em cada metro.
            </p>
          </div>

          {/* Coluna 2 - Navegação */}
          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#1a1a1a] mb-6">
              Navegação
            </h4>
            <ul className="space-y-3 text-sm font-light text-[#8a7a6a]">
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

          {/* Coluna 3 - Suporte */}
          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#1a1a1a] mb-6">
              Suporte
            </h4>
            <ul className="space-y-3 text-sm font-light text-[#8a7a6a]">
              <li>
                <Link href="/sobre" className="hover:text-[#1a1a1a] transition-colors duration-300">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#1a1a1a] transition-colors duration-300">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/politica-privacidade" className="hover:text-[#1a1a1a] transition-colors duration-300">
                  Privacidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 4 - Contato */}
          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#1a1a1a] mb-6">
              Contato
            </h4>
            <ul className="space-y-3 text-sm font-light text-[#8a7a6a]">
              <li className="leading-relaxed text-pretty">
                Av. Martins Bastos, 1234<br />
                Sarandi, Porto Alegre - RS
              </li>
              <li className="mt-4">contato@parthenon.com.br</li>
              <li>(11) 99999-9999</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Rodapé Inferior */}
      <div className="border-t border-[#e8e3dc] mt-12 md:mt-16">
        <div className="max-w-7xl mx-auto px-6 py-6 md:py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#8a7a6a] font-light">
          <p className="text-center md:text-left">
            &copy; {new Date().getFullYear()} Parthenon Tecidos. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/politica-privacidade" className="hover:text-[#1a1a1a] transition-colors duration-300">
              Política de Privacidade
            </Link>
            <span className="text-[#e8e3dc]">|</span>
            <Link href="/termos" className="hover:text-[#1a1a1a] transition-colors duration-300">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}