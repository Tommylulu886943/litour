const express = require('express');
const router = express.Router();
const { submitContactForm, getContacts, updateContactStatus } = require('../controllers/contactController');
const { protect, admin } = require('../middleware/authMiddleware');

// 提交聯絡表單 (公開路由)
router.post('/', submitContactForm);

// 獲取所有聯絡表單 (僅限管理員)
router.get('/', protect, admin, getContacts);

// 更新聯絡表單狀態 (僅限管理員)
router.put('/:id', protect, admin, updateContactStatus);

module.exports = router; 