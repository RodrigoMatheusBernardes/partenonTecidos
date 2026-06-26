const mongoose = require('mongoose');

const connectDB = async () => {
  // Verifica se a variável de ambiente está definida
  if (!process.env.MONGODB_URI) {
    console.error("ERRO CRÍTICO: A variável MONGODB_URI não está definida no ambiente.");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Erro ao conectar ao MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;