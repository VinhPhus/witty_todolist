const express = require('express');
const router = express.Router();
const { register, login, googleAuth, refreshToken, logout, claimReward } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/refresh-token', refreshToken);
router.post('/logout', protect, logout);
router.post('/claim-reward', protect, claimReward);

module.exports = router;
