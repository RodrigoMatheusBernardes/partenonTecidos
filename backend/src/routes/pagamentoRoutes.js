const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Pagamento = require('../models/Pagamento');
const Pedido = require('../models/Pedido');
const {
  createPixPayment,
  createCardPayment,
  getPaymentStatus,
} = require('../services/mercadopago');
const { sanitizeObject, sanitizeText, validateObjectId } = require('../utils/validation');

/* ============================================================
 * POST /api/pagamentos/pix — INALTERADO
 * ============================================================ */
router.post('/pix', authMiddleware, async (req, res) => {
  try {
    const payload = sanitizeObject(req.body);
    const { orderId } = payload;
    const description = sanitizeText(payload.description, 180);

    if (!validateObjectId(orderId)) {
      return res.status(400).json({ error: 'ID do pedido é obrigatório.' });
    }

    const pedido = await Pedido.findById(orderId);
    if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado.' });
    if (pedido.cliente.email !== req.user.email) {
      return res.status(403).json({ error: 'Este pedido não pertence a você.' });
    }
    if (pedido.paymentStatus === 'PAGO') {
      return res.status(400).json({ error: 'Este pedido já foi pago.' });
    }

    const pagamentoExistente = await Pagamento.findOne({
      orderId: pedido._id,
      status: 'PENDING',
    });

    if (pagamentoExistente) {
      if (pagamentoExistente.expirationDate && new Date(pagamentoExistente.expirationDate) > new Date()) {
        return res.status(400).json({
          error: 'Já existe um pagamento pendente para este pedido.',
          pagamento: pagamentoExistente,
        });
      }
      pagamentoExistente.status = 'EXPIRED';
      await pagamentoExistente.save();
    }

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

    const expirationDate = new Date();
    expirationDate.setMinutes(
      expirationDate.getMinutes() + (parseInt(process.env.MERCADO_PAGO_EXPIRATION_MINUTES) || 30)
    );

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
      expirationDate,
      metadata: {
        preferenceId: result.preferenceId,
        paymentId: result.paymentId,
      },
    });

    await pagamento.save();

    pedido.paymentStatus = 'AGUARDANDO_PAGAMENTO';
    pedido.paymentMethod = 'pix';
    pedido.paymentId = pagamento._id;
    await pedido.save();

    return res.status(201).json({
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
    console.error('[PIX] Erro:', err.message);
    return res.status(500).json({ error: 'Erro ao criar pagamento PIX.' });
  }
});

/* ============================================================
 * POST /api/pagamentos/cartao — NOVO
 * ============================================================ */
router.post('/cartao', authMiddleware, async (req, res) => {
  try {
    const payload = sanitizeObject(req.body);
    const {
      orderId, token, installments, paymentMethodId,
      issuerId, identification, clientAttemptId,
    } = payload;

    if (!validateObjectId(orderId)) {
      return res.status(400).json({ error: 'ID do pedido é obrigatório.' });
    }
    if (typeof token !== 'string' || token.trim() === '') {
      return res.status(400).json({ error: 'Token do cartão é obrigatório.' });
    }
    const installmentsNum = Number(installments);
    if (!Number.isInteger(installmentsNum) || installmentsNum < 1 || installmentsNum > 24) {
      return res.status(400).json({ error: 'Número de parcelas inválido.' });
    }
    if (typeof paymentMethodId !== 'string' || paymentMethodId.trim() === '') {
      return res.status(400).json({ error: 'Método de pagamento é obrigatório.' });
    }
    if (typeof clientAttemptId !== 'string' || clientAttemptId.trim() === '') {
      return res.status(400).json({ error: 'Identificador da tentativa é obrigatório.' });
    }

    const pedido = await Pedido.findById(orderId);
    if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado.' });
    if (pedido.cliente.email !== req.user.email) {
      return res.status(403).json({ error: 'Este pedido não pertence a você.' });
    }
    if (pedido.paymentStatus === 'PAGO') {
      return res.status(400).json({ error: 'Este pedido já foi pago.' });
    }

    const idempotencyKey = String(clientAttemptId).trim();

    const existente = await Pagamento.findOne({ idempotencyKey });
    if (existente) {
      if (existente.status === 'PROCESSING') {
        return res.status(409).json({ error: 'Pagamento já em processamento.' });
      }
      return res.status(200).json({
        message: 'Pagamento já processado.',
        pagamento: serializePagamento(existente),
      });
    }

    let validIdentification = null;
    if (identification && typeof identification === 'object') {
      const idType = typeof identification.type === 'string' ? identification.type.trim() : '';
      const idNumber = typeof identification.number === 'string' ? identification.number.trim() : '';
      if (idType && idNumber) validIdentification = { type: idType, number: idNumber };
    }

    let validIssuerId;
    if (issuerId !== undefined && issuerId !== null && issuerId !== '') {
      const parsed = Number(issuerId);
      if (Number.isFinite(parsed) && parsed > 0) validIssuerId = parsed;
    }

    let pagamento;
    try {
      pagamento = await Pagamento.create({
        orderId: pedido._id,
        customerId: req.user.id,
        paymentGateway: 'mercadopago',
        paymentMethod: 'credit_card',
        transactionId: '',
        idempotencyKey,
        amount: pedido.total,
        finalAmount: pedido.total,
        installments: installmentsNum,
        status: 'PROCESSING',
        expirationDate: null,
        metadata: { statusDetail: '' },
      });
    } catch (err) {
      if (err && err.code === 11000) {
        const vencedor = await Pagamento.findOne({ idempotencyKey });
        if (vencedor && vencedor.status === 'PROCESSING') {
          return res.status(409).json({ error: 'Pagamento já em processamento.' });
        }
        if (vencedor) {
          return res.status(200).json({
            message: 'Pagamento já processado.',
            pagamento: serializePagamento(vencedor),
          });
        }
      }
      throw err;
    }

    const result = await createCardPayment({
      orderId: pedido._id.toString(),
      amount: pedido.total,
      token,
      installments: installmentsNum,
      paymentMethodId,
      issuerId: validIssuerId,
      email: pedido.cliente.email,
      identification: validIdentification,
      idempotencyKey,
    });

    if (!result.success) {
      pagamento.status = 'CANCELED';
      pagamento.metadata = { statusDetail: result.error || 'Erro na chamada ao MP' };
      await pagamento.save();
      return res.status(502).json({ error: result.error || 'Erro ao processar pagamento.' });
    }

    let pagamentoStatus;
    let pedidoPaymentStatus;
    let pedidoStatus;
    switch (result.status) {
      case 'approved':
        pagamentoStatus = 'PAID';
        pedidoPaymentStatus = 'PAGO';
        pedidoStatus = 'PAGO';
        break;
      case 'pending':
      case 'in_process':
      case 'authorized':
        pagamentoStatus = 'PENDING';
        pedidoPaymentStatus = 'AGUARDANDO_PAGAMENTO';
        break;
      case 'rejected':
      case 'cancelled':
        pagamentoStatus = 'CANCELED';
        break;
      case 'refunded':
      case 'charged_back':
        pagamentoStatus = 'REFUNDED';
        break;
      default:
        pagamentoStatus = 'PENDING';
    }

    pagamento.transactionId = result.transactionId;
    pagamento.status = pagamentoStatus;
    pagamento.installments = result.installments || installmentsNum;
    pagamento.paidAt = pagamentoStatus === 'PAID' ? new Date() : null;
    pagamento.metadata = {
      statusDetail: result.statusDetail || '',
      paymentId: result.paymentId,
    };
    await pagamento.save();

    pedido.paymentMethod = 'credit_card';
    pedido.paymentId = pagamento._id;
    if (pedidoPaymentStatus) pedido.paymentStatus = pedidoPaymentStatus;
    if (pedidoStatus) pedido.status = pedidoStatus;
    await pedido.save();

    const message =
      pagamentoStatus === 'PAID' ? 'Pagamento aprovado.'
      : pagamentoStatus === 'PENDING' ? 'Pagamento em análise.'
      : 'Pagamento não aprovado.';

    return res.status(201).json({ message, pagamento: serializePagamento(pagamento) });
  } catch (err) {
    console.error('[CARTAO] Erro:', err.message);
    return res.status(500).json({ error: 'Erro ao processar pagamento com cartão.' });
  }
});

