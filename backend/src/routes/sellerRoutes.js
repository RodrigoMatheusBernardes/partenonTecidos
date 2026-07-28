const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Pedido = require('../models/Pedido');

// GET /api/seller/stats – estatísticas do vendedor
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'seller') {
      return res.status(403).json({ error: 'Acesso restrito a vendedores.' });
    }

    const vendedorId = req.user.id;

    const totalPedidos = await Pedido.countDocuments({ vendedor_id: vendedorId });
    const pedidosPendentes = await Pedido.countDocuments({
      vendedor_id: vendedorId,
      status: 'pendente',
    });

    const vendas = await Pedido.aggregate([
      { $match: { vendedor_id: vendedorId, status: { $ne: 'cancelado' } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    const totalVendas = vendas[0]?.total || 0;

    const clientes = await Pedido.distinct('cliente.email', { vendedor_id: vendedorId });

    res.json({
      totalPedidos,
      totalClientes: clientes.length,
      totalVendas,
      pedidosPendentes,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;