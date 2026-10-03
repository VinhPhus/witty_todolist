const ShopItem = require('../models/ShopItem');
const Inventory = require('../models/Inventory');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Get all shop items for the user
exports.getShopItems = async (req, res) => {
  try {
    const items = await ShopItem.find({ userId: req.user._id });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new shop item
exports.createShopItem = async (req, res) => {
  try {
    const { name, price, icon } = req.body;
    const item = await ShopItem.create({
      userId: req.user._id,
      name,
      price,
      icon
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update shop item
exports.updateShopItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, icon } = req.body;
    
    const item = await ShopItem.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { name, price, icon },
      { new: true }
    );
    
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete shop item
exports.deleteShopItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await ShopItem.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Buy an item
exports.buyItem = async (req, res) => {
  try {
    const { itemId } = req.body;
    const item = await ShopItem.findOne({ _id: itemId, userId: req.user._id });
    
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    const user = await User.findById(req.user._id);
    if (user.balance < item.price) {
      return res.status(400).json({ message: 'Not enough balance' });
    }
    
    // Deduct balance
    user.balance -= item.price;
    await user.save();
    
    // Add to inventory
    const inventory = await Inventory.create({
      userId: req.user._id,
      itemId: item._id,
      status: 'Chưa dùng'
    });
    
    // Create transaction
    await Transaction.create({
      userId: req.user._id,
      type: 'spend',
      amount: item.price,
      reason: `Mua vật phẩm: ${item.name}`,
      referenceId: inventory._id
    });
    
    res.json({ message: 'Purchase successful', inventory, newBalance: user.balance });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get inventory
exports.getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find({ userId: req.user._id }).populate('itemId');
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Use an inventory item
exports.useInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const inventory = await Inventory.findOneAndUpdate(
      { _id: id, userId: req.user._id, status: 'Chưa dùng' },
      { status: 'Đã dùng', usedAt: new Date() },
      { new: true }
    ).populate('itemId');
    
    if (!inventory) return res.status(404).json({ message: 'Inventory item not found or already used' });
    
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