/* ============================================================
 * GET /api/pagamentos/:id — expiração limitada a PIX
 * ============================================================ */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Pagamento inválido.' });
    }
    const pagamento = await Pagamento.findById(req.params.id);
    if (!pagamento) return res.status(404).json({ error: 'Pagamento não encontrado.' });

    const isAdmin = req.user.role === 'admin';
    const isOwner = pagamento.customerId.toString() === req.user.id;
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: 'Acesso não autorizado.' });
    }

    if (
      pagamento.paymentMethod === 'pix' &&
      pagamento.status === 'PENDING' &&
      pagamento.expirationDate &&
      new Date(pagamento.expirationDate) < new Date()
    ) {
      pagamento.status = 'EXPIRED';
      await pagamento.save();
      await Pedido.findByIdAndUpdate(pagamento.orderId, { paymentStatus: 'EXPIRADO' });
    }

    if (pagamento.transactionId) {
      const statusResult = await getPaymentStatus(pagamento.transactionId);
      if (statusResult.success && statusResult.status === 'approved') {
        if (pagamento.status !== 'PAID') {
          pagamento.status = 'PAID';
          pagamento.paidAt = new Date();
          await pagamento.save();
          await Pedido.findByIdAndUpdate(pagamento.orderId, {
            paymentStatus: 'PAGO',
            status: 'PAGO',
          });
        }
      }
    }

    return res.json(serializePagamento(pagamento, true));
  } catch (err) {
    console.error('[GET /:id] Erro:', err.message);
    return res.status(500).json({ error: 'Erro ao consultar pagamento.' });
  }
});

/* ============================================================
 * GET /api/pagamentos/pedido/:orderId — INALTERADO
 * ============================================================ */
router.get('/pedido/:orderId', authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!validateObjectId(orderId)) {
      return res.status(400).json({ error: 'Pedido inválido.' });
    }

    const pagamento = await Pagamento.findOne({ orderId }).sort({ createdAt: -1 });
    if (!pagamento) {
      return res.status(404).json({ error: 'Pagamento não encontrado para este pedido.' });
    }

    const isAdmin = req.user.role === 'admin';
    const isOwner = pagamento.customerId.toString() === req.user.id;
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: 'Acesso não autorizado.' });
    }

    return res.json(serializePagamento(pagamento, true));
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar pagamento.' });
  }
});

function serializePagamento(p, withPix = false) {
  const base = {
    id: p._id,
    orderId: p.orderId,
    status: p.status,
    paymentMethod: p.paymentMethod,
    amount: p.amount,
    finalAmount: p.finalAmount,
    installments: p.installments,
    expirationDate: p.expirationDate,
    paidAt: p.paidAt,
    statusDetail: p.metadata?.statusDetail || '',
  };
  if (withPix) {
    base.qrCode = p.qrCode;
    base.qrCodeBase64 = p.qrCodeBase64;
    base.pixCode = p.pixCode;
  }
  return base;
}

module.exports = router;