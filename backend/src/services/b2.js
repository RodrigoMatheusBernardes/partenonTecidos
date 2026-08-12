const fetch = require('node-fetch');
const B2_ACCOUNT_ID = process.env.B2_ACCESS_KEY_ID;
const B2_APPLICATION_KEY = process.env.B2_SECRET_ACCESS_KEY;
const B2_BUCKET_NAME = process.env.B2_BUCKET_NAME;
const B2_ENDPOINT = process.env.B2_ENDPOINT;

let authToken = null, apiUrl = null, downloadUrl = null, tokenExpiry = null;

async function getB2Auth() {
  // (mesmo código de autenticação que enviei antes)
}

async function generateSignedUrl(fileKey, expiresIn = 3600) {
  // (mesmo código da API nativa que enviei antes)
}