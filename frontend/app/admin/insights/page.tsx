'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import toast from 'react-hot-toast';

interface SugestaoReposicao {
  _id: string;
  nome: string;
  estoque_atual: number;
  alerta_minimo: number;
  media_diaria: string;
  recomendado_comprar: number;
}

interface RankingVenda {
  nome: string;
  total_vendido: number;
  receita: number;
}

interface InsightData {
  sugestoesReposicao: SugestaoReposicao[];
  produtosBaixaPerformance: { _id: string; nome: string }[];
  rankingVendas: RankingVenda[];
  fraseDestaque: string;
}

export default function AdminInsightsPage() {
  const [data, setData] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState(true);

  // assistente de dados (regras manuais)
  const [pergunta, setPergunta] = useState('');
  const [resposta, setResposta] = useState('');
  const [enviandoPergunta, setEnviandoPergunta] = useState(false);

  // IA exclusiva (criativa)
  const [perguntaIA, setPerguntaIA] = useState('');
  const [respostaIA, setRespostaIA] = useState('');
  const [enviandoPerguntaIA, setEnviandoPerguntaIA] = useState(false);

  const apiUrl = getApiUrl();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    if (!token) {
      setLoading(false);
      toast.error('Faça login como administrador.');
      return;
    }

    axios.get(`${apiUrl}/api/admin/insights`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setData(res.data))
      .catch(err => {
        console.error(err);
        toast.error('Erro ao carregar insights');
      })
      .finally(() => setLoading(false));
  }, []);

  const handlePergunta = async () => {
    if (!pergunta.trim()) return;
    const token = localStorage.getItem('token');
    if (!token) { toast.error('Autenticação necessária.'); return; }
    setEnviandoPergunta(true);
    try {
      const res = await axios.post(`${apiUrl}/api/admin/insights/assistente`, { pergunta }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResposta(res.data.resposta);
    } catch (err) {
      setResposta('Erro ao consultar assistente.');
    } finally {
      setEnviandoPergunta(false);
    }
  };

  const handlePerguntaIA = async () => {
    if (!perguntaIA.trim()) return;
    const token = localStorage.getItem('token');
    if (!token) { toast.error('Autenticação necessária.'); return; }
    setEnviandoPerguntaIA(true);
    try {
      const res = await axios.post(`${apiUrl}/api/admin/insights/ia`, { pergunta: perguntaIA }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRespostaIA(res.data.resposta);
    } catch (err: any) {
      const msg = err.response?.data?.resposta || 'Erro ao consultar IA.';
      setRespostaIA(msg);
    } finally {
      setEnviandoPerguntaIA(false);
    }
  };

  if (loading) return <p className="p-8 text-gray-500">Carregando insights...</p>;
  if (!data) return <p className="p-8 text-red-500">Não foi possível carregar os dados.</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">🔮 Insights & Recomendações</h1>

      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-primary font-medium">
        {data.fraseDestaque}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-semibold mb-4">📦 Sugestões de Reposição</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2">Produto</th>
                  <th className="p-2">Estoque</th>
                  <th className="p-2">Média/dia</th>
                  <th className="p-2">Comprar</th>
                </tr>
              </thead>
              <tbody>
                {data.sugestoesReposicao.map(s => (
                  <tr key={s._id} className="border-t hover:bg-gray-50">
                    <td className="p-2 font-medium">{s.nome}</td>
                    <td className="p-2">{s.estoque_atual} m</td>
                    <td className="p-2">{s.media_diaria} m</td>
                    <td className="p-2 font-bold text-primary">{s.recomendado_comprar} m</td>
                  </tr>
                ))}
                {data.sugestoesReposicao.length === 0 && (
                  <tr><td colSpan={4} className="p-4 text-center text-gray-400">Estoques OK.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-semibold mb-4">📉 Produtos com Baixa Performance</h2>
          <ul className="space-y-2">
            {data.produtosBaixaPerformance.map(p => (
              <li key={p._id} className="border-b pb-2 text-gray-700">{p.nome}</li>
            ))}
            {data.produtosBaixaPerformance.length === 0 && (
              <p className="text-gray-400">Todos os produtos tiveram vendas recentes.</p>
            )}
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <h2 className="font-semibold mb-4">🏆 Top 5 Mais Vendidos (30 dias)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2">#</th>
                <th className="p-2">Produto</th>
                <th className="p-2">Qtd Vendida</th>
                <th className="p-2">Receita</th>
              </tr>
            </thead>
            <tbody>
              {data.rankingVendas.map((r, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="p-2 font-bold">{i + 1}º</td>
                  <td className="p-2">{r.nome}</td>
                  <td className="p-2">{r.total_vendido} m</td>
                  <td className="p-2">R$ {r.receita.toFixed(2)}</td>
                </tr>
              ))}
              {data.rankingVendas.length === 0 && (
                <tr><td colSpan={4} className="p-4 text-center text-gray-400">Nenhuma venda no período.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assistente de dados */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h2 className="font-semibold mb-4">🤖 Assistente de Dados</h2>
        <p className="text-sm text-gray-500 mb-4">Pergunte sobre vendas, estoque ou desempenho.</p>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={pergunta}
            onChange={e => setPergunta(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handlePergunta()}
            placeholder="Ex: Qual o produto mais vendido?"
            className="flex-1 border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary"
          />
          <button onClick={handlePergunta} disabled={enviandoPergunta} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50">
            {enviandoPergunta ? '...' : 'Perguntar'}
          </button>
        </div>
        {resposta && (
          <div className="bg-gray-50 rounded-lg p-4 text-gray-800 text-sm">{resposta}</div>
        )}
      </div>

      {/* IA exclusiva */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h2 className="font-semibold mb-4">🤖 Pergunte à IA (criativa)</h2>
        <p className="text-sm text-gray-500 mb-4">Perguntas abertas sobre marketing, tendências e estratégias.</p>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={perguntaIA}
            onChange={e => setPerguntaIA(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handlePerguntaIA()}
            placeholder='Ex: "Sugira uma campanha para o Dia das Mães"'
            className="flex-1 border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary"
          />
          <button onClick={handlePerguntaIA} disabled={enviandoPerguntaIA} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50">
            {enviandoPerguntaIA ? '...' : 'Perguntar'}
          </button>
        </div>
        {respostaIA && (
          <div className="bg-gray-50 rounded-lg p-4 text-gray-800 text-sm whitespace-pre-line">{respostaIA}</div>
        )}
      </div>
    </div>
  );
}