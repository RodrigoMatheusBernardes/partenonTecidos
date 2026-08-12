// backend/src/services/b2.js

/**
 * Integração Backblaze B2 usando a API Native v4.
 *
 * Requisitos:
 * - Node.js 18+ (usa fetch nativo)
 * - B2_ACCESS_KEY_ID
 * - B2_SECRET_ACCESS_KEY
 * - B2_BUCKET_NAME
 *
 * A Application Key precisa ter, no mínimo:
 * - listBuckets
 * - shareFiles
 * - readFiles
 */

const B2_ACCESS_KEY_ID = process.env.B2_ACCESS_KEY_ID;
const B2_SECRET_ACCESS_KEY = process.env.B2_SECRET_ACCESS_KEY;
const B2_BUCKET_NAME = process.env.B2_BUCKET_NAME;

let authToken = null;
let accountId = null;
let apiUrl = null;
let downloadUrl = null;
let tokenExpiry = 0;
let bucketId = null;

/**
 * Valida se as variáveis essenciais existem.
 * Nunca imprime os valores das credenciais.
 */
function validateEnvironment() {
  const missing = [];

  if (!B2_ACCESS_KEY_ID) {
    missing.push('B2_ACCESS_KEY_ID');
  }

  if (!B2_SECRET_ACCESS_KEY) {
    missing.push('B2_SECRET_ACCESS_KEY');
  }

  if (!B2_BUCKET_NAME) {
    missing.push('B2_BUCKET_NAME');
  }

  if (missing.length > 0) {
    throw new Error(
      `Variáveis de ambiente B2 ausentes: ${missing.join(', ')}`
    );
  }
}

/**
 * Autentica no Backblaze B2 usando API v4.
 *
 * A API atual usa:
 * GET /b2api/v4/b2_authorize_account
 *
 * Authorization:
 * Basic base64(applicationKeyId:applicationKey)
 */
async function getB2Auth() {
  validateEnvironment();

  // Reutiliza o token enquanto estiver válido.
  // Renovamos alguns minutos antes da expiração.
  if (
    authToken &&
    tokenExpiry &&
    Date.now() < tokenExpiry
  ) {
    return {
      authToken,
      accountId,
      apiUrl,
      downloadUrl,
    };
  }

  const credentials = `${B2_ACCESS_KEY_ID}:${B2_SECRET_ACCESS_KEY}`;

  const basicAuth = Buffer
    .from(credentials, 'utf8')
    .toString('base64');

  const response = await fetch(
    'https://api.backblazeb2.com/b2api/v4/b2_authorize_account',
    {
      method: 'GET',
      headers: {
        Authorization: `Basic ${basicAuth}`,
      },
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    // NÃO imprime credentials, Basic Auth ou token.
    throw new Error(
      `B2 authorize failed: ${response.status} - ${responseText}`
    );
  }

  let data;

  try {
    data = JSON.parse(responseText);
  } catch (error) {
    throw new Error(
      'B2 authorize retornou uma resposta que não é JSON válido.'
    );
  }

  // API v4:
  // accountId
  // authorizationToken
  // apiInfo.storageApi.apiUrl
  // apiInfo.storageApi.downloadUrl
  if (!data.accountId) {
    throw new Error(
      'B2 authorize: resposta não contém accountId.'
    );
  }

  if (!data.authorizationToken) {
    throw new Error(
      'B2 authorize: resposta não contém authorizationToken.'
    );
  }

  if (!data.apiInfo?.storageApi?.apiUrl) {
    throw new Error(
      'B2 authorize: resposta não contém apiInfo.storageApi.apiUrl.'
    );
  }

  if (!data.apiInfo?.storageApi?.downloadUrl) {
    throw new Error(
      'B2 authorize: resposta não contém apiInfo.storageApi.downloadUrl.'
    );
  }

  accountId = data.accountId;
  authToken = data.authorizationToken;
  apiUrl = data.apiInfo.storageApi.apiUrl;
  downloadUrl = data.apiInfo.storageApi.downloadUrl;

  // O token B2 é válido por no máximo 24h.
  // Usamos 23h para evitar trabalhar no limite da expiração.
  tokenExpiry = Date.now() + (23 * 60 * 60 * 1000);

  console.log('✅ B2 authentication successful');

  return {
    authToken,
    accountId,
    apiUrl,
    downloadUrl,
  };
}

/**
 * Obtém o bucketId através do nome do bucket.
 */
async function getBucketId() {
  if (bucketId) {
    return bucketId;
  }

  const {
    authToken,
    accountId,
    apiUrl,
  } = await getB2Auth();

  const response = await fetch(
    `${apiUrl}/b2api/v4/b2_list_buckets`,
    {
      method: 'POST',
      headers: {
        Authorization: authToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accountId,
        bucketName: B2_BUCKET_NAME,
      }),
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `B2 list buckets failed: ${response.status} - ${responseText}`
    );
  }

  let data;

  try {
    data = JSON.parse(responseText);
  } catch (error) {
    throw new Error(
      'B2 list buckets retornou uma resposta que não é JSON válido.'
    );
  }

  if (!Array.isArray(data.buckets) || data.buckets.length === 0) {
    throw new Error(
      `Bucket "${B2_BUCKET_NAME}" não encontrado na conta B2.`
    );
  }

  const bucket = data.buckets.find(
    (item) => item.bucketName === B2_BUCKET_NAME
  );

  if (!bucket) {
    throw new Error(
      `Bucket "${B2_BUCKET_NAME}" não foi encontrado.`
    );
  }

  if (!bucket.bucketId) {
    throw new Error(
      `O bucket "${B2_BUCKET_NAME}" foi encontrado, mas não possui bucketId.`
    );
  }

  bucketId = bucket.bucketId;

  console.log('✅ B2 bucket found');

  return bucketId;
}

