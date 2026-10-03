const mongoose = require('mongoose');

const shopItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  icon: { type: String, default: 'default-icon.png' }
}, { timestamps: true });

module.exports = mongoose.model('ShopItem', shopItemSchema);
