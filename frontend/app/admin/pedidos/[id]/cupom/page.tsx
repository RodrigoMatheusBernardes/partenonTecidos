import { authGet } from '@/lib/auth';
import { notFound } from 'next/navigation';
import CupomPedido from '@/components/CupomPedido';

export default async function CupomPage({ params }: { params: { id: string } }) {
  try {
    const res = await authGet(`/api/pedidos/${params.id}`);
    const pedido = res.data;
    return <CupomPedido pedido={pedido} />;
  } catch {
    notFound();
  }
}