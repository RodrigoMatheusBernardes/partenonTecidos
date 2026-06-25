import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contato - Parthenon Tecidos',
  description: 'Entre em contato com a equipe da Parthenon Tecidos.',
};

export default function ContatoPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-heading font-bold text-primary mb-6">Fale Conosco</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4 text-gray-700">
          <p><strong>Telefone:</strong> (11) 99999-9999</p>
          <p><strong>WhatsApp:</strong> (11) 98888-8888</p>
          <p><strong>Email:</strong> contato@parthenon.com</p>
          <p><strong>Horário de atendimento:</strong> Seg a Sex, 9h às 18h</p>
          <p><strong>Endereço:</strong> Rua dos Tecidos, 123 – São Paulo/SP</p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <p className="text-sm text-gray-500 mb-4">
            Prefere enviar uma mensagem? Utilize nosso WhatsApp clicando no botão abaixo.
          </p>
          <a
            href="https://wa.me/5511988888888"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            💬 Falar no WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}