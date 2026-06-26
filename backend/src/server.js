const express = require('express');
const cors = require('cors'); // Já existe aqui
const path = require('path');
const connectDB = require('./database');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

connectDB();

const app = express();

// Configuração CORS corrigida (substitua app.use(cors()) por isso)
const corsOptions = {
  origin: function (origin, callback) {
    callback(null, true); // Permite qualquer origem (aceita o Vercel)
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
// ... o resto das rotas