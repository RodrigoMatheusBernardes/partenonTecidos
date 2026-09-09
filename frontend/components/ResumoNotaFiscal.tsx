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
}

export default function ResumoNotaFiscal({ pedido }: { pedido: Pedido }) {
  const subtotal = pedido.itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0);
  const frete = pedido.frete ?? 0;
  const desconto = pedido.desconto ?? 0;
  const total = pedido.total ?? subtotal + frete - desconto;

  return (
    <div className="documento-nota">
      <style jsx>{`
        .documento-nota {
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
          .documento-nota {
            margin: 0;
            padding: 10mm;
            border: none;
            box-shadow: none;
          }
          body { background: white; }
        }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 6px; margin-bottom: 10px; }
        .header h1 { font-size: 16pt; font-weight: bold; margin: 0; }
        .header p { margin: 2px 0; font-size: 9pt; }
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
        }
        table td { border: 1px solid #888; padding: 3px 5px; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .totals { margin-top: 10px; text-align: right; font-size: 9pt; border-top: 2px solid #333; padding-top: 6px; }
        .totals p { margin: 2px 0; }
        .totals .total { font-weight: bold; font-size: 11pt; }
        .footer { margin-top: 12px; font-size: 8pt; border-top: 1px solid #888; padding-top: 6px; }
        .footer p { margin: 1px 0; }
        .obs { margin-top: 6px; font-size: 8pt; color: #555; }
      `}</style>

      <div className="header">
        <h1>RESUMO DA NOTA FISCAL</h1>
        <p><strong>Pedido:</strong> {pedido._id}</p>
        <p><strong>Emissão:</strong> {new Date(pedido.createdAt).toLocaleString('pt-BR')}</p>
      </div>

      <div className="info-grid">
        <div><span className="label">Cliente:</span> {pedido.cliente.nome}</div>
        <div><span className="label">CPF/CNPJ:</span> {pedido.cpf || '-'}</div>
        <div><span className="label">Telefone:</span> {pedido.telefone || '-'}</div>
        <div><span className="label">Endereço:</span> {pedido.endereco || '-'}</div>
        <div><span className="label">Vendedor:</span> {pedido.vendedor || '-'}</div>
        <div><span className="label">Transportadora:</span> {pedido.transportadora || '-'}</div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Ref.</th>
            <th>Descrição</th>
            <th>NCM</th>
            <th>Un.</th>
            <th>Qtde</th>
            <th>Valor Unit.</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {pedido.itens.map((item, idx) => (
            <tr key={idx}>
              <td>{item.produtoId.slice(-6)}</td>
              <td>{item.nome}</td>
              <td className="text-center">-</td>
              <td className="text-center">MT</td>
              <td className="text-right">{item.quantidade.toFixed(3)}</td>
              <td className="text-right">{item.preco.toFixed(2)}</td>
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

      <div className="footer">
        <p><strong>Pagamento:</strong> {pedido.formaPagamento || 'A VISTA'}</p>
        <p><strong>Status:</strong> {pedido.status}</p>
        <p><strong>Observação:</strong> TROCA E DEVOLUÇÃO SOMENTE COM APRESENTAÇÃO DESTE DOCUMENTO NO PRAZO DE 30 DIAS.</p>
      </div>

      <div className="obs">
        * Campos fiscais (NCM, CFOP, ICMS, IPI) não disponíveis no sistema atual.
      </div>
    </div>
  );
}