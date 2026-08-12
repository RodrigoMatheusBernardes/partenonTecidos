// Carrega variáveis de ambiente PRIMEIRO
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const compression = require('compression');
const connectDB = require('./database');
const { getJwtSecret } = require('./utils/jwt');
const { apiLimiter, buildCorsOptions, securityHeaders } = require('./middleware/security');

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);

getJwtSecret();

app.use(securityHeaders());

const corsOptions = buildCorsOptions();
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(apiLimiter);

// ✅ Compression middleware
app.use(compression({
  level: 6,
  threshold: 1024
}));

app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ============================================================
// ROTAS DA API — com isolamento de erro
// ============================================================

// Rotas antigas (já funcionavam)
app.use('/api/frete', require('./routes/freteRoutes'));
app.use('/api/cupons', require('./routes/cupomRoutes'));
app.use('/api/produtos', require('./routes/produtoRoutes'));
app.use('/api/pedidos', require('./routes/pedidoRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/categorias', require('./routes/categoriaRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/vendedores', require('./routes/vendedorRoutes'));
app.use('/api/concorrentes', require('./routes/concorrenteRoutes'));

// ============================================================
// ROTAS NOVAS — isoladas para diagnóstico
// ============================================================

// 1. Rota de vídeos
try {
  console.log('🔄 Importando videoRoutes...');
  const videoRoutes = require('./routes/videoRoutes');
  console.log('✅ videoRoutes importado com sucesso:', typeof videoRoutes);
  app.use('/api/videos', videoRoutes);
} catch (err) {
  console.error('❌ Erro ao importar videoRoutes:', err.message);
}

// 2. Rota de pagamentos
try {
  console.log('🔄 Importando pagamentoRoutes...');
  const pagamentoRoutes = require('./routes/pagamentoRoutes');
  console.log('✅ pagamentoRoutes importado com sucesso:', typeof pagamentoRoutes);
  app.use('/api/pagamentos', pagamentoRoutes);
} catch (err) {
  console.error('❌ Erro ao importar pagamentoRoutes:', err.message);
}

// 3. Rota de webhooks
try {
  console.log('🔄 Importando webhookRoutes...');
  const webhookRoutes = require('./routes/webhookRoutes');
  console.log('✅ webhookRoutes importado com sucesso:', typeof webhookRoutes);
  app.use('/api/webhooks', webhookRoutes);
} catch (err) {
  console.error('❌ Erro ao importar webhookRoutes:', err.message);
}

// ============================================================
// HEALTH CHECK
// ============================================================
app.get('/api/health', (req, res) => {
  res.json({ message: 'Servidor OK' });
});

// ============================================================
// TRATAMENTO DE ERROS GLOBAL
// ============================================================
app.use((err, req, res, next) => {
  if (err && err.message === 'Origem não autorizada pelo CORS.') {
    return res.status(403).json({ error: 'Origem não autorizada.' });
  }
  return res.status(500).json({ error: 'Erro interno do servidor.' });
});

// ============================================================
// CONEXÃO COM BANCO E INÍCIO DO SERVIDOR
// ============================================================
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Falha ao iniciar o servidor:', err.message);
    process.exit(1);
  });