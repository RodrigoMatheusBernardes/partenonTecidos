const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Pedido = require('../models/Pedido');
const Produto = require('../models/Produto');
const Cupom = require('../models/Cupom');
const Vendedor = require('../models/Vendedor');   // <-- NOVO
const authMiddleware = require('../middleware/auth');

// ============================================================
// POST /api/pedidos – Criar pedido (com cupom e vendedor)
// ============================================================
router.post('/', async (req, res) => {
  try {
    const { cliente: clienteBody, itens, cupom, vendedor: codigoVendedor } = req.body;

    // Determinar dados do cliente (token ou corpo)
    let cliente = clienteBody;
    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'parthenon_secret_key_2026');
        cliente = {
          nome: decoded.nome || clienteBody?.nome,
          email: decoded.email || clienteBody?.email,
          telefone: clienteBody?.telefone,
          cep: clienteBody?.cep,
          logradouro: clienteBody?.logradouro,
          numero: clienteBody?.numero,
          complemento: clienteBody?.complemento,
          bairro: clienteBody?.bairro,
          cidade: clienteBody?.cidade,
          estado: clienteBody?.estado
        };
      } catch (err) { /* token inválido, usa corpo */ }
    }

    if (!cliente?.nome || !cliente?.email || !itens?.length) {
      return res.status(400).json({ error: 'Dados do cliente e itens são obrigatórios.' });
    }

    // Calcular total bruto
    let totalBruto = itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0);
    let desconto = 0;
    let cupomCodigo = '';

    // Validar cupom
    if (cupom) {
      const cupomDoc = await Cupom.findOne({ codigo: cupom.toUpperCase(), ativo: true });
      if (!cupomDoc) return res.status(400).json({ error: 'Cupom inválido ou expirado.' });
      if (cupomDoc.validade && new Date(cupomDoc.validade) < new Date()) return res.status(400).json({ error: 'Cupom expirado.' });
      if (totalBruto < (cupomDoc.valor_minimo || 0)) return res.status(400).json({ error: `Pedido mínimo de R$ ${cupomDoc.valor_minimo.toFixed(2)}.` });
      if (cupomDoc.quantidade > 0 && cupomDoc.usados >= cupomDoc.quantidade) return res.status(400).json({ error: 'Cupom esgotado.' });

      desconto = cupomDoc.tipo === 'percentual' ? totalBruto * (cupomDoc.valor / 100) : cupomDoc.valor;
      desconto = Math.min(desconto, totalBruto);
      cupomCodigo = cupomDoc.codigo;
    }

    const total = totalBruto - desconto;

    // --- PROCESSAR VENDEDOR (AGORA DENTRO DA ROTA) ---
    let vendedorId = null;
    let vendedorCodigo = '';
    let comissaoValor = 0;

    if (codigoVendedor) {
      try {
        const vendedor = await Vendedor.findOne({ codigo: codigoVendedor.toUpperCase(), ativo: true });
        if (vendedor) {
          vendedorId = vendedor._id;
          vendedorCodigo = vendedor.codigo;
          comissaoValor = (total * vendedor.comissao_percentual) / 100;
        }
      } catch (e) { /* ignora erro */ }
    }
    // --- FIM VENDEDOR ---

    const pedido = new Pedido({
      cliente,
      itens,
      total,
      cupom_codigo: cupomCodigo,
      desconto,
      status: 'pendente',
      vendedor_id: vendedorId,
      vendedor_codigo: vendedorCodigo,
      comissao_valor: comissaoValor,
    });

    await pedido.save();

    // Abater estoque e reservado
    for (const item of itens) {
      await Produto.findByIdAndUpdate(item.produtoId, {
        $inc: {
          estoque: -(item.quantidade || 0),
          reservado: -(item.quantidade || 0)
        }
      });
    }

    // Incrementar uso do cupom
    if (cupomCodigo) {
      const cupomDoc = await Cupom.findOne({ codigo: cupomCodigo });
      if (cupomDoc) {
        cupomDoc.usados += 1;
        if (cupomDoc.quantidade > 0 && cupomDoc.usados >= cupomDoc.quantidade) cupomDoc.ativo = false;
        await cupomDoc.save();
      }
    }

    res.status(201).json({
      message: 'Pedido criado!',
      pedido_id: pedido._id,
      total,
      desconto,
      cupom: cupomCodigo,
      vendedor: vendedorCodigo,
      comissao_valor: comissaoValor,
    });
  } catch (err) {
    console.error('Erro ao criar pedido:', err);
    res.status(500).json({ error: 'Erro ao processar pedido.' });
  }
});

// ============================================================
// GET /api/pedidos – Listar pedidos do cliente logado (ou todos se admin)
// ============================================================
router.get('/', authMiddleware, async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      query = { 'cliente.email': req.user.email };
    }
    const pedidos = await Pedido.find(query).sort({ createdAt: -1 });
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// GET /api/pedidos/admin – Todos os pedidos (apenas admin)
// ============================================================
router.get('/admin', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acesso restrito.' });
    const pedidos = await Pedido.find().sort({ createdAt: -1 });
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// GET /api/pedidos/:id – Detalhes de um pedido
// ============================================================
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id);
    if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado' });
    if (req.user.role !== 'admin' && pedido.cliente.email !== req.user.email) {
      return res.status(403).json({ error: 'Acesso não autorizado.' });
    }
    res.json(pedido);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// PUT /api/pedidos/:id – Atualizar status (admin)
// ============================================================
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Ação restrita a administradores.' });
    const { status } = req.body;
    const statusPermitidos = ['pendente', 'confirmado', 'enviado', 'entregue', 'cancelado'];
    if (!status || !statusPermitidos.includes(status)) return res.status(400).json({ error: 'Status inválido.' });
    const pedido = await Pedido.findByIdAndUpdate(req.params.id, { status, updatedAt: new Date() }, { new: true });
    if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado.' });
    res.json(pedido);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;