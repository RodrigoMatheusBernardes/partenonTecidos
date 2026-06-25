const express = require('express');
const router = express.Router();
const Concorrente = require('../models/Concorrente');
const authMiddleware = require('../middleware/auth');

// Admin: listar todos
router.get('/admin', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acesso restrito.' });
  const concorrentes = await Concorrente.find().sort({ data_coleta: -1 });
  res.json(concorrentes);
});

// Admin: criar
router.post('/admin', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acesso restrito.' });
  try {
    const conc = new Concorrente(req.body);
    await conc.save();
    res.status(201).json(conc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: excluir
router.delete('/admin/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acesso restrito.' });
  await Concorrente.findByIdAndDelete(req.params.id);
  res.json({ message: 'Excluído.' });
});

module.exports = router;