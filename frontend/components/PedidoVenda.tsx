'use client';

import React from 'react';

interface ItemPedido {
  produtoId: string;
  nome: string;
  preco: number;
  quantidade: number;
}

interface Pedido {
  _id: string;
  cliente: { nome: string; email?: string };
  itens: ItemPedido[];
  total: number;
  status: string;
  createdAt: string;
  endereco?: string;
  telefone?: string;
  cpf?: string;
  vendedor?: string;
  transportadora?: string;
  frete?: number;
  desconto?: number;
  formaPagamento?: string;
  parcelas?: { vencimento: string; valor: number }[];
}

export default function PedidoVenda({ pedido }: { pedido: Pedido }) {
  const subtotal = pedido.itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0);
  const frete = pedido.frete ?? 0;
  const desconto = pedido.desconto ?? 0;
  const total = pedido.total ?? subtotal + frete - desconto;

  return (
    <div className="documento-venda">
      <style jsx>{`
        .documento-venda {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 10pt;
          max-width: 210mm;
          margin: 15mm auto;
          padding: 8mm 10mm;
          background: white;
          border: 1px solid #aaa;
          box-shadow: 0 0 8px rgba(0,0,0,0.1);
          color: #222;
          line-height: 1.5;
        }
        @media print {
          .documento-venda {
            margin: 0;
            padding: 10mm;
            border: none;
            box-shadow: none;
          }
          body { background: white; }
        }
        .header { 
          display: flex; 
          justify-content: space-between; 
          border-bottom: 2px solid #333; 
          padding-bottom: 6px; 
          margin-bottom: 10px; 
        }
        .header-left { font-size: 14pt; font-weight: bold; }
        .header-right { text-align: right; font-size: 9pt; }
        .header-right .num-pedido { font-weight: bold; font-size: 11pt; }
        .info-grid { 
          display: grid; 
          grid-template-columns: 1fr 1fr 1fr; 
          gap: 4px 12px; 
          font-size: 9pt; 
          margin-bottom: 10px; 
        }
        .info-grid .label { font-weight: bold; }
        table { width: 100%; border-collapse: collapse; font-size: 8.5pt; }
        table th { 
          background: #d9d9d9; 
          border: 1px solid #888; 
          padding: 4px 5px; 
          text-align: left; 
          font-weight: bold; 
        }
        table td { border: 1px solid #888; padding: 3px 5px; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .totals { 
          margin-top: 10px; 
          text-align: right; 
          font-size: 9pt; 
          border-top: 2px solid #333; 
          padding-top: 6px; 
        }
        .totals p { margin: 2px 0; }
        .totals .total { font-weight: bold; font-size: 11pt; }
        .payment { margin-top: 8px; font-size: 9pt; border-top: 1px solid #ccc; padding-top: 6px; }
        .footer { margin-top: 12px; font-size: 8pt; border-top: 1px solid #888; padding-top: 6px; }
        .footer p { margin: 1px 0; }
        .obs { margin-top: 6px; font-size: 8pt; color: #555; }
        @media print {
          .header-left { font-size: 12pt; }
          .header-right { font-size: 8pt; }
          .info-grid { font-size: 8pt; }
          table { font-size: 7.5pt; }
        }
      `}</style>

      <div className="header">
        <div className="header-left">PEDIDO DE VENDA</div>
        <div className="header-right">
          <div className="num-pedido">Nº {pedido._id.slice(-6)}</div>
          <div>{new Date(pedido.createdAt).toLocaleString('pt-BR')}</div>
        </div>
      </div>

      <div className="info-grid">
        <div><span className="label">Empresa:</span> TÊXTIL PARTENON LTDA</div>
        <div><span className="label">CNPJ:</span> 01.876.351/0001-11</div>
        <div><span className="label">IE:</span> 0962900672</div>
        <div><span className="label">Endereço:</span> AV. MARTINS BASTOS 288, SARANDI</div>
        <div><span className="label">Cidade:</span> PORTO ALEGRE - RS</div>
        <div><span className="label">Tel:</span> (51) 3339-1080</div>
        <div><span className="label">Cliente:</span> {pedido.cliente.nome}</div>
        <div><span className="label">CPF/CNPJ:</span> {pedido.cpf || '-'}</div>
        <div><span className="label">Telefone:</span> {pedido.telefone || '-'}</div>
        <div><span className="label">Endereço:</span> {pedido.endereco || '-'}</div>
        <div><span className="label">Vendedor:</span> {pedido.vendedor || '-'}</div>
        <div><span className="label">Status:</span> {pedido.status}</div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Descrição</th>
            <th>Un.</th>
            <th>Quant.</th>
            <th>Preço Unit.</th>
            <th>Desconto %</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {pedido.itens.map((item, idx) => (
            <tr key={idx}>
              <td>{item.produtoId.slice(-6)}</td>
              <td>{item.nome}</td>
              <td className="text-center">MT</td>
              <td className="text-right">{item.quantidade.toFixed(3)}</td>
              <td className="text-right">{item.preco.toFixed(2)}</td>
              <td className="text-right">0,00</td>
              <td className="text-right">{(item.preco * item.quantidade).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="totals">
        <p>Subtotal: R$ {subtotal.toFixed(2)}</p>
        <p>Frete: R$ {frete.toFixed(2)}</p>
        <p>Desconto: R$ {desconto.toFixed(2)}</p>
        <p className="total">Total: R$ {total.toFixed(2)}</p>
      </div>

      <div className="payment">
        <p><strong>Forma de Pagamento:</strong> {pedido.formaPagamento || 'A VISTA'}</p>
        {pedido.parcelas && pedido.parcelas.length > 0 && (
          <div>
            <p><strong>Parcelas:</strong></p>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '8pt' }}>
              {pedido.parcelas.map((p, i) => (
                <li key={i}>{i+1}ª parcela: {new Date(p.vencimento).toLocaleDateString('pt-BR')} - R$ {p.valor.toFixed(2)}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="footer">
        <p><strong>Transportadora:</strong> {pedido.transportadora || '-'}</p>
        <p><strong>Data Entrega:</strong> {pedido.createdAt ? new Date(pedido.createdAt).toLocaleDateString('pt-BR') : '-'}</p>
        <p><strong>Observação:</strong> TROCA E DEVOLUÇÃO SOMENTE COM APRESENTAÇÃO DESTE DOCUMENTO NO PRAZO DE 30 DIAS.</p>
        <p>Documento gerado em {new Date().toLocaleString('pt-BR')}</p>
      </div>
    </div>
  );
}