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
              <img v-if="item.image" :src="item.image" :alt="item.name">
              <div v-else class="placeholder-image">無圖片</div>
            </div>
            
            <div class="favorite-details">
              <h3 class="favorite-name">{{ item.name }}</h3>
              <div class="favorite-price">NT$ {{ item.price }}</div>
              <div class="favorite-actions">
                <router-link :to="`/products/${item.productId}`" class="view-btn">
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
import { computed, onMounted } from 'vue';
import { useFavoriteStore } from '@/store/favoriteStore';
import { useUserStore } from '@/store/userStore';

export default {
  name: 'FavoritesView',
  setup() {
    const favoriteStore = useFavoriteStore();
    const userStore = useUserStore();
    
    const isAuthenticated = computed(() => userStore.isAuthenticated);
    const favorites = computed(() => favoriteStore.favorites);
    const loading = computed(() => favoriteStore.loading);
    
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
      removeFavorite
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
  background-color: var(--primary-color);
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.auth-button:hover, .browse-btn:hover {
  background-color: #3d8b40;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
}

.favorite-item {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.favorite-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.favorite-image {
  height: 200px;
  overflow: hidden;
}

.favorite-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.favorite-item:hover .favorite-image img {
  transform: scale(1.05);
}

.placeholder-image {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.favorite-details {
  padding: 15px;
}

.favorite-name {
  font-size: 1.1rem;
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.favorite-price {
  color: var(--primary-color);
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 15px;
}

.favorite-actions {
  display: flex;
  gap: 10px;
}

.view-btn, .remove-btn {
  flex: 1;
  padding: 8px 0;
  text-align: center;
  border-radius: 4px;
  transition: all 0.3s;
}

.view-btn {
  background-color: var(--secondary-color);
  color: white;
  text-decoration: none;
}

.view-btn:hover {
  background-color: #1976D2;
}

.remove-btn {
  background-color: #f5f5f5;
  color: #666;
  border: none;
  cursor: pointer;
}

.remove-btn:hover {
  background-color: #ffdddd;
  color: #e74c3c;
}

@media (max-width: 768px) {
  .favorites-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
}

@media (max-width: 576px) {
  .favorites-grid {
    grid-template-columns: 1fr;
  }
}
</style>