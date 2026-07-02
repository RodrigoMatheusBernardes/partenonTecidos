const mongoose = require('mongoose');

const avaliacaoSchema = new mongoose.Schema({
  produto_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produto',
    required: true
  },
  cliente_nome: {
    type: String,
    required: true
  },
  cliente_email: {
    type: String,
    default: ''
  },
  nota: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comentario: {
    type: String,
    default: ''
  },
  aprovado: {
    type: Boolean,
    default: true   // <-- se quiser moderação, mude para false
  }
}, { timestamps: true });

module.exports = mongoose.models.Avaliacao || mongoose.model('Avaliacao', avaliacaoSchema);