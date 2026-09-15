const { Preference, Payment } = require('mercadopago');
const { mercadopagoClient } = require('../config/mercadopago');

/* ============================================================
 * PIX — INALTERADO
 * ============================================================ */
async function createPixPayment({ orderId, customerId, amount, description, email, nome }) {
  try {
    const expirationMinutes = parseInt(process.env.MERCADO_PAGO_EXPIRATION_MINUTES) || 30;
    const preferenceClient = new Preference(mercadopagoClient);
    const paymentClient = new Payment(mercadopagoClient);

    const preferenceBody = {
      items: [{
        id: orderId.toString(),
        title: description || 'Pedido Parthenon Tecidos',
        quantity: 1,
        currency_id: 'BRL',
        unit_price: Number(amount.toFixed(2)),
      }],
      payer: { email: email || 'cliente@parthenon.com', name: nome || 'Cliente' },
      payment_methods: {
        excluded_payment_methods: [
          { id: 'visa' }, { id: 'master' }, { id: 'amex' },
          { id: 'hipercard' }, { id: 'elo' }, { id: 'cabal' },
        ],
        excluded_payment_types: [
          { id: 'credit_card' }, { id: 'debit_card' }, { id: 'ticket' },
        ],
        installments: 1,
      },
      external_reference: orderId.toString(),
      expiration_date_to: new Date(Date.now() + expirationMinutes * 60000).toISOString(),
      notification_url: `${process.env.API_BASE_URL}/api/webhooks/mercadopago`,
      auto_return: 'approved',
      back_urls: {
        success: `${process.env.FRONTEND_URL}/checkout/sucesso`,
        failure: `${process.env.FRONTEND_URL}/checkout/erro`,
        pending: `${process.env.FRONTEND_URL}/checkout/pendente`,
      },
    };

    const preferenceData = await preferenceClient.create({ body: preferenceBody });

    const paymentData = await paymentClient.create({
      body: {
        transaction_amount: amount,
        description: description || `Pedido #${orderId}`,
        payment_method_id: 'pix',
        payer: {
          email: email || 'cliente@parthenon.com',
          first_name: nome || 'Cliente',
        },
        external_reference: orderId.toString(),
        notification_url: `${process.env.API_BASE_URL}/api/webhooks/mercadopago`,
      },
    });

    return {
      success: true,
      preferenceId: preferenceData.id,
      paymentId: paymentData.id,
      status: paymentData.status,
      qrCode: paymentData.point_of_interaction?.transaction_data?.qr_code || '',
      qrCodeBase64: paymentData.point_of_interaction?.transaction_data?.qr_code_base64 || '',
      pixCode: paymentData.point_of_interaction?.transaction_data?.qr_code || '',
      expirationDate: paymentData.date_of_expiration || preferenceData.expiration_date_to,
      transactionId: paymentData.id.toString(),
      amount: paymentData.transaction_amount,
    };
  } catch (error) {
    console.error('Erro ao criar pagamento PIX:', error.response?.data || error.message);
    return { success: false, error: error.response?.data?.message || error.message };
  }
}

/* ============================================================
 * CARTÃO — NOVO
 * ============================================================ */
async function createCardPayment({
  orderId,
  amount,
  token,
  installments,
  paymentMethodId,
  issuerId,
  email,
  identification,
  idempotencyKey,
}) {
  try {
    const paymentClient = new Payment(mercadopagoClient);

    const payer = { email };
    if (identification && identification.type && identification.number) {
      payer.identification = {
        type: String(identification.type),
        number: String(identification.number),
      };
    }

    const body = {
      transaction_amount: Number(Number(amount).toFixed(2)),
      token,
      description: `Pedido #${orderId}`,
      installments: Number(installments),
      payment_method_id: paymentMethodId,
      payer,
      external_reference: String(orderId),
      notification_url: `${process.env.API_BASE_URL}/api/webhooks/mercadopago`,
    };

    if (issuerId !== undefined && issuerId !== null && issuerId !== '') {
      const parsed = Number(issuerId);
      if (Number.isFinite(parsed) && parsed > 0) body.issuer_id = parsed;
    }

    const paymentData = await paymentClient.create({
      body,
      requestOptions: idempotencyKey ? { idempotencyKey } : undefined,
    });

    return {
      success: true,
      paymentId: paymentData.id,
      status: paymentData.status,
      statusDetail: paymentData.status_detail || '',
      transactionId: String(paymentData.id),
      amount: paymentData.transaction_amount,
      installments: paymentData.installments,
    };
  } catch (error) {
    const msg =
      error.response?.data?.message
      || error.response?.data?.error
      || 'Falha ao processar pagamento com cartão.';
    console.error('[MP] Erro ao criar pagamento com cartão:', msg);
    return { success: false, error: msg };
  }
}

/* ============================================================
 * Consulta — INALTERADO
 * ============================================================ */
async function getPaymentStatus(paymentId) {
  try {
    const paymentClient = new Payment(mercadopagoClient);
    const response = await paymentClient.get({ id: paymentId });
    return { success: true, status: response.status, payment: response };
  } catch (error) {
    console.error('Erro ao consultar pagamento:', error.response?.data || error.message);
    return { success: false, error: error.response?.data?.message || error.message };
  }
}

/* ============================================================
 * Webhook — dívida técnica, NÃO mexer
 * ============================================================ */
function validateWebhookSignature(notification, signature, xRequestId) {
  if (!notification || !notification.id) return false;
  return true;
}

module.exports = {
  createPixPayment,
  createCardPayment,
  getPaymentStatus,
  validateWebhookSignature,
};