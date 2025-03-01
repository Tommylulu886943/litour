<template>
  <div class="product-card" @click="navigateToProduct">
    <div class="product-image">
      <img 
        v-if="product.images && product.images.length > 0" 
        :src="product.images[0]" 
        :alt="product.name" 
      >
      <div v-else class="placeholder-image">
        <span>無圖片</span>
      </div>
      
      <div v-if="hasDiscount" class="discount-badge">
        {{ discountPercentage }}% OFF
      </div>
      
      <div v-if="product.isPersonalized" class="personalized-badge">
        可客製
      </div>

      <!-- 收藏按鈕 -->
      <button 
        class="favorite-btn" 
        :class="{ active: isFavorite }" 
        @click.stop="toggleFavorite"
      >
        <i class="heart-icon"></i>
      </button>
    </div>
    
    <div class="product-content">
      <div class="product-category">{{ product.category }}</div>
      <h3 class="product-title">{{ product.name }}</h3>
      
      <div class="product-rating">
        <div class="stars">
          <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= Math.floor(product.rating) }">
            ★
          </span>
        </div>
        <span class="reviews">{{ product.reviews }}</span>
      </div>
      
      <div class="product-price">
        <template v-if="hasDiscount">
          <span class="original-price">NT$ {{ product.price }}</span>
          <span class="current-price">NT$ {{ product.discountPrice }}</span>
        </template>
        <span v-else class="current-price">NT$ {{ product.price }}</span>
      </div>
      
      <button @click.stop="addToCart" class="add-to-cart-btn">
        加入購物車
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
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
    
    // 是否有折扣
    const hasDiscount = computed(() => {
      return props.product.discountPrice && props.product.discountPrice < props.product.price;
    });
    
    // 折扣百分比
    const discountPercentage = computed(() => {
      if (!hasDiscount.value) return 0;
      
      const discount = props.product.price - props.product.discountPrice;
      const percentage = (discount / props.product.price) * 100;
      return Math.round(percentage);
    });
    
    // 是否已收藏
    const isFavorite = computed(() => {
      return favoriteStore.isFavorite(props.product._id);
    });
    
    // 添加到購物車
    const addToCart = () => {
      cartStore.addItem(props.product);
      alert(`已將 ${props.product.name} 加入購物車`);
    };
    
    // 切換收藏狀態
    const toggleFavorite = () => {
      if (!userStore.isAuthenticated) {
        // 未登入，顯示提示
        if (confirm('請先登入以儲存收藏商品。前往登入頁面？')) {
          router.push('/login?redirect=' + encodeURIComponent(router.currentRoute.value.fullPath));
        }
        return;
      }
      
      if (isFavorite.value) {
        favoriteStore.removeFavorite(props.product._id);
      } else {
        favoriteStore.addFavorite(props.product);
      }
    };
    
    // 導航到產品詳情
    const navigateToProduct = () => {
      router.push(`/products/${props.product._id}`);
    };
    
    return {
      hasDiscount,
      discountPercentage,
      isFavorite,
      addToCart,
      toggleFavorite,
      navigateToProduct
    };
  }
}
</script>

<style scoped>
/* 原有樣式保留 */

/* 新增收藏按鈕樣式 */
.favorite-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: white;
  border: none;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s;
}

.favorite-btn:hover {
  transform: scale(1.1);
}

.favorite-btn .heart-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  transition: all 0.3s;
}

.favorite-btn.active .heart-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e74c3c' stroke='%23e74c3c' stroke-width='2'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E");
}
</style>