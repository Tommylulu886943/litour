const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// 獲取產品（支持過濾、排序和分頁）
router.get('/', productController.getProducts);

// 獲取產品分類
router.get('/categories', productController.getCategories);

module.exports = router;
