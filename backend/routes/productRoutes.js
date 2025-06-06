const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// 獲取產品（支持過濾、排序和分頁）
router.get('/', productController.getProducts);

// 獲取產品分類
router.get('/categories', productController.getCategories);

// 新增：獲取精選產品的專用路由
router.get('/featured', productController.getFeaturedProducts);

// 搜尋預覽
router.get('/preview', productController.getSearchPreview);

// 獲取單個產品 - 放在最後處理
router.get('/:id', productController.getProductById);

module.exports = router;
