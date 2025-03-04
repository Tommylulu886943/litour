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
    </div>

    <!-- 收藏按鈕 -->
    <button 
      class="favorite-btn" 
      :class="{ active: isFavorite }" 
      @click.stop="toggleFavorite"
    >
      <i class="heart-icon"></i>
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
.product-card {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  background: white;
  cursor: pointer;
  margin-bottom: 20px;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.product-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.placeholder-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  color: #999;
}

.discount-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #e44d26;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
  z-index: 2;
}

.personalized-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  z-index: 2;
}

.product-content {
  padding: 15px;
}

.product-title {
  font-size: 1.1rem;
  margin-bottom: 8px;
  height: 42px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-rating {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.stars {
  display: inline-flex;
  margin-right: 8px;
}

.star {
  color: #ddd;
  font-size: 1rem;
}

.star.filled {
  color: #ffc107;
}

.reviews {
  font-size: 0.8rem;
  color: #777;
}

.product-price {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.original-price {
  text-decoration: line-through;
  color: #999;
  font-size: 0.9rem;
}

.price {
  font-weight: bold;
  font-size: 1.1rem;
  color: #e44d26;
}

.add-to-cart-btn {
  width: 100%;
  padding: 10px 0;
  background-color: var(--primary-color, #4CAF50);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-to-cart-btn:hover {
  background-color: #3d8b40;
}

.favorite-btn {
  position: absolute;
  top: 160px;
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
  padding: 0;
  transform: translateY(-50%);
}

.favorite-btn:hover {
  transform: translateY(-50%) scale(1.1);
}

.heart-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='1.5'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  transition: all 0.3s;
}

.favorite-btn.active .heart-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e74c3c' stroke='%23e74c3c' stroke-width='1.5'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E");
}

@media (max-width: 768px) {
  .product-image {
    height: 160px;
  }
  
  .favorite-btn {
    top: 120px;
  }
}
</style>