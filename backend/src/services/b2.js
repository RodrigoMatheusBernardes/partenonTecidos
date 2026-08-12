const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// Configuração do cliente S3 para Backblaze B2 (valores fixos)
const s3Client = new S3Client({
  endpoint: 'https://s3.us-east-005.backblazeb2.com',
  region: 'us-east-005',
  credentials: {
    accessKeyId: process.env.B2_ACCESS_KEY_ID,
    secretAccessKey: process.env.B2_SECRET_ACCESS_KEY,
  },
});

/**
 * Gera uma URL pré-assinada para um arquivo no bucket B2.
 * @param {string} fileKey - O caminho/arquivo dentro do bucket (ex: 'vd ATENDIMENTO TEXTIL.mp4')
 * @param {number} expiresIn - Tempo de expiração em segundos (padrão: 3600 = 1 hora)
 * @returns {Promise<string>} - A URL pré-assinada
 */
async function generateSignedUrl(fileKey, expiresIn = 3600) {
  const command = new GetObjectCommand({
    Bucket: process.env.B2_BUCKET_NAME,
    Key: fileKey,
  });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
  return signedUrl;
}

module.exports = { generateSignedUrl };