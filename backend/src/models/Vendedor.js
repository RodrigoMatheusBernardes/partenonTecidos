const mongoose = require('mongoose');

const vendedorSchema = new mongoose.Schema({
  codigo: { type: String, required: true, unique: true, uppercase: true, trim: true },
  nome: { type: String, required: true },
  email: { type: String, default: '' },
  telefone: { type: String, default: '' },
  comissao_percentual: { type: Number, default: 5, min: 0, max: 100 },
  ativo: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.models.Vendedor || mongoose.model('Vendedor', vendedorSchema);