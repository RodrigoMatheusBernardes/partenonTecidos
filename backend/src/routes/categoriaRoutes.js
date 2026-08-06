const express = require('express');
const router = express.Router();
const Categoria = require('../models/Categoria');
const authMiddleware = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const { pick, sanitizeObject, sanitizeText, validateObjectId } = require('../utils/validation');

function buildSlug(nome) {
  return nome
    .toLowerCase()
    .replace(/ /g, '-')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

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
router.get('/admin', authMiddleware, requireRole(['admin']), async (req, res) => {
  try {
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
router.post('/admin', authMiddleware, requireRole(['admin']), async (req, res) => {
  try {
    const payload = sanitizeObject(req.body);
    const nome = sanitizeText(payload.nome, 120);
    const descricao = sanitizeText(payload.descricao, 500);
    const imagem = sanitizeText(payload.imagem, 500);
    const ordem = Number.isFinite(Number(payload.ordem)) ? Number(payload.ordem) : 0;
    if (!nome) {
      return res.status(400).json({ error: 'Nome é obrigatório.' });
    }
    const slug = buildSlug(nome);
    const categoria = await Categoria.create({ nome, slug, descricao, imagem, ordem });
    res.status(201).json(categoria);
  } catch (err) {
    res.status(400).json({ error: 'Dados de categoria inválidos.' });
  }
});

// Admin – atualizar
router.put('/admin/:id', authMiddleware, requireRole(['admin']), async (req, res) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({ error: 'ID de categoria inválido.' });
    }
    const payload = sanitizeObject(req.body);
    const update = pick(payload, ['descricao', 'imagem', 'ativo', 'ordem']);
    if (payload.nome) {
      const nome = sanitizeText(payload.nome, 120);
      update.nome = nome;
      update.slug = buildSlug(nome);
    }
    const categoria = await Categoria.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );
    if (!categoria) return res.status(404).json({ error: 'Categoria não encontrada' });
    res.json(categoria);
  } catch (err) {
    res.status(400).json({ error: 'Dados de categoria inválidos.' });
  }
});

// Admin – excluir
router.delete('/admin/:id', authMiddleware, requireRole(['admin']), async (req, res) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({ error: 'ID de categoria inválido.' });
    }
    const categoria = await Categoria.findByIdAndDelete(req.params.id);
    if (!categoria) return res.status(404).json({ error: 'Categoria não encontrada' });
    res.json({ message: 'Categoria excluída' });
  } catch (err) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
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