const User = require('../models/User');
const Order = require('../models/Order');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'jkruby886743@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'qmyolojqsfgmhlad'
  }
});

exports.createCustomer = async (req, res) => {
  try {
    const { name, email, password, phone, company } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: '該電子郵件已被註冊' });
    }

    const user = await User.create({ name, email, password, phone, company });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      company: user.company
    });
  } catch (error) {
    console.error('創建客戶錯誤:', error);
    res.status(500).json({ message: '創建客戶失敗', error: error.message });
  }
};

exports.listCustomers = async (req, res) => {
  try {
    const filter = { role: 'user' };
    if (req.query.q) {
      const q = req.query.q;
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ];
    }
    const users = await User.find(filter).select('-password');
    res.json(users);
  } catch (error) {
    console.error('獲取客戶列表錯誤:', error);
    res.status(500).json({ message: '獲取客戶列表失敗', error: error.message });
  }
};

exports.getCustomer = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: '客戶不存在' });
    }
    const orders = await Order.find({ user: user._id });
    res.json({ user, orders });
  } catch (error) {
    console.error('獲取客戶詳情錯誤:', error);
    res.status(500).json({ message: '獲取客戶詳情失敗', error: error.message });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: '客戶不存在' });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.company = req.body.company || user.company;

    if (req.body.addresses !== undefined) {
      user.addresses = req.body.addresses;
      user.markModified('addresses');
    }

    const updatedUser = await user.save();
    res.json({ _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, phone: updatedUser.phone, company: updatedUser.company, addresses: updatedUser.addresses });
  } catch (error) {
    console.error('更新客戶資料錯誤:', error);
    res.status(500).json({ message: '更新客戶資料失敗', error: error.message });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: '客戶不存在' });
    }
    await Order.deleteMany({ user: user._id });
    await user.remove();
    res.json({ message: '客戶已刪除' });
  } catch (error) {
    console.error('刪除客戶錯誤:', error);
    res.status(500).json({ message: '刪除客戶失敗', error: error.message });
  }
};

exports.sendEmailToCustomer = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: '客戶不存在' });
    }

    const { subject, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ message: '請提供主旨和內容' });
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'jkruby886743@gmail.com',
      to: user.email,
      subject,
      text: message
    });

    res.json({ message: '已發送郵件給客戶' });
  } catch (error) {
    console.error('發送郵件錯誤:', error);
    res.status(500).json({ message: '發送郵件失敗', error: error.message });
  }
};
