import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidade - Parthenon Tecidos',
  description: 'Como protegemos seus dados pessoais.',
};

export default function PoliticaPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-heading font-bold text-primary mb-6">Política de Privacidade</h1>
      <div className="prose max-w-none text-gray-700 space-y-4">
        <p>Última atualização: 07 de maio de 2026</p>
        <h2>1. Coleta de dados</h2>
        <p>Coletamos informações como nome, e-mail, endereço e telefone apenas para processamento de pedidos e comunicações essenciais. Não compartilhamos seus dados com terceiros.</p>
        <h2>2. Uso das informações</h2>
        <p>Utilizamos seus dados para:</p>
        <ul>
          <li>Processar e entregar seus pedidos;</li>
          <li>Enviar atualizações sobre o status do pedido;</li>
          <li>Melhorar a experiência de navegação.</li>
        </ul>
        <h2>3. Segurança</h2>
        <p>Adotamos medidas técnicas para proteger seus dados pessoais contra acessos não autorizados.</p>
        <h2>4. Cookies</h2>
        <p>Utilizamos cookies essenciais para o funcionamento da loja (carrinho, autenticação). Nenhum cookie de rastreamento publicitário é usado sem seu consentimento.</p>
        <h2>5. Seus direitos</h2>
        <p>Você pode solicitar a exclusão ou correção dos seus dados a qualquer momento entrando em contato conosco.</p>
      </div>
    </main>
  );
}