const mongoose = require('mongoose');

function sanitizeString(value, maxLength = 255) {
  if (typeof value !== 'string') return '';
  return value
    .trim()
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .slice(0, maxLength);
}

function sanitizeText(value, maxLength = 2000) {
  return sanitizeString(value, maxLength).replace(/[<>]/g, '');
}

function sanitizeObject(value) {
  if (Array.isArray(value)) {
    return value.map(sanitizeObject);
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).reduce((acc, [key, currentValue]) => {
      if (key.startsWith('$') || key.includes('.')) return acc;
      acc[key] = sanitizeObject(currentValue);
      return acc;
    }, {});
  }

  if (typeof value === 'string') {
    return value.trim();
  }

  return value;
}

function normalizeEmail(email) {
  return sanitizeString(email, 254).toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));
}

function isStrongPassword(password) {
  return typeof password === 'string'
    && password.length >= 8
    && /[A-Za-z]/.test(password)
    && /\d/.test(password);
}

function validateObjectId(value) {
  return typeof value === 'string' && mongoose.Types.ObjectId.isValid(value);
}

function parsePositiveInteger(value, defaultValue = 1, maxValue = 999) {
  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isInteger(parsed) || parsed < 1) return defaultValue;
  return Math.min(parsed, maxValue);
}

function parseMoney(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return Number(parsed.toFixed(2));
}

function escapeRegex(value) {
  return sanitizeString(value, 100).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function pick(source, allowedKeys) {
  return allowedKeys.reduce((acc, key) => {
    if (Object.prototype.hasOwnProperty.call(source, key) && source[key] !== undefined) {
      acc[key] = source[key];
    }
    return acc;
  }, {});
}

module.exports = {
  escapeRegex,
  isStrongPassword,
  isValidEmail,
  normalizeEmail,
  parseMoney,
  parsePositiveInteger,
  pick,
  sanitizeObject,
  sanitizeString,
  sanitizeText,
  validateObjectId,
};
