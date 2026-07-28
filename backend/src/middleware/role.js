/**
 * Middleware de autorização baseada em roles.
 * Verifica se o usuário autenticado possui uma das roles permitidas.
 *
 * Uso:
 *   router.get('/admin', authMiddleware, requireRole(['admin']), handler);
 *   router.get('/seller', authMiddleware, requireRole(['seller', 'admin']), handler);
 */
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Acesso negado. Você não tem permissão para acessar este recurso.',
      });
    }

    next();
  };
};

module.exports = { requireRole };