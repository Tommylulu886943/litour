import { defineStore } from 'pinia';
import axios from 'axios';

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [],
    featuredProducts: [],
    product: null,
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchProducts() {
      this.loading = true;
      try {
        const response = await axios.get('/api/products');
        this.products = response.data;
        this.error = null;
      } catch (error) {
        console.error('獲取產品錯誤:', error);
        this.error = '無法獲取產品。請稍後再試。';
      } finally {
        this.loading = false;
      }
    },
    
    async fetchFeaturedProducts() {
      this.loading = true;
      try {
        // 注意這裡使用的是 /api/products/featured，而不是 /api/products/id
        const response = await axios.get('/api/products/featured');
        this.featuredProducts = response.data;
        this.error = null;
      } catch (error) {
        console.error('獲取精選產品錯誤:', error);
        this.error = '無法獲取精選產品';
        // 嘗試使用備用方法
        try {
          this.featuredProducts = await this.getFallbackProducts();
        } catch (fallbackError) {
          console.error('備用方法也失敗:', fallbackError);
        }
      } finally {
        this.loading = false;
      }
    },

    // 新增後備方案方法
    async getFallbackProducts() {
      // 嘗試獲取所有產品，然後從中篩選出精選產品
      const response = await axios.get('/api/products', {
        params: {
          limit: 6,
          sort: 'popular' // 或其他排序方式
        }
      });
      
      return response.data.products || [];
    },
    
    async fetchProductById(id) {
      this.loading = true;
      this.product = null; // 先清空現有產品數據
      console.log(`準備獲取產品詳情，ID: ${id}`);
      
      try {
        console.log(`發送請求到: /api/products/${id}`);
        const response = await axios.get(`/api/products/${id}`);
        console.log('獲取產品詳情成功:', response.data);
        this.product = response.data;
        this.error = null;
      } catch (error) {
        console.error('獲取產品詳情錯誤:', error);
        console.error('詳細錯誤信息:', error.response ? error.response.data : error.message);
        this.error = '無法獲取產品詳情。請稍後再試。';
        this.product = null;
      } finally {
        this.loading = false;
      }
    }
  }
});
