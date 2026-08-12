// backend/src/services/b2.js
const https = require('https');

// Variáveis de ambiente (já existem)
const B2_ACCOUNT_ID = process.env.B2_ACCESS_KEY_ID;       // seu Application Key ID
const B2_APPLICATION_KEY = process.env.B2_SECRET_ACCESS_KEY; // sua Application Key
const B2_BUCKET_NAME = process.env.B2_BUCKET_NAME;

// Cache do token de autorização
let authToken = null;
let apiUrl = null;
let downloadUrl = null;
let tokenExpiry = null;

// Função para autenticar e obter token
async function getB2Auth() {
  if (authToken && tokenExpiry && Date.now() < tokenExpiry) {
    return { authToken, apiUrl, downloadUrl };
  }

  const authString = Buffer.from(`${B2_ACCOUNT_ID}:${B2_APPLICATION_KEY}`).toString('base64');
  const response = await fetch('https://api.backblazeb2.com/b2api/v2/b2_authorize_account', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${authString}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Falha na autenticação B2: ${response.status}`);
  }

  const data = await response.json();
  authToken = data.authorizationToken;
  apiUrl = data.apiUrl;
  downloadUrl = data.downloadUrl;
  // Expira em 24h (valor retornado)
  tokenExpiry = Date.now() + (data.expirationInSeconds || 86400) * 1000;

  return { authToken, apiUrl, downloadUrl };
}

/**
 * Gera uma URL de download autorizada para o B2 (equivalente a uma Signed URL).
 * @param {string} fileKey - Nome do arquivo no bucket (ex: 'ATENDIMENTO TEXTIL.mp4')
 * @param {number} expiresIn - Tempo de validade em segundos (padrão: 3600)
 * @returns {Promise<string>} URL com token de autorização
 */
async function generateSignedUrl(fileKey, expiresIn = 3600) {
  const { authToken, apiUrl, downloadUrl } = await getB2Auth();

  const body = JSON.stringify({
    bucketId: null, // se você tiver o bucketId, pode usá-lo; caso contrário, use o nome do bucket
    fileNamePrefix: fileKey,
    validDurationInSeconds: expiresIn,
  });

  // Se não tiver bucketId, usamos o nome do bucket no endpoint
  const endpoint = `${apiUrl}/b2api/v2/b2_get_download_authorization`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': authToken,
      'Content-Type': 'application/json',
    },
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Falha ao gerar autorização de download: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  // A URL final é: downloadUrl + '/file/' + bucketName + '/' + fileKey + '?Authorization=' + data.authorizationToken
  const url = `${downloadUrl}/file/${B2_BUCKET_NAME}/${fileKey}?Authorization=${data.authorizationToken}`;
  return url;
}

module.exports = { generateSignedUrl };