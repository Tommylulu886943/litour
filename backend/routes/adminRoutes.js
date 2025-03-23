const express = require('express');
const router = express.Router();
const multer = require('multer');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { protect, admin } = require('../middleware/authMiddleware');
const Product = require('../models/Product');

// 配置文件儲存
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    
    // 確保上傳目錄存在
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    // 生成隨機文件名避免衝突
    const filename = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, filename);
  }
});

// 圖片上傳配置
const imageStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'uploads', 'images');
    
    // 確保上傳目錄存在
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    // 使用原始文件名但添加時間戳與唯一ID避免衝突
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  }
});

// 過濾器
const fileFilter = (req, file, cb) => {
  // 接受 Excel 和 CSV 文件
  if (
    file.mimetype === 'application/vnd.ms-excel' || 
    file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    file.mimetype === 'text/csv' ||
    file.originalname.endsWith('.xlsx') ||
    file.originalname.endsWith('.xls') ||
    file.originalname.endsWith('.csv')
  ) {
    cb(null, true);
  } else {
    cb(new Error('不支持的文件類型！'), false);
  }
};

const imageFilter = (req, file, cb) => {
  // 只接受圖片文件
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('只能上傳圖片文件！'), false);
  }
};

// 設置上傳中間件
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB 限制
});

const uploadImages = multer({ 
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB 限制
});

// 公開路由 - 不需要身份驗證
// @desc    下載商品上傳模板
// @route   GET /api/admin/download-template
// @access  Public
router.get('/download-template', async (req, res) => {
  try {
    // 創建工作簿和工作表
    const wb = XLSX.utils.book_new();
    
    // 設置模板列標題
    const templateColumns = [
      'name', 'description', 'price', 'discountPrice', 'stock', 
      'category', 'subcategory', 'deliveryTime', 'forGender', 
      'isPersonalized', 'minimumOrderQuantity', 'tags',
      'spec_material', 'spec_size', 'spec_weight', 'spec_color', 'spec_origin'
    ];
    
    // 創建示例行數據
    const exampleRow = [
      '高級茶葉禮盒', '精選台灣高山茶，精美木盒包裝', 1200, 980, 50,
      'Food & Drink', 'Tea', 7, 'Unisex',
      false, 1, '茶葉,禮盒,伴手禮',
      '優質茶葉', '500g', '500g', '綠色', '台灣南投'
    ];
    
    // 創建工作表
    const ws = XLSX.utils.aoa_to_sheet([templateColumns, exampleRow]);
    
    // 添加工作表到工作簿
    XLSX.utils.book_append_sheet(wb, ws, '商品上傳模板');
    
    // 創建臨時文件路徑
    const tempFilePath = path.join(__dirname, '..', 'temp', 'product_upload_template.xlsx');
    
    // 確保臨時目錄存在
    const tempDir = path.join(__dirname, '..', 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    // 寫入文件
    XLSX.writeFile(wb, tempFilePath);
    
    // 發送文件
    res.download(tempFilePath, 'product_upload_template.xlsx', (err) => {
      if (err) {
        console.error('發送模板錯誤:', err);
      }
      
      // 下載完成後刪除臨時文件
      fs.unlinkSync(tempFilePath);
    });
  } catch (error) {
    console.error('生成模板錯誤:', error);
    res.status(500).json({ message: '下載模板失敗', error: error.message });
  }
});

// 保護的路由 - 只有管理員可以訪問
router.use(protect, admin);

// @desc    處理 Excel 文件
// @route   POST /api/admin/process-excel
// @access  Admin
router.post('/process-excel', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '沒有上傳文件' });
    }
    
    // 讀取上傳的 Excel 文件
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // 轉換為 JSON
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    if (data.length === 0) {
      return res.status(400).json({ message: '文件中沒有數據' });
    }
    
    // 處理數據，準備產品資訊
    const products = data.map(row => {
      // 處理標籤（將逗號分隔的字符串轉換為數組）
      let tags = [];
      if (row.tags) {
        tags = row.tags.split(',').map(tag => tag.trim());
      }
      
      // 處理規格（將以 spec_ 開頭的欄位轉換為規格對象）
      const specifications = {};
      Object.keys(row).forEach(key => {
        if (key.startsWith('spec_') && row[key]) {
          const specKey = key.replace('spec_', '');
          specifications[specKey] = row[key];
        }
      });
      
      // 返回產品對象
      return {
        name: row.name,
        description: row.description,
        price: Number(row.price || 0),
        discountPrice: Number(row.discountPrice || 0),
        stock: Number(row.stock || 0),
        category: row.category,
        subcategory: row.subcategory,
        deliveryTime: Number(row.deliveryTime || 7),
        forGender: row.forGender || 'Unisex',
        isPersonalized: Boolean(row.isPersonalized),
        minimumOrderQuantity: Number(row.minimumOrderQuantity || 1),
        tags: tags,
        specifications: specifications
      };
    });
    
    // 刪除上傳的文件
    fs.unlinkSync(req.file.path);
    
    // 返回處理好的產品數據
    res.json({ products });
  } catch (error) {
    console.error('處理 Excel 錯誤:', error);
    
    // 如果文件存在，刪除文件
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ message: '處理 Excel 文件失敗', error: error.message });
  }
});

