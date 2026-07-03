const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Produto = require('../models/Produto');
const authMiddleware = require('../middleware/auth');

const noCache = (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
};

// ================= CONFIGURAÇÃO DO CLOUDINARY =================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// ================= CONFIGURAÇÃO DO UPLOAD (MEMORY STORAGE) =================
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// ================= UPLOAD DE IMAGEM (PROTEGIDO, VIA CLOUDINARY) =================
router.post('/upload', authMiddleware, upload.single('imagem'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    }

    // Converte o buffer para base64 e faz upload para o Cloudinary
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'parthenon-produtos',
      resource_type: 'auto'
    });

    // Retorna a URL segura do Cloudinary (HTTPS)
    res.json({ url: result.secure_url });
  } catch (err) {
    console.error('Erro no upload:', err);
    res.status(500).json({ error: 'Falha no upload da imagem' });
  }
});

// ================= ROTAS FIXAS (ANTES DE :ID) =================

// POST /api/produtos - criar produto (admin)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const produtoData = { ...req.body };
    if (produtoData.categoria === '' || produtoData.categoria === null) {
      delete produtoData.categoria;
    }
    const produto = new Produto(produtoData);
    await produto.save();
    res.status(201).json(produto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/produtos - listar todos (admin)
router.get('/', noCache, async (req, res) => {
  try {
    const produtos = await Produto.find().sort({ createdAt: -1 }).lean();
    res.json(produtos);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/produtos/vitrine - produtos disponíveis para loja
router.get('/vitrine', noCache, async (req, res) => {
  try {
    const produtos = await Produto.find({ ativo: true })
      .sort({ createdAt: -1 })
      .populate('categoria', 'nome slug')
      .lean();
    const disponiveis = produtos.map(p => ({
      ...p,
      disponivel: (p.estoque || 0) - (p.reservado || 0)
    }));
    res.json(disponiveis);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/produtos/destaques – Mais Vendidos
router.get('/destaques', noCache, async (req, res) => {
  try {
    const produtos = await Produto.find({ ativo: true })
      .sort({ vendas: -1 })
      .populate('categoria', 'nome slug')
      .lean();
    const resultado = produtos.map(p => ({
      ...p,
      disponivel: (p.estoque || 0) - (p.reservado || 0)
    }));
    res.json(resultado);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/produtos/busca?q=termo – busca preditiva
router.get('/busca', noCache, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.json([]);
    }
    const regex = new RegExp(q.trim(), 'i');
    const produtos = await Produto.find({
      ativo: true,
      nome: { $regex: regex }
    })
      .select('nome preco fotos imagemUrl estoque reservado')
      .limit(5)
      .lean();

    const resultado = produtos.map(p => ({
      _id: p._id,
      nome: p.nome,
      preco: p.preco,
      foto: p.fotos?.[0] || p.imagemUrl || null,
    }));
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= FAVORITOS =================
router.get('/favoritos/check/:clienteId/:produtoId', async (req, res) => {
  try {
    const Favorito = require('../models/Favorito');
    const fav = await Favorito.findOne({
      cliente_id: req.params.clienteId,
      produto_id: req.params.produtoId
    });
    res.json({ isFavorito: !!fav });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/favoritos', async (req, res) => {
  try {
    const Favorito = require('../models/Favorito');
    const { cliente_id, produto_id } = req.body;
    if (!cliente_id || !produto_id)
      return res.status(400).json({ error: 'cliente_id e produto_id são obrigatórios.' });

    const existente = await Favorito.findOne({ cliente_id, produto_id });
    if (existente) {
      await Favorito.findByIdAndDelete(existente._id);
      return res.json({ isFavorito: false, message: 'Removido dos favoritos' });
    }
    const novo = new Favorito({ cliente_id, produto_id });
    await novo.save();
    res.status(201).json({ isFavorito: true, message: 'Adicionado aos favoritos' });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'Operação inválida.' });
    res.status(400).json({ error: err.message });
  }
});

router.delete('/favoritos', async (req, res) => {
  try {
    const Favorito = require('../models/Favorito');
    const { cliente_id, produto_id } = req.body;
    if (!cliente_id || !produto_id)
      return res.status(400).json({ error: 'cliente_id e produto_id são obrigatórios.' });
    await Favorito.findOneAndDelete({ cliente_id, produto_id });
    res.json({ message: 'Removido dos favoritos' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/favoritos/:clienteId', async (req, res) => {
  try {
    const Favorito = require('../models/Favorito');
    const favoritos = await Favorito.find({ cliente_id: req.params.clienteId })
      .populate('produto_id');
    res.json(favoritos);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ================= AVALIAÇÕES =================
router.post('/:id/avaliar', async (req, res) => {
  try {
    const Avaliacao = require('../models/Avaliacao');
    const { cliente_nome, cliente_email, nota, comentario } = req.body;
    if (!cliente_nome || !nota) {
      return res.status(400).json({ error: 'Nome e nota são obrigatórios.' });
    }
    const avaliacao = new Avaliacao({
      produto_id: req.params.id,
      cliente_nome,
      cliente_email: cliente_email || '',
      nota: Number(nota),
      comentario: comentario || '',
    });
    await avaliacao.save();
    res.status(201).json({ message: 'Avaliação enviada com sucesso!' });
  } catch (err) {
    console.error('Erro ao salvar avaliação:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/avaliacoes', async (req, res) => {
  try {
    const Avaliacao = require('../models/Avaliacao');
    const avaliacoes = await Avaliacao.find({
      produto_id: req.params.id,
      aprovado: true
    }).sort({ createdAt: -1 });
    res.json(avaliacoes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/media', async (req, res) => {
  try {
    const Avaliacao = require('../models/Avaliacao');
    const avaliacoes = await Avaliacao.find({
      produto_id: req.params.id,
      aprovado: true
    });
    if (avaliacoes.length === 0) return res.json({ media: 0, total: 0 });
    const soma = avaliacoes.reduce((acc, cur) => acc + cur.nota, 0);
    res.json({ media: (soma / avaliacoes.length).toFixed(1), total: avaliacoes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= ROTAS COM :ID =================
router.get('/:id', noCache, async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id)
      .populate('categoria', 'nome slug')
      .lean();
    if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json({
      ...produto,
      disponivel: (produto.estoque || 0) - (produto.reservado || 0)
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const produto = await Produto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(produto);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const produto = await Produto.findByIdAndDelete(req.params.id);
    if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json({ message: 'Produto excluído' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/produtos/:id/reservar
router.post('/:id/reservar', async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);
    if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });
    const qtd = parseInt(req.body.quantidade) || 1;

    const disponivel = (produto.estoque || 0) - (produto.reservado || 0);
    if (qtd > disponivel) throw new Error('Estoque insuficiente');

    produto.reservado = (produto.reservado || 0) + qtd;
    await produto.save();
    res.json({ disponivel: (produto.estoque || 0) - (produto.reservado || 0) });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// POST /api/produtos/:id/cancelar-reserva
router.post('/:id/cancelar-reserva', async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);
    if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });
    const qtd = parseInt(req.body.quantidade) || 1;

    produto.reservado = Math.max(0, (produto.reservado || 0) - qtd);
    await produto.save();
    res.json({ disponivel: (produto.estoque || 0) - (produto.reservado || 0) });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// POST /api/produtos/:id/confirmar
router.post('/:id/confirmar', async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);
    if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });
    const qtd = parseInt(req.body.quantidade) || 1;

    produto.estoque = Math.max(0, (produto.estoque || 0) - qtd);
    produto.reservado = Math.max(0, (produto.reservado || 0) - qtd);
    produto.vendas = (produto.vendas || 0) + qtd;
    await produto.save();
    res.json({ message: 'Compra confirmada', disponivel: (produto.estoque || 0) - (produto.reservado || 0) });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// ================= MIGRAÇÃO DE IMAGENS =================
router.post('/migrar-imagens', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acesso restrito.' });

    const { origem, destino } = req.body;
    const oldBase = origem || 'http://localhost:5000';
    const newBase = destino || 'https://res.cloudinary.com/dzwarbmzt/image/upload/v1/parthenon-produtos';

    const produtos = await Produto.find({
      $or: [
        { fotos: { $regex: oldBase, $options: 'i' } },
        { imagemUrl: { $regex: oldBase, $options: 'i' } }
      ]
    });

    let atualizados = 0;
    for (const produto of produtos) {
      const update = {};
      if (produto.fotos && Array.isArray(produto.fotos)) {
        update.fotos = produto.fotos.map(url => url.replace(oldBase, newBase));
      }
      if (produto.imagemUrl && typeof produto.imagemUrl === 'string') {
        update.imagemUrl = produto.imagemUrl.replace(oldBase, newBase);
      }
      await Produto.updateOne({ _id: produto._id }, { $set: update });
      atualizados++;
    }

    res.json({ message: `${atualizados} produtos atualizados.` });
  } catch (err) {
    console.error('Erro na migração:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;