'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getApiUrl } from '@/lib/api';
import toast from 'react-hot-toast';

export default function EditarProdutoPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState({
    nome: '',
    preco: '',
    descricao: '',
    estoque: '',
    composicao: '',
    largura_metro: '',
    gramatura: '',
    cuidados: '',
  });
  const [fotos, setFotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`${getApiUrl()}/api/produtos/${id}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          nome: data.nome || '',
          preco: data.preco?.toString() || '',
          descricao: data.descricao || '',
          estoque: data.estoque?.toString() || '',
          composicao: data.atributos?.composicao || '',
          largura_metro: data.atributos?.largura_metro?.toString() || '',
          gramatura: data.atributos?.gramatura?.toString() || '',
          cuidados: data.atributos?.cuidados || '',
        });
        setFotos(data.fotos || []);
        setCarregando(false);
      })
      .catch(err => {
        console.error(err);
        toast.error('Erro ao carregar produto');
        setCarregando(false);
      });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('imagem', file);
    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${getApiUrl()}/api/produtos/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error('Falha no upload');
      const data = await res.json();
      setFotos(prev => [...prev, data.url]);
      toast.success('Imagem enviada!');
    } catch (err: any) {
      toast.error(err.message || 'Erro no upload');
    } finally {
      setUploading(false);
    }
  };

  const removerImagem = (index: number) => {
    setFotos(prev => prev.filter((_, i) => i !== index));
    toast.success('Imagem removida');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.preco) {
      toast.error('Nome e preço são obrigatórios.');
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const body = {
        nome: form.nome,
        preco: parseFloat(form.preco),
        descricao: form.descricao,
        estoque: parseInt(form.estoque) || 0,
        fotos,
        atributos: {
          composicao: form.composicao || undefined,
          largura_metro: form.largura_metro ? parseFloat(form.largura_metro) : undefined,
          gramatura: form.gramatura ? parseInt(form.gramatura) : undefined,
          cuidados: form.cuidados || undefined,
        },
      };
      const res = await fetch(`${getApiUrl()}/api/produtos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Erro ao atualizar produto');
      toast.success('Produto atualizado!');
      router.push('/admin/produtos');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  if (carregando) {
    return <p className="text-center py-12 text-gray-500">Carregando produto...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Editar Produto</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Upload de imagens */}
        <div>
          <label className="block text-sm font-medium mb-1">Imagens do produto</label>
          <div className="flex items-center gap-4 mb-2">
            <label className="bg-indigo-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-indigo-700 transition">
              {uploading ? 'Enviando...' : '📷 Selecionar imagem'}
              <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
            </label>
          </div>
          {fotos.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {fotos.map((url, idx) => (
                <div key={idx} className="relative">
                  <img src={url} alt={`Preview ${idx}`} className="w-20 h-20 object-cover rounded" />
                  <button type="button" onClick={() => removerImagem(idx)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs">×</button>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">Formatos: JPG, PNG, GIF (max 5MB)</p>
        </div>

        {/* Campos básicos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome *</label>
            <input type="text" name="nome" value={form.nome} onChange={handleChange} required className="w-full border rounded-lg p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Preço (R$) *</label>
            <input type="number" step="0.01" name="preco" value={form.preco} onChange={handleChange} required className="w-full border rounded-lg p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Estoque total (metros)</label>
            <input type="number" name="estoque" value={form.estoque} onChange={handleChange} className="w-full border rounded-lg p-2" placeholder="Ex: 100" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descrição</label>
          <textarea name="descricao" value={form.descricao} onChange={handleChange} rows={4} className="w-full border rounded-lg p-2" />
        </div>

        {/* Atributos */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-3">Atributos Técnicos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Composição</label>
              <input type="text" name="composicao" value={form.composicao} onChange={handleChange} className="w-full border rounded-lg p-2" placeholder="Ex: 100% Algodão" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Largura (metros)</label>
              <input type="number" step="0.01" name="largura_metro" value={form.largura_metro} onChange={handleChange} className="w-full border rounded-lg p-2" placeholder="Ex: 1.50" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Gramatura (g/m²)</label>
              <input type="number" name="gramatura" value={form.gramatura} onChange={handleChange} className="w-full border rounded-lg p-2" placeholder="Ex: 200" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Instruções de cuidado</label>
              <input type="text" name="cuidados" value={form.cuidados} onChange={handleChange} className="w-full border rounded-lg p-2" placeholder="Ex: Lavar à máquina" />
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={saving} className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition">
            {saving ? 'Salvando...' : '💾 Salvar Alterações'}
          </button>
          <button type="button" onClick={() => router.back()} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}