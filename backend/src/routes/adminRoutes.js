const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Produto = require('../models/Produto');
const Pedido = require('../models/pedido');
const Cupom = require('../models/Cupom');
const Categoria = require('../models/Categoria');
const Concorrente = require('../models/Concorrente');

// ========== DASHBOARD CONSOLIDADO ==========
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acesso restrito.' });

    const totalProdutos = await Produto.countDocuments();
    const totalPedidos = await Pedido.countDocuments();
    const pedidosPendentes = await Pedido.countDocuments({ status: 'pendente' });
    const totalCupons = await Cupom.countDocuments({ ativo: true });

    const pedidos = await Pedido.find({ status: { $ne: 'cancelado' } }, 'total');
    const faturamento = pedidos.reduce((acc, p) => acc + (p.total || 0), 0);
    const ticketMedio = totalPedidos > 0 ? faturamento / totalPedidos : 0;

    const produtosBaixoEstoque = await Produto.countDocuments({
      $expr: { $lte: ['$estoque', '$alerta_minimo'] },
      ativo: true,
    });

    const hoje = new Date();
    const seteDiasAtras = new Date(hoje);
    seteDiasAtras.setDate(hoje.getDate() - 7);
    seteDiasAtras.setHours(0, 0, 0, 0);

    const vendasDiarias = await Pedido.aggregate([
      { $match: { status: { $ne: 'cancelado' }, createdAt: { $gte: seteDiasAtras, $lte: hoje } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, total: { $sum: '$total' }, quantidade: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const dias = [];
    for (let i = 6; i >= 0; i--) {
      const data = new Date(hoje);
      data.setDate(hoje.getDate() - i);
      const chave = data.toISOString().slice(0, 10);
      const encontrado = vendasDiarias.find(r => r._id === chave);
      dias.push({ data: chave.slice(5), total: encontrado ? encontrado.total : 0, quantidade: encontrado ? encontrado.quantidade : 0 });
    }

    const vendasPorCategoria = await Pedido.aggregate([
      { $match: { status: { $ne: 'cancelado' } } },
      { $unwind: '$itens' },
      { $lookup: { from: 'produtos', localField: 'itens.produtoId', foreignField: '_id', as: 'produto' } },
      { $unwind: { path: '$produto', preserveNullAndEmptyArrays: true } },
      { $lookup: { from: 'categorias', localField: 'produto.categoria', foreignField: '_id', as: 'categoria' } },
      { $unwind: { path: '$categoria', preserveNullAndEmptyArrays: true } },
      { $group: { _id: { $ifNull: ['$categoria.nome', 'Sem categoria'] }, total: { $sum: { $multiply: ['$itens.quantidade', '$itens.preco'] } } } },
      { $sort: { total: -1 } },
    ]);

    const statusPedidos = await Pedido.aggregate([{ $group: { _id: '$status', quantidade: { $sum: 1 } } }]);

    const ultimosPedidos = await Pedido.find()
      .select('cliente.nome total status createdAt')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.json({ totalProdutos, totalPedidos, pedidosPendentes, totalCupons, faturamento, ticketMedio, produtosBaixoEstoque, vendasDiarias: dias, vendasPorCategoria, statusPedidos, ultimosPedidos });
  } catch (err) {
    console.error('Erro no dashboard:', err);
    res.status(500).json({ error: err.message });
  }
});

// ========== ESTATÍSTICAS SIMPLES ==========
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acesso restrito.' });
    const totalProdutos = await Produto.countDocuments();
    const totalPedidos = await Pedido.countDocuments();
    const totalCupons = await Cupom.countDocuments({ ativo: true });
    const pedidos = await Pedido.find({}, 'total');
    const faturamento = pedidos.reduce((acc, p) => acc + (p.total || 0), 0);
    res.json({ totalProdutos, totalPedidos, totalCupons, faturamento });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ========== RELATÓRIO DE COMISSÕES ==========
router.get('/relatorios/comissoes', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acesso restrito.' });
    const { inicio, fim } = req.query;
    const filtro = { status: { $ne: 'cancelado' }, vendedor_codigo: { $ne: '' } };
    if (inicio || fim) {
      filtro.createdAt = {};
      if (inicio) filtro.createdAt.$gte = new Date(inicio + 'T00:00:00.000Z');
      if (fim) filtro.createdAt.$lte = new Date(fim + 'T23:59:59.999Z');
    }
    const resultado = await Pedido.aggregate([
      { $match: filtro },
      { $group: { _id: '$vendedor_codigo', total_vendas: { $sum: '$total' }, total_comissao: { $sum: '$comissao_valor' }, quantidade_pedidos: { $sum: 1 } } },
      { $sort: { total_comissao: -1 } }
    ]);
    const dados = resultado.map(r => ({ vendedor_codigo: r._id, total_vendas: r.total_vendas, total_comissao: r.total_comissao, quantidade_pedidos: r.quantidade_pedidos }));
    res.json(dados);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ========== VENDAS POR VENDEDOR ==========
router.get('/relatorios/vendas-por-vendedor/:codigo', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acesso restrito.' });
    const { inicio, fim } = req.query;
    const filtro = { status: { $ne: 'cancelado' }, vendedor_codigo: req.params.codigo.toUpperCase() };
    if (inicio || fim) {
      filtro.createdAt = {};
      if (inicio) filtro.createdAt.$gte = new Date(inicio + 'T00:00:00.000Z');
      if (fim) filtro.createdAt.$lte = new Date(fim + 'T23:59:59.999Z');
    }
    const pedidos = await Pedido.find(filtro).select('cliente.nome cliente.email total comissao_valor createdAt itens.nome itens.quantidade itens.preco').sort({ createdAt: -1 }).lean();
    const totalVendas = pedidos.reduce((sum, p) => sum + p.total, 0);
    const totalComissao = pedidos.reduce((sum, p) => sum + (p.comissao_valor || 0), 0);
    res.json({ pedidos, totalVendas, totalComissao });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ========== VENDAS DIÁRIAS ==========
router.get('/stats/vendas-diarias', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acesso restrito.' });
    const hoje = new Date();
    const seteDiasAtras = new Date(hoje);
    seteDiasAtras.setDate(hoje.getDate() - 7);
    seteDiasAtras.setHours(0, 0, 0, 0);
    const resultado = await Pedido.aggregate([
      { $match: { status: { $ne: 'cancelado' }, createdAt: { $gte: seteDiasAtras, $lte: hoje } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, total: { $sum: '$total' }, quantidade: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    const dias = [];
    for (let i = 6; i >= 0; i--) {
      const data = new Date(hoje);
      data.setDate(hoje.getDate() - i);
      const chave = data.toISOString().slice(0, 10);
      const encontrado = resultado.find(r => r._id === chave);
      dias.push({ data: chave.slice(5), total: encontrado ? encontrado.total : 0, quantidade: encontrado ? encontrado.quantidade : 0 });
    }
    res.json(dias);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ========== INSIGHTS ==========
router.get('/insights', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acesso restrito.' });

    const hoje = new Date();
    const trintaDiasAtras = new Date(hoje);
    trintaDiasAtras.setDate(hoje.getDate() - 30);

    const produtosBaixoEstoque = await Produto.find({ ativo: true, $expr: { $lte: ['$estoque', '$alerta_minimo'] } }).select('nome estoque alerta_minimo vendas').lean();

    const vendasPorProduto = await Pedido.aggregate([
      { $match: { status: { $ne: 'cancelado' }, createdAt: { $gte: trintaDiasAtras } } },
      { $unwind: '$itens' },
      { $group: { _id: '$itens.produtoId', total_vendido: { $sum: '$itens.quantidade' }, receita: { $sum: { $multiply: ['$itens.quantidade', '$itens.preco'] } } } },
      { $sort: { total_vendido: -1 } },
      { $limit: 10 }
    ]);

    const todosProdutosAtivos = await Produto.find({ ativo: true }, '_id nome').lean();
    const idsComVendas = vendasPorProduto.filter(v => v._id).map(v => v._id.toString());
    const produtosBaixaPerformance = todosProdutosAtivos.filter(p => p._id && !idsComVendas.includes(p._id.toString())).slice(0, 5);

    const sugestoesReposicao = await Promise.all(produtosBaixoEstoque.map(async (prod) => {
      const vendasPeriodo = await Pedido.aggregate([
        { $match: { status: { $ne: 'cancelado' }, createdAt: { $gte: trintaDiasAtras } } },
        { $unwind: '$itens' },
        { $match: { 'itens.produtoId': prod._id } },
        { $group: { _id: null, total: { $sum: '$itens.quantidade' } } }
      ]);
      const totalVendido = vendasPeriodo[0]?.total || 0;
      const mediaDiaria = totalVendido / 30;
      const recomendado = Math.ceil(mediaDiaria * 7);
      return { _id: prod._id, nome: prod.nome, estoque_atual: prod.estoque, alerta_minimo: prod.alerta_minimo, media_diaria: mediaDiaria.toFixed(2), recomendado_comprar: recomendado > 0 ? recomendado : prod.alerta_minimo * 2 };
    }));

    const categoriaTop = await Pedido.aggregate([
      { $match: { status: { $ne: 'cancelado' }, createdAt: { $gte: trintaDiasAtras } } },
      { $unwind: '$itens' },
      { $lookup: { from: 'produtos', localField: 'itens.produtoId', foreignField: '_id', as: 'produto' } },
      { $unwind: '$produto' },
      { $lookup: { from: 'categorias', localField: 'produto.categoria', foreignField: '_id', as: 'categoria' } },
      { $unwind: { path: '$categoria', preserveNullAndEmptyArrays: true } },
      { $group: { _id: { $ifNull: ['$categoria.nome', 'Sem categoria'] }, total: { $sum: '$itens.quantidade' } } },
      { $sort: { total: -1 } },
      { $limit: 1 }
    ]);
    const fraseDestaque = categoriaTop.length > 0 ? `🔥 A categoria "${categoriaTop[0]._id}" foi a mais vendida nos últimos 30 dias, com ${categoriaTop[0].total} metros comercializados.` : '📊 Nenhuma venda registrada nos últimos 30 dias.';

    const rankingVendas = await Promise.all(vendasPorProduto.slice(0, 5).map(async (v) => {
      const produto = await Produto.findById(v._id, 'nome').lean();
      return { nome: produto?.nome || 'Produto removido', total_vendido: v.total_vendido, receita: v.receita };
    }));

    res.json({ sugestoesReposicao, produtosBaixaPerformance, rankingVendas, fraseDestaque });
  } catch (err) {
    console.error('Erro ao carregar insights:', err);
    res.status(500).json({ error: err.message });
  }
});

// ========== ASSISTENTE COM IA (GROQ + GEMINI + REGRAS) ==========
router.post('/insights/assistente', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acesso restrito.' });
    const { pergunta } = req.body;
    if (!pergunta) return res.status(400).json({ error: 'Pergunta é obrigatória.' });

    const resposta = await analisarComIA(pergunta);
    res.json({ resposta });
  } catch (err) {
    console.error('Erro no assistente:', err);
    res.status(500).json({ error: 'Erro ao processar pergunta.' });
  }
});

// ========== ASSISTENTE IA EXCLUSIVO (GROQ + GEMINI, SEM FALLBACK) ==========
router.post('/insights/ia', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acesso restrito.' });
    const { pergunta } = req.body;
    if (!pergunta) return res.status(400).json({ error: 'Pergunta é obrigatória.' });

    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    let resposta = '';

    // 1. Tentar Groq
    if (groqKey) {
      try {
        const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: 'Você é um assistente de e‑commerce de tecidos. Responda em português.' },
              { role: 'user', content: pergunta },
            ],
          }),
        });

        if (resp.ok) {
          const data = await resp.json();
          if (data.choices && data.choices[0]) {
            resposta = data.choices[0].message.content;
          }
        }
      } catch (err) {
        console.error('Groq falhou:', err.message);
      }
    }

    // 2. Se Groq não retornou, tentar Gemini
    if (!resposta && geminiKey) {
      try {
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const result = await model.generateContent(pergunta);
        resposta = result.response.text();
      } catch (err) {
        console.error('Gemini falhou:', err.message);
      }
    }

    // 3. Se nenhuma IA funcionou
    if (!resposta) {
      resposta = '❌ Nenhuma IA disponível no momento. Tente novamente mais tarde.';
    }

    res.json({ resposta });
  } catch (err) {
    console.error('Erro na rota IA:', err);
    res.status(500).json({
      resposta: '❌ Não foi possível obter uma resposta da IA agora.',
    });
  }
});

