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
    
    // 添加到購物車
    const addToCart = () => {
      cartStore.addItem(props.product);
      
      // 顯示通知
      alert(`已將 ${props.product.name} 加入購物車`);
    };
    
    // 導航到產品詳情
    const navigateToProduct = () => {
      router.push(`/products/${props.product._id}`);
    };
    
    return {
      hasDiscount,
      discountPercentage,
      addToCart,
      navigateToProduct
    };
  }
}
</script>

<style scoped>
.product-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.product-image {
  height: 200px;
  position: relative;
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
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.discount-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #e53935;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.personalized-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #2196f3;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.product-content {
  padding: 15px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-category {
  color: #999;
  font-size: 0.8rem;
  margin-bottom: 8px;
  text-transform: capitalize;
}

.product-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 10px;
  line-height: 1.4;
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
  display: flex;
  color: #ddd;
  margin-right: 5px;
}

.star {
  margin-right: 2px;
}

.star.filled {
  color: #ffc107;
}

.reviews {
  font-size: 0.8rem;
  color: #999;
}

.product-price {
  margin-bottom: 15px;
  margin-top: auto;
}

.original-price {
  color: #999;
  text-decoration: line-through;
  margin-right: 8px;
  font-size: 0.9rem;
}

.current-price {
  color: #e53935;
  font-weight: 600;
  font-size: 1.1rem;
}

.add-to-cart-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
}

.add-to-cart-btn:hover {
  background-color: #3d8b40;
}
</style>
