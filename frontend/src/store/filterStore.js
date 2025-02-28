import { defineStore } from 'pinia';
import axios from 'axios';

export const useFilterStore = defineStore('filter', {
  state: () => ({
    // 搜索參數
    searchParams: {
      search: '',
      category: '',
      subcategory: [],
      minPrice: '',
      maxPrice: '',
      forGender: '',
      isPersonalized: null,
      sort: 'newest',
      page: 1,
      limit: 12
    },
    // 篩選選項
    filterOptions: {
      categories: [],
      priceRange: { min: 0, max: 1000 }
    },
    // 產品結果
    products: [],
    // 分頁信息
    pagination: {
      total: 0,
      page: 1,
      pages: 1,
      limit: 12
    },
    // 載入狀態
    loading: false,
    // 錯誤信息
    error: null
  }),
  
  getters: {
    // 格式化的 URL 查詢參數
    queryParams() {
      const params = new URLSearchParams();
      const { searchParams } = this;
      
      if (searchParams.search) params.append('search', searchParams.search);
      if (searchParams.category) params.append('category', searchParams.category);
      if (searchParams.subcategory && searchParams.subcategory.length > 0) {
        params.append('subcategory', searchParams.subcategory.join(','));
      }
      if (searchParams.minPrice) params.append('minPrice', searchParams.minPrice);
      if (searchParams.maxPrice) params.append('maxPrice', searchParams.maxPrice);
      if (searchParams.forGender) params.append('forGender', searchParams.forGender);
      if (searchParams.isPersonalized !== null) {
        params.append('isPersonalized', searchParams.isPersonalized);
      }
      params.append('sort', searchParams.sort);
      params.append('page', searchParams.page);
      params.append('limit', searchParams.limit);
      
      return params.toString();
    },
    
    // 目前選擇的子類別數量
    selectedSubcategoriesCount() {
      return this.searchParams.subcategory.length;
    },
    
    // 目前已應用的篩選器數量
    activeFiltersCount() {
      let count = 0;
      
      if (this.searchParams.search) count++;
      if (this.searchParams.category) count++;
      if (this.searchParams.subcategory.length > 0) count++;
      if (this.searchParams.minPrice || this.searchParams.maxPrice) count++;
      if (this.searchParams.forGender) count++;
      if (this.searchParams.isPersonalized !== null) count++;
      
      return count;
    }
  },
  
  actions: {
    // 設置搜索參數
    setSearchParam(key, value) {
      this.searchParams[key] = value;
      
      // 當類別改變時，重置子類別
      if (key === 'category') {
        this.searchParams.subcategory = [];
      }
      
      // 當更改任何過濾參數時，重置到第一頁
      if (key !== 'page') {
        this.searchParams.page = 1;
      }
    },
    
    // 切換子類別選擇
    toggleSubcategory(subcategory) {
      const index = this.searchParams.subcategory.indexOf(subcategory);
      if (index === -1) {
        this.searchParams.subcategory.push(subcategory);
      } else {
        this.searchParams.subcategory.splice(index, 1);
      }
      
      // 重置到第一頁
      this.searchParams.page = 1;
    },
    
    // 清除所有過濾器
    clearAllFilters() {
      this.searchParams = {
        search: '',
        category: '',
        subcategory: [],
        minPrice: '',
        maxPrice: '',
        forGender: '',
        isPersonalized: null,
        sort: 'newest',
        page: 1,
        limit: 12
      };
    },
    
    // 獲取所有分類
    async fetchCategories() {
      try {
        const response = await axios.get('/api/products/categories');
        this.filterOptions.categories = response.data;
      } catch (error) {
        console.error('獲取分類錯誤:', error);
        this.error = '無法獲取商品分類';
      }
    },
    
    // 獲取符合篩選條件的產品
    async fetchFilteredProducts() {
      this.loading = true;
      this.error = null;
      
      try {
        const query = this.queryParams;
        const response = await axios.get(`/api/products?${query}`);
        
        this.products = response.data.products;
        this.pagination = response.data.pagination;
        
        // 更新價格範圍（如果有提供）
        if (response.data.filters?.priceRange) {
          this.filterOptions.priceRange = response.data.filters.priceRange;
        }
        
        return response.data;
      } catch (error) {
        console.error('獲取產品錯誤:', error);
        this.error = '無法獲取商品數據';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});
