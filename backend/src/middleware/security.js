const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

function getAllowedOrigins() {
  const configured = [
    process.env.FRONTEND_URL,
    process.env.APP_URL,
    process.env.CORS_ALLOWED_ORIGINS,
    process.env.FRONTEND_URLS,
  ]
    .filter(Boolean)
    .flatMap((value) => value.split(','))
    .map((value) => value.trim())
    .filter(Boolean);

  const defaults = ['http://localhost:3000', 'http://127.0.0.1:3000'];
  return [...new Set(configured.length ? configured : defaults)];
}

function buildCorsOptions() {
  const allowedOrigins = getAllowedOrigins();

  return {
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Origem não autorizada pelo CORS.'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400,
  };
}

function createLimiter({ windowMs, max, message, skipSuccessfulRequests = false }) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests,
    message: { error: message },
  });
}

const apiLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: Number.parseInt(process.env.API_RATE_LIMIT_MAX || '300', 10),
  message: 'Muitas requisições. Tente novamente em alguns minutos.',
});

const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: Number.parseInt(process.env.AUTH_RATE_LIMIT_MAX || '10', 10),
  message: 'Muitas tentativas de autenticação. Aguarde e tente novamente.',
  skipSuccessfulRequests: true,
});

const passwordResetLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: Number.parseInt(process.env.RESET_RATE_LIMIT_MAX || '5', 10),
  message: 'Muitas solicitações de redefinição. Tente novamente mais tarde.',
});

const uploadLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: Number.parseInt(process.env.UPLOAD_RATE_LIMIT_MAX || '30', 10),
  message: 'Muitos uploads em sequência. Aguarde um pouco.',
});

function securityHeaders() {
  return helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: ["'none'"],
        baseUri: ["'self'"],
        frameAncestors: ["'none'"],
        formAction: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'", 'https:'],
        fontSrc: ["'self'", 'https:', 'data:'],
      },
    },
    crossOriginResourcePolicy: false,
    hsts: process.env.NODE_ENV === 'production'
      ? { maxAge: 15552000, includeSubDomains: true }
      : false,
    frameguard: { action: 'deny' },
    referrerPolicy: { policy: 'no-referrer' },
  });
}

module.exports = {
  apiLimiter,
  authLimiter,
  buildCorsOptions,
  getAllowedOrigins,
  passwordResetLimiter,
  securityHeaders,
  uploadLimiter,
};
