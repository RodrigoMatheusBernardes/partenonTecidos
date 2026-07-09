// backend/update-image-urls.js
const mongoose = require('mongoose');

// Use a variável de ambiente MONGODB_URI (já configurada no Render)
const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error('❌ A variável MONGODB_URI não está definida.');
  process.exit(1);
}

// === CONFIGURE AQUI AS URLs ANTIGA E NOVA ===
const OLD_BASE = 'http://localhost:5000';
const NEW_BASE = 'https://partenontecidos.onrender.com'; // ou a URL do Cloudinary se preferir

async function migrate() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado ao MongoDB Atlas');

    const db = mongoose.connection.db;
    const collection = db.collection('produtos');

    const result = await collection.updateMany(
      {
        $or: [
          { fotos: { $regex: OLD_BASE, $options: 'i' } },
          { imagemUrl: { $regex: OLD_BASE, $options: 'i' } }
        ]
      },
      [
        {
          $set: {
            fotos: {
              $map: {
                input: '$fotos',
                as: 'url',
                in: {
                  $replaceOne: {
                    input: '$$url',
                    find: OLD_BASE,
                    replacement: NEW_BASE
                  }
                }
              }
            },
            imagemUrl: {
              $replaceOne: {
                input: { $ifNull: ['$imagemUrl', ''] },
                find: OLD_BASE,
                replacement: NEW_BASE
              }
            }
          }
        }
      ]
    );

    console.log(`${result.modifiedCount} produtos atualizados.`);
    await mongoose.disconnect();
    console.log('🎉 URLs atualizadas com sucesso!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro na migração:', err);
    process.exit(1);
  }
}

migrate();