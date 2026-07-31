const mongoose = require('mongoose');

const pagamentoSchema = new mongoose.Schema({
  // Relacionamento
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pedido',
    required: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Dados do pagamento
  paymentGateway: {
    type: String,
    enum: ['mercadopago', 'pagarme', 'asaas', 'stripe'],
    default: 'mercadopago',
  },
  paymentMethod: {
    type: String,
    enum: ['pix', 'credit_card', 'boleto', 'debit_card'],
    required: true,
  },

  // Transação
  transactionId: {
    type: String,
    default: '',
  },
  preferenceId: {
    type: String,
    default: '',
  },

  // PIX específico
  qrCode: {
    type: String,
    default: '',
  },
  pixCode: {
    type: String,
    default: '',
  },
  qrCodeBase64: {
    type: String,
    default: '',
  },

  // Valores
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  finalAmount: {
    type: Number,
    required: true,
    min: 0,
  },

  // Status
  status: {
    type: String,
    enum: [
      'PENDING',      // Aguardando pagamento
      'PAID',         // Pago
      'EXPIRED',      // Expirado
      'CANCELED',     // Cancelado
      'REFUNDED',     // Reembolsado
      'PARTIALLY_REFUNDED', // Reembolsado parcialmente
    ],
    default: 'PENDING',
  },

  // Datas
  expirationDate: {
    type: Date,
    required: true,
  },
  paidAt: {
    type: Date,
    default: null,
  },
  refundedAt: {
    type: Date,
    default: null,
  },

  // Dados adicionais
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },

  // Para futuros parcelamentos
  installments: {
    type: Number,
    default: 1,
  },

}, { timestamps: true });

// Índices para consultas rápidas
pagamentoSchema.index({ orderId: 1 });
pagamentoSchema.index({ transactionId: 1 });
pagamentoSchema.index({ status: 1 });
pagamentoSchema.index({ expirationDate: 1 });
pagamentoSchema.index({ customerId: 1 });

module.exports = mongoose.models.Pagamento || mongoose.model('Pagamento', pagamentoSchema);