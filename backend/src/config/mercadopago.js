// Configuração do Mercado Pago
const mercadopago = require('mercadopago');

// Credenciais via variáveis de ambiente
const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

if (!accessToken) {
  console.warn('⚠️ MERCADO_PAGO_ACCESS_TOKEN não configurado. O sistema de pagamentos não funcionará.');
}

mercadopago.configure({
  access_token: accessToken,
  // Em produção, use integrator_id se tiver
});

module.exports = { mercadopago };