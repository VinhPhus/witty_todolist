const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopItem', required: true },
  status: { type: String, enum: ['Chưa dùng', 'Đã dùng'], default: 'Chưa dùng' },
  purchasedAt: { type: Date, default: Date.now },
  usedAt: { type: Date }
});

module.exports = mongoose.model('Inventory', inventorySchema);
