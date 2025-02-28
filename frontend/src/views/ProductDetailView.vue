<template>
  <div class="product-detail container">
    <div v-if="loading" class="loading">載入中...</div>
    
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <div v-else-if="!product" class="empty">
      找不到產品
    </div>
    
    <div v-else class="product-detail-content">
      <div class="product-gallery">
        <img 
          v-if="product.images && product.images.length > 0" 
          :src="product.images[0]" 
          :alt="product.name" 
          class="product-main-image"
        >
        <div v-else class="placeholder-image">
          <span>無圖片</span>
        </div>
      </div>
      
      <div class="product-info">
        <h1 class="product-title">{{ product.name }}</h1>
        
        <div class="product-price">
          <template v-if="product.discountPrice">
            <span class="original-price">NT$ {{ product.price }}</span>
            <span class="price">NT$ {{ product.discountPrice }}</span>
          </template>
          <span v-else class="price">NT$ {{ product.price }}</span>
        </div>
        
        <p class="product-description">{{ product.description }}</p>
        
        <div class="product-meta">
          <div class="product-stock">
            <span class="meta-label">庫存:</span>
            <span class="stock-status" :class="{ 'in-stock': product.stock > 0 }">
              {{ product.stock > 0 ? '有庫存' : '缺貨中' }}
            </span>
          </div>
          
          <div v-if="product.categories && product.categories.length" class="product-categories">
            <span class="meta-label">類別:</span>
            <span v-for="(category, index) in product.categories" :key="index" class="category-tag">
              {{ category }}
            </span>
          </div>
        </div>
        
        <div class="product-actions">
          <div class="quantity-selector">
            <button @click="decreaseQuantity" :disabled="quantity <= 1">-</button>
            <input type="number" v-model.number="quantity" min="1" :max="product.stock">
            <button @click="increaseQuantity" :disabled="quantity >= product.stock">+</button>
          </div>
          
          <button 
            @click="addToCart" 
            class="add-to-cart-btn"
            :disabled="product.stock <= 0"
          >
            加入購物車
          </button>
        </div>
        
        <div v-if="product.specifications" class="product-specifications">
          <h3>產品規格</h3>
          <ul>
            <li v-for="(value, key) in product.specifications" :key="key">
              <span class="spec-name">{{ key }}:</span> {{ value }}
            </li>
          </ul>
        </div>
        
        <div v-if="product.tags && product.tags.length" class="product-tags">
          <span v-for="tag in product.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useProductStore } from '@/store/productStore';

export default {
  name: 'ProductDetailView',
  setup() {
    const route = useRoute();
    const productStore = useProductStore();
    const quantity = ref(1);
    
    onMounted(() => {
      const productId = route.params.id;
      productStore.fetchProductById(productId);
    });
    
    const increaseQuantity = () => {
      if (quantity.value < productStore.product.stock) {
        quantity.value++;
      }
    };
    
    const decreaseQuantity = () => {
      if (quantity.value > 1) {
        quantity.value--;
      }
    };
    
    const addToCart = () => {
      alert(`已將 ${quantity.value} 個 "${productStore.product.name}" 加入購物車`);
      // 稍後會實現真正的購物車功能
    };
    
    return {
      loading: computed(() => productStore.loading),
      error: computed(() => productStore.error),
      product: computed(() => productStore.product),
      quantity,
      increaseQuantity,
      decreaseQuantity,
      addToCart
    };
  }
}
</script>

<style scoped>
.product-detail {
  padding: 40px 0;
}

.loading, .error, .empty {
  text-align: center;
  padding: 40px 0;
  font-size: 1.2rem;
  color: #666;
}

.error {
  color: #e44d26;
}

.product-detail-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.product-gallery {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.product-main-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.placeholder-image {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
  background-color: #f0f0f0;
  color: #999;
}

.product-title {
  font-size: 2rem;
  margin-bottom: 15px;
}

.product-price {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.product-description {
  color: #555;
  line-height: 1.7;
  margin-bottom: 25px;
}

.product-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 25px;
  padding-bottom: 25px;
  border-bottom: 1px solid var(--border-color);
}

.meta-label {
  font-weight: bold;
  margin-right: 5px;
}

.stock-status {
  color: #e44d26;
}

.stock-status.in-stock {
  color: var(--primary-color);
}

.category-tag {
  background-color: #f0f0f0;
  padding: 4px 8px;
  border-radius: 4px;
  margin-right: 5px;
  font-size: 0.9rem;
}

.product-actions {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.quantity-selector {
  display: flex;
  align-items: center;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  overflow: hidden;
}

.quantity-selector button {
  background-color: #f0f0f0;
  color: var(--text-color);
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.quantity-selector button:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.quantity-selector button:disabled {
  color: #999;
  cursor: not-allowed;
}

.quantity-selector input {
  width: 60px;
  text-align: center;
  border: none;
  border-left: 1px solid var(--border-color);
  border-right: 1px solid var(--border-color);
  padding: 10px 0;
}

.add-to-cart-btn {
  flex-grow: 1;
}

.add-to-cart-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.product-specifications {
  margin-bottom: 25px;
}

.product-specifications h3 {
  margin-bottom: 10px;
  font-size: 1.2rem;
}

.product-specifications ul {
  list-style: none;
  padding: 0;
}

.product-specifications li {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.spec-name {
  font-weight: bold;
  margin-right: 5px;
  text-transform: capitalize;
}

.product-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 25px;
}

.tag {
  background-color: #f0f0f0;
  color: #555;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .product-detail-content {
    grid-template-columns: 1fr;
  }
}
</style>
