import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Mail, Phone, Instagram, Facebook, Youtube, Twitter } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sobre - Parthenon Tecidos',
  description: 'Conheça a história da Parthenon Tecidos, nossa paixão por tecidos de qualidade e nosso compromisso com a excelência.',
};

export default function SobrePage() {
  const whatsappNumber = '5511999999999';
  const whatsappMessage = encodeURIComponent(
    'Olá! Gostaria de mais informações sobre os tecidos da Parthenon.'
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <main className="bg-white">
      {/* ==================== HERO ==================== */}
      <section className="relative py-20 md:py-28 bg-dark-light text-white overflow-hidden">
        {/* Fundo com textura de tecido */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none bg-repeat"
          style={{ backgroundImage: "url('/uploads/sobre/texture-linen.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-light/80 to-dark-light/40" />

        <div className="relative z-10 main-container text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-wide">
            Sobre a Parthenon Tecidos
          </h1>
          <div className="w-20 h-1 bg-gold mx-auto mt-4 mb-6" />
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light">
            Tradição, qualidade e paixão por tecidos que transformam ideias em realidade.
          </p>
        </div>
      </section>

      {/* ==================== TEXTO INSTITUCIONAL ==================== */}
      <section className="py-16 md:py-24 border-b border-gray-mid">
        <div className="main-container max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-dark-light text-center mb-8">
            Nossa História
          </h2>
          <div className="space-y-6 text-text-secondary text-sm md:text-base leading-relaxed">
            <p>
              Fundada em 2010, a <strong className="text-dark-light">Parthenon Tecidos</strong> nasceu do sonho de oferecer tecidos de 
              qualidade por metro, com atendimento personalizado e preços justos. Nossa loja está localizada 
              no coração de São Paulo, mas atendemos clientes de todo o Brasil através do nosso e‑commerce.
            </p>
            <p>
              Trabalhamos com uma seleção criteriosa de fornecedores nacionais e importados, garantindo 
              produtos que aliam beleza, durabilidade e conforto. Do algodão ao linho, passando por malhas e 
              tecidos finos, temos a solução ideal para suas criações.
            </p>
            <p>
              Acreditamos que cada metro de tecido carrega uma história, e é por isso que nos dedicamos 
              a oferecer não apenas produtos, mas uma experiência única de compra. Nossa equipe está sempre 
              pronta para ajudar você a encontrar o material perfeito para seus projetos, seja para moda, 
              decoração ou artesanato.
            </p>
            <p className="text-dark-light font-medium">
              Parthenon Tecidos – a elegância que tece histórias.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== LOCALIZAÇÃO ==================== */}
      <section className="py-16 md:py-24 border-b border-gray-mid">
        <div className="main-container">
          <h2 className="font-serif text-3xl md:text-4xl text-dark-light text-center mb-12">
            Onde Estamos
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* Mapa */}
            <div className="relative h-64 md:h-80 rounded-card overflow-hidden shadow-lg-luxury">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.097!2d-46.6333!3d-23.5505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59a2b4b0f4c1%3A0x8b5f8b5f8b5f8b5f!2sRua%20dos%20Tecidos%2C%20123%20-%20São%20Paulo%2C%20SP!5e0!3m2!1spt-BR!2sbr!4v1700000000000"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização da Parthenon Tecidos"
              />
            </div>

            {/* Informações de endereço */}
            <div className="flex flex-col justify-center space-y-6 p-6 bg-light rounded-card border border-gray-mid">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-gold flex-shrink-0 mt-1" strokeWidth={1.5} />
                <div>
                  <p className="font-medium text-dark-light">Endereço</p>
                  <p className="text-text-secondary text-sm">Rua dos Tecidos, 123 – São Paulo/SP</p>
                  <p className="text-text-secondary text-sm">CEP: 01000-000</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-gold flex-shrink-0 mt-1" strokeWidth={1.5} />
                <div>
                  <p className="font-medium text-dark-light">Telefone</p>
                  <p className="text-text-secondary text-sm">(11) 99999-9999</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-gold flex-shrink-0 mt-1" strokeWidth={1.5} />
                <div>
                  <p className="font-medium text-dark-light">E-mail</p>
                  <p className="text-text-secondary text-sm">contato@parthenon.com</p>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-mid">
                <p className="font-medium text-dark-light">Horário de atendimento</p>
                <p className="text-text-secondary text-sm">Segunda a Sexta, das 9h às 18h</p>
                <p className="text-text-secondary text-sm">Sábado, das 9h às 13h</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CHAMADA PARA CONTATO ==================== */}
      <section className="py-16 md:py-24 bg-light">
        <div className="main-container text-center max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-dark-light mb-4">
            Pronto para encontrar o tecido perfeito?
          </h2>
          <p className="text-text-secondary text-sm md:text-base mb-8">
            Nossa equipe está à disposição para ajudar você a escolher os melhores materiais para seus projetos. 
            Fale conosco pelo WhatsApp ou visite nossa loja física.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-full hover:bg-[#1ebe5d] transition-colors shadow-lg-luxury hover:shadow-xl-luxury"
          >
            <Phone className="w-5 h-5" strokeWidth={2} />
            Falar no WhatsApp
          </a>

          {/* Redes Sociais */}
          <div className="mt-10">
            <p className="text-text-secondary text-sm mb-4">Siga-nos nas redes sociais</p>
            <div className="flex justify-center gap-6">
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-gold transition-colors duration-300">
                <Instagram className="w-7 h-7" strokeWidth={1.5} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-gold transition-colors duration-300">
                <Facebook className="w-7 h-7" strokeWidth={1.5} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-gold transition-colors duration-300">
                <Youtube className="w-7 h-7" strokeWidth={1.5} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-gold transition-colors duration-300">
                <Twitter className="w-7 h-7" strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}