const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User', index: true },
  tokenHash: { type: String, required: true, unique: true, index: true },
  family: { type: String, required: true, index: true },
  expiresAt: { type: Date, required: true, index: true },
  replacedByTokenHash: { type: String, default: null },
  revokedAt: { type: Date, default: null },
  lastUsedAt: { type: Date, default: null },
  userAgent: { type: String, default: '' },
  ipAddress: { type: String, default: '' },
}, { timestamps: true });

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.models.RefreshToken || mongoose.model('RefreshToken', refreshTokenSchema);
