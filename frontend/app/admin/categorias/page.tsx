'use client';

import { useEffect, useState } from 'react';
import { getApiUrl } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminCategoriasPage() {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = getApiUrl();

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${apiUrl}/api/categorias`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setCategorias(data);
        setLoading(false);
      })
      .catch(err => {
        toast.error('Erro ao carregar categorias');
        setLoading(false);
      });
  }, [apiUrl]);

  if (loading) return <p className="p-8 text-center">Carregando...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Categorias</h1>
      <ul className="space-y-2">
        {categorias.map((cat: any) => (
          <li key={cat._id} className="bg-white p-4 rounded shadow">
            {cat.nome}
          </li>
        ))}
      </ul>
    </div>
  );
}