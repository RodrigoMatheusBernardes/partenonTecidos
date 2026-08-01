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
// GET /api/seller/stats – estatísticas do vendedor (com pagamentos)
router.get('/stats', authMiddleware, requireRole(['seller']), async (req, res) => {
  try {
    const vendedorId = req.user.id;
    const Pagamento = require('../models/Pagamento');

    // Pedidos do vendedor
    const pedidos = await Pedido.find({ vendedor_id: vendedorId });

    // IDs dos pedidos
    const pedidoIds = pedidos.map(p => p._id);

    // Pagamentos dos pedidos do vendedor
    const pagamentos = await Pagamento.find({
      orderId: { $in: pedidoIds },
      status: 'PAID',
    });

    const totalVendas = pagamentos.reduce((acc, p) => acc + p.finalAmount, 0);
    const totalPedidos = pedidos.length;
    const pedidosPendentes = pedidos.filter(p => p.paymentStatus === 'AGUARDANDO_PAGAMENTO').length;

    // Clientes únicos
    const clientes = [...new Set(pedidos.map(p => p.cliente.email))];

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