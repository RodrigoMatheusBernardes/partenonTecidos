const { Preference, Payment } = require('mercadopago');
const { mercadopagoClient } = require('../config/mercadopago');

/**
 * Cria um pagamento PIX no Mercado Pago
 */
async function createPixPayment({ orderId, customerId, amount, description, email, nome }) {
  try {
    const expirationMinutes = parseInt(process.env.MERCADO_PAGO_EXPIRATION_MINUTES) || 30;
    const preferenceClient = new Preference(mercadopagoClient);
    const paymentClient = new Payment(mercadopagoClient);

    const preferenceBody = {
      items: [
        {
          id: orderId.toString(),
          title: description || 'Pedido Parthenon Tecidos',
          quantity: 1,
          currency_id: 'BRL',
          unit_price: Number(amount.toFixed(2)),
        },
      ],
      payer: {
        email: email || 'cliente@parthenon.com',
        name: nome || 'Cliente',
      },
      payment_methods: {
        excluded_payment_methods: [
          { id: 'visa' },
          { id: 'master' },
          { id: 'amex' },
          { id: 'hipercard' },
          { id: 'elo' },
          { id: 'cabal' },
        ],
        excluded_payment_types: [
          { id: 'credit_card' },
          { id: 'debit_card' },
          { id: 'ticket' },
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

    // Gerar QR Code para PIX
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
      pixCode: paymentData.point_of_interaction?.transaction_data?.ticket_url || '',
      expirationDate: paymentData.date_of_expiration || preferenceData.expiration_date_to,
      transactionId: paymentData.id.toString(),
      amount: paymentData.transaction_amount,
    };
  } catch (error) {
    console.error('Erro ao criar pagamento PIX:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
}

/**
 * Consulta status de um pagamento no Mercado Pago
 */
async function getPaymentStatus(paymentId) {
  try {
    const paymentClient = new Payment(mercadopagoClient);
    const response = await paymentClient.get({ id: paymentId });
    return {
      success: true,
      status: response.status,
      payment: response,
    };
  } catch (error) {
    console.error('Erro ao consultar pagamento:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
}

/**
 * Verifica assinatura do Webhook do Mercado Pago
 */
function validateWebhookSignature(notification, signature, xRequestId) {
  // Implementação básica - em produção, use a validação oficial do Mercado Pago
  // https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
  // Para validação completa, é recomendado verificar o x-signature
  // Por enquanto, vamos validar pela presença dos campos obrigatórios
  if (!notification || !notification.id) {
    return false;
  }
  return true;
}

module.exports = {
  createPixPayment,
  getPaymentStatus,
  validateWebhookSignature,
};