// backend/src/services/b2.js

// Usa fetch nativo do Node.js (já disponível em Node 24)
// Sem dependências externas.

const B2_APP_KEY_ID = process.env.B2_ACCESS_KEY_ID;      // Application Key ID
const B2_APP_KEY = process.env.B2_SECRET_ACCESS_KEY;      // Application Key
const B2_BUCKET_NAME = process.env.B2_BUCKET_NAME;

// Cache de autenticação e dados
let authData = null;          // Armazena { accountId, apiUrl, downloadUrl, authorizationToken, tokenExpiry }
let bucketId = null;

/**
 * Autentica no B2 usando API v4 (GET com Basic Auth).
 * A documentação oficial recomenda GET para b2_authorize_account.
 */
async function getB2Auth() {
  if (authData && authData.tokenExpiry && Date.now() < authData.tokenExpiry) {
    return authData;
  }

  const authString = Buffer.from(`${B2_APP_KEY_ID}:${B2_APP_KEY}`).toString('base64');
  const response = await fetch('https://api.backblazeb2.com/b2api/v4/b2_authorize_account', {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${authString}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`B2 authorize failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  authData = {
    accountId: data.accountId,
    apiUrl: data.apiUrl,
    downloadUrl: data.downloadUrl,
    authorizationToken: data.authorizationToken,
    tokenExpiry: Date.now() + (data.expirationInSeconds || 86400) * 1000,
  };
  return authData;
}

/**
 * Obtém o bucketId a partir do nome do bucket.
 */
async function getBucketId() {
  if (bucketId) return bucketId;

  const { accountId, apiUrl, authorizationToken } = await getB2Auth();

  const response = await fetch(`${apiUrl}/b2api/v4/b2_list_buckets`, {
    method: 'POST',
    headers: {
      'Authorization': authorizationToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      accountId: accountId,
      bucketName: B2_BUCKET_NAME,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`B2 list buckets failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  if (!data.buckets || data.buckets.length === 0) {
    throw new Error(`Bucket "${B2_BUCKET_NAME}" not found.`);
  }

  bucketId = data.buckets[0].bucketId;
  return bucketId;
}

/**
 * Gera token de download autorizado (caminho streaming)
 * A Application Key precisa ter a capacidade "shareFiles".
 */
async function generateSignedUrl(fileKey, expiresIn = 3600) {
  try {
    const { accountId, apiUrl, downloadUrl, authorizationToken } = await getB2Auth();
    const bucketId = await getBucketId();

    const response = await fetch(`${apiUrl}/b2api/v4/b2_get_download_authorization`, {
      method: 'POST',
      headers: {
        'Authorization': authorizationToken,
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
    // A URL final de download é: downloadUrl + '/file/' + bucketName + '/' + fileKey + '?Authorization=' + data.authorizationToken
    return `${downloadUrl}/file/${B2_BUCKET_NAME}/${fileKey}?Authorization=${data.authorizationToken}`;
  } catch (error) {
    console.error('Erro detalhado ao gerar URL do vídeo:', error.message);
    throw error;
  }
}

module.exports = { generateSignedUrl };