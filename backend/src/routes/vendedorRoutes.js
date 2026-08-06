const express = require('express');
const router = express.Router();
const Vendedor = require('../models/Vendedor');
const authMiddleware = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const { normalizeEmail, sanitizeObject, sanitizeText, validateObjectId } = require('../utils/validation');

// GET /api/vendedores/admin – listar todos COM PAGINAÇÃO
router.get('/admin', authMiddleware, requireRole(['admin']), async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [vendedores, total] = await Promise.all([
      Vendedor.find().sort({ nome: 1 }).skip(skip).limit(limit).lean(),
      Vendedor.countDocuments()
    ]);

    res.json({
      data: vendedores,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/vendedores/admin – criar
router.post('/admin', authMiddleware, requireRole(['admin']), async (req, res) => {
  try {
    const payload = sanitizeObject(req.body);
    const vendedor = new Vendedor({
      codigo: sanitizeText(payload.codigo, 30).toUpperCase(),
      nome: sanitizeText(payload.nome, 120),
      email: normalizeEmail(payload.email),
      telefone: sanitizeText(payload.telefone, 40),
      comissao_percentual: Number(payload.comissao_percentual ?? 5),
      ativo: Boolean(payload.ativo ?? true),
    });
    await vendedor.save();
    res.status(201).json(vendedor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/vendedores/admin/:id – atualizar
router.put('/admin/:id', authMiddleware, requireRole(['admin']), async (req, res) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Vendedor inválido.' });
    }
    const payload = sanitizeObject(req.body);
    const update = {
      nome: sanitizeText(payload.nome, 120),
      email: normalizeEmail(payload.email),
      telefone: sanitizeText(payload.telefone, 40),
      ativo: typeof payload.ativo === 'boolean' ? payload.ativo : undefined,
      comissao_percentual: payload.comissao_percentual !== undefined ? Number(payload.comissao_percentual) : undefined,
      codigo: payload.codigo ? sanitizeText(payload.codigo, 30).toUpperCase() : undefined,
    };
    Object.keys(update).forEach((key) => update[key] === undefined && delete update[key]);

    const vendedor = await Vendedor.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!vendedor) return res.status(404).json({ error: 'Vendedor não encontrado.' });
    res.json(vendedor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/vendedores/admin/:id – excluir
router.delete('/admin/:id', authMiddleware, requireRole(['admin']), async (req, res) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Vendedor inválido.' });
    }
    const vendedor = await Vendedor.findByIdAndDelete(req.params.id);
    if (!vendedor) return res.status(404).json({ error: 'Vendedor não encontrado.' });
    res.json({ message: 'Vendedor excluído.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/vendedores/public/:codigo – validar código do vendedor (público)
router.get('/public/:codigo', async (req, res) => {
  try {
    const vendedor = await Vendedor.findOne({ codigo: req.params.codigo.toUpperCase(), ativo: true });
    if (!vendedor) return res.status(404).json({ error: 'Vendedor não encontrado.' });
    res.json({ nome: vendedor.nome, codigo: vendedor.codigo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;