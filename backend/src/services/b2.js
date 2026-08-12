// backend/src/services/b2.js
const fetch = require('node-fetch');

const B2_ACCOUNT_ID = process.env.B2_ACCESS_KEY_ID;
const B2_APPLICATION_KEY = process.env.B2_SECRET_ACCESS_KEY;
const B2_BUCKET_NAME = process.env.B2_BUCKET_NAME;
const B2_ENDPOINT = process.env.B2_ENDPOINT;

let authToken = null;
let apiUrl = null;
let downloadUrl = null;
let tokenExpiry = null;

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
    throw new Error(`Falha na autenticação B2: ${response.status}`);
  }

  const data = await response.json();
  authToken = data.authorizationToken;
  apiUrl = data.apiUrl;
  downloadUrl = data.downloadUrl;
  tokenExpiry = Date.now() + (data.expirationInSeconds || 86400) * 1000;

  return { authToken, apiUrl, downloadUrl };
}

async function generateSignedUrl(fileKey, expiresIn = 3600) {
  const { authToken, apiUrl, downloadUrl } = await getB2Auth();

  const response = await fetch(`${apiUrl}/b2api/v2/b2_get_download_authorization`, {
    method: 'POST',
    headers: {
      'Authorization': authToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      bucketName: B2_BUCKET_NAME,
      fileNamePrefix: fileKey,
      validDurationInSeconds: expiresIn,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Falha ao gerar autorização: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return `${downloadUrl}/file/${B2_BUCKET_NAME}/${fileKey}?Authorization=${data.authorizationToken}`;
}

module.exports = { generateSignedUrl };