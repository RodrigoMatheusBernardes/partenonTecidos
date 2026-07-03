'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* ESQUERDA – LOGO + DESCRIÇÃO */}
          <div>
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

          {/* DIREITA – LINKS + CONTATO */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-xs tracking-[0.1em] uppercase text-[#1a1a1a] font-light mb-4">
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
            <div>
              <h4 className="text-xs tracking-[0.1em] uppercase text-[#1a1a1a] font-light mb-4">
                Contato
              </h4>
              <ul className="space-y-2 text-sm text-[#8a7a6a] font-light">
                <li>Av. Martins Bastos, 1234 – Sarandi</li>
                <li>Porto Alegre, RS</li>
                <li className="mt-3">contato@parthenon.com.br</li>
                <li>(11) 99999-9999</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* RODAPÉ INFERIOR */}
      <div className="border-t border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-[#8a7a6a] font-light">
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