const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

// 驗證令牌中間件
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // 檢查請求頭中的Authorization令牌
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // 如果沒有令牌，則返回錯誤
    if (!token) {
      return res.status(401).json({ message: '未授權，無令牌' });
    }
    
    try {
      // 驗證令牌
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // 查找用戶並添加到請求中
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error('令牌驗證錯誤:', error);
      return res.status(401).json({ message: '未授權，令牌無效' });
    }
  } catch (error) {
    console.error('授權中間件錯誤:', error);
    res.status(500).json({ message: '授權失敗', error: error.message });
  }
};

// 管理員權限中間件
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: '沒有管理員權限' });
  }
};
