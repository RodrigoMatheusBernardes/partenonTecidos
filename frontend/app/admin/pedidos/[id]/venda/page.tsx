import { authGet } from '@/lib/auth';
import { notFound } from 'next/navigation';
import PedidoVenda from '@/components/PedidoVenda';

export default async function PedidoVendaPage({ params }: { params: { id: string } }) {
  try {
    const res = await authGet(`/api/pedidos/${params.id}`);
    const pedido = res.data;
    return <PedidoVenda pedido={pedido} />;
  } catch {
    notFound();
  }
}