const express = require('express');
const router = express.Router();
const { getShopItems, createShopItem, updateShopItem, deleteShopItem, buyItem, getInventory, useInventoryItem } = require('../controllers/shopController');
const { protect } = require('../middlewares/auth');

router.use(protect);

// Shop Items
router.route('/')
  .get(getShopItems)
  .post(createShopItem);

router.route('/:id')
  .put(updateShopItem)
  .delete(deleteShopItem);

// Buying
router.post('/buy', buyItem);

// Inventory
router.get('/inventory', getInventory);
router.patch('/inventory/:id/use', useInventoryItem);

module.exports = router;