/**
 * Gera uma autorização específica para o arquivo.
 *
 * A Application Key precisa possuir:
 * shareFiles
 */
async function generateSignedUrl(fileKey, expiresIn = 3600) {
  try {
    if (!fileKey) {
      throw new Error('fileKey não informado.');
    }

    if (
      !Number.isInteger(expiresIn) ||
      expiresIn < 1 ||
      expiresIn > 604800
    ) {
      throw new Error(
        'expiresIn deve estar entre 1 e 604800 segundos.'
      );
    }

    const {
      authToken,
      apiUrl,
      downloadUrl,
    } = await getB2Auth();

    const currentBucketId = await getBucketId();

    const response = await fetch(
      `${apiUrl}/b2api/v4/b2_get_download_authorization`,
      {
        method: 'POST',
        headers: {
          Authorization: authToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bucketId: currentBucketId,
          fileNamePrefix: fileKey,
          validDurationInSeconds: expiresIn,
        }),
      }
    );

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(
        `B2 get download auth failed: ${response.status} - ${responseText}`
      );
    }

    let data;

    try {
      data = JSON.parse(responseText);
    } catch (error) {
      throw new Error(
        'B2 get download authorization retornou uma resposta que não é JSON válido.'
      );
    }

    if (!data.authorizationToken) {
      throw new Error(
        'B2 get download authorization não retornou authorizationToken.'
      );
    }

    /**
     * Codificamos o nome do arquivo para evitar problemas
     * caso futuramente ele contenha espaços ou caracteres especiais.
     *
     * Mantemos "/" sem encoding para preservar possíveis caminhos.
     */
    const encodedFileKey = fileKey
      .split('/')
      .map(encodeURIComponent)
      .join('/');

    const finalUrl =
      `${downloadUrl}/file/${encodeURIComponent(B2_BUCKET_NAME)}/${encodedFileKey}` +
      `?Authorization=${encodeURIComponent(data.authorizationToken)}`;

    console.log(
      `✅ B2 signed URL generated for file: ${fileKey}`
    );

    return finalUrl;

  } catch (error) {
    /**
     * IMPORTANTE:
     * Nunca registrar:
     * - B2_SECRET_ACCESS_KEY
     * - Authorization header
     * - authToken
     * - signed URL
     */
    console.error(
      'Erro detalhado ao gerar URL do vídeo:',
      error.message
    );

    throw error;
  }
}

module.exports = {
  generateSignedUrl,
};