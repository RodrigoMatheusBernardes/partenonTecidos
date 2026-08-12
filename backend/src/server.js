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

// ✅ Compression middleware para reduzir tamanho de respostas (até 90%)
app.use(compression({
  level: 6,
  threshold: 1024  // Apenas comprimir respostas > 1KB
}));

app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Rotas da API
app.use('/api/frete', require('./routes/freteRoutes'));
app.use('/api/cupons', require('./routes/cupomRoutes'));
app.use('/api/produtos', require('./routes/produtoRoutes'));
app.use('/api/pedidos', require('./routes/pedidoRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/categorias', require('./routes/categoriaRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/vendedores', require('./routes/vendedorRoutes'));
app.use('/api/concorrentes', require('./routes/concorrenteRoutes'));
// Rotas de vídeos (B2)
app.use('/api/videos', require('./routes/videoRoutes'));
// Adicionar rotas de pagamento
app.use('/api/pagamentos', require('./routes/pagamentoRoutes'));
app.use('/api/webhooks', require('./routes/webhookRoutes'));
app.get('/api/health', (req, res) => {
  res.json({ message: 'Servidor OK' });
});

app.use((err, req, res, next) => {
  if (err && err.message === 'Origem não autorizada pelo CORS.') {
    return res.status(403).json({ error: 'Origem não autorizada.' });
  }
  return res.status(500).json({ error: 'Erro interno do servidor.' });
});

// Conecta ao banco e só então inicia o servidor
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Falha ao iniciar o servidor:', err.message);
    process.exit(1);
  });