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
      this.error = null;
      
      try {
        // 嘗試正常 API 呼叫
        const response = await axios.get('/api/products/featured');
        this.featuredProducts = response.data;
        
        // 確保即使返回空數組也不顯示錯誤
        if (!this.featuredProducts || this.featuredProducts.length === 0) {
          // 如果後端返回了空數組，可以使用預設的推薦商品
          this.featuredProducts = await this.getFallbackProducts();
        }
      } catch (error) {
        console.error('獲取精選產品錯誤:', error);
        this.error = '無法獲取精選產品';
        
        // 發生錯誤時嘗試使用後備方案
        try {
          this.featuredProducts = await this.getFallbackProducts();
          this.error = null; // 如果後備方案成功，清除錯誤
        } catch (fallbackError) {
          console.error('後備方案也失敗:', fallbackError);
          this.error = '無法獲取精選產品，請稍後再試';
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
      try {
        const response = await axios.get(`/api/products/${id}`);
        this.product = response.data;
        this.error = null;
      } catch (error) {
        console.error('獲取產品詳情錯誤:', error);
        this.error = '無法獲取產品詳情。請稍後再試。';
      } finally {
        this.loading = false;
      }
    }
  }
});
