'use client';

import React from 'react';

interface ItemPedido {
  produtoId: string;
  nome: string;
  preco: number;
  quantidade: number;
  codigo?: string;
  referencia?: string;
  ncm?: string;
}

interface Pedido {
  _id: string;
  cliente: {
    nome: string;
    email?: string;
    cpf?: string;
    telefone?: string;
    endereco?: string;
    bairro?: string;
    cidade?: string;
    uf?: string;
    cep?: string;
  };
  itens: ItemPedido[];
  total: number;
  subtotal: number;
  frete: number;
  desconto: number;
  status: string;
  createdAt: string;
  vendedor?: string;
  transportadora?: string;
  formaPagamento?: string;
  parcelas?: { vencimento: string; valor: number }[];
  dataEntrega?: string;
  observacao?: string;
  empresa?: {
    nome: string;
    cnpj: string;
    ie: string;
    endereco: string;
    cidade: string;
    uf: string;
    telefone: string;
    email: string;
  };
}

export default function ResumoNotaFiscal({ pedido }: { pedido: Pedido }) {
  const empresa = pedido.empresa || {
    nome: 'TÊXTIL PARTENON LTDA',
    cnpj: '01.876.351/0001-11',
    ie: '0962900672',
    endereco: 'AVENIDA MARTINS BASTOS 288, SARANDI',
    cidade: 'PORTO ALEGRE',
    uf: 'RS',
    telefone: '(51) 3339-1080',
    email: 'contato@partenon.com.br',
  };

  const subtotal = pedido.subtotal ?? pedido.itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0);
  const frete = pedido.frete ?? 0;
  const desconto = pedido.desconto ?? 0;
  const total = pedido.total ?? subtotal + frete - desconto;

  return (
    <div className="documento-nota">
      <style jsx>{`
        .documento-nota {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 9pt;
          max-width: 210mm;
          margin: 15mm auto;
          padding: 8mm 10mm;
          background: white;
          border: 1px solid #aaa;
          box-shadow: 0 0 8px rgba(0,0,0,0.1);
          color: #222;
          line-height: 1.4;
          box-sizing: border-box;
        }
        @media print {
          .documento-nota {
            margin: 0;
            padding: 10mm;
            border: none;
            box-shadow: none;
          }
          body { background: white; margin: 0; }
        }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 6px; margin-bottom: 8px; }
        .header h1 { font-size: 16pt; font-weight: bold; margin: 0; }
        .header p { margin: 2px 0; font-size: 9pt; }
        .info-grid { 
          display: grid; 
          grid-template-columns: 1fr 1fr 1fr; 
          gap: 4px 12px; 
          font-size: 8.5pt; 
          margin-bottom: 8px; 
        }
        .info-grid .label { font-weight: bold; }
        table { width: 100%; border-collapse: collapse; font-size: 8pt; }
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
          margin-top: 8px; 
          text-align: right; 
          font-size: 9pt; 
          border-top: 2px solid #333; 
          padding-top: 6px; 
        }
        .totals p { margin: 2px 0; }
        .totals .total { font-weight: bold; font-size: 11pt; }
        .footer { margin-top: 12px; font-size: 8pt; border-top: 1px solid #888; padding-top: 6px; }
        .footer p { margin: 1px 0; }
        .obs { margin-top: 6px; font-size: 8pt; color: #555; }
        .payment { margin-top: 8px; font-size: 8.5pt; }
      `}</style>

      <div className="header">
        <h1>RESUMO DA NOTA FISCAL</h1>
        <p><strong>Pedido:</strong> {pedido._id}</p>
        <p><strong>Emissão:</strong> {new Date(pedido.createdAt).toLocaleString('pt-BR')}</p>
      </div>

      <div className="info-grid">
        <div><span className="label">Empresa:</span> {empresa.nome}</div>
        <div><span className="label">CNPJ:</span> {empresa.cnpj}</div>
        <div><span className="label">IE:</span> {empresa.ie}</div>
        <div><span className="label">Endereço:</span> {empresa.endereco}</div>
        <div><span className="label">Município:</span> {empresa.cidade} - {empresa.uf}</div>
        <div><span className="label">Fone:</span> {empresa.telefone}</div>
        <div><span className="label">Cliente:</span> {pedido.cliente.nome}</div>
        <div><span className="label">CPF/CNPJ:</span> {pedido.cliente.cpf || '-'}</div>
        <div><span className="label">Telefone:</span> {pedido.cliente.telefone || '-'}</div>
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
              <td>{item.codigo || item.produtoId.slice(-6)}</td>
              <td>{item.nome}</td>
              <td className="text-center">{item.ncm || '-'}</td>
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

      <div className="payment">
        <p><strong>Forma de Pagamento:</strong> {pedido.formaPagamento || 'A VISTA'}</p>
        {pedido.parcelas && pedido.parcelas.length > 0 && (
          <div>
            <p><strong>Parcelas:</strong></p>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '8pt' }}>
              {pedido.parcelas.map((p, i) => (
                <li key={i}>{i+1}ª: {new Date(p.vencimento).toLocaleDateString('pt-BR')} - R$ {p.valor.toFixed(2)}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="footer">
        <p><strong>Transportadora:</strong> {pedido.transportadora || '-'}</p>
        <p><strong>Data Entrega:</strong> {pedido.dataEntrega ? new Date(pedido.dataEntrega).toLocaleDateString('pt-BR') : new Date(pedido.createdAt).toLocaleDateString('pt-BR')}</p>
        <p><strong>Observação:</strong> {pedido.observacao || 'TROCA E DEVOLUÇÃO SOMENTE COM APRESENTAÇÃO DESTE DOCUMENTO NO PRAZO DE 30 DIAS.'}</p>
      </div>

      <div className="obs">
        * Campos fiscais (NCM, CFOP, ICMS, IPI) não disponíveis no sistema atual.
      </div>
    </div>
  );
}