'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#050A14] mt-24 pt-16 pb-8 md:pt-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* CAMADA 1: NEWSLETTER */}
        <div className="mb-20 md:mb-28 border-b border-white/10 pb-12 md:pb-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif font-light text-2xl md:text-3xl text-white mb-4 tracking-wide">
              Receba nossas novidades
            </h2>
            <p className="text-white/60 font-light text-sm md:text-base max-w-md mx-auto mb-8">
              Cadastre-se para receber atualizações sobre novos lançamentos, coleções exclusivas e ofertas especiais.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#C5A880] transition-all"
                required
              />
              <button
                type="submit"
                className="bg-[#C5A880] text-[#050A14] px-8 py-3 rounded-xl text-sm font-medium tracking-wide hover:bg-[#D4BC9B] transition-all duration-300 whitespace-nowrap"
              >
                Inscrever-se
              </button>
            </form>
          </div>
        </div>

        {/* CAMADA 2: COLUNAS DE NAVEGAÇÃO */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 mb-16 md:mb-24">
          <div>
            <h3 className="font-serif font-light text-2xl tracking-[0.1em] text-white mb-6">
              PARTHENON
              <span className="block text-sm font-light text-white/50 tracking-[0.05em] mt-1">
                TECIDOS FINOS
              </span>
            </h3>
            <p className="text-sm text-white/60 font-light leading-relaxed max-w-xs">
              Elegância e sofisticação em cada metro. Tecidos selecionados para os melhores projetos.
            </p>
          </div>

          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/50 mb-6">
              Suporte
            </h4>
            <ul className="space-y-4 text-sm font-light text-white/60">
              <li><Link href="/sobre" className="hover:text-[#C5A880] transition-colors duration-300">Sobre Nós</Link></li>
              <li><Link href="/faq" className="hover:text-[#C5A880] transition-colors duration-300">FAQ</Link></li>
              <li><Link href="/politica-privacidade" className="hover:text-[#C5A880] transition-colors duration-300">Privacidade</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/50 mb-6">
              Institucional
            </h4>
            <ul className="space-y-4 text-sm font-light text-white/60">
              <li><Link href="/loja" className="hover:text-[#C5A880] transition-colors duration-300">Loja</Link></li>
              <li><Link href="/novidades" className="hover:text-[#C5A880] transition-colors duration-300">Novidades</Link></li>
              <li><Link href="/promocoes" className="hover:text-[#C5A880] transition-colors duration-300">Promoções</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/50 mb-6">
              Atendimento
            </h4>
            <ul className="space-y-4 text-sm font-light text-white/60">
              <li className="leading-relaxed text-pretty">
                Av. Martins Bastos, 1234<br />
                Sarandi, Porto Alegre - RS
              </li>
              <li className="mt-6">
                <a href="mailto:contato@parthenon.com.br" className="hover:text-[#C5A880] transition-colors duration-300">
                  contato@parthenon.com.br
                </a>
              </li>
              <li>
                <a href="tel:5511999999999" className="hover:text-[#C5A880] transition-colors duration-300">
                  (11) 99999-9999
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* CAMADA 3: REDES SOCIAIS */}
        <div className="mb-12 md:mb-16 border-t border-white/10 pt-8 md:pt-10 flex flex-col items-center gap-6">
          <p className="text-xs text-white/40 font-light uppercase tracking-[0.2em]">Siga nossas redes</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-white/60 hover:text-[#C5A880] transition-colors duration-300" aria-label="Instagram">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="#" className="text-white/60 hover:text-[#C5A880] transition-colors duration-300" aria-label="Pinterest">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.65 0-5.793 2.737-5.793 5.563 0 1.102.424 2.285.954 2.928.105.126.12.235.089.358-.061.255-.198.814-.225.929-.073.318-.241.429-.435.312-1.626-.759-2.645-3.131-2.645-5.039 0-4.095 2.977-7.857 8.579-7.857 4.504 0 8.004 3.211 8.004 7.506 0 4.48-2.824 8.083-6.742 8.083-1.315 0-2.551-.685-2.976-1.49l-.807 3.069c-.293 1.125-1.086 2.538-1.616 3.4 1.333.393 2.731.604 4.184.604 6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
            </a>
          </div>
        </div>

        {/* CAMADA 4: COPYRIGHT */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40 font-light">
          <p className="text-center md:text-left">
            &copy; {new Date().getFullYear()} Parthenon Tecidos. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/politica-privacidade" className="hover:text-[#C5A880] transition-colors duration-300">
              Privacidade
            </Link>
            <Link href="/termos" className="hover:text-[#C5A880] transition-colors duration-300">
              Termos
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}