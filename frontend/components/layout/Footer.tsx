'use client';

import Link from 'next/link';
import { MapPin, Mail, Phone, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary-dark border-t border-white/20 text-white">
      
      {/* NEWSLETTER - REFINAMENTO DEFINITIVO */}
      <div className="border-y border-white/20 py-16 md:py-24">
        <div className="main-container flex flex-col items-center justify-center text-center gap-8 md:gap-12">
          
          {/* Título */}
          <h2 className="font-primary font-bold text-4xl md:text-6xl tracking-tight text-white">
            Receba informações exclusivas
          </h2>

          {/* Frase - CORRIGIDA COM !important */}
          <p className="font-secondary text-2xl md:text-4xl leading-snug text-white/80 max-w-5xl mx-auto !text-base md:!text-4xl">
            Cadastre-se para receber novidades, lançamentos e ofertas especiais.
          </p>

          {/* Input e Botão de Envio (Centralizado) */}
          <div className="w-full max-w-2xl relative mt-4">
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              className="w-full border-2 border-white/30 rounded-full px-8 py-5 text-lg font-secondary text-white placeholder:text-white/60 bg-white/10 focus:outline-none focus:border-gold transition-colors pr-16"
            />
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-gold text-primary-dark p-4 rounded-full hover:bg-gold-light transition-colors"
              aria-label="Inscrever-se"
            >
              <Send className="w-6 h-6" strokeWidth={2} />
            </button>
          </div>

          {/* Botão Criar Conta - CORRIGIDO E REFINADO */}
          <div className="mt-2">
            <Link
              href="/cadastro"
              className="inline-block border-2 border-metallic-navy text-metallic-navy px-12 py-4 rounded-full text-lg font-secondary font-bold hover:bg-metallic-navy hover:text-white transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
            >
              Criar sua conta
            </Link>
          </div>

        </div>
      </div>

      {/* COLUNAS */}
      <div className="main-container py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16">
          
          <div>
            <h4 className="font-primary font-bold text-lg mb-6 tracking-wide text-white">
              Institucional
            </h4>
            <ul className="space-y-4 font-secondary text-sm text-white/80">
              <li><Link href="/sobre" className="hover:text-gold transition-colors">Sobre Nós</Link></li>
              <li><Link href="/termos" className="hover:text-gold transition-colors">Termos de Uso</Link></li>
              <li><Link href="/politica-privacidade" className="hover:text-gold transition-colors">Política de Privacidade</Link></li>
              <li><Link href="/trocas" className="hover:text-gold transition-colors">Trocas e Devoluções</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-primary font-bold text-lg mb-6 tracking-wide text-white">
              Atendimento
            </h4>
            <ul className="space-y-4 font-secondary text-sm text-white/80">
              <li><Link href="/faq" className="hover:text-gold transition-colors">FAQ</Link></li>
              <li><Link href="/como-comprar" className="hover:text-gold transition-colors">Como Comprar</Link></li>
              <li><Link href="/contato" className="hover:text-gold transition-colors">Fale Conosco</Link></li>
              <li><Link href="/meus-pedidos" className="hover:text-gold transition-colors">Meus Pedidos</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-primary font-bold text-lg mb-6 tracking-wide text-white">
              Minha Conta
            </h4>
            <ul className="space-y-4 font-secondary text-sm text-white/80">
              <li><Link href="/meu-perfil" className="hover:text-gold transition-colors">Meus Dados</Link></li>
              <li><Link href="/favoritos" className="hover:text-gold transition-colors">Favoritos</Link></li>
              <li><Link href="/pedidos" className="hover:text-gold transition-colors">Histórico</Link></li>
              <li><Link href="/carrinho" className="hover:text-gold transition-colors">Carrinho</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-primary font-bold text-lg mb-6 tracking-wide text-white">
              Contato
            </h4>
            <ul className="space-y-4 font-secondary text-sm text-white/80">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-1" strokeWidth={1.5} />
                <span>Rua dos Tecidos, 123<br />São Paulo – SP</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold flex-shrink-0" strokeWidth={1.5} />
                <a href="mailto:contato@parthenon.com" className="hover:text-gold transition-colors">contato@parthenon.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold flex-shrink-0" strokeWidth={1.5} />
                <a href="tel:5511999999999" className="hover:text-gold transition-colors">(11) 99999-9999</a>
              </li>
            </ul>

            <div className="mt-6 pt-6 border-t border-white/20">
              <span className="font-primary text-xs font-bold uppercase tracking-widest block mb-4 text-white">
                Siga-nos
              </span>
              <div className="flex gap-4">
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:border-gold hover:text-gold transition-all duration-300 hover:scale-110 text-white">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:border-gold hover:text-gold transition-all duration-300 hover:scale-110 text-white">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0-2.88 1.44 1.44 0 0 0 0 2.88z"/></svg>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:border-gold hover:text-gold transition-all duration-300 hover:scale-110 text-white">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.02 22c-.847 0-1.67-.114-2.452-.332l-4.62 1.635 1.572-4.627A9.93 9.93 0 0 1 2 12.02C2 6.496 6.476 2 12.02 2S22 6.496 22 12.02 17.524 22 12.02 22z"/></svg>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:border-gold hover:text-gold transition-all duration-300 hover:scale-110 text-white">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.104c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63A9.936 9.936 0 0024 4.59z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-white/20 bg-primary-dark/90">
        <div className="main-container py-6 md:py-8 flex flex-col md:flex-row items-center justify-between gap-4 font-secondary text-xs text-white/80">
          <p>
            &copy; {new Date().getFullYear()} Parthenon Tecidos. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/politica-privacidade" className="hover:text-gold transition-colors">Política de Privacidade</Link>
            <span className="text-white/30">|</span>
            <Link href="/termos" className="hover:text-gold transition-colors">Termos de Uso</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}