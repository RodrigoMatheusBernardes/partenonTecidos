const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./database');

// Carrega variáveis de ambiente apenas em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Conecta ao MongoDB
connectDB();

const app = express();

// Configuração CORS – libera qualquer origem (incluindo o seu Vercel)
const corsOptions = {
  origin: function (origin, callback) {
    callback(null, true);
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json());
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

// Rota de health check (para testar se o servidor está OK)
app.get('/api/health', (req, res) => {
  res.json({ message: 'Servidor OK' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});