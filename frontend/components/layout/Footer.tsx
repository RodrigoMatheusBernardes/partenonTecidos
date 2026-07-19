'use client';

import Link from 'next/link';
import { MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white mt-24 md:mt-32">
      
      {/* ================================================================
          SEÇÃO 1 – NEWSLETTER
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
                {/* Facebook SVG inline */}
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-80 transition-opacity">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                {/* Instagram SVG inline */}
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#E1306C] text-white flex items-center justify-center hover:opacity-80 transition-opacity">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0-2.88 1.44 1.44 0 0 0 0 2.88z" />
                  </svg>
                </a>
                {/* WhatsApp SVG inline */}
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-80 transition-opacity">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.02 22c-.847 0-1.67-.114-2.452-.332l-4.62 1.635 1.572-4.627A9.93 9.93 0 0 1 2 12.02C2 6.496 6.476 2 12.02 2S22 6.496 22 12.02 17.524 22 12.02 22z"/>
                  </svg>
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