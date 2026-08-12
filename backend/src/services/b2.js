const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// Configuração do cliente S3 para Backblaze B2
const s3Client = new S3Client({
  endpoint: 'https://s3.us-east-005.backblazeb2.com',
  region: 'us-east-005',
  credentials: {
    accessKeyId: process.env.B2_ACCESS_KEY_ID,
    secretAccessKey: process.env.B2_SECRET_ACCESS_KEY,
  },
});

// Nome do bucket fixo (substitui a variável de ambiente problemática)
const BUCKET_NAME = 'partenon-tecidos-videos';

async function generateSignedUrl(fileKey, expiresIn = 3600) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
  });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
  return signedUrl;
}

module.exports = { generateSignedUrl };