'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#e8e3dc]">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Coluna 1 - Logo */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="font-serif font-light text-2xl tracking-[0.1em] text-[#1a1a1a]">
              PARTHENON
              <span className="block text-sm font-light text-[#8a7a6a] tracking-[0.05em] mt-1">
                TECIDOS FINOS
              </span>
            </h3>
            <p className="mt-4 text-sm text-[#8a7a6a] font-light leading-relaxed max-w-xs">
              Elegância e sofisticação em cada metro.
            </p>
          </div>

          {/* Coluna 2 - Navegação */}
          <div>
            <h4 className="text-xs tracking-[0.1em] uppercase text-[#1a1a1a] font-medium mb-4">
              Navegação
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/loja" className="text-[#8a7a6a] hover:text-[#1a1a1a] transition-colors font-light">
                  Loja
                </Link>
              </li>
              <li>
                <Link href="/novidades" className="text-[#8a7a6a] hover:text-[#1a1a1a] transition-colors font-light">
                  Novidades
                </Link>
              </li>
              <li>
                <Link href="/promocoes" className="text-[#8a7a6a] hover:text-[#1a1a1a] transition-colors font-light">
                  Promoções
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3 - Suporte */}
          <div>
            <h4 className="text-xs tracking-[0.1em] uppercase text-[#1a1a1a] font-medium mb-4">
              Suporte
            </h4>
            <ul className="space-y-2 text-sm text-[#8a7a6a] font-light">
              <li>
                <Link href="/sobre" className="hover:text-[#1a1a1a] transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#1a1a1a] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/politica-privacidade" className="hover:text-[#1a1a1a] transition-colors">
                  Privacidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 4 - Contato */}
          <div>
            <h4 className="text-xs tracking-[0.1em] uppercase text-[#1a1a1a] font-medium mb-4">
              Contato
            </h4>
            <ul className="space-y-2 text-sm text-[#8a7a6a] font-light">
              <li className="leading-relaxed">Av. Martins Bastos, 1234<br />Sarandi, Porto Alegre - RS</li>
              <li className="mt-2">contato@parthenon.com.br</li>
              <li>(11) 99999-9999</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Rodapé Inferior */}
      <div className="border-t border-[#e8e3dc]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-[#8a7a6a] font-light">
          <p>&copy; {new Date().getFullYear()} Parthenon Tecidos. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <Link href="/politica-privacidade" className="hover:text-[#1a1a1a] transition-colors">
              Política de Privacidade
            </Link>
            <span className="text-[#e8e3dc]">|</span>
            <Link href="/termos" className="hover:text-[#1a1a1a] transition-colors">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}