'use client';

import Link from 'next/link';
import { MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0B1F33] mt-24 border-t border-white/5">
      
      {/* CAMADA 1 – NEWSLETTER (com bastante espaço abaixo) */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 md:pt-32 md:pb-20">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/10 shadow-lg">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
            <div className="lg:max-w-md">
              <h2 className="font-serif font-light text-2xl md:text-3xl text-white tracking-wide">
                Receba nossas novidades
              </h2>
              <p className="text-white/60 font-light text-sm md:text-base leading-relaxed mt-3">
                Cadastre-se para receber lançamentos, coleções exclusivas e ofertas especiais da Parthenon Tecidos.
              </p>
            </div>
            <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="flex-1 sm:w-72 bg-white/10 border border-white/20 rounded-full px-6 py-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#C5A880] transition-all"
              />
              <button className="bg-[#C5A880] text-[#0B1F33] px-8 py-4 rounded-full text-sm font-medium tracking-wide hover:bg-[#D4BC9B] transition-all duration-300 whitespace-nowrap">
                Inscrever-se
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CAMADA 2 – COLUNAS DE NAVEGAÇÃO (TEXTO BRANCO) */}
      <div className="max-w-7xl mx-auto px-6 pb-20 md:pb-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-20 lg:gap-24">
          
          {/* Coluna 1 – Parthenon */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="font-serif font-light text-2xl tracking-[0.1em] text-white">
              PARTHENON
              <span className="block text-sm font-light text-[#C5A880] tracking-[0.05em] mt-1">
                TECIDOS FINOS
              </span>
            </h3>
            <p className="mt-6 text-sm text-white/60 font-light leading-relaxed max-w-xs">
              Elegância e sofisticação em cada metro. Tecidos selecionados para os melhores projetos.
            </p>
          </div>

          {/* Coluna 2 – Suporte */}
          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/80 mb-8">
              Suporte
            </h4>
            <ul className="space-y-4 text-sm font-light text-white/60">
              <li><Link href="/sobre" className="hover:text-[#C5A880] transition-colors">Sobre Nós</Link></li>
              <li><Link href="/faq" className="hover:text-[#C5A880] transition-colors">FAQ</Link></li>
              <li><Link href="/politica-privacidade" className="hover:text-[#C5A880] transition-colors">Privacidade</Link></li>
            </ul>
          </div>

          {/* Coluna 3 – Institucional */}
          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/80 mb-8">
              Institucional
            </h4>
            <ul className="space-y-4 text-sm font-light text-white/60">
              <li><Link href="/loja" className="hover:text-[#C5A880] transition-colors">Loja</Link></li>
              <li><Link href="/novidades" className="hover:text-[#C5A880] transition-colors">Novidades</Link></li>
              <li><Link href="/promocoes" className="hover:text-[#C5A880] transition-colors">Promoções</Link></li>
            </ul>
          </div>

          {/* Coluna 4 – Atendimento */}
          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/80 mb-8">
              Atendimento
            </h4>
            <ul className="space-y-4 text-sm font-light text-white/60">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C5A880]" strokeWidth={1.5} />
                <span className="leading-relaxed">Av. Martins Bastos, 1234<br />Sarandi, Porto Alegre - RS</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C5A880]" strokeWidth={1.5} />
                <a href="mailto:contato@parthenon.com.br" className="hover:text-[#C5A880]">contato@parthenon.com.br</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C5A880]" strokeWidth={1.5} />
                <a href="tel:5511999999999" className="hover:text-[#C5A880]">(11) 99999-9999</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* CAMADA 3 – RODAPÉ FINAL (ÍCONES CIRCULARES + COPYRIGHT) */}
      <div className="border-t border-white/10 mt-8">
        <div className="max-w-7xl mx-auto px-6 py-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-white/60">
          
          <p className="text-center md:text-left">
            &copy; {new Date().getFullYear()} Parthenon Tecidos. Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-4">
            {/* X */}
            <a href="#" target="_blank" rel="noopener" className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white/70 hover:border-[#C5A880] hover:text-[#C5A880] transition-all duration-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
            {/* YouTube */}
            <a href="#" target="_blank" rel="noopener" className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white/70 hover:border-[#C5A880] hover:text-[#C5A880]">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
            </a>
            {/* Instagram */}
            <a href="#" target="_blank" rel="noopener" className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white/70 hover:border-[#C5A880] hover:text-[#C5A880]">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0-2.88 1.44 1.44 0 0 0 0 2.88z" /></svg>
            </a>
            {/* Facebook */}
            <a href="#" target="_blank" rel="noopener" className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white/70 hover:border-[#C5A880] hover:text-[#C5A880]">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
            </a>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/politica-privacidade" className="hover:text-[#C5A880]">Política de Privacidade</Link>
            <Link href="/termos" className="hover:text-[#C5A880]">Termos de Uso</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}