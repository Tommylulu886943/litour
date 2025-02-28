const express = require('express');
const router = express.Router();
const { register, login, getUserProfile, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// 用戶註冊
router.post('/register', register);

// 用戶登錄
router.post('/login', login);

// 獲取用戶資料（需要授權）
router.get('/profile', protect, getUserProfile);

// 更新用戶資料（需要授權）
router.put('/profile', protect, updateUserProfile);

module.exports = router;