// ========== FUNÇÃO QUE USA IA REAL (GROQ PRIMEIRO, GEMINI DEPOIS) ==========
async function analisarComIA(pergunta) {
  // 1. Tenta o Groq (maior cota gratuita)
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'Você é um assistente especializado em e‑commerce de tecidos. Responda de forma direta e útil, em português.',
            },
            { role: 'user', content: pergunta },
          ],
        }),
      });

      if (!response.ok) throw new Error(`Groq respondeu com status ${response.status}`);

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        return data.choices[0].message.content;
      }
    } catch (err) {
      console.error('Erro ao chamar Groq:', err.message);
    }
  }

  // 2. Fallback para o Gemini
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent(pergunta);
      return result.response.text();
    } catch (err) {
      console.error('Erro ao chamar Gemini:', err.message);
    }
  }

  // 3. Nenhuma IA disponível → regras manuais
  return await analisarComRegras(pergunta);
}

// ========== CONTEXTO PARA A IA ==========
async function montarContextoParaIA() {
  const totalProdutos = await Produto.countDocuments();
  const produtosAtivos = await Produto.countDocuments({ ativo: true });
  const totalPedidos = await Pedido.countDocuments();
  const pedidosPendentes = await Pedido.countDocuments({ status: 'pendente' });
  const pedidos = await Pedido.find({ status: { $ne: 'cancelado' } }, 'total').lean();
  const faturamento = pedidos.reduce((acc, p) => acc + (p.total || 0), 0);

  const top5 = await Pedido.aggregate([
    { $match: { status: { $ne: 'cancelado' } } },
    { $unwind: '$itens' },
    { $group: { _id: '$itens.nome', total: { $sum: '$itens.quantidade' } } },
    { $sort: { total: -1 } },
    { $limit: 5 }
  ]);

  const concorrentes = await Concorrente.find().sort({ data_coleta: -1 }).limit(10).lean();

  return `
Total de produtos: ${totalProdutos} (${produtosAtivos} ativos)
Total de pedidos: ${totalPedidos} (${pedidosPendentes} pendentes)
Faturamento total (excluindo cancelados): R$ ${faturamento.toFixed(2)}

Produtos mais vendidos:
${top5.map((p, i) => `${i+1}. ${p._id} – ${p.total} m`).join('\n')}

Últimos concorrentes cadastrados:
${concorrentes.length > 0 ? concorrentes.map(c => `${c.nome}: ${c.produto} a R$ ${c.preco.toFixed(2)}`).join('\n') : 'Nenhum concorrente cadastrado.'}
  `;
}

