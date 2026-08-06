const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Pedido = require('../models/Pedido');
const Produto = require('../models/Produto');
const Cupom = require('../models/Cupom');
const Vendedor = require('../models/Vendedor');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const {
  isValidEmail,
  normalizeEmail,
  parsePositiveInteger,
  sanitizeObject,
  sanitizeText,
  validateObjectId,
} = require('../utils/validation');

async function getSellerIdentity(userEmail) {
  const email = normalizeEmail(userEmail);
  if (!email) return null;
  return Vendedor.findOne({ email, ativo: true }).select('_id codigo').lean();
}

async function buildPedidoItens(rawItens) {
  if (!Array.isArray(rawItens) || rawItens.length === 0) {
    throw new Error('Itens do pedido são obrigatórios.');
  }

  const normalized = rawItens.map((item) => ({
    produtoId: typeof item?.produtoId === 'string' ? item.produtoId : (typeof item?.id === 'string' ? item.id : ''),
    quantidade: parsePositiveInteger(item?.quantidade, 0, 100),
  }));

  if (normalized.some((item) => !validateObjectId(item.produtoId) || item.quantidade < 1)) {
    throw new Error('Itens do pedido inválidos.');
  }

  const produtoIds = [...new Set(normalized.map((item) => item.produtoId))];
  const produtos = await Produto.find({
    _id: mongoose.trusted({ $in: produtoIds }),
    ativo: true,
  }).lean();

  if (produtos.length !== produtoIds.length) {
    throw new Error('Um ou mais produtos não estão disponíveis.');
  }

  const produtoMap = new Map(produtos.map((produto) => [produto._id.toString(), produto]));

  const itens = normalized.map((item) => {
    const produto = produtoMap.get(item.produtoId);
    const disponivel = Math.max(0, (produto.estoque || 0) - (produto.reservado || 0));
    if (item.quantidade > (produto.estoque || 0) || item.quantidade > (disponivel + (produto.reservado || 0))) {
      throw new Error(`Estoque insuficiente para ${produto.nome}.`);
    }

    return {
      produtoId: produto._id,
      nome: produto.nome,
      preco: Number(produto.preco),
      quantidade: item.quantidade,
    };
  });

  return itens;
}

// ============================================================
// POST /api/pedidos – Criar pedido (com cupom e vendedor)
// ============================================================
router.post('/', authMiddleware, async (req, res) => {
  try {
    const payload = sanitizeObject(req.body);
    const { cliente: clienteBody, cupom, vendedor: codigoVendedor } = payload;
    const itens = await buildPedidoItens(payload.itens);

    const authUser = await User.findById(req.user.id).select('nome email').lean();
    if (!authUser) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    let cliente = {
      nome: authUser.nome || clienteBody?.nome,
      email: authUser.email,
      telefone: clienteBody?.telefone,
      cep: clienteBody?.cep,
      logradouro: clienteBody?.logradouro,
      numero: clienteBody?.numero,
      complemento: clienteBody?.complemento,
      bairro: clienteBody?.bairro,
      cidade: clienteBody?.cidade,
      estado: clienteBody?.estado,
    };

    cliente = {
      nome: sanitizeText(cliente?.nome, 120),
      email: normalizeEmail(cliente?.email),
      telefone: sanitizeText(cliente?.telefone, 30),
      cep: sanitizeText(cliente?.cep, 20),
      logradouro: sanitizeText(cliente?.logradouro, 120),
      numero: sanitizeText(cliente?.numero, 20),
      complemento: sanitizeText(cliente?.complemento, 120),
      bairro: sanitizeText(cliente?.bairro, 80),
      cidade: sanitizeText(cliente?.cidade, 80),
      estado: sanitizeText(cliente?.estado, 40),
    };

    if (!cliente?.nome || !cliente?.email || !itens?.length) {
      return res.status(400).json({ error: 'Dados do cliente e itens são obrigatórios.' });
    }
    if (!isValidEmail(cliente.email)) {
      return res.status(400).json({ error: 'E-mail do cliente inválido.' });
    }

    let totalBruto = itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0);
    let desconto = 0;
    let cupomCodigo = '';

    if (cupom) {
      const cupomNormalizado = sanitizeText(cupom, 50).toUpperCase();
      const cupomDoc = await Cupom.findOne({ codigo: cupomNormalizado, ativo: true });
      if (!cupomDoc) return res.status(400).json({ error: 'Cupom inválido ou expirado.' });
      if (cupomDoc.validade && new Date(cupomDoc.validade) < new Date()) return res.status(400).json({ error: 'Cupom expirado.' });
      if (totalBruto < (cupomDoc.valor_minimo || 0)) return res.status(400).json({ error: `Pedido mínimo de R$ ${cupomDoc.valor_minimo.toFixed(2)}.` });
      if (cupomDoc.quantidade > 0 && cupomDoc.usados >= cupomDoc.quantidade) return res.status(400).json({ error: 'Cupom esgotado.' });

      desconto = cupomDoc.tipo === 'percentual' ? totalBruto * (cupomDoc.valor / 100) : cupomDoc.valor;
      desconto = Math.min(desconto, totalBruto);
      cupomCodigo = cupomDoc.codigo;
    }

    const total = totalBruto - desconto;

    let vendedorId = null;
    let vendedorCodigo = '';
    let comissaoValor = 0;

    if (codigoVendedor) {
      try {
        const vendedor = await Vendedor.findOne({ codigo: sanitizeText(codigoVendedor, 50).toUpperCase(), ativo: true });
        if (vendedor) {
          vendedorId = vendedor._id;
          vendedorCodigo = vendedor.codigo;
          comissaoValor = (total * vendedor.comissao_percentual) / 100;
        }
      } catch (e) { /* ignora erro */ }
    }

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

    for (const item of itens) {
      const updated = await Produto.findOneAndUpdate(
        {
          _id: item.produtoId,
          estoque: mongoose.trusted({ $gte: item.quantidade }),
        },
        [
          {
            $set: {
              estoque: { $subtract: ['$estoque', (item.quantidade || 0)] },
              reservado: { $max: [0, { $subtract: ['$reservado', (item.quantidade || 0)] }] },
            },
          },
        ],
        { new: true }
      );

      if (!updated) {
        return res.status(409).json({ error: `Estoque insuficiente para ${item.nome}.` });
      }
    }

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
    if (err.message) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Erro ao processar pedido.' });
  }
});

