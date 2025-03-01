import { defineStore } from 'pinia';
import axios from 'axios';

export const useFavoriteStore = defineStore('favorite', {
  state: () => ({
    favorites: [],
    loading: false,
    error: null
  }),
  
  getters: {
    totalFavorites: (state) => state.favorites.length,
    
    isFavorite: (state) => (productId) => {
      return state.favorites.some(fav => fav.productId === productId);
    }
  },
  
  actions: {
    async fetchFavorites() {
      this.loading = true;
      
      try {
        const response = await axios.get('/api/favorites');
        this.favorites = response.data;
        this.error = null;
      } catch (error) {
        console.error('獲取收藏失敗:', error);
        this.error = '無法獲取收藏列表';
      } finally {
        this.loading = false;
      }
    },
    
    async addFavorite(product) {
      // 避免重複添加
      if (this.isFavorite(product._id)) return;
      
      this.loading = true;
      
      try {
        await axios.post('/api/favorites', { productId: product._id });
        
        // 添加到本地狀態
        this.favorites.push({
          productId: product._id,
          name: product.name,
          price: product.discountPrice || product.price,
          image: product.images && product.images.length > 0 ? product.images[0] : null,
          addedAt: new Date().toISOString()
        });
        
        this.error = null;
      } catch (error) {
        console.error('添加收藏失敗:', error);
        this.error = '無法添加到收藏夾';
      } finally {
        this.loading = false;
      }
    },
    
    async removeFavorite(productId) {
      this.loading = true;
      
      try {
        await axios.delete(`/api/favorites/${productId}`);
        
        // 從本地狀態移除
        this.favorites = this.favorites.filter(fav => fav.productId !== productId);
        
        this.error = null;
      } catch (error) {
        console.error('移除收藏失敗:', error);
        this.error = '無法從收藏夾移除';
      } finally {
        this.loading = false;
      }
    },
    
    // 初始化收藏夾
    initFavorites() {
      if (localStorage.getItem('userToken')) {
        this.fetchFavorites();
      }
    }
  }
});