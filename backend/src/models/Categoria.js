const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  descricao: { type: String, default: '' },
  imagem: { type: String, default: '' },
  ativo: { type: Boolean, default: true },
  ordem: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.models.Categoria || mongoose.model('Categoria', categoriaSchema);