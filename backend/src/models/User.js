const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },
  googleId: { type: String, sparse: true, unique: true },
  displayName: { type: String, required: true },
  avatarUrl: { type: String, default: '' },
  gender: { type: String, enum: ['Nam', 'Nữ', 'Khác'], default: 'Khác' },
  rankIndex: { type: Number, default: 0 },
  rankPoints: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
  totalTasksCompleted: { type: Number, default: 0 },
  inactiveDays: { type: Number, default: 0 },
  claimedRanks: { type: [Number], default: [] },
  seasonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Season' },
  refreshToken: { type: String }
}, { timestamps: true });

userSchema.index({ rankIndex: -1, rankPoints: -1, updatedAt: 1 });

module.exports = mongoose.model('User', userSchema);
