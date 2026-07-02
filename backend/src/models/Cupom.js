const mongoose = require('mongoose');

const cupomSchema = new mongoose.Schema({
  codigo: { type: String, required: true, unique: true, uppercase: true, trim: true },
  descricao: { type: String, default: '' },
  tipo: { type: String, enum: ['percentual', 'fixo'], required: true },
  valor: { type: Number, required: true, min: 0 },
  valor_minimo: { type: Number, default: 0 },
  quantidade: { type: Number, default: 1, min: 1 },
  usados: { type: Number, default: 0 },
  ativo: { type: Boolean, default: true },
  validade: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.models.Cupom || mongoose.model('Cupom', cupomSchema);