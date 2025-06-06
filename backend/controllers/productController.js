const Product = require('../models/Product');
const synonyms = require('../utils/synonyms');

const buildSearchTerms = (keyword) => {
  const lowerKeyword = keyword.toLowerCase();
  const terms = new Set([lowerKeyword]);

  for (const [key, list] of Object.entries(synonyms)) {
    const keyLower = key.toLowerCase();
    const listLower = list.map((s) => s.toLowerCase());

    if (
      lowerKeyword.includes(keyLower) ||
      listLower.some((s) => lowerKeyword.includes(s))
    ) {
      terms.add(keyLower);
      listLower.forEach((t) => terms.add(t));
    }
  }

  return Array.from(terms);
};

// 獲取所有產品，支持過濾、排序和分頁
exports.getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      subcategory,
      minPrice,
      maxPrice,
      forGender,
      isPersonalized,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    // 構建查詢條件
    const query = { isActive: true };

    // 搜索關鍵詞
    if (search) {
      const terms = buildSearchTerms(search);
      query.$text = { $search: terms.join(' ') };
    }

    // 類別過濾
    if (category) {
      query.category = category;
    }

    // 子類別過濾
    if (subcategory) {
      // 支持多個子類別（逗號分隔）
      const subcategories = subcategory.split(',');
      if (subcategories.length > 1) {
        query.subcategory = { $in: subcategories };
      } else {
        query.subcategory = subcategory;
      }
    }

    // 價格範圍
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined) {
        query.price.$lte = Number(maxPrice);
      }
    }

    // 性別過濾
    if (forGender) {
      query.forGender = forGender;
    }

    // 個人化選項
    if (isPersonalized !== undefined) {
      query.isPersonalized = isPersonalized === 'true';
    }

    // 定義排序
    let sortOption = {};
    if (sort) {
      switch (sort) {
        case 'price_asc':
          sortOption = { price: 1 };
          break;
        case 'price_desc':
          sortOption = { price: -1 };
          break;
        case 'newest':
          sortOption = { createdAt: -1 };
          break;
        case 'rating':
          sortOption = { rating: -1 };
          break;
        case 'popular':
          sortOption = { reviews: -1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }
    } else {
      // 默認排序
      sortOption = { createdAt: -1 };
    }

    // 計算分頁
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // 獲取產品總數（用於分頁）
    const total = await Product.countDocuments(query);

    // 獲取產品
    let products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    // 若使用文本搜尋卻沒有結果，改用模糊搜尋
    if (search && products.length === 0) {
      const regexTerms = buildSearchTerms(search)
        .map((t) => t.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&'))
        .join('|');
      const regex = new RegExp(regexTerms, 'i');
      const fuzzyQuery = { ...query };
      delete fuzzyQuery.$text;
      fuzzyQuery.$or = [
        { name: { $regex: regex } },
        { description: { $regex: regex } },
        { tags: { $elemMatch: { $regex: regex } } }
      ];

      products = await Product.find(fuzzyQuery)
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit));
    }

    // 獲取獨特的子類別和它們的數量（用於過濾器）
    const subcategories = await Product.aggregate([
      { $match: { isActive: true, ...(category ? { category } : {}) } },
      { $group: { _id: "$subcategory", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // 獲取價格範圍（用於過濾器）
    const priceRange = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" }
        }
      }
    ]);

    res.json({
      products,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      },
      filters: {
        subcategories: subcategories.map(s => ({ name: s._id, count: s.count })),
        priceRange: priceRange.length > 0 ? {
          min: priceRange[0].minPrice,
          max: priceRange[0].maxPrice
        } : { min: 0, max: 1000 }
      }
    });
  } catch (error) {
    console.error('獲取產品錯誤:', error);
    res.status(500).json({ message: '獲取產品失敗', error: error.message });
  }
};

// 獲取產品分類
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { 
        _id: { category: "$category", subcategory: "$subcategory" },
        count: { $sum: 1 }
      }},
      { $group: {
        _id: "$_id.category",
        subcategories: { 
          $push: { 
            name: "$_id.subcategory", 
            count: "$count" 
          } 
        },
        totalCount: { $sum: "$count" }
      }},
      { $sort: { _id: 1 } }
    ]);

    res.json(categories);
  } catch (error) {
    console.error('獲取分類錯誤:', error);
    res.status(500).json({ message: '獲取分類失敗', error: error.message });
  }
};

// 獲取單個產品
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: '找不到產品' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('獲取產品詳情錯誤:', error);
    res.status(500).json({ message: '獲取產品詳情失敗', error: error.message });
  }
};

// 獲取精選產品
exports.getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await Product.find({ 
      isActive: true,
      isFeatured: true 
    })
    .sort({ createdAt: -1 })
    .limit(6);
    
    res.json(featuredProducts);
  } catch (error) {
    console.error('獲取精選產品錯誤:', error);
    res.status(500).json({ message: '獲取精選產品失敗', error: error.message });
  }
};

// 搜尋預覽
exports.getSearchPreview = async (req, res) => {
  try {
    const search = (req.query.search || '').trim();

    if (!search) {
    const terms = buildSearchTerms(search);
    const textSearch = terms.join(' ');

    // 先使用文本搜尋獲取排名靠前的結果
    let products = await Product.find(
      { isActive: true, $text: { $search: textSearch } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .select('name images')
      .limit(10);

    // 若結果不足，使用模糊搜尋補齊
    if (products.length < 10) {
      const regexTerms = terms
        .map((t) => t.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&'))
        .join('|');
      const regex = new RegExp(regexTerms, 'i');
      const ids = products.map(p => p._id);
      const extra = await Product.find({
        isActive: true,
        _id: { $nin: ids },
        $or: [
          { name: { $regex: regex } },
          { description: { $regex: regex } },
          { tags: { $elemMatch: { $regex: regex } } }
        ]
      })
        .select('name images')
        .limit(10 - products.length);

      products = products.concat(extra);
    }
      { name: { $regex: regex } },
      { description: { $regex: regex } },
      { tags: { $elemMatch: { $regex: regex } } }
    ]
  })
    .select('name images')
    .limit(5);

    res.json(products);
  } catch (error) {
    console.error('獲取搜尋預覽錯誤:', error);
    res.status(500).json({ message: '獲取搜尋預覽失敗', error: error.message });
  }
};
