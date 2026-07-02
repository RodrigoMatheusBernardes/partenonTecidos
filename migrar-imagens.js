const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// CONFIGURAÇÃO – copie do seu .env ou do painel do Render
const MONGODB_URI = 'mongodb://rodrigotechlead_db_user:parthenontextil204488@cluster0-shard-00-00.ouy6kus.mongodb.net:27017,cluster0-shard-00-01.ouy6kus.mongodb.net:27017,cluster0-shard-00-02.ouy6kus.mongodb.net:27017/parthenon?replicaSet=atlas-xxxxx-shard-0&ssl=true&authSource=admin&appName=Cluster0';
const CLOUDINARY_URL = 'cloudinary://173648447634522:OMKNB4lZfQ1hhQjGxK@dzwarbmzt';

cloudinary.config({ url: CLOUDINARY_URL });

// Conecta ao MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Conectado ao MongoDB Atlas'))
  .catch(err => { console.error('❌ Erro no MongoDB:', err); process.exit(1); });

// Modelo simplificado do produto (apenas os campos que importam)
const productSchema = new mongoose.Schema({ fotos: [String], imagemUrl: String }, { strict: false });
const Product = mongoose.model('Product', productSchema);

async function migrate() {
  console.log('🔄 Buscando produtos com imagens locais...');
  
  // Busca todos os produtos que tenham 'localhost:5000' nas fotos ou imagemUrl
  const products = await Product.find({
    $or: [
      { fotos: { $regex: 'localhost:5000' } },
      { imagemUrl: { $regex: 'localhost:5000' } }
    ]
  });

  console.log(`📦 Encontrados ${products.length} produtos para migrar.`);

  for (const product of products) {
    const allImageUrls = [...(product.fotos || []), product.imagemUrl].filter(Boolean);
    const newUrls = [];

    for (const oldUrl of allImageUrls) {
      // Extrai o caminho local (ex: /uploads/1778217350854-237105947.png)
      const localPath = oldUrl.replace('http://localhost:5000', '');
      const fullPath = path.join(__dirname, 'backend', localPath); // ajuste se sua pasta 'uploads' estiver em outro lugar

      if (!fs.existsSync(fullPath)) {
        console.warn(`⚠️ Arquivo não encontrado: ${fullPath} – pulando.`);
        continue;
      }

      try {
        // Faz upload para o Cloudinary
        const result = await cloudinary.uploader.upload(fullPath, {
          folder: 'parthenon',
          use_filename: true,
          unique_filename: true,
        });
        newUrls.push(result.secure_url);
        console.log(`✅ Upload OK: ${result.secure_url}`);
      } catch (err) {
        console.error(`❌ Erro no upload de ${fullPath}:`, err.message);
      }
    }

    // Atualiza o produto no banco com as novas URLs do Cloudinary
    if (newUrls.length > 0) {
      if (product.fotos && product.fotos.length > 0) {
        product.fotos = newUrls;
      } else {
        product.imagemUrl = newUrls[0];
      }
      await product.save();
      console.log(`💾 Produto ${product._id} atualizado com URLs do Cloudinary.`);
    }
  }

  console.log('🎉 Migração concluída!');
  process.exit(0);
}

migrate();