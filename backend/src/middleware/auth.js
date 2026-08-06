const { verifyAuthToken } = require('../utils/jwt');
const { getAccessTokenCookieName } = require('../utils/cookies');

module.exports = (req, res, next) => {
  const header = req.headers.authorization;
  const cookieToken = req.cookies?.[getAccessTokenCookieName()];
  let token = cookieToken;

  if (!token && header) {
    if (!header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Formato de token inválido.' });
    }
    token = header.split(' ')[1];
  }

  if (!token) return res.status(401).json({ error: 'Token não fornecido.' });

  try {
    const decoded = verifyAuthToken(token);
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};