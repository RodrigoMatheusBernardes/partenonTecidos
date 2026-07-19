'use client';

import Link from 'next/link';
import { MapPin, Mail, Phone, Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white mt-24 md:mt-32">
      
      {/* ================================================================
          SEÇÃO 1 – NEWSLETTER (com linhas divisórias no topo e embaixo)
          ================================================================ */}
      <div className="border-y border-[#e8e3dc] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
          <h2 className="font-serif font-light text-2xl md:text-3xl text-[#1a1a1a] tracking-wide whitespace-nowrap">
            Novidades e Promoções
          </h2>
          <div className="w-full md:w-auto flex-1 max-w-lg relative">
            <input
              type="email"
              placeholder="Seu endereço de e-mail"
              className="w-full border border-[#dcd9d4] rounded-sm px-5 py-3.5 text-sm text-[#1a1a1a] placeholder:text-[#8a7a6a] bg-white focus:outline-none focus:border-[#1a1a1a] transition-colors"
            />
            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8a7a6a]" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* ================================================================
          SEÇÃO 2 – COLUNAS DE NAVEGAÇÃO
          ================================================================ */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-16">
          
          {/* Coluna 1 – Institucional */}
          <div>
            <h4 className="font-serif font-light text-lg text-[#1a1a1a] mb-6">
              Institucional
            </h4>
            <ul className="space-y-3 text-sm text-[#4a4a4a] font-light">
              <li><Link href="/sobre" className="hover:text-[#1a1a1a] transition-colors">Sobre Nós</Link></li>
              <li><Link href="/termos" className="hover:text-[#1a1a1a] transition-colors">Termos de Uso</Link></li>
              <li><Link href="/politica-privacidade" className="hover:text-[#1a1a1a] transition-colors">Política de Privacidade</Link></li>
              <li><Link href="/trocas" className="hover:text-[#1a1a1a] transition-colors">Trocas e Devoluções</Link></li>
            </ul>
          </div>

          {/* Coluna 2 – Informações */}
          <div>
            <h4 className="font-serif font-light text-lg text-[#1a1a1a] mb-6">
              Informações
            </h4>
            <ul className="space-y-3 text-sm text-[#4a4a4a] font-light">
              <li><Link href="/como-comprar" className="hover:text-[#1a1a1a] transition-colors">Como Comprar</Link></li>
              <li><Link href="/faq" className="hover:text-[#1a1a1a] transition-colors">Perguntas Frequentes</Link></li>
              <li><Link href="/promocoes" className="hover:text-[#1a1a1a] transition-colors">Promoções</Link></li>
              <li><Link href="/novidades" className="hover:text-[#1a1a1a] transition-colors">Novidades</Link></li>
            </ul>
          </div>

          {/* Coluna 3 – Minha Conta */}
          <div>
            <h4 className="font-serif font-light text-lg text-[#1a1a1a] mb-6">
              Minha Conta
            </h4>
            <ul className="space-y-3 text-sm text-[#4a4a4a] font-light">
              <li><Link href="/meus-pedidos" className="hover:text-[#1a1a1a] transition-colors">Meus Pedidos</Link></li>
              <li><Link href="/favoritos" className="hover:text-[#1a1a1a] transition-colors">Favoritos</Link></li>
              <li><Link href="/meu-perfil" className="hover:text-[#1a1a1a] transition-colors">Meus Dados</Link></li>
            </ul>
          </div>

          {/* Coluna 4 – Contato + Redes Sociais */}
          <div>
            <h4 className="font-serif font-light text-lg text-[#1a1a1a] mb-6">
              Contato
            </h4>
            <ul className="space-y-3 text-sm text-[#4a4a4a] font-light">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#8a7a6a] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <span className="leading-relaxed">Av. Martins Bastos, 1234<br />Sarandi, Porto Alegre - RS</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#8a7a6a] flex-shrink-0" strokeWidth={1.5} />
                <a href="mailto:contato@parthenon.com.br" className="hover:text-[#1a1a1a]">contato@parthenon.com.br</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#8a7a6a] flex-shrink-0" strokeWidth={1.5} />
                <a href="tel:5511999999999" className="hover:text-[#1a1a1a]">(11) 99999-9999</a>
              </li>
            </ul>
            
            <div className="mt-8 pt-6 border-t border-[#e8e3dc]">
              <span className="text-xs font-medium uppercase tracking-widest text-[#8a7a6a] block mb-4">
                Redes Sociais
              </span>
              <div className="flex items-center gap-4">
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-80 transition-opacity">
                  <Facebook className="w-4 h-4" strokeWidth={2} />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#E1306C] text-white flex items-center justify-center hover:opacity-80 transition-opacity">
                  <Instagram className="w-4 h-4" strokeWidth={2} />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-80 transition-opacity">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.02 22c-.847 0-1.67-.114-2.452-.332l-4.62 1.635 1.572-4.627A9.93 9.93 0 0 1 2 12.02C2 6.496 6.476 2 12.02 2S22 6.496 22 12.02 17.524 22 12.02 22z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================
          SEÇÃO 3 – COPYRIGHT
          ================================================================ */}
      <div className="border-t border-[#e8e3dc] py-8 md:py-10 bg-[#f9f9f9]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#8a7a6a] font-light">
          <p className="text-center md:text-left">
            &copy; {new Date().getFullYear()} Parthenon Tecidos. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
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