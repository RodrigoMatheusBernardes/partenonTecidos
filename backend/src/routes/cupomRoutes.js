const express = require('express');
const router = express.Router();
const Cupom = require('../models/Cupom');
const authMiddleware = require('../middleware/auth');

// Pública – validação de cupom
router.post('/validar', async (req, res) => {
  try {
    const { codigo, total } = req.body;
    if (!codigo) return res.status(400).json({ error: 'Código obrigatório.' });

    const cupom = await Cupom.findOne({ codigo: codigo.toUpperCase(), ativo: true });
    if (!cupom) return res.status(400).json({ error: 'Cupom inválido.' });

    // Verificar validade
    if (cupom.validade && new Date(cupom.validade) < new Date())
      return res.status(400).json({ error: 'Cupom expirado.' });

    // Verificar valor mínimo
    if (total !== undefined && total < (cupom.valor_minimo || 0))
      return res.status(400).json({ error: `Pedido mínimo de R$ ${cupom.valor_minimo.toFixed(2)}.` });

    // Verificar quantidade de usos disponíveis
    if (cupom.quantidade > 0 && cupom.usados >= cupom.quantidade)
      return res.status(400).json({ error: 'Cupom esgotado.' });

    let desconto = 0;
    if (cupom.tipo === 'percentual') {
      desconto = (total || 0) * (cupom.valor / 100);
    } else {
      desconto = cupom.valor;
    }
    desconto = Math.min(desconto, total || 0);

    res.json({ valido: true, desconto, tipo: cupom.tipo, valor: cupom.valor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin – listar todos COM PAGINAÇÃO
router.get('/admin', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acesso restrito.' });

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [cupons, total] = await Promise.all([
      Cupom.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Cupom.countDocuments()
    ]);

    res.json({
      data: cupons,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin – criar
router.post('/admin', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acesso restrito.' });
    const cupom = new Cupom(req.body);
    await cupom.save();
    res.status(201).json(cupom);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin – excluir
router.delete('/admin/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acesso restrito.' });
    const cupom = await Cupom.findByIdAndDelete(req.params.id);
    if (!cupom) return res.status(404).json({ error: 'Cupom não encontrado.' });
    res.json({ message: 'Cupom excluído.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;