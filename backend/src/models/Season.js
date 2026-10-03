const mongoose = require('mongoose');

const seasonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'ended'], default: 'active' },
  topPlayers: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    displayName: String,
    rankIndex: Number,
    rankPoints: Number
  }]
}, { timestamps: true });

module.exports = mongoose.model('Season', seasonSchema);
