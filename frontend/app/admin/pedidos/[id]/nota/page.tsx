import { authGet } from '@/lib/auth';
import { notFound } from 'next/navigation';
import ResumoNotaFiscal from '@/components/ResumoNotaFiscal';

export default async function ResumoNotaPage({ params }: { params: { id: string } }) {
  try {
    const res = await authGet(`/api/pedidos/${params.id}`);
    const pedido = res.data;
    return <ResumoNotaFiscal pedido={pedido} />;
  } catch {
    notFound();
  }
}