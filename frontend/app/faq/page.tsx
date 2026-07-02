import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ - Parthenon Tecidos',
  description: 'Perguntas frequentes sobre compras, envio e trocas.',
};

export default function FaqPage() {
  const faqs = [
    {
      q: 'Qual o prazo de entrega?',
      a: 'O prazo varia de acordo com a sua região. Após a confirmação do pagamento, o pedido é processado em até 2 dias úteis e enviado. Você receberá um código de rastreamento por e-mail.',
    },
    {
      q: 'Como faço para trocar um produto?',
      a: 'Se o produto apresentar defeito ou não corresponder ao pedido, entre em contato conosco em até 7 dias após o recebimento. Analisaremos o caso e providenciaremos a troca ou reembolso.',
    },
    {
      q: 'Quais formas de pagamento são aceitas?',
      a: 'Aceitamos cartões de crédito, débito, PIX e boleto bancário. O pagamento via PIX é aprovado instantaneamente.',
    },
    {
      q: 'Posso comprar sem criar uma conta?',
      a: 'Sim! Você pode finalizar a compra como visitante. No entanto, recomendamos criar uma conta para acompanhar seus pedidos e facilitar futuras compras.',
    },
    {
      q: 'Vocês vendem por atacado?',
      a: 'Atendemos tanto varejo quanto atacado. Para compras em grande quantidade, entre em contato para condições especiais.',
    },
  ];

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-heading font-bold text-primary mb-8">Perguntas Frequentes</h1>
      <div className="space-y-6">
        {faqs.map((faq, i) => (
          <details key={i} className="bg-white rounded-lg shadow p-4 group">
            <summary className="font-semibold text-lg cursor-pointer list-none flex justify-between items-center">
              {faq.q}
              <span className="text-primary text-xl">+</span>
            </summary>
            <p className="mt-2 text-gray-600">{faq.a}</p>
          </details>
        ))}
      </div>
    </main>
  );
}