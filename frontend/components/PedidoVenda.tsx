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
  natureza?: string;
  unidade?: string;
  descontoPercentual?: number;
  icms?: number;
  ipi?: number;
  valorIpi?: number;
  valorSubs?: number;
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
    contato?: string;
    observacao?: string;
    inscricao?: string;
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
  // campos extras para totais
  somaQuantidade?: number;
  volumes?: number;
  peso?: number;
  totalProdutos?: number;
  descontoPercentual?: number;
  totalIpi?: number;
  outrasDesp?: number;
  seguro?: number;
  totalSubs?: number;
}

export default function PedidoVenda({ pedido }: { pedido: Pedido }) {
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

  const somaQuantidade = pedido.somaQuantidade ?? pedido.itens.reduce((acc, i) => acc + i.quantidade, 0);
  const volumes = pedido.volumes ?? 1;
  const peso = pedido.peso ?? 0;

  return (
    <div className="documento-venda">
      <style jsx>{`
        .documento-venda {
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
          .documento-venda {
            margin: 0;
            padding: 10mm;
            border: none;
            box-shadow: none;
          }
          body { background: white; margin: 0; }
        }
        .header { 
          display: flex; 
          justify-content: space-between; 
          border-bottom: 2px solid #333; 
          padding-bottom: 6px; 
          margin-bottom: 8px; 
        }
        .header-left { font-size: 14pt; font-weight: bold; }
        .header-right { text-align: right; font-size: 9pt; }
        .header-right .num-pedido { font-weight: bold; font-size: 12pt; }
        .info-grid { 
          display: grid; 
          grid-template-columns: 1fr 1fr 1fr; 
          gap: 4px 12px; 
          font-size: 8.5pt; 
          margin-bottom: 8px; 
        }
        .info-grid .label { font-weight: bold; }
        .info-grid .full { grid-column: span 3; }
        .info-grid .half { grid-column: span 2; }
        table { width: 100%; border-collapse: collapse; font-size: 8pt; }
        table th { 
          background: #d9d9d9; 
          border: 1px solid #888; 
          padding: 4px 5px; 
          text-align: left; 
          font-weight: bold; 
          white-space: nowrap;
        }
        table td { border: 1px solid #888; padding: 3px 5px; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .totals { 
          margin-top: 8px; 
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px 16px;
          font-size: 8.5pt;
          border-top: 2px solid #333;
          padding-top: 6px;
        }
        .totals .right { text-align: right; }
        .totals .total { font-weight: bold; font-size: 10pt; }
        .footer { margin-top: 12px; font-size: 8pt; border-top: 1px solid #888; padding-top: 6px; }
        .footer p { margin: 1px 0; }
        .obs { margin-top: 6px; font-size: 8pt; }
        .obs-title { font-weight: bold; }
        .payment { margin-top: 8px; font-size: 8.5pt; border-top: 1px solid #ccc; padding-top: 6px; }
        .payment-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 16px; }
        .small-text { font-size: 7.5pt; }
        .col-3 { grid-column: span 3; }
      `}</style>

      <div className="header">
        <div className="header-left">PEDIDO DE VENDA</div>
        <div className="header-right">
          <div className="num-pedido">Nº {pedido._id.slice(-6)}</div>
          <div>Data: {new Date(pedido.createdAt).toLocaleString('pt-BR')}</div>
        </div>
      </div>

      <div className="info-grid">
        <div><span className="label">Empresa:</span> {empresa.nome}</div>
        <div><span className="label">CNPJ:</span> {empresa.cnpj}</div>
        <div><span className="label">IE:</span> {empresa.ie}</div>
        <div><span className="label">Endereço:</span> {empresa.endereco}</div>
        <div><span className="label">Município:</span> {empresa.cidade} - {empresa.uf}</div>
        <div><span className="label">Fone:</span> {empresa.telefone}</div>
        <div className="full"><span className="label">E-mail:</span> {empresa.email}</div>
      </div>

      <div className="info-grid" style={{ borderTop: '1px solid #ccc', paddingTop: '6px' }}>
        <div><span className="label">Cliente:</span> {pedido.cliente.nome}</div>
        <div><span className="label">CPF/CNPJ:</span> {pedido.cliente.cpf || '-'}</div>
        <div><span className="label">Fone:</span> {pedido.cliente.telefone || '-'}</div>
        <div><span className="label">Endereço:</span> {pedido.cliente.endereco || '-'}</div>
        <div><span className="label">Bairro:</span> {pedido.cliente.bairro || '-'}</div>
        <div><span className="label">Cidade/UF:</span> {pedido.cliente.cidade || ''} {pedido.cliente.uf || ''}</div>
        <div><span className="label">CEP:</span> {pedido.cliente.cep || '-'}</div>
        <div><span className="label">Contato:</span> {pedido.cliente.contato || '-'}</div>
        <div><span className="label">Vendedor:</span> {pedido.vendedor || '-'}</div>
        <div className="full"><span className="label">Observação:</span> {pedido.cliente.observacao || '-'}</div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Referência</th>
            <th>Descrição</th>
            <th>NCM/SH</th>
            <th>Natureza</th>
            <th>UN</th>
            <th>Quant.</th>
            <th>P.Unit.</th>
            <th>%Desc.</th>
            <th>%ICMS</th>
            <th>%IPI</th>
            <th>Vlr.IPI</th>
            <th>Vlr.Subs.</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {pedido.itens.map((item, idx) => (
            <tr key={idx}>
              <td>{item.codigo || item.produtoId.slice(-6)}</td>
              <td>{item.referencia || '-'}</td>
              <td>{item.nome}</td>
              <td className="text-center">{item.ncm || '-'}</td>
              <td className="text-center">{item.natureza || '-'}</td>
              <td className="text-center">{item.unidade || 'MT'}</td>
              <td className="text-right">{item.quantidade.toFixed(3)}</td>
              <td className="text-right">{item.preco.toFixed(2)}</td>
              <td className="text-right">{item.descontoPercentual?.toFixed(2) ?? '0,00'}</td>
              <td className="text-right">{item.icms?.toFixed(2) ?? '0,00'}</td>
              <td className="text-right">{item.ipi?.toFixed(2) ?? '0,00'}</td>
              <td className="text-right">{item.valorIpi?.toFixed(2) ?? '0,00'}</td>
              <td className="text-right">{item.valorSubs?.toFixed(2) ?? '0,00'}</td>
              <td className="text-right">{(item.preco * item.quantidade).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="totals">
        <div><span className="label">Soma Quantidade:</span> {somaQuantidade.toFixed(3)}</div>
        <div><span className="label">Volumes:</span> {volumes}</div>
        <div><span className="label">Peso:</span> {peso.toFixed(2)}</div>
        <div><span className="label">Total Produtos:</span> R$ {subtotal.toFixed(2)}</div>
        <div><span className="label">% Desconto:</span> {pedido.descontoPercentual?.toFixed(2) ?? '0,00'}</div>
        <div><span className="label">Desconto:</span> R$ {desconto.toFixed(2)}</div>
        <div><span className="label">Total IPI:</span> R$ {pedido.totalIpi?.toFixed(2) ?? '0,00'}</div>
        <div><span className="label">Frete:</span> R$ {frete.toFixed(2)}</div>
        <div><span className="label">Outras Desp.:</span> R$ {pedido.outrasDesp?.toFixed(2) ?? '0,00'}</div>
        <div><span className="label">Seguro:</span> R$ {pedido.seguro?.toFixed(2) ?? '0,00'}</div>
        <div><span className="label">Total Subst.:</span> R$ {pedido.totalSubs?.toFixed(2) ?? '0,00'}</div>
        <div className="total"><span className="label">Total do Pedido:</span> R$ {total.toFixed(2)}</div>
      </div>

      <div className="payment">
        <div className="payment-grid">
          <div><span className="label">Condição Pagamento:</span> {pedido.formaPagamento || 'A VISTA'}</div>
          <div><span className="label">Plano:</span> {pedido.formaPagamento || 'A VISTA DINHEIRO'}</div>
          <div><span className="label">Vendedor:</span> {pedido.vendedor || '-'}</div>
          <div><span className="label">Transportador:</span> {pedido.transportadora || '-'}</div>
          <div><span className="label">Data Entrega:</span> {pedido.dataEntrega ? new Date(pedido.dataEntrega).toLocaleDateString('pt-BR') : new Date(pedido.createdAt).toLocaleDateString('pt-BR')}</div>
          <div><span className="label">Frete:</span> Frete por Conta do Destinatário</div>
        </div>
        {pedido.parcelas && pedido.parcelas.length > 0 && (
          <div style={{ marginTop: '4px' }}>
            <span className="label">Parcelas:</span>
            <table style={{ width: 'auto', borderCollapse: 'collapse', fontSize: '8pt', marginTop: '2px' }}>
              <tbody>
                {pedido.parcelas.map((p, i) => (
                  <tr key={i}>
                    <td style={{ padding: '1px 8px 1px 0' }}>{i+1}ª</td>
                    <td style={{ padding: '1px 8px 1px 0' }}>{new Date(p.vencimento).toLocaleDateString('pt-BR')}</td>
                    <td style={{ padding: '1px 0' }}>R$ {p.valor.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="footer">
        <p><strong>Observação:</strong> {pedido.observacao || 'TROCA E DEVOLUÇÃO SOMENTE COM APRESENTAÇÃO DESTE DOCUMENTO NO PRAZO DE 30 DIAS.'}</p>
        <p>Documento gerado em {new Date().toLocaleString('pt-BR')}</p>
      </div>
    </div>
  );
}