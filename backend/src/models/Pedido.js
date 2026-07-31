const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  cliente: {
    nome: { type: String, required: true },
    email: { type: String, required: true },
    telefone: String,
    cep: String,
    logradouro: String,
    numero: String,
    complemento: String,
    bairro: String,
    cidade: String,
    estado: String
  },
  itens: [{
    produtoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Produto', required: true },
    nome: String,
    preco: Number,
    quantidade: Number
  }],
  total: { type: Number, required: true },
  
  // Status do pedido
  status: {
    type: String,
    enum: ['AGUARDANDO_PAGAMENTO', 'PAGO', 'pendente', 'confirmado', 'enviado', 'entregue', 'cancelado', 'EXPIRADO'],
    default: 'AGUARDANDO_PAGAMENTO',
  },
  
  cupom_codigo: { type: String, default: '' },
  desconto: { type: Number, default: 0 },

  // Campos de pagamento
  paymentStatus: {
    type: String,
    enum: ['AGUARDANDO_PAGAMENTO', 'PAGO', 'EXPIRADO', 'CANCELADO'],
    default: 'AGUARDANDO_PAGAMENTO',
  },
  paymentMethod: {
    type: String,
    enum: ['pix', 'credit_card', 'boleto', 'debit_card'],
    default: null,
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pagamento',
    default: null,
  },

  // Campos de vendedor e comissão
  vendedor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendedor', default: null },
  vendedor_codigo: { type: String, default: '' },
  comissao_valor: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
});

module.exports = mongoose.models.Pedido || mongoose.model('Pedido', pedidoSchema);