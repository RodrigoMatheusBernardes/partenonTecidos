const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// POST /api/auth/registrar
router.post('/registrar', async (req, res) => {
  try {
    const { nome, email, password } = req.body;
    if (!nome || !email || !password) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
    }
    const existente = await User.findOne({ email });
    if (existente) {
      return res.status(400).json({ error: 'Este email já está cadastrado.' });
    }
    const user = new User({ nome, email, password, role: 'customer' });
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'parthenon_secret_key_2026',
      { expiresIn: '7d' }
    );
    res.status(201).json({
      message: 'Conta criada com sucesso!',
      token,
      user: { id: user._id, nome: user.nome, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, nome: user.nome },
      process.env.JWT_SECRET || 'parthenon_secret_key_2026',
      { expiresIn: '7d' }
    );
    res.json({
      token,
      user: { id: user._id, nome: user.nome, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json({ id: user._id, nome: user.nome, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const crypto = require('crypto');
const PasswordResetToken = require('../models/PasswordResetToken');

// POST /api/auth/esqueci-senha
router.post('/esqueci-senha', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'E-mail é obrigatório.' });

    const user = await User.findOne({ email });
    if (!user) {
      // Por segurança, retornamos sucesso genérico para não revelar se o e-mail existe
      return res.json({ message: 'Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha.' });
    }

    // Gera token único
    const token = crypto.randomBytes(32).toString('hex');
    // Expira em 1 hora
    const expiresAt = new Date(Date.now() + 3600000);

    await PasswordResetToken.create({ userId: user._id, token, expiresAt });

    const resetLink = `http://localhost:3000/redefinir-senha?token=${token}`;

    // 🖨️ Exibe no console (substituir por envio de e-mail posteriormente)
    console.log(`\n📧 Link de redefinição de senha para ${email}:\n${resetLink}\n`);

    res.json({ message: 'Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha.' });
  } catch (err) {
    console.error('Erro ao solicitar redefinição:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// POST /api/auth/redefinir-senha
router.post('/redefinir-senha', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token e nova senha são obrigatórios.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });
    }

    const resetToken = await PasswordResetToken.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() }
    });

    if (!resetToken) {
      return res.status(400).json({ error: 'Token inválido ou expirado.' });
    }

    // Atualiza a senha do usuário
    const user = await User.findById(resetToken.userId);
    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado.' });
    }

    user.password = newPassword; // o middleware pre-save fará o hash
    await user.save();

    // Marca o token como usado
    resetToken.used = true;
    await resetToken.save();

    res.json({ message: 'Senha redefinida com sucesso! Faça login com a nova senha.' });
  } catch (err) {
    console.error('Erro ao redefinir senha:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});
// PUT /api/auth/perfil – atualizar nome e/ou senha do cliente logado
router.put('/perfil', authMiddleware, async (req, res) => {
  try {
    const { nome, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

    // Se quiser trocar a senha, precisa confirmar a senha atual
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Senha atual é obrigatória para definir uma nova senha.' });
      }
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ error: 'Senha atual incorreta.' });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'A nova senha deve ter pelo menos 6 caracteres.' });
      }
      user.password = newPassword;
    }

    if (nome) user.nome = nome;

    await user.save();

    res.json({ message: 'Perfil atualizado com sucesso!', nome: user.nome, email: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;