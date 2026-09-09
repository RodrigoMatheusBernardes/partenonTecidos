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
  cliente: { nome: string };
  itens: ItemPedido[];
  total: number;
  createdAt: string;
  vendedor?: string;
  formaPagamento?: string;
  parcelas?: { vencimento: string; valor: number }[];
  frete?: number;
  desconto?: number;
}

export default function CupomPedido({ pedido }: { pedido: Pedido }) {
  const subtotal = pedido.itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0);
  const frete = pedido.frete ?? 0;
  const desconto = pedido.desconto ?? 0;
  const total = pedido.total ?? subtotal + frete - desconto;

  return (
    <div className="cupom">
      <style jsx>{`
        .cupom {
          font-family: 'Courier New', Courier, monospace;
          font-size: 9pt;
          width: 80mm;
          margin: 5mm auto;
          padding: 4mm;
          background: white;
          border: 1px dashed #666;
        }
        @media print {
          .cupom {
            margin: 0;
            border: none;
            padding: 4mm;
          }
          body { background: white; }
        }
        .center { text-align: center; }
        .divider { border-top: 1px dashed #333; margin: 4px 0; }
        .row { display: flex; justify-content: space-between; font-size: 8.5pt; }
        .row-item { display: flex; justify-content: space-between; font-size: 8.5pt; }
        .product-detail { font-size: 8pt; }
        .total { font-weight: bold; font-size: 10pt; }
        .small { font-size: 7pt; }
        .footer { font-size: 6.5pt; }
        .strong { font-weight: bold; }
      `}</style>

      <div className="center">
        <h3 style={{ margin: '2px 0', fontWeight: 'bold', fontSize: '11pt' }}>PARTENON TECIDOS</h3>
        <p style={{ margin: '1px 0', fontSize: '7pt' }}>AV. MARTINS BASTOS 288, SARANDI - POA</p>
        <p style={{ margin: '1px 0', fontSize: '7pt' }}>CNPJ: 01.876.351/0001-11</p>
        <div className="divider" />
        <p style={{ margin: '2px 0' }}><strong>PEDIDO</strong> #{pedido._id.slice(-6)}</p>
        <p style={{ margin: '1px 0', fontSize: '7pt' }}>{new Date(pedido.createdAt).toLocaleString('pt-BR')}</p>
        <p style={{ margin: '1px 0', fontSize: '7pt' }}><strong>Cliente:</strong> {pedido.cliente.nome}</p>
        {pedido.vendedor && <p style={{ margin: '1px 0', fontSize: '7pt' }}><strong>Vendedor:</strong> {pedido.vendedor}</p>}
        <div className="divider" />
      </div>

      <div style={{ margin: '4px 0' }}>
        {pedido.itens.map((item, idx) => (
          <div key={idx} className="product-detail" style={{ marginBottom: '2px' }}>
            <div className="row-item">
              <span>{item.nome}</span>
              <span>{item.quantidade.toFixed(0)} x R$ {item.preco.toFixed(2)}</span>
            </div>
            <div className="row-item" style={{ paddingLeft: '4px' }}>
              <span></span>
              <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="divider" />

      <div className="row">
        <span>Subtotal</span>
        <span>R$ {subtotal.toFixed(2)}</span>
      </div>
      {frete > 0 && (
        <div className="row">
          <span>Frete</span>
          <span>R$ {frete.toFixed(2)}</span>
        </div>
      )}
      {desconto > 0 && (
        <div className="row">
          <span>Desconto</span>
          <span>- R$ {desconto.toFixed(2)}</span>
        </div>
      )}
      <div className="row total">
        <span>TOTAL</span>
        <span>R$ {total.toFixed(2)}</span>
      </div>

      <div className="divider" />

      <div style={{ fontSize: '7.5pt', marginTop: '4px' }}>
        <p style={{ margin: '1px 0' }}><strong>Pagamento:</strong> {pedido.formaPagamento || 'A VISTA'}</p>
        {pedido.parcelas && pedido.parcelas.length > 0 && (
          <div>
            {pedido.parcelas.map((p, i) => (
              <div key={i} className="row small">
                <span>Parcela {i+1}</span>
                <span>{new Date(p.vencimento).toLocaleDateString('pt-BR')} - R$ {p.valor.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="divider" />

      <div className="footer center" style={{ marginTop: '4px' }}>
        <p>Troca/Devolução até 30 dias</p>
        <p>Documento gerado em {new Date().toLocaleString('pt-BR')}</p>
        <p>Obrigado pela preferência!</p>
      </div>
    </div>
  );
}