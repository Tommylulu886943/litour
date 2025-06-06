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

      const fav = {
        productId: product._id,
        name: product.name,
        price: product.discountPrice || product.price,
        image: product.images && product.images.length > 0 ? product.images[0] : null,
        addedAt: new Date().toISOString(),
      };

      // 先樂觀地更新本地狀態
      this.favorites.push(fav);

      try {
        await axios.post('/api/favorites', { productId: product._id });
        this.error = null;
      } catch (error) {
        console.error('添加收藏失敗:', error);
        this.error = '無法添加到收藏夾';
        // 還原本地狀態
        this.favorites.splice(addedIndex, 1);
      }
    },
    
    async removeFavorite(productId) {
      const index = this.favorites.findIndex(f => f.productId === productId);
      if (index === -1) return;

      // 樂觀移除
      const [removed] = this.favorites.splice(index, 1);

      try {
        await axios.delete(`/api/favorites/${productId}`);
        this.error = null;
      } catch (error) {
        console.error('移除收藏失敗:', error);
        this.error = '無法從收藏夾移除';
        // 還原狀態
        this.favorites.splice(index, 0, removed);
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