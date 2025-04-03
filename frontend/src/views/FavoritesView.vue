<template>
    <div class="favorites-page container">
      <h1 class="page-title">我的收藏</h1>
      
      <div v-if="!isAuthenticated" class="not-authenticated">
        <p>請先登入以查看您的收藏</p>
        <router-link to="/login" class="auth-button">登入</router-link>
      </div>
      
      <div v-else-if="loading" class="loading-favorites">
        <div class="spinner"></div>
        <p>載入中...</p>
      </div>
      
      <div v-else-if="!favorites.length" class="empty-favorites">
        <p>您還沒有收藏任何商品</p>
        <router-link to="/products" class="browse-btn">瀏覽商品</router-link>
      </div>
      
      <div v-else class="favorites-content">
        <div class="favorites-grid">
          <div v-for="item in favorites" :key="item.productId" class="favorite-item">
            <div class="favorite-image">
              <img 
                v-if="item.image && !imageErrors[item.productId]" 
                :src="getImageUrl(item.image)" 
                :alt="item.name"
                @error="handleImageError(item.productId)"
              >
              <div v-else class="image-placeholder">
                <div class="placeholder-content">
                  <div class="placeholder-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="#CCCCCC" stroke-width="1.5"/>
                      <circle cx="8.5" cy="8.5" r="1.5" stroke="#CCCCCC" stroke-width="1.5"/>
                      <path d="M21 15L16 10L5 21" stroke="#CCCCCC" stroke-width="1.5"/>
                    </svg>
                  </div>
                  <div class="placeholder-text">商品圖片準備中</div>
                </div>
              </div>
            </div>
            
            <div class="favorite-details">
              <h3 class="favorite-name">{{ item.name }}</h3>
              <div class="favorite-price">NT$ {{ item.price }}</div>
              <div class="favorite-actions">
                <router-link :to="`/product/${item.productId}`" class="view-btn">
                  查看詳情
                </router-link>
                <button @click="removeFavorite(item.productId)" class="remove-btn">
                  移除收藏
                </button>
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useFavoriteStore } from '@/store/favoriteStore';
import { useUserStore } from '@/store/userStore';

export default {
  name: 'FavoritesView',
  setup() {
    const favoriteStore = useFavoriteStore();
    const userStore = useUserStore();
    const imageErrors = ref({});
    
    const isAuthenticated = computed(() => userStore.isAuthenticated);
    const favorites = computed(() => favoriteStore.favorites);
    const loading = computed(() => favoriteStore.loading);
    
    // 取得圖片URL
    const getImageUrl = (image) => {
      if (!image) return '';
      if (image.startsWith('http')) return image;
      return `/uploads/images/${image}`;
    };
    
    // 處理圖片載入錯誤
    const handleImageError = (productId) => {
      imageErrors.value[productId] = true;
    };
    
    // 移除收藏
    const removeFavorite = (productId) => {
      if (confirm('確定要移除這個收藏嗎？')) {
        favoriteStore.removeFavorite(productId);
      }
    };
    
    // 組件掛載時獲取收藏
    onMounted(() => {
      if (isAuthenticated.value) {
        favoriteStore.fetchFavorites();
      }
    });
    
    return {
      isAuthenticated,
      favorites,
      loading,
      removeFavorite,
      getImageUrl,
      handleImageError,
      imageErrors
    };
  }
}
</script>

<style scoped>
.favorites-page {
  padding: 40px 0;
}

.page-title {
  text-align: center;
  margin-bottom: 40px;
  font-size: 2rem;
}

.not-authenticated, .empty-favorites, .loading-favorites {
  text-align: center;
  padding: 50px 0;
}

.not-authenticated p, .empty-favorites p {
  font-size: 1.2rem;
  margin-bottom: 20px;
  color: #666;
}

.auth-button, .browse-btn {
  display: inline-block;
  background-color: #e74c3c;
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.auth-button:hover, .browse-btn:hover {
  background-color: #c0392b;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #e74c3c;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
}

.favorite-item {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.favorite-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.favorite-image {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
  background-color: #f8f9fa;
}

.favorite-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.favorite-item:hover .favorite-image img {
  transform: scale(1.05);
}

/* 圖片佔位符樣式 */
.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
}

.placeholder-icon {
  margin-bottom: 12px;
  opacity: 0.7;
}

.placeholder-text {
  color: #adb5bd;
  font-size: 14px;
}

.favorite-details {
  padding: 15px;
}

.favorite-name {
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 10px;
  color: #333;
  line-height: 1.4;
}

.favorite-price {
  font-size: 18px;
  color: #e74c3c;
  font-weight: 500;
  margin-bottom: 15px;
}

.favorite-actions {
  display: flex;
  gap: 10px;
}

.view-btn, .remove-btn {
  flex: 1;
  padding: 8px 0;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.view-btn {
  background-color: #e74c3c;
  color: white;
  text-decoration: none;
}

.view-btn:hover {
  background-color: #c0392b;
}

.remove-btn {
  background-color: white;
  color: #333;
  border: 1px solid #ddd;
}

.remove-btn:hover {
  background-color: #f8f9fa;
  border-color: #ccc;
}

@media (max-width: 768px) {
  .favorites-grid {
    grid-template-columns: 1fr;
  }
}
</style>