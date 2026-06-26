const express = require('express');
const cors = require('cors'); // Já existe
const path = require('path');
const connectDB = require('./database');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

connectDB();

const app = express();

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
// ... (o resto das rotas)