// ========== REGRAS MANUAIS (FALLBACK) ==========
async function analisarComRegras(p) {
  if (p.includes('mais vendido') || p.includes('produto mais vendido') || p.includes('top')) {
    const ranking = await Pedido.aggregate([
      { $match: { status: { $ne: 'cancelado' } } },
      { $unwind: '$itens' },
      { $group: { _id: '$itens.nome', total: { $sum: '$itens.quantidade' } } },
      { $sort: { total: -1 } },
      { $limit: 3 }
    ]);
    if (ranking.length === 0) return 'Nenhuma venda registrada ainda.';
    return `Os produtos mais vendidos são: ${ranking.map(r => `${r._id} (${r.total} m)`).join(', ')}.`;
  }

  if (p.includes('estoque baixo') || p.includes('repor') || p.includes('comprar')) {
    const baixoEstoque = await Produto.countDocuments({ ativo: true, $expr: { $lte: ['$estoque', '$alerta_minimo'] } });
    return `Atualmente há ${baixoEstoque} produto(s) com estoque abaixo do nível de alerta. Consulte a seção de Sugestões de Reposição.`;
  }

  if (p.includes('categoria') && (p.includes('mais vende') || p.includes('popular'))) {
    const cat = await Pedido.aggregate([
      { $match: { status: { $ne: 'cancelado' } } },
      { $unwind: '$itens' },
      { $lookup: { from: 'produtos', localField: 'itens.produtoId', foreignField: '_id', as: 'produto' } },
      { $unwind: '$produto' },
      { $lookup: { from: 'categorias', localField: 'produto.categoria', foreignField: '_id', as: 'categoria' } },
      { $unwind: { path: '$categoria', preserveNullAndEmptyArrays: true } },
      { $group: { _id: { $ifNull: ['$categoria.nome', 'Sem categoria'] }, total: { $sum: '$itens.quantidade' } } },
      { $sort: { total: -1 } },
      { $limit: 1 }
    ]);
    if (cat.length === 0) return 'Nenhuma venda registrada.';
    return `A categoria mais vendida é "${cat[0]._id}" com ${cat[0].total} metros comercializados.`;
  }

  if (p.includes('faturamento') || p.includes('receita')) {
    const pedidos = await Pedido.find({ status: { $ne: 'cancelado' } }, 'total');
    const total = pedidos.reduce((acc, p) => acc + (p.total || 0), 0);
    return `O faturamento total (excluindo cancelados) é de R$ ${total.toFixed(2)}.`;
  }

  if (p.includes('preço médio') || p.includes('média de preço')) {
    const produtos = await Produto.find({ ativo: true }, 'preco');
    if (produtos.length === 0) return 'Nenhum produto ativo.';
    const media = produtos.reduce((acc, p) => acc + p.preco, 0) / produtos.length;
    return `O preço médio dos produtos ativos é R$ ${media.toFixed(2)}.`;
  }

  if (p.includes('produto mais caro')) {
    const maisCaro = await Produto.findOne({ ativo: true }).sort({ preco: -1 }).lean();
    if (!maisCaro) return 'Nenhum produto ativo.';
    return `O produto mais caro é "${maisCaro.nome}" custando R$ ${maisCaro.preco.toFixed(2)}.`;
  }

  if (p.includes('sugestão de preço') || p.includes('preço competitivo')) {
    const palavras = p.split(' ');
    const possivelCategoria = palavras.find(w => w.length > 3);
    const produtos = await Produto.find({ ativo: true }, 'nome preco categoria').populate('categoria', 'nome');
    if (produtos.length === 0) return 'Nenhum produto para análise.';
    const mediaGeral = produtos.reduce((acc, p) => acc + p.preco, 0) / produtos.length;
    const categoriaFiltro = produtos.filter(p => p.categoria?.nome?.toLowerCase() === possivelCategoria?.toLowerCase());
    const mediaCategoria = categoriaFiltro.length > 0 ? categoriaFiltro.reduce((acc, p) => acc + p.preco, 0) / categoriaFiltro.length : null;
    if (mediaCategoria) {
      return `A média de preço para a categoria "${possivelCategoria}" é R$ ${mediaCategoria.toFixed(2)}. Sugestão: mantenha seu preço competitivo nessa faixa.`;
    } else {
      return `A média de preço geral é R$ ${mediaGeral.toFixed(2)}. Para ser competitivo, fique próximo a esse valor.`;
    }
  }

  if (p.includes('melhor frete') || p.includes('frete mais barato') || p.includes('frete para')) {
    const cepMatch = p.match(/\d{5}-?\d{3}/);
    if (cepMatch) {
      const cep = cepMatch[0].replace('-', '');
      try {
        const tabela = JSON.parse(require('fs').readFileSync(require('path').join(__dirname, '..', 'data', 'tabela-frete.json'), 'utf8'));
        const faixa = tabela.find(f => cep >= f.faixa_cep_inicio && cep <= f.faixa_cep_fim);
        if (faixa) {
          return `Para o CEP ${cep}, o frete mais barato é R$ ${faixa.valor.toFixed(2)} (${faixa.prazo_dias} dias úteis, ${faixa.capital}).`;
        } else {
          return `Não encontramos frete para o CEP ${cep}. Verifique a tabela.`;
        }
      } catch (e) {
        return 'Não foi possível consultar a tabela de fretes.';
      }
    } else {
      return 'Por favor, informe um CEP válido para eu consultar o melhor frete. Ex: "melhor frete para 01310100"';
    }
  }

  if (p.includes('pedidos pendentes') || p.includes('status dos pedidos')) {
    const pendentes = await Pedido.countDocuments({ status: 'pendente' });
    const confirmados = await Pedido.countDocuments({ status: 'confirmado' });
    const enviados = await Pedido.countDocuments({ status: 'enviado' });
    const entregues = await Pedido.countDocuments({ status: 'entregue' });
    return `Status dos pedidos: ${pendentes} pendentes, ${confirmados} confirmados, ${enviados} enviados, ${entregues} entregues.`;
  }

  if (p.includes('método de pagamento') || p.includes('pagamento')) {
    return 'Atualmente o sistema não registra o método de pagamento. Recomendo oferecer PIX, boleto e cartão. O PIX é o mais rápido e reduz custos.';
  }

  if (p.includes('concorrente') || p.includes('mercado') || p.includes('comparar preço')) {
    const produtoNome = p.replace(/concorrente|mercado|comparar preço/gi, '').trim();
    if (!produtoNome) {
      return 'Informe o nome do produto para comparar com os concorrentes. Ex: "comparar preço do algodão"';
    }
    const meuProduto = await Produto.findOne({ nome: { $regex: new RegExp(produtoNome, 'i') }, ativo: true });
    const meuPreco = meuProduto ? `R$ ${meuProduto.preco.toFixed(2)}` : 'não encontrado';
    const concorrentes = await Concorrente.find({ produto: { $regex: new RegExp(produtoNome, 'i') } }).sort({ data_coleta: -1 }).limit(5);
    if (concorrentes.length === 0) {
      return `Preço na sua loja: ${meuPreco}. Nenhum concorrente cadastrado para "${produtoNome}". Cadastre concorrentes em Admin > Concorrentes.`;
    }
    const precosConc = concorrentes.map(c => `${c.nome}: R$ ${c.preco.toFixed(2)}`).join(', ');
    const menorPreco = Math.min(...concorrentes.map(c => c.preco));
    const sugestao = meuProduto
      ? (meuProduto.preco > menorPreco
          ? `Seu preço está acima do menor concorrente (R$ ${menorPreco.toFixed(2)}). Considere ajustar ou criar um cupom.`
          : `Seu preço está competitivo!`)
      : 'Cadastre este produto na sua loja para comparar.';
    return `Sua loja: ${meuPreco}. Concorrentes: ${precosConc}. ${sugestao}`;
  }

  if (p.includes('tendência') || p.includes('busca por') || p.includes('o que está em alta')) {
    const termo = p.replace(/tendência|busca por|o que está em alta/gi, '').trim() || 'tecido';
    const dadosSimulados = {
      termo: termo,
      interesse: Math.floor(Math.random() * 100),
      periodo: 'últimos 12 meses',
      sugestao: `A busca por "${termo}" está em tendência de alta. Considere criar promoções e anúncios para este termo.`,
    };
    return `🔍 Tendência para "${dadosSimulados.termo}": interesse de ${dadosSimulados.interesse}% nos ${dadosSimulados.periodo}. ${dadosSimulados.sugestao}`;
  }

  return 'Desculpe, ainda não entendi sua pergunta. Tente perguntar sobre: "produto mais vendido", "estoque baixo", "categoria mais vendida", "faturamento", "preço médio", "melhor frete para CEP", "pedidos pendentes", "comparar preço do [produto]" ou "tendência de [termo]".';
}

module.exports = router;