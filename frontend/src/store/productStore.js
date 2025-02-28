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
        const response = await axios.get('/api/products/featured');
        this.featuredProducts = response.data;
        this.error = null;
      } catch (error) {
        console.error('獲取精選產品錯誤:', error);
        this.error = '無法獲取精選產品。請稍後再試。';
      } finally {
        this.loading = false;
      }
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
