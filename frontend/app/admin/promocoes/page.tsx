'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import toast from 'react-hot-toast';

interface Produto {
  _id: string;
  nome: string;
  preco: number;
  preco_original: number | null;
  estoque: number;
}

export default function AdminPromocoesPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [busca, setBusca] = useState('');
  const [resultadosBusca, setResultadosBusca] = useState<Produto[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [tipoDesconto, setTipoDesconto] = useState<'percentual' | 'valor'>('percentual');
  const [valorDesconto, setValorDesconto] = useState('');
  const [salvando, setSalvando] = useState(false);

  const apiUrl = getApiUrl();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';

  const carregar = async () => {
    setCarregando(true);
    try {
      const res = await axios.get(`${apiUrl}/api/produtos/vitrine`);
      const promos = res.data.filter((p: Produto) => p.preco_original && p.preco_original > p.preco);
      setProdutos(promos);
    } catch (err) {
      toast.error('Erro ao carregar promoções. Verifique sua conexão e autenticação.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const abrirModal = async () => {
    setShowModal(true);
    setBusca('');
    setProdutoSelecionado(null);
    setValorDesconto('');
    setTipoDesconto('percentual');
    try {
      // Busca todos os produtos ativos (não apenas os da vitrine)
      const res = await axios.get(`${apiUrl}/api/produtos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResultadosBusca(res.data);
    } catch (err) {
      toast.error('Erro ao buscar produtos. Verifique se você é administrador.');
    }
  };

  const filtrar = () => {
    if (!busca.trim()) return resultadosBusca;
    return resultadosBusca.filter(p =>
      p.nome.toLowerCase().includes(busca.toLowerCase())
    );
  };

  const calcularNovoPreco = (precoAtual: number) => {
    const valor = parseFloat(valorDesconto);
    if (isNaN(valor) || valor <= 0) return null;
    if (tipoDesconto === 'percentual') {
      if (valor >= 100) return null;
      return Math.max(0.01, precoAtual * (1 - valor / 100));
    } else {
      return Math.max(0.01, precoAtual - valor);
    }
  };

  const adicionarPromocao = async () => {
    if (!produtoSelecionado) return;
    const novoPreco = calcularNovoPreco(produtoSelecionado.preco);
    if (!novoPreco) {
      toast.error('Informe um desconto válido.');
      return;
    }

    if (!token) {
      toast.error('Token de autenticação não encontrado. Faça login novamente.');
      return;
    }

    setSalvando(true);
    try {
      await axios.put(
        `${apiUrl}/api/produtos/${produtoSelecionado._id}`,
        {
          preco: novoPreco,
          preco_original: produtoSelecionado.preco
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Promoção aplicada!');
      setShowModal(false);
      carregar();
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Erro ao aplicar promoção.';
      toast.error(msg);
    } finally {
      setSalvando(false);
    }
  };

  const removerPromocao = async (produto: Produto) => {
    if (!confirm(`Remover promoção de "${produto.nome}" e restaurar preço original?`)) return;
    if (!token) {
      toast.error('Token não encontrado. Faça login novamente.');
      return;
    }
    try {
      const precoRestaurado = produto.preco_original || produto.preco;
      await axios.put(
        `${apiUrl}/api/produtos/${produto._id}`,
        {
          preco: precoRestaurado,
          preco_original: null
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Promoção removida.');
      carregar();
    } catch (err) {
      toast.error('Erro ao remover promoção.');
    }
  };

  if (carregando) return <p className="p-6 text-gray-500">Carregando...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Promoções</h1>
        <button onClick={abrirModal} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          + Adicionar produto
        </button>
      </div>

      {produtos.length === 0 ? (
        <p className="text-gray-500">Nenhum produto em promoção. Clique em "Adicionar produto" para selecionar um produto e definir o desconto.</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3">Produto</th>
                <th className="p-3">Preço Atual</th>
                <th className="p-3">Preço Original</th>
                <th className="p-3">Desconto</th>
                <th className="p-3">Estoque</th>
                <th className="p-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map(prod => {
                const descontoPercentual = prod.preco_original ? Math.round((1 - prod.preco / prod.preco_original) * 100) : 0;
                const descontoReais = prod.preco_original ? (prod.preco_original - prod.preco).toFixed(2) : '0.00';
                return (
                  <tr key={prod._id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium">{prod.nome}</td>
                    <td className="p-3 font-bold text-green-600">R$ {prod.preco.toFixed(2)}</td>
                    <td className="p-3 text-gray-500 line-through">R$ {prod.preco_original?.toFixed(2)}</td>
                    <td className="p-3">
                      <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                        -{descontoPercentual}% (R$ {descontoReais})
                      </span>
                    </td>
                    <td className="p-3">{prod.estoque}</td>
                    <td className="p-3 text-center space-x-2">
                      <Link href={`/admin/produtos/editar/${prod._id}`} className="text-primary hover:underline text-sm">Editar</Link>
                      <button onClick={() => removerPromocao(prod)} className="text-red-600 hover:underline text-sm">Remover</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Adicionar produto à promoção</h2>
            <input type="text" placeholder="Buscar produto..." value={busca} onChange={e => setBusca(e.target.value)} className="w-full border rounded-lg p-2 mb-4" />
            <ul className="max-h-60 overflow-y-auto border rounded-lg divide-y mb-4">
              {filtrar().map(prod => (
                <li key={prod._id} onClick={() => setProdutoSelecionado(prod)} className={`p-2 cursor-pointer hover:bg-gray-50 text-sm flex justify-between ${produtoSelecionado?._id === prod._id ? 'bg-blue-50' : ''}`}>
                  <span>{prod.nome}</span>
                  <span className="text-gray-500">R$ {prod.preco.toFixed(2)}</span>
                </li>
              ))}
              {filtrar().length === 0 && <li className="p-2 text-gray-400 text-sm">Nenhum produto encontrado.</li>}
            </ul>

            {produtoSelecionado && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-3">
                <p className="font-medium">{produtoSelecionado.nome}</p>
                <p className="text-sm text-gray-600">Preço atual: R$ {produtoSelecionado.preco.toFixed(2)}</p>
                <div>
                  <label className="block text-sm font-medium mb-2">Tipo de desconto</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="tipo" checked={tipoDesconto === 'percentual'} onChange={() => setTipoDesconto('percentual')} />
                      Percentual (%)
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="tipo" checked={tipoDesconto === 'valor'} onChange={() => setTipoDesconto('valor')} />
                      Valor fixo (R$)
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{tipoDesconto === 'percentual' ? 'Desconto (%)' : 'Desconto (R$)'}</label>
                  <input type="number" step="0.01" min="0" value={valorDesconto} onChange={e => setValorDesconto(e.target.value)} className="w-full border rounded-lg p-2" placeholder={tipoDesconto === 'percentual' ? 'Ex: 20' : 'Ex: 5.00'} />
                </div>
                {valorDesconto && !isNaN(parseFloat(valorDesconto)) && (
                  <div className="text-sm text-green-600">
                    Novo preço com desconto: <strong>R$ {calcularNovoPreco(produtoSelecionado.preco)?.toFixed(2) || '—'}</strong>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={adicionarPromocao} disabled={!produtoSelecionado || salvando || !valorDesconto} className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                {salvando ? 'Salvando...' : 'Aplicar promoção'}
              </button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 py-2 rounded-lg hover:bg-gray-300">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}