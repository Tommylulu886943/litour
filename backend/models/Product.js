const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discountPrice: {
    type: Number,
    default: 0,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  images: {
    type: [String],
    default: []
  },
  category: {
    type: String,
    required: true,
    enum: ['Home', 'Clothing & Accessories', 'Drinkware', 'Stationery', 'Tech', 'Beauty', 'Food & Drink', 'Other']
  },
  subcategory: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  specifications: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  minimumOrderQuantity: {
    type: Number,
    default: 1,
    min: 1
  },
  tags: {
    type: [String],
    default: []
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0
  },
  isPersonalized: {
    type: Boolean,
    default: false
  },
  forGender: {
    type: String,
    enum: ['Men', 'Women', 'Unisex', 'Kids'],
    default: 'Unisex'
  },
  deliveryTime: {
    type: Number,
    default: 7,
    min: 1,
    description: '預計交貨時間（天）'
  }
}, {
  timestamps: true
});

// 添加文本搜索索引
productSchema.index({ 
  name: 'text',
  description: 'text',
  tags: 'text',
  category: 'text',
  subcategory: 'text'
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;