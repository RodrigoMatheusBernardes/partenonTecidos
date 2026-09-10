'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { authGet } from '@/lib/auth';
import CupomPedido from '@/components/CupomPedido';

export default function CupomPage() {
  const { id } = useParams<{ id: string }>();
  const [pedido, setPedido] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!id) return;
    authGet(`/api/pedidos/${id}`)
      .then(res => setPedido(res.data))
      .catch(() => setErro('Erro ao carregar pedido.'))
      .finally(() => setCarregando(false));
  }, [id]);

  if (carregando) return <p className="p-8 text-center">Carregando documento...</p>;
  if (erro || !pedido) return <p className="p-8 text-center text-red-600">{erro || 'Pedido não encontrado.'}</p>;

  return <CupomPedido pedido={pedido} />;
}