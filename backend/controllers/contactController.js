const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// 配置郵件傳輸器
const transporter = nodemailer.createTransport({
  service: 'gmail',  // 使用 Gmail 服務
  auth: {
    user: process.env.EMAIL_USER || 'jkruby886743@gmail.com',  // 請修改為實際發送郵件的郵箱
    pass: process.env.EMAIL_PASSWORD || 'qmyolojqsfgmhlad'  // 請使用應用程式密碼而非登錄密碼
  }
});

// 清理舊聯絡記錄
const cleanupOldRecords = async () => {
  try {
    // 設定閾值，例如30天前的記錄被視為舊記錄
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // 找到並刪除過期的未處理記錄
    // 注意：您可以根據業務需求調整這個條件
    const result = await Contact.deleteMany({
      createdAt: { $lt: thirtyDaysAgo },
      status: 'pending' // 只刪除未處理的記錄
    });
    
    console.log(`已清理 ${result.deletedCount} 條舊聯絡記錄`);
  } catch (error) {
    console.error('清理舊記錄錯誤:', error);
    // 即使清理失敗，我們不應該中斷表單提交流程
  }
};

// 發送電子郵件通知給管理員
const sendEmailNotification = async (contact) => {
  try {
    // 郵件內容
    const mailOptions = {
      from: process.env.EMAIL_USER || 'jkruby886743@gmail.com',
      to: 'jkruby886743@gmail.com',  // 管理員郵箱
      subject: '新的聯絡表單提交通知',
      html: `
        <h2>您收到一條新的聯絡表單提交</h2>
        <p><strong>提交時間:</strong> ${new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>姓名:</strong> ${contact.name}</p>
          <p><strong>電子郵件:</strong> ${contact.email}</p>
          ${contact.company ? `<p><strong>公司:</strong> ${contact.company}</p>` : ''}
          ${contact.phone ? `<p><strong>電話:</strong> ${contact.phone}</p>` : ''}
          ${contact.lineId ? `<p><strong>LINE ID:</strong> ${contact.lineId}</p>` : ''}
          <p><strong>訊息內容:</strong></p>
          <div style="background-color: white; padding: 10px; border-left: 4px solid #e74c3c;">
            ${contact.message.replace(/\n/g, '<br>')}
          </div>
        </div>
        <p>您可以登入管理後台查看並處理此聯絡表單。</p>
      `
    };

    // 發送郵件
    await transporter.sendMail(mailOptions);
    console.log('已發送聯絡表單通知郵件至管理員');
  } catch (error) {
    console.error('發送郵件通知失敗:', error);
    // 即使郵件發送失敗，我們不希望影響用戶體驗
  }
};

// 提交聯絡表單
exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, company, phone, lineId, message } = req.body;
    
    // 驗證必要欄位
    if (!name || !email || !message) {
      return res.status(400).json({ message: '姓名、電子郵件和訊息為必填欄位' });
    }
    
    // 創建新的聯絡訊息
    const contact = await Contact.create({
      name,
      email,
      company: company || '',
      phone: phone || '',
      lineId: lineId || '',
      message
    });

    // 清理舊記錄 (異步執行，不影響主流程)
    cleanupOldRecords().catch(err => console.error('清理舊記錄時出錯:', err));
    
    // 發送郵件通知 (異步執行，不影響主流程)
    sendEmailNotification(contact).catch(err => console.error('發送郵件通知時出錯:', err));
    
    // 返回成功訊息
    res.status(201).json({ 
      success: true, 
      message: '訊息已成功發送！我們會盡快與您聯繫。',
      contactId: contact._id 
    });
    
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