'use client';

import Link from 'next/link';
import { Instagram, Facebook, Youtube, MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#0A1420] to-[#050A14] mt-24 border-t border-white/5">
      
      {/* ============================================================
          CAMADA 1 – NEWSLETTER (ÚNICA, com título refinado)
          ============================================================ */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12 md:pt-32 md:pb-20">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 md:p-12 lg:p-16 border border-white/10 shadow-2xl">
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
              <button className="bg-[#C5A880] text-[#0A1420] px-8 py-4 rounded-full text-sm font-medium tracking-wide hover:bg-[#D4BC9B] transition-all duration-300 whitespace-nowrap">
                Inscrever-se
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          CAMADA 2 – COLUNAS DE NAVEGAÇÃO (Muito respiro após a Newsletter)
          ============================================================ */}
      <div className="max-w-7xl mx-auto px-6 pb-20 md:pb-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-20 lg:gap-24">
          
          {/* Coluna 1 – Parthenon (Identidade) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="font-serif font-light text-2xl tracking-[0.1em] text-white">
              PARTHENON
              <span className="block text-sm font-light text-[#C5A880] tracking-[0.05em] mt-1">
                TECIDOS FINOS
              </span>
            </h3>
            <p className="mt-6 text-sm text-white/50 font-light leading-relaxed max-w-xs">
              Elegância e sofisticação em cada metro. Tecidos selecionados para os melhores projetos.
            </p>
          </div>

          {/* Coluna 2 – Suporte */}
          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/60 mb-8">
              Suporte
            </h4>
            <ul className="space-y-4 text-sm font-light text-white/50">
              <li><Link href="/sobre" className="hover:text-[#C5A880] transition-colors duration-300">Sobre Nós</Link></li>
              <li><Link href="/faq" className="hover:text-[#C5A880] transition-colors duration-300">FAQ</Link></li>
              <li><Link href="/politica-privacidade" className="hover:text-[#C5A880] transition-colors duration-300">Privacidade</Link></li>
            </ul>
          </div>

          {/* Coluna 3 – Institucional */}
          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/60 mb-8">
              Institucional
            </h4>
            <ul className="space-y-4 text-sm font-light text-white/50">
              <li><Link href="/loja" className="hover:text-[#C5A880] transition-colors duration-300">Loja</Link></li>
              <li><Link href="/novidades" className="hover:text-[#C5A880] transition-colors duration-300">Novidades</Link></li>
              <li><Link href="/promocoes" className="hover:text-[#C5A880] transition-colors duration-300">Promoções</Link></li>
            </ul>
          </div>

          {/* Coluna 4 – Atendimento */}
          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/60 mb-8">
              Atendimento
            </h4>
            <ul className="space-y-4 text-sm font-light text-white/50">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C5A880] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <span className="leading-relaxed">Av. Martins Bastos, 1234<br />Sarandi, Porto Alegre - RS</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C5A880] flex-shrink-0" strokeWidth={1.5} />
                <a href="mailto:contato@parthenon.com.br" className="hover:text-[#C5A880] transition-colors">contato@parthenon.com.br</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C5A880] flex-shrink-0" strokeWidth={1.5} />
                <a href="tel:5511999999999" className="hover:text-[#C5A880] transition-colors">(11) 99999-9999</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ============================================================
          CAMADA 3 – REDES SOCIAIS (Com bastante espaço)
          ============================================================ */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-10 md:py-14">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <span className="text-xs font-light text-white/40 tracking-widest uppercase">Siga-nos</span>
            <div className="flex items-center gap-6">
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-[#C5A880] transition-colors duration-300">
                <Instagram className="w-5 h-5" strokeWidth={1.5} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-[#C5A880] transition-colors duration-300">
                <Facebook className="w-5 h-5" strokeWidth={1.5} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-[#C5A880] transition-colors duration-300">
                <Youtube className="w-5 h-5" strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          CAMADA 4 – COPYRIGHT (Base sólida e separada)
          ============================================================ */}
      <div className="border-t border-white/5 bg-[#050A14]">
        <div className="max-w-7xl mx-auto px-6 py-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-white/40 font-light">
          <p className="text-center md:text-left">
            &copy; {new Date().getFullYear()} Parthenon Tecidos. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-8">
            <Link href="/politica-privacidade" className="hover:text-[#C5A880] transition-colors duration-300">
              Política de Privacidade
            </Link>
            <Link href="/termos" className="hover:text-[#C5A880] transition-colors duration-300">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>

    </footer>
  );
}