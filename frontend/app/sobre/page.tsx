import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre - Parthenon Tecidos',
  description: 'Conheça a história da Parthenon Tecidos, sua missão e valores.',
};

export default function SobrePage() {
  return (
    <main className="main-container py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif font-light text-3xl md:text-4xl text-[#1a1a1a] mb-8 text-center tracking-wide">
          Sobre a Parthenon Tecidos
        </h1>
        
        <div className="space-y-6 text-[#4a4a4a] font-light leading-relaxed text-sm md:text-base">
          <p>
            Fundada em 2010, a <strong className="font-medium text-[#1a1a1a]">Parthenon Tecidos</strong> nasceu do sonho de oferecer tecidos de 
            qualidade por metro, com atendimento personalizado e preços justos. Nossa loja está localizada 
            no coração de São Paulo, mas atendemos clientes de todo o Brasil através do nosso e‑commerce.
          </p>
          <p>
            Trabalhamos com uma seleção criteriosa de fornecedores nacionais e importados, garantindo 
            produtos que aliam beleza, durabilidade e conforto. Do algodão ao linho, passando por malhas e 
            tecidos finos, temos a solução ideal para suas criações.
          </p>
          
          <h2 className="font-serif font-light text-2xl text-[#1a1a1a] mt-8 mb-4">Nossa missão</h2>
          <p>
            Proporcionar uma experiência de compra excepcional, oferecendo tecidos de alta qualidade 
            e inspirando a criatividade de costureiras, artesãos e amantes da moda.
          </p>
          
          <h2 className="font-serif font-light text-2xl text-[#1a1a1a] mt-8 mb-4">Valores</h2>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Qualidade em cada metro</li>
            <li>Transparência e honestidade</li>
            <li>Atendimento humano e próximo</li>
            <li>Sustentabilidade e responsabilidade social</li>
          </ul>
          
          <h2 className="font-serif font-light text-2xl text-[#1a1a1a] mt-8 mb-4">Visite-nos</h2>
          <p>
            Rua dos Tecidos, 123 – Bairro Centro – São Paulo/SP<br />
            CEP: 01000-000
          </p>
        </div>
      </div>
    </main>
  );
}