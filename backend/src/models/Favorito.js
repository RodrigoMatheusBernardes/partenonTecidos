const mongoose = require('mongoose');

const favoritoSchema = new mongoose.Schema({
  cliente_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  produto_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Produto', required: true },
}, {
  timestamps: true,
});

// Índice composto para evitar duplicatas
favoritoSchema.index({ cliente_id: 1, produto_id: 1 }, { unique: true });

module.exports = mongoose.model('Favorito', favoritoSchema);