const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const Pagamento = require('../models/Pagamento');
const Pedido = require('../models/Pedido');
const User = require('../models/User');
const { createPixPayment, getPaymentStatus } = require('../services/mercadopago');

// POST /api/pagamentos/pix - Criar pagamento PIX
router.post('/pix', authMiddleware, async (req, res) => {
  try {
    const { orderId, description } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'ID do pedido é obrigatório.' });
    }

    // Buscar pedido
    const pedido = await Pedido.findById(orderId);
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }

    // Verificar se o pedido pertence ao cliente
    if (pedido.cliente.email !== req.user.email) {
      return res.status(403).json({ error: 'Este pedido não pertence a você.' });
    }

    // Verificar se já existe pagamento pendente
    const pagamentoExistente = await Pagamento.findOne({
      orderId: pedido._id,
      status: 'PENDING',
    });

    if (pagamentoExistente) {
      // Verificar se o pagamento expirou
      if (new Date(pagamentoExistente.expirationDate) > new Date()) {
        return res.status(400).json({
          error: 'Já existe um pagamento pendente para este pedido.',
          pagamento: pagamentoExistente,
        });
      } else {
        // Marcar como expirado e criar novo
        pagamentoExistente.status = 'EXPIRED';
        await pagamentoExistente.save();
      }
    }

    // Criar pagamento no Mercado Pago
    const result = await createPixPayment({
      orderId: pedido._id.toString(),
      customerId: req.user.id,
      amount: pedido.total,
      description: description || `Pedido #${pedido._id.toString().slice(-6)}`,
      email: req.user.email,
      nome: req.user.nome,
    });

    if (!result.success) {
      return res.status(500).json({ error: result.error || 'Erro ao criar pagamento.' });
    }

    // Salvar pagamento no banco
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + (parseInt(process.env.MERCADO_PAGO_EXPIRATION_MINUTES) || 30));

    const pagamento = new Pagamento({
      orderId: pedido._id,
      customerId: req.user.id,
      paymentGateway: 'mercadopago',
      paymentMethod: 'pix',
      transactionId: result.transactionId,
      preferenceId: result.preferenceId,
      qrCode: result.qrCode,
      qrCodeBase64: result.qrCodeBase64,
      pixCode: result.pixCode,
      amount: pedido.total,
      finalAmount: pedido.total,
      status: 'PENDING',
      expirationDate: expirationDate,
      metadata: {
        preferenceId: result.preferenceId,
        paymentId: result.paymentId,
      },
    });

    await pagamento.save();

    // Atualizar pedido com informações de pagamento
    pedido.paymentStatus = 'AGUARDANDO_PAGAMENTO';
    pedido.paymentMethod = 'pix';
    pedido.paymentId = pagamento._id;
    await pedido.save();

    res.status(201).json({
      message: 'Pagamento PIX criado com sucesso!',
      pagamento: {
        id: pagamento._id,
        orderId: pagamento.orderId,
        qrCode: pagamento.qrCode,
        qrCodeBase64: pagamento.qrCodeBase64,
        pixCode: pagamento.pixCode,
        status: pagamento.status,
        expirationDate: pagamento.expirationDate,
        amount: pagamento.amount,
        finalAmount: pagamento.finalAmount,
      },
    });
  } catch (err) {
    console.error('Erro ao criar pagamento PIX:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/pagamentos/:id - Consultar status do pagamento
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const pagamento = await Pagamento.findById(req.params.id);
    if (!pagamento) {
      return res.status(404).json({ error: 'Pagamento não encontrado.' });
    }

    // Verificar se o usuário tem permissão
    const isAdmin = req.user.role === 'admin';
    const isOwner = pagamento.customerId.toString() === req.user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: 'Acesso não autorizado.' });
    }

    // Se o pagamento estiver expirado, atualizar status
    if (pagamento.status === 'PENDING' && new Date(pagamento.expirationDate) < new Date()) {
      pagamento.status = 'EXPIRED';
      await pagamento.save();

      // Atualizar pedido
      await Pedido.findByIdAndUpdate(pagamento.orderId, {
        paymentStatus: 'EXPIRADO',
      });
    }

    // Buscar status atualizado no Mercado Pago (opcional)
    if (pagamento.transactionId) {
      const statusResult = await getPaymentStatus(pagamento.transactionId);
      if (statusResult.success && statusResult.status === 'paid') {
        pagamento.status = 'PAID';
        pagamento.paidAt = new Date();
        await pagamento.save();

        // Atualizar pedido
        await Pedido.findByIdAndUpdate(pagamento.orderId, {
          paymentStatus: 'PAGO',
          status: 'PAGO',
        });
      }
    }

    res.json({
      id: pagamento._id,
      orderId: pagamento.orderId,
      status: pagamento.status,
      paymentMethod: pagamento.paymentMethod,
      amount: pagamento.amount,
      finalAmount: pagamento.finalAmount,
      expirationDate: pagamento.expirationDate,
      paidAt: pagamento.paidAt,
      qrCode: pagamento.qrCode,
      qrCodeBase64: pagamento.qrCodeBase64,
      pixCode: pagamento.pixCode,
    });
  } catch (err) {
    console.error('Erro ao consultar pagamento:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/pagamentos/pedido/:orderId - Buscar pagamento por pedido
router.get('/pedido/:orderId', authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.params;

    const pagamento = await Pagamento.findOne({ orderId }).sort({ createdAt: -1 });
    if (!pagamento) {
      return res.status(404).json({ error: 'Pagamento não encontrado para este pedido.' });
    }

    // Verificar permissão
    const isAdmin = req.user.role === 'admin';
    const isOwner = pagamento.customerId.toString() === req.user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: 'Acesso não autorizado.' });
    }

    res.json({
      id: pagamento._id,
      orderId: pagamento.orderId,
      status: pagamento.status,
      paymentMethod: pagamento.paymentMethod,
      amount: pagamento.amount,
      finalAmount: pagamento.finalAmount,
      expirationDate: pagamento.expirationDate,
      paidAt: pagamento.paidAt,
      qrCode: pagamento.qrCode,
      qrCodeBase64: pagamento.qrCodeBase64,
      pixCode: pagamento.pixCode,
    });
  } catch (err) {
    console.error('Erro ao buscar pagamento:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;