const mongoose = require('mongoose');

const pagamentoSchema = new mongoose.Schema({
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

  transactionId: { type: String, default: '' },
  preferenceId: { type: String, default: '' },

  idempotencyKey: { type: String, default: '' },

  qrCode: { type: String, default: '' },
  pixCode: { type: String, default: '' },
  qrCodeBase64: { type: String, default: '' },

  amount: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0 },
  finalAmount: { type: Number, required: true, min: 0 },

  status: {
    type: String,
    enum: [
      'PROCESSING',
      'PENDING',
      'PAID',
      'EXPIRED',
      'CANCELED',
      'REFUNDED',
      'PARTIALLY_REFUNDED',
    ],
    default: 'PENDING',
  },

  expirationDate: { type: Date, default: null },
  paidAt: { type: Date, default: null },
  refundedAt: { type: Date, default: null },

  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  installments: { type: Number, default: 1 },
}, { timestamps: true });

pagamentoSchema.index({ orderId: 1 });
pagamentoSchema.index({ transactionId: 1 }, { unique: true, sparse: true });
pagamentoSchema.index({ status: 1 });
pagamentoSchema.index({ expirationDate: 1 });
pagamentoSchema.index({ customerId: 1 });

pagamentoSchema.index(
  { idempotencyKey: 1 },
  {
    unique: true,
    partialFilterExpression: { idempotencyKey: { $type: 'string', $ne: '' } },
  }
);

module.exports = mongoose.models.Pagamento || mongoose.model('Pagamento', pagamentoSchema);