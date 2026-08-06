const mongoose = require('mongoose');

const passwordResetTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  tokenHash: { type: String, required: true, index: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false }
}, { timestamps: true });

passwordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.models.PasswordResetToken || mongoose.model('PasswordResetToken', passwordResetTokenSchema);