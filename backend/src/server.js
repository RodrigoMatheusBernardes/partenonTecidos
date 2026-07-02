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

// Configuração CORS – FORÇA BRUTA (substitui tudo)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

// Middleware manual para garantir headers CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

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

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Servidor OK' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => {
    console.error('Erro ao conectar no MongoDB:', err.message);
    process.exit(1);
  });