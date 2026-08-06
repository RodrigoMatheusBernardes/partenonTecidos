const express = require('express');
const crypto = require('crypto');

const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const { authLimiter, passwordResetLimiter } = require('../middleware/security');
const PasswordResetToken = require('../models/PasswordResetToken');
const RefreshToken = require('../models/RefreshToken');
const { clearAuthCookies, getRefreshTokenMaxAgeMs, setAuthCookies } = require('../utils/cookies');
const { hashToken, randomTokenId, signAuthToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const {
  isStrongPassword,
  isValidEmail,
  normalizeEmail,
  sanitizeObject,
  sanitizeString,
  sanitizeText,
} = require('../utils/validation');

const router = express.Router();

function getClientContext(req) {
  return {
    userAgent: sanitizeString(req.headers['user-agent'] || '', 300),
    ipAddress: sanitizeString(req.ip || req.socket?.remoteAddress || '', 120),
  };
}

async function issueSession(user, req, res, options = {}) {
  const family = options.family || randomTokenId();
  const refreshJti = randomTokenId();
  const accessToken = signAuthToken(user);
  const refreshToken = signRefreshToken({
    id: user._id.toString(),
    role: user.role,
    email: user.email,
    family,
    jti: refreshJti,
    type: 'refresh',
  });
  const tokenHash = hashToken(refreshToken);
  const { userAgent, ipAddress } = getClientContext(req);

  await RefreshToken.create({
    userId: user._id,
    tokenHash,
    family,
    expiresAt: new Date(Date.now() + getRefreshTokenMaxAgeMs()),
    userAgent,
    ipAddress,
    lastUsedAt: new Date(),
  });

  setAuthCookies(res, { accessToken, refreshToken });

  return { accessToken, refreshToken };
}

async function revokeRefreshToken(refreshToken, replacedByTokenHash = null) {
  if (!refreshToken) return null;
  const tokenHash = hashToken(refreshToken);
  const current = await RefreshToken.findOne({ tokenHash });
  if (!current) return null;
  current.revokedAt = new Date();
  current.replacedByTokenHash = replacedByTokenHash;
  await current.save();
  return current;
}

async function revokeRefreshFamily(family) {
  await RefreshToken.updateMany(
    { family, revokedAt: null },
    { revokedAt: new Date() }
  );
}

// POST /api/auth/registrar – cliente comum (customer)
router.post('/registrar', authLimiter, async (req, res) => {
  try {
    const payload = sanitizeObject(req.body);
    const nome = sanitizeText(payload.nome, 120);
    const email = normalizeEmail(payload.email);
    const password = payload.password;

    if (!nome || !email || !password) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'E-mail inválido.' });
    }
    if (!isStrongPassword(password)) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 8 caracteres, incluindo letras e números.' });
    }

    const existente = await User.findOne({ email });
    if (existente) {
      return res.status(400).json({ error: 'Este email já está cadastrado.' });
    }
    const user = new User({ nome, email, password, role: 'customer' });
    await user.save();

    const { accessToken } = await issueSession(user, req, res);
    res.status(201).json({
      message: 'Conta criada com sucesso!',
      token: accessToken,
      user: { id: user._id, nome: user.nome, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// POST /api/auth/login – todos os perfis
router.post('/login', authLimiter, async (req, res) => {
  try {
    const payload = sanitizeObject(req.body);
    const email = normalizeEmail(payload.email);
    const password = payload.password;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'E-mail inválido.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }
    const { accessToken } = await issueSession(user, req, res);
    res.json({
      token: accessToken,
      user: { id: user._id, nome: user.nome, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// GET /api/auth/me – dados do usuário autenticado
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json({ id: user._id, nome: user.nome, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// POST /api/auth/refresh – renovação transparente de sessão
router.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies?.[process.env.REFRESH_COOKIE_NAME || 'parthenon_rt'];
    if (!refreshToken) {
      clearAuthCookies(res);
      return res.status(401).json({ error: 'Refresh token não fornecido.' });
    }

    const payload = verifyRefreshToken(refreshToken);
    if (payload.type !== 'refresh' || !payload.family || !payload.jti) {
      clearAuthCookies(res);
      return res.status(401).json({ error: 'Refresh token inválido.' });
    }

    const currentHash = hashToken(refreshToken);
    const storedToken = await RefreshToken.findOne({ tokenHash: currentHash, revokedAt: null });
    if (!storedToken) {
      await revokeRefreshFamily(payload.family);
      clearAuthCookies(res);
      return res.status(401).json({ error: 'Sessão inválida.' });
    }

    if (storedToken.expiresAt <= new Date()) {
      await revokeRefreshToken(refreshToken);
      clearAuthCookies(res);
      return res.status(401).json({ error: 'Sessão expirada.' });
    }

    const user = await User.findById(storedToken.userId).select('-password');
    if (!user) {
      await revokeRefreshFamily(payload.family);
      clearAuthCookies(res);
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }

    const nextRefreshJti = randomTokenId();
    const nextRefreshToken = signRefreshToken({
      id: user._id.toString(),
      role: user.role,
      email: user.email,
      family: payload.family,
      jti: nextRefreshJti,
      type: 'refresh',
    });
    const nextRefreshHash = hashToken(nextRefreshToken);
    const accessToken = signAuthToken(user);
    const { userAgent, ipAddress } = getClientContext(req);

    await revokeRefreshToken(refreshToken, nextRefreshHash);
    await RefreshToken.create({
      userId: user._id,
      tokenHash: nextRefreshHash,
      family: payload.family,
      expiresAt: new Date(Date.now() + getRefreshTokenMaxAgeMs()),
      userAgent,
      ipAddress,
      lastUsedAt: new Date(),
    });

    setAuthCookies(res, { accessToken, refreshToken: nextRefreshToken });

    res.json({
      token: accessToken,
      user: { id: user._id, nome: user.nome, email: user.email, role: user.role },
    });
  } catch (err) {
    clearAuthCookies(res);
    res.status(401).json({ error: 'Não foi possível renovar a sessão.' });
  }
});

// POST /api/auth/logout – logout da sessão atual
router.post('/logout', async (req, res) => {
  try {
    const refreshToken = req.cookies?.[process.env.REFRESH_COOKIE_NAME || 'parthenon_rt'];
    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }
    clearAuthCookies(res);
    res.json({ message: 'Logout realizado com sucesso.' });
  } catch (err) {
    clearAuthCookies(res);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// POST /api/auth/logout-all – revoga todas as sessões do usuário
router.post('/logout-all', authMiddleware, async (req, res) => {
  try {
    await RefreshToken.updateMany({ userId: req.user.id, revokedAt: null }, { revokedAt: new Date() });
    clearAuthCookies(res);
    res.json({ message: 'Todas as sessões foram encerradas.' });
  } catch (err) {
    clearAuthCookies(res);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// POST /api/auth/criar-vendedor – apenas administradores
router.post('/criar-vendedor', authMiddleware, requireRole(['admin']), async (req, res) => {
  try {
    const payload = sanitizeObject(req.body);
    const nome = sanitizeText(payload.nome, 120);
    const email = normalizeEmail(payload.email);
    const password = payload.password;

    if (!nome || !email || !password) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'E-mail inválido.' });
    }
    if (!isStrongPassword(password)) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 8 caracteres, incluindo letras e números.' });
    }

    const existente = await User.findOne({ email });
    if (existente) {
      return res.status(400).json({ error: 'Este email já está cadastrado.' });
    }

    const user = new User({ nome, email, password, role: 'seller' });
    await user.save();

    res.status(201).json({
      message: 'Vendedor criado com sucesso!',
      user: { id: user._id, nome: user.nome, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// POST /api/auth/esqueci-senha
router.post('/esqueci-senha', passwordResetLimiter, async (req, res) => {
  try {
    const payload = sanitizeObject(req.body);
    const email = normalizeEmail(payload.email);
    if (!email) return res.status(400).json({ error: 'E-mail é obrigatório.' });
    if (!isValidEmail(email)) return res.status(400).json({ error: 'E-mail inválido.' });

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: 'Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha.' });
    }

    await PasswordResetToken.updateMany({ userId: user._id, used: false }, { used: true });

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 3600000);

    await PasswordResetToken.create({ userId: user._id, tokenHash, expiresAt });

    const resetLink = `${(process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '')}/redefinir-senha?token=${token}&email=${encodeURIComponent(email)}`;

    const response = { message: 'Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha.' };
    if (process.env.NODE_ENV !== 'production' && process.env.RETURN_RESET_LINK_IN_RESPONSE === 'true') {
      response.debugResetLink = resetLink;
    }

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// POST /api/auth/redefinir-senha
router.post('/redefinir-senha', passwordResetLimiter, async (req, res) => {
  try {
    const payload = sanitizeObject(req.body);
    const token = sanitizeString(payload.token, 512);
    const newPassword = payload.newPassword || payload.novaSenha;
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token e nova senha são obrigatórios.' });
    }
    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 8 caracteres, incluindo letras e números.' });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const resetToken = await PasswordResetToken.findOne({
      tokenHash,
      used: false,
      expiresAt: { $gt: new Date() }
    });

    if (!resetToken) {
      return res.status(400).json({ error: 'Token inválido ou expirado.' });
    }

    const user = await User.findById(resetToken.userId);
    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado.' });
    }

    user.password = newPassword;
    await user.save();

    resetToken.used = true;
    await resetToken.save();
    await PasswordResetToken.updateMany({ userId: user._id, used: false }, { used: true });

    res.json({ message: 'Senha redefinida com sucesso! Faça login com a nova senha.' });
  } catch (err) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// PUT /api/auth/perfil
router.put('/perfil', authMiddleware, async (req, res) => {
  try {
    const payload = sanitizeObject(req.body);
    const nome = payload.nome ? sanitizeText(payload.nome, 120) : '';
    const currentPassword = payload.currentPassword;
    const newPassword = payload.newPassword;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Senha atual é obrigatória para definir uma nova senha.' });
      }
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ error: 'Senha atual incorreta.' });
      }
      if (!isStrongPassword(newPassword)) {
        return res.status(400).json({ error: 'A nova senha deve ter pelo menos 8 caracteres, incluindo letras e números.' });
      }
      user.password = newPassword;
    }

    if (nome) user.nome = nome;

    await user.save();

    res.json({ message: 'Perfil atualizado com sucesso!', nome: user.nome, email: user.email });
  } catch (err) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

module.exports = router;