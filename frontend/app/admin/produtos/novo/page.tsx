'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getApiUrl } from '@/lib/api';
import toast from 'react-hot-toast';

interface Categoria {
  _id: string;
  nome: string;
}

export default function NovoProdutoPage() {
  const router = useRouter();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaId, setCategoriaId] = useState('');
  const [mostrarInputNovaCategoria, setMostrarInputNovaCategoria] = useState(false);
  const [novaCategoriaNome, setNovaCategoriaNome] = useState('');
  const [form, setForm] = useState({
    nome: '',
    preco: '',
    preco_original: '',   // NOVO
    parcelas: '3',        // NOVO
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

  useEffect(() => {
    fetch(`${getApiUrl()}/api/categorias`)
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(console.error);
  }, []);

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
      const apiUrl = getApiUrl();
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/api/produtos/upload`, {
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

  const handleNovaCategoria = () => {
    setMostrarInputNovaCategoria(true);
  };

  const criarCategoria = async () => {
    if (!novaCategoriaNome.trim()) {
      toast.error('Digite um nome para a categoria.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/categorias/admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome: novaCategoriaNome.trim() }),
      });
      if (!res.ok) throw new Error('Erro ao criar categoria');
      const novaCat = await res.json();
      setCategorias(prev => [...prev, novaCat]);
      setCategoriaId(novaCat._id);
      setNovaCategoriaNome('');
      setMostrarInputNovaCategoria(false);
      toast.success('Categoria criada!');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao criar categoria');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.preco) {
      toast.error('Nome e preço são obrigatórios.');
      return;
    }
    setSaving(true);
    try {
      const apiUrl = getApiUrl();
      const token = localStorage.getItem('token');
      const produto = {
        nome: form.nome,
        preco: parseFloat(form.preco),
        preco_original: form.preco_original ? parseFloat(form.preco_original) : null,  // NOVO
        parcelas: parseInt(form.parcelas) || 3,                                       // NOVO
        descricao: form.descricao,
        estoque: parseInt(form.estoque) || 0,
        fotos,
        categoria: categoriaId || null,
        atributos: {
          composicao: form.composicao || undefined,
          largura_metro: form.largura_metro ? parseFloat(form.largura_metro) : undefined,
          gramatura: form.gramatura ? parseInt(form.gramatura) : undefined,
          cuidados: form.cuidados || undefined,
        },
        ativo: true,
      };
      const res = await fetch(`${apiUrl}/api/produtos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(produto),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Erro ao criar produto');
      }
      toast.success('Produto criado com sucesso!');
      router.push('/admin/produtos');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Novo Produto</h1>
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
          {/* NOVOS CAMPOS PROMOCIONAIS */}
          <div>
            <label className="block text-sm font-medium mb-1">Preço Original (R$)</label>
            <input type="number" step="0.01" name="preco_original" value={form.preco_original} onChange={handleChange} className="w-full border rounded-lg p-2" placeholder="Deixe vazio se não houver promoção" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Parcelas</label>
            <input type="number" name="parcelas" value={form.parcelas} onChange={handleChange} className="w-full border rounded-lg p-2" min="1" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Estoque total (metros)</label>
            <input type="number" name="estoque" value={form.estoque} onChange={handleChange} className="w-full border rounded-lg p-2" placeholder="Ex: 100" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Categoria</label>
            <div className="flex gap-2">
              <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} className="flex-1 border rounded-lg p-2 bg-white">
                <option value="">Selecione uma categoria</option>
                {categorias.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.nome}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleNovaCategoria}
                className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                + Nova
              </button>
            </div>
            {mostrarInputNovaCategoria && (
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  placeholder="Nome da nova categoria"
                  value={novaCategoriaNome}
                  onChange={(e) => setNovaCategoriaNome(e.target.value)}
                  className="flex-1 border rounded-lg p-2"
                />
                <button type="button" onClick={criarCategoria} className="bg-primary text-white px-3 py-2 rounded-lg hover:bg-green-700 transition">
                  Salvar
                </button>
                <button type="button" onClick={() => setMostrarInputNovaCategoria(false)} className="bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition">
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descrição</label>
          <textarea name="descricao" value={form.descricao} onChange={handleChange} rows={4} className="w-full border rounded-lg p-2" />
        </div>

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

        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={saving} className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition">
            {saving ? 'Salvando...' : '💾 Salvar Produto'}
          </button>
          <button type="button" onClick={() => router.back()} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}