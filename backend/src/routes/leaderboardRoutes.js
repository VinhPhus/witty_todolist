const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middlewares/auth');

router.get('/', protect, async (req, res) => {
  try {
    const topUsers = await User.find({})
      .sort({ rankIndex: -1, rankPoints: -1 })
      .limit(50)
      .select('displayName avatarUrl rankIndex rankPoints balance totalTasksCompleted');
    
    res.json(topUsers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
