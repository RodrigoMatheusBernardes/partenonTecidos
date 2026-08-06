// Configuração do Mercado Pago
const { MercadoPagoConfig } = require('mercadopago');

// Credenciais via variáveis de ambiente
const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

if (!accessToken) {
  console.warn('⚠️ MERCADO_PAGO_ACCESS_TOKEN não configurado. O sistema de pagamentos não funcionará.');
}

const mercadopagoClient = new MercadoPagoConfig({
  accessToken: accessToken || 'not-configured',
});

module.exports = { mercadopagoClient };