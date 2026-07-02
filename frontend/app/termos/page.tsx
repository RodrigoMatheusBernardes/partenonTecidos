import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termos de Uso - Parthenon Tecidos',
  description: 'Termos e condições de uso do site Parthenon Tecidos.',
};

export default function TermosPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-heading font-bold text-primary mb-6">Termos de Uso</h1>
      <div className="prose max-w-none text-gray-700 space-y-4">
        <p>Última atualização: 07 de maio de 2026</p>
        <h2>1. Aceitação</h2>
        <p>Ao acessar e utilizar o site Parthenon Tecidos, você concorda com estes termos. Caso não concorde, não utilize nossos serviços.</p>
        <h2>2. Cadastro</h2>
        <p>Para realizar compras, você deve criar uma conta fornecendo informações verdadeiras e mantê-las atualizadas. Você é responsável pela segurança de sua senha.</p>
        <h2>3. Produtos e Preços</h2>
        <p>Os preços e disponibilidade estão sujeitos a alterações sem aviso prévio. As imagens são meramente ilustrativas.</p>
        <h2>4. Pagamento e Entrega</h2>
        <p>Os prazos de entrega variam conforme a região e a forma de envio escolhida. A Parthenon se reserva o direito de cancelar pedidos não confirmados.</p>
        <h2>5. Trocas e Devoluções</h2>
        <p>Consulte nossa política de trocas na página de FAQ ou entre em contato conosco.</p>
      </div>
    </main>
  );
}