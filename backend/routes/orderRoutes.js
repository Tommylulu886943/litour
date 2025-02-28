const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Order = require('../models/Order');

// 創建訂單
router.post('/', protect, async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice
    } = req.body;
    
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: '沒有訂單項目' });
    }
    
    const order = new Order({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice
    });
    
    const createdOrder = await order.save();
    
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('創建訂單錯誤:', error);
    res.status(500).json({ message: '創建訂單失敗', error: error.message });
  }
});

// 獲取用戶訂單列表
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    console.error('獲取訂單錯誤:', error);
    res.status(500).json({ message: '獲取訂單失敗', error: error.message });
  }
});

// 獲取訂單詳情
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({ message: '訂單不存在' });
    }
    
    // 確保用戶只能查看自己的訂單
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: '沒有權限' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('獲取訂單詳情錯誤:', error);
    res.status(500).json({ message: '獲取訂單詳情失敗', error: error.message });
  }
});

// 更新訂單為已付款
router.put('/:id/pay', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: '訂單不存在' });
    }
    
    // 更新訂單為已付款
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address
    };
    
    const updatedOrder = await order.save();
    
    res.json(updatedOrder);
  } catch (error) {
    console.error('更新訂單付款狀態錯誤:', error);
    res.status(500).json({ message: '更新訂單付款狀態失敗', error: error.message });
  }
});

module.exports = router;
