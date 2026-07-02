const mongoose = require('mongoose');

const produtoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  preco: { type: Number, required: true },
  preco_original: { type: Number, default: null },  // NOVO – se informado, indica promoção
  parcelas: { type: Number, default: 3 },           // NOVO – número de parcelas padrão
  descricao: { type: String, default: '' },
  fotos: [String],
  estoque: { type: Number, default: 0 },
  reservado: { type: Number, default: 0 },
  alerta_minimo: { type: Number, default: 5 },
  categoria: { type: String, default: '' },
  atributos: {
    composicao: { type: String, default: '' },
    largura_metro: { type: Number, default: 0 },
    gramatura: { type: Number, default: 0 },
    vendas: { type: Number, default: 0 },
  },
  ativo: { type: Boolean, default: true },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual: estoque disponível
produtoSchema.virtual('disponivel').get(function () {
  return Math.max(0, this.estoque - this.reservado);
});

module.exports = mongoose.model('Produto', produtoSchema);