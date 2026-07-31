const express = require('express');
const router = express.Router();
const Pagamento = require('../models/Pagamento');
const Pedido = require('../models/Pedido');
const { validateWebhookSignature, getPaymentStatus } = require('../services/mercadopago');

// POST /api/webhooks/mercadopago
router.post('/mercadopago', async (req, res) => {
  try {
    console.log('Webhook recebido:', req.body);

    const { type, data, action } = req.body;

    // Validação básica
    if (type !== 'payment') {
      return res.status(200).json({ message: 'Evento ignorado' });
    }

    // Validar assinatura (implementação básica)
    if (!validateWebhookSignature(req.body, req.headers['x-signature'], req.headers['x-request-id'])) {
      console.log('Assinatura inválida:', req.body);
      return res.status(401).json({ error: 'Assinatura inválida' });
    }

    const paymentId = data?.id;
    if (!paymentId) {
      return res.status(400).json({ error: 'ID do pagamento não informado' });
    }

    // Consultar status no Mercado Pago
    const statusResult = await getPaymentStatus(paymentId);
    if (!statusResult.success) {
      console.error('Erro ao consultar pagamento:', statusResult.error);
      return res.status(500).json({ error: 'Erro ao consultar pagamento' });
    }

    const paymentData = statusResult.payment;
    const externalReference = paymentData.external_reference;
    const paymentStatus = paymentData.status;

    // Buscar pagamento no banco
    const pagamento = await Pagamento.findOne({ transactionId: paymentId.toString() });
    if (!pagamento) {
      console.log('Pagamento não encontrado:', paymentId);
      return res.status(404).json({ error: 'Pagamento não encontrado' });
    }

    // Atualizar status do pagamento
    const statusMap = {
      approved: 'PAID',
      pending: 'PENDING',
      rejected: 'CANCELED',
      cancelled: 'CANCELED',
      refunded: 'REFUNDED',
      charged_back: 'REFUNDED',
    };

    const newStatus = statusMap[paymentStatus] || pagamento.status;

    if (newStatus !== pagamento.status) {
      pagamento.status = newStatus;
      if (newStatus === 'PAID') {
        pagamento.paidAt = new Date();
      }
      await pagamento.save();

      // Atualizar pedido
      const pedido = await Pedido.findById(pagamento.orderId);
      if (pedido) {
        const pedidoStatusMap = {
          PAID: 'PAGO',
          PENDING: 'AGUARDANDO_PAGAMENTO',
          CANCELED: 'CANCELADO',
          REFUNDED: 'CANCELADO',
        };

        pedido.paymentStatus = pedidoStatusMap[newStatus] || 'AGUARDANDO_PAGAMENTO';
        if (newStatus === 'PAID') {
          pedido.status = 'PAGO';
          pedido.paymentStatus = 'PAGO';
        }
        await pedido.save();

        console.log(`✅ Pedido ${pedido._id} atualizado para status: ${pedido.status}`);
      }
    }

    res.status(200).json({ message: 'Webhook processado com sucesso' });
  } catch (err) {
    console.error('Erro ao processar webhook:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/webhooks/mercadopago - Para testes (apenas development)
router.get('/mercadopago', (req, res) => {
  res.json({ message: 'Webhook endpoint está funcionando' });
});

module.exports = router;