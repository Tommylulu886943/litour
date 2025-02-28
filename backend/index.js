const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');

// 加載環境變量
dotenv.config();

const app = express();
const port = 3000;

// 連接到 MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongo:27017/giftshop';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('成功連接到 MongoDB'))
  .catch(err => {
    console.error('MongoDB 連接錯誤:', err);
    process.exit(1);
  });

// 中間件
app.use(express.json());
app.use(cookieParser());

// 允許跨域請求
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // 處理 OPTIONS 請求
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// API 路由
app.get('/api', (req, res) => {
  res.json({ message: '台灣企業禮品選物網站 API 服務運行中！' });
});

// 使用路由
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// 初始化示例數據的路由
app.post('/api/seed', async (req, res) => {
  const Product = require('./models/Product');
  
  try {
    // 清空現有產品
    await Product.deleteMany({});
    
    // 示例產品數據
    const sampleProducts = [
      {
        name: '高級茶葉禮盒',
        description: '精選台灣高山茶，精美木盒包裝',
        price: 1200,
        discountPrice: 980,
        stock: 50,
        images: ['https://images.unsplash.com/photo-1627483262268-9c2b5b2834b5?w=300'],
        category: 'Food & Drink',
        subcategory: 'Tea',
        isActive: true,
        isFeatured: true,
        specifications: {
          weight: '500g',
          material: '優質茶葉',
          origin: '台灣南投'
        },
        minimumOrderQuantity: 1,
        tags: ['茶葉', '禮盒', '伴手禮'],
        rating: 4.8,
        reviews: 18,
        isPersonalized: false,
        forGender: 'Unisex'
      },
      {
        name: '多功能充電寶',
        description: '10000mAh大容量，支持無線充電，可客製Logo',
        price: 850,
        stock: 100,
        images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300'],
        category: 'Tech',
        subcategory: 'Electronics',
        isActive: true,
        isFeatured: true,
        specifications: {
          capacity: '10000mAh',
          input: '5V/2A',
          output: '5V/2A, 9V/2A',
          wirelessCharge: '是'
        },
        minimumOrderQuantity: 5,
        tags: ['充電寶', '電子', '辦公用品'],
        rating: 4.5,
        reviews: 24,
        isPersonalized: true,
        forGender: 'Unisex'
      },
      {
        name: '環保隨行杯',
        description: '304不鏽鋼內膽，保溫12小時，可客製圖案',
        price: 450,
        discountPrice: 380,
        stock: 200,
        images: ['https://images.unsplash.com/photo-1572866347793-7040956e7421?w=300'],
        category: 'Drinkware',
        subcategory: 'Travel Mug',
        isActive: true,
        isFeatured: true,
        specifications: {
          capacity: '500ml',
          material: '304不鏽鋼',
          keepWarm: '12小時'
        },
        minimumOrderQuantity: 10,
        tags: ['隨行杯', '環保', '辦公用品'],
        rating: 4.7,
        reviews: 36,
        isPersonalized: true,
        forGender: 'Unisex'
      },
      {
        name: '便攜筆記本套裝',
        description: '高質感PU皮面，含筆記本和簽字筆，可燙印Logo',
        price: 580,
        stock: 150,
        images: ['https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=300'],
        category: 'Stationery',
        subcategory: 'Notebooks',
        isActive: true,
        isFeatured: false,
        specifications: {
          size: 'A5',
          material: 'PU皮',
          pages: '100頁'
        },
        minimumOrderQuantity: 20,
        tags: ['筆記本', '文具', '辦公用品'],
        rating: 4.6,
        reviews: 15,
        isPersonalized: true,
        forGender: 'Unisex'
      },
      {
        name: '女士絲巾',
        description: '100%真絲材質，柔軟親膚，多種圖案可選',
        price: 980,
        discountPrice: 880,
        stock: 80,
        images: ['https://images.unsplash.com/photo-1614251055880-ee96e4803393?w=300'],
        category: 'Clothing & Accessories',
        subcategory: 'Scarves',
        isActive: true,
        isFeatured: true,
        specifications: {
          material: '100%真絲',
          size: '90x90cm'
        },
        minimumOrderQuantity: 1,
        tags: ['絲巾', '配飾', '女士禮品'],
        rating: 4.9,
        reviews: 42,
        isPersonalized: false,
        forGender: 'Women'
      },
      {
        name: '手工皂禮盒',
        description: '純天然植物油製作，溫和清潔，送禮自用兩相宜',
        price: 650,
        stock: 120,
        images: ['https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=300'],
        category: 'Beauty',
        subcategory: 'Bath & Body',
        isActive: true,
        isFeatured: false,
        specifications: {
          weight: '100g*4塊',
          ingredients: '橄欖油，椰子油，精油'
        },
        minimumOrderQuantity: 1,
        tags: ['手工皂', '護膚', '有機'],
        rating: 4.7,
        reviews: 28,
        isPersonalized: false,
        forGender: 'Unisex'
      },
      {
        name: '個性化咖啡杯',
        description: '陶瓷材質，可印製姓名或特殊圖案',
        price: 320,
        stock: 250,
        images: ['https://images.unsplash.com/photo-1570649857669-6eb98648d2b5?w=300'],
        category: 'Drinkware',
        subcategory: 'Mugs',
        isActive: true,
        isFeatured: true,
        specifications: {
          material: '陶瓷',
          capacity: '350ml'
        },
        minimumOrderQuantity: 10,
        tags: ['咖啡杯', '陶瓷', '個性化'],
        rating: 4.5,
        reviews: 56,
        isPersonalized: true,
        forGender: 'Unisex'
      },
      {
        name: '精美相框',
        description: '木質材料，簡約風格，適合擺放家中或辦公室',
        price: 420,
        discountPrice: 380,
        stock: 100,
        images: ['https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=300'],
        category: 'Home',
        subcategory: 'Décor',
        isActive: true,
        isFeatured: false,
        specifications: {
          material: '木質',
          size: '10x15cm'
        },
        minimumOrderQuantity: 5,
        tags: ['相框', '家居', '裝飾'],
        rating: 4.6,
        reviews: 31,
        isPersonalized: true,
        forGender: 'Unisex'
      },
      {
        name: '男士皮帶',
        description: '頭層牛皮製作，經典款式，商務休閒兩相宜',
        price: 750,
        stock: 80,
        images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300'],
        category: 'Clothing & Accessories',
        subcategory: 'Belts',
        isActive: true,
        isFeatured: false,
        specifications: {
          material: '頭層牛皮',
          length: '115cm'
        },
        minimumOrderQuantity: 1,
        tags: ['皮帶', '男士', '配飾'],
        rating: 4.8,
        reviews: 22,
        isPersonalized: false,
        forGender: 'Men'
      },
      {
        name: '香薰蠟燭',
        description: '天然大豆蠟，多種香味可選，營造溫馨氛圍',
        price: 360,
        stock: 150,
        images: ['https://images.unsplash.com/photo-1603006905393-c279cbbbd2df?w=300'],
        category: 'Home',
        subcategory: 'Décor',
        isActive: true,
        isFeatured: true,
        specifications: {
          material: '大豆蠟',
          burnTime: '45小時'
        },
        minimumOrderQuantity: 2,
        tags: ['蠟燭', '香薰', '居家'],
        rating: 4.7,
        reviews: 47,
        isPersonalized: false,
        forGender: 'Unisex'
      },
      {
        name: '女士手提包',
        description: '優質PU皮革，時尚實用，多色可選',
        price: 1280,
        discountPrice: 1080,
        stock: 60,
        images: ['https://images.unsplash.com/photo-1584917865442-de89df41c136?w=300'],
        category: 'Clothing & Accessories',
        subcategory: 'Bags & Wallets',
        isActive: true,
        isFeatured: true,
        specifications: {
          material: 'PU皮革',
          size: '30x22x10cm'
        },
        minimumOrderQuantity: 1,
        tags: ['手提包', '女士', '時尚'],
        rating: 4.9,
        reviews: 38,
        isPersonalized: false,
        forGender: 'Women'
      },
      {
        name: '玻璃水瓶',
        description: '耐熱玻璃，防滑矽膠套，環保健康',
        price: 290,
        stock: 200,
        images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300'],
        category: 'Drinkware',
        subcategory: 'Water Bottles',
        isActive: true,
        isFeatured: false,
        specifications: {
          material: '玻璃+矽膠',
          capacity: '550ml'
        },
        minimumOrderQuantity: 10,
        tags: ['水瓶', '玻璃', '環保'],
        rating: 4.4,
        reviews: 29,
        isPersonalized: true,
        forGender: 'Unisex'
      },
      {
        name: '客製化鑰匙圈',
        description: '可雕刻姓名或特殊圖案，多種材質可選',
        price: 180,
        stock: 300,
        images: ['https://images.unsplash.com/photo-1585676623595-5bfe8788b677?w=300'],
        category: 'Clothing & Accessories',
        subcategory: 'Keychains',
        isActive: true,
        isFeatured: true,
        specifications: {
          material: '金屬/皮革',
          size: '8cm'
        },
        minimumOrderQuantity: 20,
        tags: ['鑰匙圈', '客製化', '配飾'],
        rating: 4.6,
        reviews: 65,
        isPersonalized: true,
        forGender: 'Unisex'
      },
      {
        name: '高級紅酒',
        description: '法國進口，口感醇厚，送禮佳選',
        price: 1580,
        stock: 40,
        images: ['https://images.unsplash.com/photo-1553361371-9a22f31be39f?w=300'],
        category: 'Food & Drink',
        subcategory: 'Wine & Spirits',
        isActive: true,
        isFeatured: false,
        specifications: {
          origin: '法國波爾多',
          volume: '750ml',
          vintage: '2018'
        },
        minimumOrderQuantity: 1,
        tags: ['紅酒', '酒類', '高級禮品'],
        rating: 4.9,
        reviews: 19,
        isPersonalized: false,
        forGender: 'Unisex'
      },
      {
        name: '男士領帶',
        description: '100%桑蠶絲，多款花色，商務正裝必備',
        price: 680,
        stock: 90,
        images: ['https://images.unsplash.com/photo-1606745256301-028f432c3e25?w=300'],
        category: 'Clothing & Accessories',
        subcategory: 'Ties',
        isActive: true,
        isFeatured: false,
        specifications: {
          material: '桑蠶絲',
          width: '8cm'
        },
        minimumOrderQuantity: 2,
        tags: ['領帶', '男士', '商務'],
        rating: 4.7,
        reviews: 25,
        isPersonalized: false,
        forGender: 'Men'
      },
      {
        name: '懸浮花盆',
        description: '創意磁懸浮設計，讓植物漂浮在空中，科技感十足',
        price: 1980,
        stock: 30,
        images: ['https://images.unsplash.com/photo-1632577442026-93a855dfa27d?w=300'],
        category: 'Home',
        subcategory: 'Décor',
        isActive: true,
        isFeatured: true,
        specifications: {
          material: 'ABS塑料',
          size: '直徑12cm'
        },
        minimumOrderQuantity: 1,
        tags: ['花盆', '創意', '科技'],
        rating: 4.8,
        reviews: 14,
        isPersonalized: false,
        forGender: 'Unisex'
      },
      {
        name: '精美筆記本套裝',
        description: '高質感皮面，含筆記本、鋼筆和筆袋',
        price: 880,
        discountPrice: 780,
        stock: 70,
        images: ['https://images.unsplash.com/photo-1519493556416-8e5591d4a1d5?w=300'],
        category: 'Stationery',
        subcategory: 'Notebooks',
        isActive: true,
        isFeatured: false,
        specifications: {
          material: '皮革+紙',
          size: 'A5'
        },
        minimumOrderQuantity: 5,
        tags: ['筆記本', '文具', '辦公'],
        rating: 4.6,
        reviews: 33,
        isPersonalized: true,
        forGender: 'Unisex'
      }
    ];
    
    // 插入示例數據
    await Product.insertMany(sampleProducts);
    
    res.json({ message: '示例產品數據已成功加載', count: sampleProducts.length });
  } catch (error) {
    console.error('加載示例數據錯誤:', error);
    res.status(500).json({ message: '加載示例數據失敗', error: error.message });
  }
});

// 啟動服務器
app.listen(port, () => {
  console.log(`後端服務運行在 http://localhost:${port}`);
});
