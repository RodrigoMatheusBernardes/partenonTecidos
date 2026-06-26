const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./database');

// Carrega variáveis de ambiente apenas se NÃO estiver em produção (Render define NODE_ENV=production)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Conecta ao MongoDB (a função connectDB deve usar process.env.MONGODB_URI)
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/api/frete', require('./routes/freteRoutes'));
app.use('/api/cupons', require('./routes/cupomRoutes'));
app.use('/api/produtos', require('./routes/produtoRoutes'));
app.use('/api/pedidos', require('./routes/pedidoRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/categorias', require('./routes/categoriaRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/vendedores', require('./routes/vendedorRoutes'));
app.use('/api/concorrentes', require('./routes/concorrenteRoutes'));
app.get('/api/health', (req, res) => {
  res.json({ message: 'Servidor OK' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
const cors = require('cors');
const corsOptions = {
  origin: 'https://partenon-tecidos-w3t8-45v3v7co6-rpetrobernardes-1055s-projects.vercel.app', // seu link do Vercel
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));