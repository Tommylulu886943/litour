const User = require('../models/User');
const jwt = require('jsonwebtoken');

// JWT密鑰
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

// 生成JWT令牌
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: '30d'
  });
};

// 用戶註冊
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, company } = req.body;
    
    // 檢查用戶是否已存在
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: '該電子郵件已被註冊' });
    }
    
    // 創建新用戶
    const user = await User.create({
      name,
      email,
      password,
      phone,
      company
    });
    
    // 生成令牌
    const token = generateToken(user._id);
    
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      company: user.company,
      addresses: user.addresses,
      role: user.role,
      token
    });
  } catch (error) {
    console.error('註冊錯誤:', error);
    res.status(500).json({ message: '註冊失敗', error: error.message });
  }
};

// 用戶登錄
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 查找用戶
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: '無效的電子郵件或密碼' });
    }
    
    // 驗證密碼
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: '無效的電子郵件或密碼' });
    }
    
    // 生成令牌
    const token = generateToken(user._id);
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      company: user.company,
      addresses: user.addresses,
      role: user.role,
      token
    });
  } catch (error) {
    console.error('登錄錯誤:', error);
    res.status(500).json({ message: '登錄失敗', error: error.message });
  }
};

// 獲取當前用戶資料
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: '用戶不存在' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('獲取用戶資料錯誤:', error);
    res.status(500).json({ message: '獲取用戶資料失敗', error: error.message });
  }
};

// 更新用戶資料
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: '用戶不存在' });
    }
    
    // 更新用戶資料
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.company = req.body.company || user.company;
    
    // 如果提供了新密碼，則更新密碼
    if (req.body.password) {
      user.password = req.body.password;
    }
    
    // 更新地址 (允許清空)
    if (req.body.addresses !== undefined) {
      user.addresses = req.body.addresses;
      user.markModified('addresses');
    }

    const updatedUser = await user.save();

    // 生成新令牌
    const token = generateToken(updatedUser._id);

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      company: updatedUser.company,
      addresses: updatedUser.addresses,
      role: updatedUser.role,
      token
    });
  } catch (error) {
    console.error('更新用戶資料錯誤:', error);
    res.status(500).json({ message: '更新用戶資料失敗', error: error.message });
  }
};
