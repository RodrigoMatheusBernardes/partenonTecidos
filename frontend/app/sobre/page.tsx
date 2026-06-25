import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre - Parthenon Tecidos',
  description: 'Conheça a história da Parthenon Tecidos, sua missão e valores.',
};

export default function SobrePage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-heading font-bold text-primary mb-6">Sobre a Parthenon Tecidos</h1>
      <div className="prose max-w-none text-gray-700 space-y-4">
        <p>
          Fundada em 2010, a <strong>Parthenon Tecidos</strong> nasceu do sonho de oferecer tecidos de 
          qualidade por metro, com atendimento personalizado e preços justos. Nossa loja está localizada 
          no coração de São Paulo, mas atendemos clientes de todo o Brasil através do nosso e‑commerce.
        </p>
        <p>
          Trabalhamos com uma seleção criteriosa de fornecedores nacionais e importados, garantindo 
          produtos que aliam beleza, durabilidade e conforto. Do algodão ao linho, passando por malhas e 
          tecidos finos, temos a solução ideal para suas criações.
        </p>
        <h2 className="text-2xl font-heading font-semibold text-primary mt-8">Nossa missão</h2>
        <p>
          Proporcionar uma experiência de compra excepcional, oferecendo tecidos de alta qualidade 
          e inspirando a criatividade de costureiras, artesãos e amantes da moda.
        </p>
        <h2 className="text-2xl font-heading font-semibold text-primary mt-8">Valores</h2>
        <ul className="list-disc list-inside">
          <li>Qualidade em cada metro</li>
          <li>Transparência e honestidade</li>
          <li>Atendimento humano e próximo</li>
          <li>Sustentabilidade e responsabilidade social</li>
        </ul>
        <h2 className="text-2xl font-heading font-semibold text-primary mt-8">Visite-nos</h2>
        <p>
          Rua dos Tecidos, 123 – Bairro Centro – São Paulo/SP<br />
          CEP: 01000-000
        </p>
      </div>
    </main>
  );
}