const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const DEFAULT_ISSUER = 'parthenon-backend';
const DEFAULT_AUDIENCE = 'parthenon-frontend';

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET ausente ou inseguro. Defina um segredo com pelo menos 32 caracteres.');
  }
  return secret;
}

function getJwtOptions() {
  return {
    algorithm: 'HS256',
    issuer: process.env.JWT_ISSUER || DEFAULT_ISSUER,
    audience: process.env.JWT_AUDIENCE || DEFAULT_AUDIENCE,
  };
}

function signAuthToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      nome: user.nome,
    },
    getJwtSecret(),
    {
      ...getJwtOptions(),
      expiresIn: process.env.JWT_EXPIRES_IN || '12h',
    }
  );
}

function signRefreshToken(payload) {
  return jwt.sign(payload, getJwtSecret(), {
    ...getJwtOptions(),
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
}

function verifyAuthToken(token) {
  return jwt.verify(token, getJwtSecret(), {
    algorithms: ['HS256'],
    issuer: process.env.JWT_ISSUER || DEFAULT_ISSUER,
    audience: process.env.JWT_AUDIENCE || DEFAULT_AUDIENCE,
  });
}

function verifyRefreshToken(token) {
  return jwt.verify(token, getJwtSecret(), {
    algorithms: ['HS256'],
    issuer: process.env.JWT_ISSUER || DEFAULT_ISSUER,
    audience: process.env.JWT_AUDIENCE || DEFAULT_AUDIENCE,
  });
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function randomTokenId() {
  return crypto.randomUUID();
}

module.exports = {
  getJwtSecret,
  hashToken,
  randomTokenId,
  signAuthToken,
  signRefreshToken,
  verifyAuthToken,
  verifyRefreshToken,
};
