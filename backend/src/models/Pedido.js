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
  status: { type: String, enum: ['pendente', 'confirmado', 'enviado', 'entregue', 'cancelado'], default: 'pendente' },
  cupom_codigo: { type: String, default: '' },
  desconto: { type: Number, default: 0 },
  // Campos de vendedor e comissão (agora dentro do schema)
  vendedor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendedor', default: null },
  vendedor_codigo: { type: String, default: '' },
  comissao_valor: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Pedido || mongoose.model('Pedido', pedidoSchema);