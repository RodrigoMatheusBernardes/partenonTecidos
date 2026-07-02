const mongoose = require('mongoose');

const concorrenteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  link: { type: String, default: '' },
  produto: { type: String, required: true },
  preco: { type: Number, required: true },
  data_coleta: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.models.Concorrente || mongoose.model('Concorrente', concorrenteSchema);