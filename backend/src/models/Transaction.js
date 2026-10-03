const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['earn', 'spend'], required: true },
  amount: { type: Number, required: true },
  reason: { type: String, required: true },
  referenceId: { type: mongoose.Schema.Types.ObjectId }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
