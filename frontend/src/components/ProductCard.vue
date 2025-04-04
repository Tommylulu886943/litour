<template>
  <div class="product-card" @click="navigateToProduct">
    <div class="product-image-container">
      <img 
        v-if="product.images && product.images.length > 0 && !showImageError" 
        :src="getImageUrl(product.images[0])" 
        :alt="product.name" 
        @error="handleImageError"
        class="product-image"
      />
      
      <!-- 優化的無圖片佔位符 -->
      <div v-if="!product.images || !product.images.length || showImageError" class="image-placeholder">
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
      
      <div v-if="hasDiscount" class="discount-badge">
        {{ discountPercentage }}% OFF
      </div>
      
      <div v-if="product.isPersonalized" class="personalized-badge">
        可客製
      </div>
    </div>

    <!-- 收藏按鈕 - 改進版 -->
    <button 
      class="favorite-btn" 
      :class="{ active: isFavorite }" 
      @click="toggleFavorite"
    >
      <svg class="heart-icon" viewBox="0 0 24 24" width="20" height="20">
        <path 
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          :fill="isFavorite ? '#FF5A5A' : 'white'"
          stroke="#FF5A5A"
          stroke-width="1.5"
        />
      </svg>
    </button>
    
    <div class="product-content">
      <h3 class="product-title">{{ product.name }}</h3>
      
      <div class="product-rating">
        <div class="stars">
          <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= Math.floor(product.rating) }">
            ★
          </span>
        </div>
        <span class="reviews">{{ product.reviews || 0 }}</span>
      </div>
      
      <div class="product-price">
        <template v-if="hasDiscount">
          <span class="original-price">NT$ {{ product.price }}</span>
          <span class="price">NT$ {{ product.discountPrice }}</span>
        </template>
        <span v-else class="price">NT$ {{ product.price }}</span>
      </div>
      
      <button @click.stop="addToCart" class="add-to-cart-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 6px">
          <path d="M3 3H5L5.4 5M5.4 5H21L17 13H7M5.4 5L7 13M7 13L4.707 15.293C4.077 15.923 4.523 17 5.414 17H17M17 17C16.4696 17 15.9609 17.2107 15.5858 17.5858C15.2107 17.9609 15 18.4696 15 19C15 19.5304 15.2107 20.0391 15.5858 20.4142C15.9609 20.7893 16.4696 21 17 21C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19C19 18.4696 18.7893 17.9609 18.4142 17.5858C18.0391 17.2107 17.5304 17 17 17ZM9 19C9 19.5304 8.78929 20.0391 8.41421 20.4142C8.03914 20.7893 7.53043 21 7 21C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19C5 18.4696 5.21071 17.9609 5.58579 17.5858C5.96086 17.2107 6.46957 17 7 17C7.53043 17 8.03914 17.2107 8.41421 17.5858C8.78929 17.9609 9 18.4696 9 19Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        加入購物車
      </button>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/store/cartStore';
import { useFavoriteStore } from '@/store/favoriteStore';
import { useUserStore } from '@/store/userStore';

export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const router = useRouter();
    const cartStore = useCartStore();
    const favoriteStore = useFavoriteStore();
    const userStore = useUserStore();
    const showImageError = ref(false);
    
    // 取得圖片URL
    const getImageUrl = (image) => {
      if (!image) return '';
      // 如果圖片路徑已經包含完整URL或/uploads前綴，直接返回
      if (image.startsWith('http') || image.startsWith('/uploads')) {
        return image;
      }
      // 否則添加/uploads/images/前綴
      return `/uploads/images/${image}`;
    };
    
    // 是否有折扣
    const hasDiscount = computed(() => {
      return props.product.discountPrice && props.product.discountPrice < props.product.price;
    });
    
    // 處理圖片載入錯誤
    const handleImageError = () => {
      showImageError.value = true;
    };
    
    // 折扣百分比
    const discountPercentage = computed(() => {
      if (!hasDiscount.value) return 0;
      const discount = Math.round(((props.product.price - props.product.discountPrice) / props.product.price) * 100);
      return discount;
    });
    
    // 是否已收藏
    const isFavorite = computed(() => {
      return favoriteStore.isFavorite(props.product._id);
    });
    
    // 切換收藏狀態
    const toggleFavorite = (event) => {
      event.stopPropagation();
      if (!userStore.isAuthenticated) {
        // 如果用戶未登入，跳轉到登入頁面
        router.push('/login');
        return;
      }
      
      if (isFavorite.value) {
        favoriteStore.removeFavorite(props.product._id);
      } else {
        favoriteStore.addFavorite(props.product);
      }
    };
    
    // 導航到商品詳情頁
    const navigateToProduct = () => {
      console.log('正在導航到產品詳情頁，產品ID:', props.product._id);
      router.push(`/product/${props.product._id}`);
    };
    
    // 添加到購物車
    const addToCart = (event) => {
      event.stopPropagation();
      cartStore.addToCart(props.product);
    };
    
    return {
      hasDiscount,
      discountPercentage,
      isFavorite,
      toggleFavorite,
      navigateToProduct,
      addToCart,
      showImageError,
      handleImageError,
      getImageUrl
    };
  }
}
</script>

<style scoped>
.product-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100%;
  position: relative;
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-image-container {
  position: relative;
  width: 100%;
  padding-bottom: 100%; /* 正方形容器 */
  overflow: hidden;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

/* 無圖片佔位符樣式 */
.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f8f8f8;
  display: flex;
  justify-content: center;
  align-items: center;
}

.placeholder-content {
  text-align: center;
}

.placeholder-icon {
  margin-bottom: 10px;
}

.placeholder-text {
  color: #999;
  font-size: 14px;
}

/* 收藏按鈕樣式 */
.favorite-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: white;
  border: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: transform 0.2s ease;
}

.favorite-btn:hover {
  transform: scale(1.1);
}

.heart-icon {
  width: 22px;
  height: 22px;
}

/* 折扣和個人化標籤 */
.discount-badge,
.personalized-badge {
  position: absolute;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  z-index: 5;
}

.discount-badge {
  top: 10px;
  left: 10px;
  background-color: #e74c3c;
  color: white;
}

.personalized-badge {
  top: 10px;
  left: 10px;
  background-color: #3498db;
  color: white;
}

/* 折扣和可客製同時存在時，調整可客製標籤位置 */
.discount-badge + .personalized-badge {
  top: 45px;
}

.product-content {
  padding: 15px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.product-title {
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 10px;
  color: #333;
  line-height: 1.4;
  height: 44px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-rating {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.stars {
  display: inline-flex;
  margin-right: 5px;
}

.star {
  color: #ddd;
  font-size: 16px;
}

.star.filled {
  color: #ffc107;
}

.reviews {
  font-size: 12px;
  color: #666;
}

.product-price {
  margin-bottom: 15px;
  font-weight: 500;
}

.price {
  font-size: 18px;
  color: #e74c3c;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
  margin-right: 8px;
}

.add-to-cart-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 10px 0;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-to-cart-btn:hover {
  background-color: #c0392b;
}

@media (max-width: 768px) {
  .product-card {
    margin-bottom: 20px;
  }
}
</style>