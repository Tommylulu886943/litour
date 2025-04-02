// 獲取用戶資料
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: '用戶不存在' });
    }
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      company: user.company,
      role: user.role,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('獲取用戶資料錯誤:', error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// 更新用戶資料
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: '用戶不存在' });
    }
    
    // 更新用戶基本資料
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.company = req.body.company || user.company;
    
    // 處理密碼更新 (如果有的話)
    if (req.body.currentPassword && req.body.newPassword) {
      // 驗證當前密碼
      const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: '當前密碼不正確' });
      }
      
      // 設置新密碼
      user.password = req.body.newPassword;
    }
    
    // 保存更新後的用戶資料
    const updatedUser = await user.save();
    
    // 返回更新後的用戶資料
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,        // 確保返回更新後的電話
      company: updatedUser.company,    // 確保返回更新後的公司名稱
      role: updatedUser.role,
      createdAt: updatedUser.createdAt
    });
  } catch (error) {
    console.error('更新用戶資料錯誤:', error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
}; 