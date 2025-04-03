const Contact = require('../models/Contact');

// 提交聯絡表單
exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, company, phone, lineId, message } = req.body;
    
    // 驗證必要欄位
    if (!name || !email || !message) {
      return res.status(400).json({ message: '姓名、電子郵件和訊息為必填欄位' });
    }
    
    // 檢查並清理舊記錄以控制數據庫大小
    await cleanupOldRecords();
    
    // 創建新的聯絡訊息
    const contact = await Contact.create({
      name,
      email,
      company: company || '',
      phone: phone || '',
      lineId: lineId || '',
      message
    });
    
    // 返回成功訊息
    res.status(201).json({ 
      success: true, 
      message: '訊息已成功發送！我們會盡快與您聯繫。',
      contactId: contact._id 
    });
    
    // TODO: 在這裡可以加入發送電子郵件通知給管理員的功能
    
  } catch (error) {
    console.error('提交聯絡表單錯誤:', error);
    res.status(500).json({ message: '提交表單失敗，請稍後再試', error: error.message });
  }
};

// 獲取所有聯絡表單 (僅限管理員)
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort('-createdAt');
    res.json(contacts);
  } catch (error) {
    console.error('獲取聯絡表單錯誤:', error);
    res.status(500).json({ message: '獲取聯絡表單失敗', error: error.message });
  }
};

// 更新聯絡表單狀態 (僅限管理員)
exports.updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    const contact = await Contact.findById(id);
    
    if (!contact) {
      return res.status(404).json({ message: '找不到該聯絡表單' });
    }
    
    contact.status = status || contact.status;
    contact.notes = notes || contact.notes;
    
    const updatedContact = await contact.save();
    
    res.json(updatedContact);
  } catch (error) {
    console.error('更新聯絡表單狀態錯誤:', error);
    res.status(500).json({ message: '更新聯絡表單狀態失敗', error: error.message });
  }
}; 