const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// 建立 Favorite 模型
const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }
}, {
  timestamps: true
});

// 添加複合索引以確保每個用戶對每個產品只有一個收藏
favoriteSchema.index({ user: 1, product: 1 }, { unique: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);

// 獲取用戶收藏列表
router.get('/', protect, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .populate('product', 'name price discountPrice images')
      .sort('-createdAt');
    
    // 轉換為前端需要的格式
    const formattedFavorites = favorites.map(fav => ({
      productId: fav.product._id,
      name: fav.product.name,
      price: fav.product.discountPrice || fav.product.price,
      image: fav.product.images && fav.product.images.length > 0 ? fav.product.images[0] : null,
      addedAt: fav.createdAt
    }));
    
    res.json(formattedFavorites);
  } catch (error) {
    console.error('獲取收藏錯誤:', error);
    res.status(500).json({ message: '獲取收藏失敗', error: error.message });
  }
});

// 添加收藏
router.post('/', protect, async (req, res) => {
  try {
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({ message: '需要產品ID' });
    }
    
    // 檢查產品是否存在
    const Product = mongoose.model('Product');
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: '產品不存在' });
    }
    
    // 創建或更新收藏
    await Favorite.findOneAndUpdate(
      { user: req.user._id, product: productId },
      { user: req.user._id, product: productId },
      { upsert: true, new: true }
    );
    
    res.status(201).json({ message: '已加入收藏' });
  } catch (error) {
    console.error('添加收藏錯誤:', error);
    res.status(500).json({ message: '添加收藏失敗', error: error.message });
  }
});

// 移除收藏
router.delete('/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;
    
    await Favorite.findOneAndDelete({ user: req.user._id, product: productId });
    
    res.json({ message: '已從收藏移除' });
  } catch (error) {
    console.error('移除收藏錯誤:', error);
    res.status(500).json({ message: '移除收藏失敗', error: error.message });
  }
});

module.exports = router;