// @desc    上傳商品圖片
// @route   POST /api/admin/upload-images
// @access  Admin
router.post('/upload-images', uploadImages.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: '沒有上傳圖片' });
    }
    
    // 處理上傳的圖片文件
    const uploadedImages = req.files.map(file => {
      const imageUrl = `/uploads/images/${file.filename}`;
      return {
        id: uuidv4(),
        name: file.originalname,
        url: imageUrl,
        path: file.path
      };
    });
    
    // 返回上傳的圖片信息
    res.json({ images: uploadedImages });
  } catch (error) {
    console.error('上傳圖片錯誤:', error);
    res.status(500).json({ message: '上傳圖片失敗', error: error.message });
  }
});

// @desc    獲取已上傳的圖片
// @route   GET /api/admin/uploaded-images
// @access  Admin
router.get('/uploaded-images', async (req, res) => {
  try {
    const imagesDir = path.join(__dirname, '..', 'uploads', 'images');
    
    // 如果目錄不存在則創建
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
      return res.json({ images: [] });
    }
    
    // 讀取目錄中的所有文件
    const files = fs.readdirSync(imagesDir);
    
    // 過濾出圖片文件
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    });
    
    // 構造圖片數據
    const images = imageFiles.map(file => {
      return {
        id: uuidv4(),
        name: file,
        url: `/uploads/images/${file}`,
        path: path.join(imagesDir, file)
      };
    });
    
    res.json({ images });
  } catch (error) {
    console.error('獲取已上傳圖片錯誤:', error);
    res.status(500).json({ message: '獲取已上傳圖片失敗', error: error.message });
  }
});

// @desc    批量上傳商品
// @route   POST /api/admin/batch-upload-products
// @access  Admin
router.post('/batch-upload-products', async (req, res) => {
  try {
    const { products } = req.body;
    
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: '沒有提供有效的商品數據' });
    }
    
    // 準備插入數據庫的產品數據
    const productsToInsert = products.map(product => {
      return {
        name: product.name,
        description: product.description,
        price: Number(product.price),
        discountPrice: Number(product.discountPrice || 0),
        stock: Number(product.stock),
        images: product.images || [],
        category: product.category,
        subcategory: product.subcategory,
        isActive: true,
        isFeatured: false,
        specifications: product.specifications || {},
        minimumOrderQuantity: Number(product.minimumOrderQuantity || 1),
        tags: product.tags || [],
        rating: 0,
        reviews: 0,
        isPersonalized: Boolean(product.isPersonalized),
        forGender: product.forGender || 'Unisex',
        deliveryTime: Number(product.deliveryTime || 7)
      };
    });
    
    // 批量插入到數據庫
    const insertedProducts = await Product.insertMany(productsToInsert);
    
    res.status(201).json({
      message: '成功批量上傳商品',
      count: insertedProducts.length,
      products: insertedProducts
    });
  } catch (error) {
    console.error('批量上傳商品錯誤:', error);
    res.status(500).json({ message: '批量上傳商品失敗', error: error.message });
  }
});

module.exports = router;