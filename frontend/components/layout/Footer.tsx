'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white mt-24">
      
      {/* MAIN GRID SECTION */}
      <div className="max-w-7xl mx-auto px-6 pt-28 pb-16 md:pt-32 md:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-24 lg:gap-28">
          
          {/* COLUMN 1 - Brand Identity (Wider, heavy visual anchor) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1 max-w-sm">
            <h3 className="font-serif font-light text-2xl tracking-[0.1em] text-[#1a1a1a]">
              PARTHENON
              <span className="block text-sm font-light text-[#8a7a6a] tracking-[0.05em] mt-1">
                TECIDOS FINOS
              </span>
            </h3>
            <p className="mt-8 text-sm text-[#8a7a6a] font-light leading-relaxed max-w-xs">
              Elegância e sofisticação em cada metro. Tecidos selecionados para os melhores projetos.
            </p>
          </div>

          {/* COLUMN 2 - Core Links (Nav + Support) */}
          <div className="col-span-1 md:col-span-1 lg:col-span-1 flex flex-col gap-12 md:gap-16">
            <div>
              <h4 className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#1a1a1a] mb-8">
                Navegação
              </h4>
              <ul className="space-y-4 text-sm font-light text-[#8a7a6a]">
                <li><Link href="/loja" className="hover:text-[#1a1a1a] transition-colors duration-300">Loja</Link></li>
                <li><Link href="/novidades" className="hover:text-[#1a1a1a] transition-colors duration-300">Novidades</Link></li>
                <li><Link href="/promocoes" className="hover:text-[#1a1a1a] transition-colors duration-300">Promoções</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#1a1a1a] mb-8">
                Suporte
              </h4>
              <ul className="space-y-4 text-sm font-light text-[#8a7a6a]">
                <li><Link href="/sobre" className="hover:text-[#1a1a1a] transition-colors duration-300">Sobre Nós</Link></li>
                <li><Link href="/faq" className="hover:text-[#1a1a1a] transition-colors duration-300">FAQ</Link></li>
                <li><Link href="/politica-privacidade" className="hover:text-[#1a1a1a] transition-colors duration-300">Privacidade</Link></li>
              </ul>
            </div>
          </div>

          {/* COLUMN 3 - Contact Information */}
          <div className="col-span-1 md:col-span-1 lg:col-span-1">
            <div className="mb-12">
              <h4 className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#1a1a1a] mb-8">
                Contato
              </h4>
              <ul className="space-y-4 text-sm font-light text-[#8a7a6a]">
                <li className="leading-relaxed text-pretty">
                  Av. Martins Bastos, 1234<br />
                  Sarandi, Porto Alegre - RS
                </li>
                <li className="mt-6">
                  <a href="mailto:contato@parthenon.com.br" className="hover:text-[#1a1a1a] transition-colors duration-300">
                    contato@parthenon.com.br
                  </a>
                </li>
                <li>
                  <a href="tel:5511999999999" className="hover:text-[#1a1a1a] transition-colors duration-300">
                    (11) 99999-9999
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* SEPARATOR ANCHOR BASE */}
      <div className="border-t border-[#e8e3dc] mt-16 md:mt-20">
        <div className="bg-[#f8f6f2]">
          <div className="max-w-7xl mx-auto px-6 py-12 md:py-14 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#8a7a6a] font-light">
            <p className="text-center md:text-left">
              &copy; {new Date().getFullYear()} Parthenon Tecidos. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-8">
              <Link href="/politica-privacidade" className="hover:text-[#1a1a1a] transition-colors duration-300">
                Política de Privacidade
              </Link>
              <Link href="/termos" className="hover:text-[#1a1a1a] transition-colors duration-300">
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
      
    </footer>
  );
}