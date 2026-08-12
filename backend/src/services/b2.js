// backend/src/services/b2.js
const https = require('https');

const B2_ACCOUNT_ID = process.env.B2_ACCESS_KEY_ID;
const B2_APPLICATION_KEY = process.env.B2_SECRET_ACCESS_KEY;
const B2_BUCKET_NAME = process.env.B2_BUCKET_NAME;
const B2_ENDPOINT = process.env.B2_ENDPOINT;

let authToken = null;
let apiUrl = null;
let downloadUrl = null;
let tokenExpiry = null;

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch {
            resolve(data);
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(body);
    }
    req.end();
  });
}

async function getB2Auth() {
  if (authToken && tokenExpiry && Date.now() < tokenExpiry) {
    return { authToken, apiUrl, downloadUrl };
  }

  const authString = Buffer.from(`${B2_ACCOUNT_ID}:${B2_APPLICATION_KEY}`).toString('base64');
  const options = {
    hostname: 'api.backblazeb2.com',
    path: '/b2api/v2/b2_authorize_account',
    method: 'POST',
    headers: {
      'Authorization': `Basic ${authString}`,
      'Content-Type': 'application/json',
    },
  };
  const data = await request(options);
  authToken = data.authorizationToken;
  apiUrl = data.apiUrl;
  downloadUrl = data.downloadUrl;
  tokenExpiry = Date.now() + (data.expirationInSeconds || 86400) * 1000;
  return { authToken, apiUrl, downloadUrl };
}

async function generateSignedUrl(fileKey, expiresIn = 3600) {
  const { authToken, apiUrl, downloadUrl } = await getB2Auth();

  const url = new URL(`${apiUrl}/b2api/v2/b2_get_download_authorization`);
  const options = {
    hostname: url.hostname,
    path: url.pathname,
    method: 'POST',
    headers: {
      'Authorization': authToken,
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({
    bucketName: B2_BUCKET_NAME,
    fileNamePrefix: fileKey,
    validDurationInSeconds: expiresIn,
  });
  const data = await request(options, body);
  return `${downloadUrl}/file/${B2_BUCKET_NAME}/${fileKey}?Authorization=${data.authorizationToken}`;
}

module.exports = { generateSignedUrl };