<template>
  <div class="product-detail container">
    <!-- 調試信息 -->
    <div class="debug-info" v-if="showDebug">
      <h3>調試信息</h3>
      <p>產品ID: {{ $route.params.id }}</p>
      <p>載入狀態: {{ loading ? '載入中' : '載入完成' }}</p>
      <p>錯誤信息: {{ error || '無錯誤' }}</p>
      <p>產品數據: {{ product ? '已獲取' : '未獲取' }}</p>
      <pre v-if="product">{{ JSON.stringify(product, null, 2) }}</pre>
      <button @click="refreshData" class="debug-btn">重新獲取數據</button>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <span>載入中...</span>
    </div>
    
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <router-link to="/products" class="back-link">返回商品列表</router-link>
    </div>
    
    <div v-else-if="!product" class="empty">
      <p>找不到此產品</p>
      <router-link to="/products" class="back-link">返回商品列表</router-link>
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
          <template v-else>
            <span class="price">NT$ {{ product.price }}</span>
          </template>
        </div>
        
        <div class="product-stock">
          <span v-if="product.stock > 0" class="in-stock">現貨: {{ product.stock }} 件</span>
          <span v-else class="out-of-stock">缺貨中</span>
        </div>
        
        <div class="product-description">
          <h2>產品描述</h2>
          <p>{{ product.description }}</p>
        </div>
        
        <div class="quantity-selector">
          <h2>數量</h2>
          <div class="quantity-controls">
            <button @click="decreaseQuantity" :disabled="quantity <= 1 || product.stock <= 0" class="quantity-btn">-</button>
            <input type="number" v-model.number="quantity" min="1" :max="product.stock" class="quantity-input" />
            <button @click="increaseQuantity" :disabled="quantity >= product.stock || product.stock <= 0" class="quantity-btn">+</button>
          </div>
        </div>
        
        <button 
          @click="addToCart" 
          class="add-to-cart-btn"
          :disabled="product.stock <= 0"
        >
          <span v-if="product.stock > 0">加入購物車</span>
          <span v-else>缺貨中</span>
        </button>
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
    const showDebug = ref(true); // 開啟調試模式
    
    const fetchProductData = () => {
      const productId = route.params.id;
      console.log('正在獲取產品ID:', productId);
      productStore.fetchProductById(productId)
        .then(() => console.log('獲取產品成功'))
        .catch(err => console.error('獲取產品失敗:', err));
    };
    
    onMounted(() => {
      console.log('ProductDetailView mounted with ID:', route.params.id);
      fetchProductData();
    });
    
    const refreshData = () => {
      console.log('手動刷新數據');
      fetchProductData();
    };
    
    const increaseQuantity = () => {
      if (quantity.value < productStore.product?.stock) {
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
    };
    
    return {
      loading: computed(() => productStore.loading),
      error: computed(() => productStore.error),
      product: computed(() => productStore.product),
      quantity,
      increaseQuantity,
      decreaseQuantity,
      addToCart,
      showDebug,
      refreshData
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-left-color: var(--primary-color);
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  color: #e44d26;
}

.back-link {
  margin-top: 15px;
  display: inline-block;
  padding: 8px 16px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s;
}

.back-link:hover {
  background-color: var(--hover-color);
}

.product-detail-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.product-gallery {
  border-radius: 8px;
  overflow: hidden;
}

.product-main-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.placeholder-image {
  width: 100%;
  height: 500px;
  background-color: #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 1.2rem;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-title {
  font-size: 2rem;
  margin: 0;
  color: var(--text-color);
}

.product-price {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.price {
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--primary-color);
}

.original-price {
  font-size: 1.2rem;
  color: #999;
  text-decoration: line-through;
}

.product-stock {
  font-size: 1rem;
  margin-bottom: 10px;
}

.in-stock {
  color: #2ecc71;
}

.out-of-stock {
  color: #e74c3c;
}

.product-description {
  margin: 20px 0;
}

.product-description h2 {
  font-size: 1.3rem;
  margin-bottom: 10px;
  color: var(--text-color);
}

.product-description p {
  line-height: 1.6;
  color: #555;
  text-align: justify;
}

.quantity-selector {
  margin: 20px 0;
}

.quantity-selector h2 {
  font-size: 1.3rem;
  margin-bottom: 10px;
  color: var(--text-color);
}

.quantity-controls {
  display: flex;
  align-items: center;
  width: 150px;
}

.quantity-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  background-color: #f5f5f5;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.quantity-input {
  width: 70px;
  height: 40px;
  border: 1px solid #ddd;
  text-align: center;
  font-size: 1rem;
  margin: 0 5px;
}

.add-to-cart-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 15px 0;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 20px;
}

.add-to-cart-btn:hover:not(:disabled) {
  background-color: var(--hover-color);
}

.add-to-cart-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .product-detail-content {
    grid-template-columns: 1fr;
  }
  
  .product-title {
    font-size: 1.8rem;
  }
  
  .price {
    font-size: 1.5rem;
  }
}

/* 調試區域樣式 */
.debug-info {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 20px;
  font-family: monospace;
  font-size: 14px;
}

.debug-info pre {
  white-space: pre-wrap;
  margin-top: 10px;
  max-height: 300px;
  overflow-y: auto;
  background-color: #eee;
  padding: 10px;
  border-radius: 4px;
}

.debug-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}
</style>
