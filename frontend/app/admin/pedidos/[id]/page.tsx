'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { authGet, authPut } from '@/lib/auth';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';

interface ItemPedido {
  produtoId: string;
  nome: string;
  preco: number;
  quantidade: number;
}

interface Pedido {
  _id: string;
  cliente: {
    nome: string;
    email: string;
  };
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

const STATUS_OPCOES = ['pendente', 'confirmado', 'enviado', 'entregue', 'cancelado'];

export default function DetalhesPedidoPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [salvandoStatus, setSalvandoStatus] = useState(false);

  const carregarPedido = async () => {
    try {
      const res = await authGet(`/api/pedidos/${id}`);
      setPedido(res.data);
    } catch (err: any) {
      console.error(err);
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        router.push('/login');
      }
      toast.error('Erro ao carregar pedido.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    carregarPedido();
  }, [id]);

  const handleStatusChange = async (novoStatus: string) => {
    if (!pedido || novoStatus === pedido.status) return;
    setSalvandoStatus(true);
    try {
      await authPut(`/api/pedidos/${id}`, { status: novoStatus });
      setPedido(prev => prev ? { ...prev, status: novoStatus } : null);
      toast.success(`Status atualizado para "${novoStatus}"!`);
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Erro ao atualizar status.';
      toast.error(msg);
    } finally {
      setSalvandoStatus(false);
    }
  };

  if (carregando) return <p className="p-8 text-center">Carregando pedido...</p>;
  if (!pedido) return <p className="p-8 text-center text-red-600">Pedido não encontrado.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Pedido #{pedido._id.slice(-6)}</h1>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            href={`/admin/pedidos/${id}/venda`}
            target="_blank"
          >
            Pedido de Venda
          </Button>
          <Button
            variant="secondary"
            size="sm"
            href={`/admin/pedidos/${id}/nota`}
            target="_blank"
          >
            Resumo da Nota
          </Button>
          <Button
            variant="secondary"
            size="sm"
            href={`/admin/pedidos/${id}/cupom`}
            target="_blank"
          >
            Imprimir Cupom
          </Button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div><span className="font-semibold">Cliente:</span> {pedido.cliente?.nome}</div>
          <div><span className="font-semibold">Email:</span> {pedido.cliente?.email}</div>
          <div><span className="font-semibold">Data:</span> {new Date(pedido.createdAt).toLocaleString('pt-BR')}</div>
          <div>
            <span className="font-semibold">Status:</span>
            <div className="flex items-center gap-2 mt-1">
              <select
                value={pedido.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={salvandoStatus}
                className="border rounded px-2 py-1 text-sm bg-white focus:ring-2 focus:ring-primary"
              >
                {STATUS_OPCOES.map(op => (
                  <option key={op} value={op}>{op}</option>
                ))}
              </select>
              {salvandoStatus && <span className="text-xs text-gray-500">Salvando...</span>}
            </div>
          </div>
          {pedido.endereco && <div><span className="font-semibold">Endereço:</span> {pedido.endereco}</div>}
          {pedido.telefone && <div><span className="font-semibold">Telefone:</span> {pedido.telefone}</div>}
          {pedido.cpf && <div><span className="font-semibold">CPF/CNPJ:</span> {pedido.cpf}</div>}
          {pedido.vendedor && <div><span className="font-semibold">Vendedor:</span> {pedido.vendedor}</div>}
          {pedido.transportadora && <div><span className="font-semibold">Transportadora:</span> {pedido.transportadora}</div>}
          {pedido.frete !== undefined && <div><span className="font-semibold">Frete:</span> R$ {pedido.frete.toFixed(2)}</div>}
          {pedido.desconto !== undefined && <div><span className="font-semibold">Desconto:</span> R$ {pedido.desconto.toFixed(2)}</div>}
          {pedido.formaPagamento && <div><span className="font-semibold">Pagamento:</span> {pedido.formaPagamento}</div>}
          {pedido.parcelas && pedido.parcelas.length > 0 && (
            <div className="col-span-2">
              <span className="font-semibold">Parcelas:</span>
              <ul className="list-disc pl-5 mt-1">
                {pedido.parcelas.map((p, i) => (
                  <li key={i}>{new Date(p.vencimento).toLocaleDateString('pt-BR')} - R$ {p.valor.toFixed(2)}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <h2 className="text-xl font-bold mb-4">Itens</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Produto</th>
              <th className="p-2 text-right">Qtd</th>
              <th className="p-2 text-right">Unitário</th>
              <th className="p-2 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {pedido.itens.map((item, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{item.nome}</td>
                <td className="p-2 text-right">{item.quantidade}</td>
                <td className="p-2 text-right">R$ {item.preco.toFixed(2)}</td>
                <td className="p-2 text-right">R$ {(item.preco * item.quantidade).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xl font-bold mt-4 text-right">Total: R$ {pedido.total.toFixed(2)}</p>
      </div>
    </div>
  );
}