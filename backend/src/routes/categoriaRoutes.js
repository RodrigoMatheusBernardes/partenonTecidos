const express = require('express');
const router = express.Router();
const Categoria = require('../models/Categoria');
const authMiddleware = require('../middleware/auth');

// Pública – apenas categorias ativas
router.get('/', async (req, res) => {
  try {
    const categorias = await Categoria.find({ ativo: true }).sort('ordem');
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin – todas (inclusive inativas) COM PAGINAÇÃO
router.get('/admin', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acesso restrito.' });

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [categorias, total] = await Promise.all([
      Categoria.find().sort('ordem').skip(skip).limit(limit).lean(),
      Categoria.countDocuments()
    ]);

    res.json({
      data: categorias,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin – criar
router.post('/admin', authMiddleware, async (req, res) => {
  try {
    const { nome, descricao, imagem, ordem } = req.body;
    const slug = nome
      .toLowerCase()
      .replace(/ /g, '-')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const categoria = await Categoria.create({ nome, slug, descricao, imagem, ordem });
    res.status(201).json(categoria);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin – atualizar
router.put('/admin/:id', authMiddleware, async (req, res) => {
  try {
    const categoria = await Categoria.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!categoria) return res.status(404).json({ error: 'Categoria não encontrada' });
    res.json(categoria);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin – excluir
router.delete('/admin/:id', authMiddleware, async (req, res) => {
  try {    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acesso restrito.' });    const categoria = await Categoria.findByIdAndDelete(req.params.id);
    if (!categoria) return res.status(404).json({ error: 'Categoria não encontrada' });
    res.json({ message: 'Categoria excluída' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Rota pública – buscar por slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const categoria = await Categoria.findOne({ slug: req.params.slug, ativo: true });
    if (!categoria) return res.status(404).json({ error: 'Categoria não encontrada' });
    res.json(categoria);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;