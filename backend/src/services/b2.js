// backend/src/services/b2.js

// Usa fetch nativo do Node.js (disponível a partir da versão 18, já temos 24)
// Não importamos node-fetch.

const B2_ACCOUNT_ID = process.env.B2_ACCESS_KEY_ID;
const B2_APPLICATION_KEY = process.env.B2_SECRET_ACCESS_KEY;
const B2_BUCKET_NAME = process.env.B2_BUCKET_NAME;

// Cache de autenticação
let authToken = null;
let apiUrl = null;
let downloadUrl = null;
let tokenExpiry = null;
let bucketId = null;

/**
 * Autentica no B2 e obtém token de autorização, apiUrl, downloadUrl.
 */
async function getB2Auth() {
  if (authToken && tokenExpiry && Date.now() < tokenExpiry) {
    return { authToken, apiUrl, downloadUrl };
  }

  const authString = Buffer.from(`${B2_ACCOUNT_ID}:${B2_APPLICATION_KEY}`).toString('base64');
  const response = await fetch('https://api.backblazeb2.com/b2api/v2/b2_authorize_account', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${authString}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`B2 authorize failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  authToken = data.authorizationToken;
  apiUrl = data.apiUrl;
  downloadUrl = data.downloadUrl;
  // A documentação indica que o token expira em 24 horas, mas o campo pode estar presente
  tokenExpiry = Date.now() + (data.expirationInSeconds || 86400) * 1000;

  return { authToken, apiUrl, downloadUrl };
}

/**
 * Obtém o bucketId a partir do nome do bucket.
 */
async function getBucketId(bucketName) {
  if (bucketId) {
    return bucketId;
  }

  const { authToken, apiUrl } = await getB2Auth();

  const response = await fetch(`${apiUrl}/b2api/v2/b2_list_buckets`, {
    method: 'POST',
    headers: {
      'Authorization': authToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      accountId: B2_ACCOUNT_ID,
      bucketName: bucketName,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`B2 list buckets failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  if (!data.buckets || data.buckets.length === 0) {
    throw new Error(`Bucket "${bucketName}" not found.`);
  }

  bucketId = data.buckets[0].bucketId;
  return bucketId;
}

/**
 * Gera um token de download autorizado para o arquivo.
 * A capacidade necessária na Application Key é "shareFiles".
 */
async function generateSignedUrl(fileKey, expiresIn = 3600) {
  try {
    const { authToken, apiUrl, downloadUrl } = await getB2Auth();
    const bucketId = await getBucketId(B2_BUCKET_NAME);

    const response = await fetch(`${apiUrl}/b2api/v2/b2_get_download_authorization`, {
      method: 'POST',
      headers: {
        'Authorization': authToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bucketId: bucketId,
        fileNamePrefix: fileKey,
        validDurationInSeconds: expiresIn,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`B2 get download auth failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    // A URL final é: downloadUrl + '/file/' + bucketName + '/' + fileKey + '?Authorization=' + data.authorizationToken
    return `${downloadUrl}/file/${B2_BUCKET_NAME}/${fileKey}?Authorization=${data.authorizationToken}`;
  } catch (error) {
    console.error('Erro detalhado ao gerar URL do vídeo:', error.message);
    throw error; // Re-lança para o videoRoutes.js capturar
  }
}

module.exports = { generateSignedUrl };