// ============================================================
// GET /api/pedidos – Listar pedidos (filtrado por role)
// ============================================================
router.get('/', authMiddleware, async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'admin') {
      // admin vê todos
    } else if (req.user.role === 'seller') {
      const seller = await getSellerIdentity(req.user.email);
      if (!seller) {
        return res.json([]);
      }
      query = {
        $or: [
          { vendedor_id: seller._id },
          { vendedor_codigo: seller.codigo },
        ],
      };
    } else {
      // customer vê apenas seus pedidos (por email)
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
router.get('/admin', authMiddleware, requireRole(['admin']), async (req, res) => {
  try {
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
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Pedido inválido.' });
    }
    const pedido = await Pedido.findById(req.params.id);
    if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado' });

    const isAdmin = req.user.role === 'admin';
    const isOwner = pedido.cliente.email === req.user.email;
    let isSeller = false;
    if (req.user.role === 'seller') {
      const seller = await getSellerIdentity(req.user.email);
      if (seller) {
        isSeller = pedido.vendedor_id?.toString() === String(seller._id)
          || pedido.vendedor_codigo === seller.codigo;
      }
    }

    if (!isAdmin && !isOwner && !isSeller) {
      return res.status(403).json({ error: 'Acesso não autorizado.' });
    }

    res.json(pedido);
  } catch (err) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// ============================================================
// PUT /api/pedidos/:id – Atualizar status (admin)
// ============================================================
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Ação restrita a administradores.' });
    }
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Pedido inválido.' });
    }

    const { status } = sanitizeObject(req.body);
    const statusPermitidos = ['pendente', 'confirmado', 'enviado', 'entregue', 'cancelado'];
    if (!status || !statusPermitidos.includes(status)) {
      return res.status(400).json({ error: 'Status inválido.' });
    }

    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );
    if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado.' });
    res.json(pedido);
  } catch (err) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// ============================================================
// PATCH /api/pedidos/:id/status – atualização de status (admin e seller)
// ============================================================
router.patch('/:id/status', authMiddleware, requireRole(['admin', 'seller']), async (req, res) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Pedido inválido.' });
    }

    const payload = sanitizeObject(req.body);
    const status = sanitizeText(payload.status, 32).toLowerCase();
    const statusPermitidos = ['pendente', 'confirmado', 'enviado', 'entregue', 'cancelado'];
    if (!statusPermitidos.includes(status)) {
      return res.status(400).json({ error: 'Status inválido.' });
    }

    const pedido = await Pedido.findById(req.params.id);
    if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado.' });

    if (req.user.role === 'seller') {
      const seller = await getSellerIdentity(req.user.email);
      if (!seller) {
        return res.status(403).json({ error: 'Acesso não autorizado.' });
      }

      const isOwnerSeller = pedido.vendedor_id?.toString() === String(seller._id)
        || pedido.vendedor_codigo === seller.codigo;
      if (!isOwnerSeller) {
        return res.status(403).json({ error: 'Acesso não autorizado.' });
      }
    }

    pedido.status = status;
    pedido.updatedAt = new Date();
    await pedido.save();
    res.json({ pedido });
  } catch (err) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

module.exports = router;