'use client';

import React from 'react';

interface ItemPedido {
  produtoId: string;
  nome: string;
  preco: number;
  quantidade: number;
  // possíveis campos extras
  codigo?: string;
  referencia?: string;
}

interface Pedido {
  _id: string;
  cliente: { nome: string; email?: string; cpf?: string; telefone?: string; endereco?: string; bairro?: string; cidade?: string; uf?: string; cep?: string };
  itens: ItemPedido[];
  total: number;
  status: string;
  createdAt: string;
  vendedor?: string;
  formaPagamento?: string;
  parcelas?: { vencimento: string; valor: number }[];
  frete?: number;
  desconto?: number;
  subtotal?: number;
  empresa?: {
    nome: string;
    cnpj: string;
    ie: string;
    endereco: string;
    cidade: string;
    uf: string;
    telefone: string;
  };
}

export default function CupomPedido({ pedido }: { pedido: Pedido }) {
  const subtotal = pedido.subtotal ?? pedido.itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0);
  const frete = pedido.frete ?? 0;
  const desconto = pedido.desconto ?? 0;
  const total = pedido.total ?? subtotal + frete - desconto;

  // Dados da empresa (podem vir do pedido ou fixos)
  const empresa = pedido.empresa || {
    nome: 'TÊXTIL PARTENON LTDA',
    cnpj: '01.876.351/0001-11',
    ie: '0962900672',
    endereco: 'AVENIDA MARTINS BASTOS 288, SARANDI',
    cidade: 'PORTO ALEGRE',
    uf: 'RS',
    telefone: '(51) 3339-1080',
  };

  return (
    <div className="cupom">
      <style jsx>{`
        .cupom {
          font-family: 'Courier New', Courier, monospace;
          font-size: 9pt;
          width: 80mm;
          margin: 5mm auto;
          padding: 4mm 3mm;
          background: white;
          border: 1px dashed #666;
          box-sizing: border-box;
        }
        @media print {
          .cupom {
            margin: 0;
            border: none;
            padding: 4mm 3mm;
          }
          body { background: white; margin: 0; }
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
        .gap-1 { margin-bottom: 2px; }
        .gap-2 { margin-bottom: 4px; }
        .text-left { text-align: left; }
        .text-right { text-align: right; }
      `}</style>

      <div className="center">
        <h3 style={{ margin: '2px 0', fontWeight: 'bold', fontSize: '11pt' }}>{empresa.nome}</h3>
        <p style={{ margin: '1px 0', fontSize: '7pt' }}>{empresa.endereco}</p>
        <p style={{ margin: '1px 0', fontSize: '7pt' }}>{empresa.cidade} - {empresa.uf}</p>
        <p style={{ margin: '1px 0', fontSize: '7pt' }}>CNPJ: {empresa.cnpj}  IE: {empresa.ie}</p>
        <p style={{ margin: '1px 0', fontSize: '7pt' }}>Tel: {empresa.telefone}</p>
        <div className="divider" />
        <p style={{ margin: '2px 0' }}><strong>PEDIDO Nº</strong> {pedido._id.slice(-6)}</p>
        <p style={{ margin: '1px 0', fontSize: '7pt' }}><strong>Data:</strong> {new Date(pedido.createdAt).toLocaleString('pt-BR')}</p>
        <div className="divider" />
        <p style={{ margin: '2px 0', fontSize: '8pt' }}><strong>Cliente:</strong> {pedido.cliente.nome}</p>
        {pedido.cliente.cpf && <p style={{ margin: '1px 0', fontSize: '7pt' }}>CPF: {pedido.cliente.cpf}</p>}
        {pedido.cliente.endereco && <p style={{ margin: '1px 0', fontSize: '7pt' }}>End.: {pedido.cliente.endereco}</p>}
        {pedido.cliente.bairro && <p style={{ margin: '1px 0', fontSize: '7pt' }}>Bairro: {pedido.cliente.bairro}</p>}
        {pedido.cliente.cidade && <p style={{ margin: '1px 0', fontSize: '7pt' }}>Cidade: {pedido.cliente.cidade} - {pedido.cliente.uf || ''}</p>}
        {pedido.cliente.telefone && <p style={{ margin: '1px 0', fontSize: '7pt' }}>Fone: {pedido.cliente.telefone}</p>}
        {pedido.vendedor && <p style={{ margin: '1px 0', fontSize: '7pt' }}><strong>Vendedor:</strong> {pedido.vendedor}</p>}
        <div className="divider" />
      </div>

      <div style={{ margin: '4px 0' }}>
        <div className="row" style={{ fontWeight: 'bold', fontSize: '8pt', borderBottom: '1px solid #333', paddingBottom: '2px' }}>
          <span>Produto</span>
          <span>Qtd</span>
          <span>Unit</span>
          <span>Total</span>
        </div>
        {pedido.itens.map((item, idx) => (
          <div key={idx} className="product-detail" style={{ marginBottom: '2px' }}>
            <div className="row-item">
              <span>{item.nome}</span>
              <span>{item.quantidade.toFixed(0)}</span>
              <span>{item.preco.toFixed(2)}</span>
              <span>{(item.preco * item.quantidade).toFixed(2)}</span>
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
            <p style={{ margin: '2px 0' }}><strong>Parcelas:</strong></p>
            {pedido.parcelas.map((p, i) => (
              <div key={i} className="row small">
                <span>{i+1}ª</span>
                <span>{new Date(p.vencimento).toLocaleDateString('pt-BR')}</span>
                <span>R$ {p.valor.toFixed(2)}</span>
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