<template>
  <div class="product-detail container">
    <button
      v-if="isAdmin"
      class="toggle-debug-btn"
      @click="showDebug = !showDebug"
    >
      {{ showDebug ? '隱藏調試' : '顯示調試' }}
    </button>
    <!-- 調試信息 -->
    <div class="debug-info" v-if="isAdmin && showDebug">
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
        <ImageGallery
          v-if="filteredImages.length > 0"
          :images="filteredImages"
          :alt="product.name"
        />
        <img
          v-else
          class="placeholder-image"
          :src="noImage"
          alt="目前無照片"
        />
      </div>
      
      <div class="product-info">
        <h1 class="product-title">{{ product.name }}</h1>

        <div class="product-rating" v-if="product.rating > 0">
          <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= Math.round(product.rating) }">★</span>
          <span class="rating-number">{{ product.rating.toFixed(1) }}</span>
        </div>

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

        <div class="order-info">
          <span v-if="product.minimumOrderQuantity">最低訂購量: {{ product.minimumOrderQuantity }}</span>
          <span v-if="product.deliveryTime">預計交貨 {{ product.deliveryTime }} 天</span>
          <span v-if="product.isPersonalized" class="personalized-info">可客製化</span>
        </div>

        <div class="product-description">
          <h2>產品描述</h2>
          <p>
            {{ showFullDescription ? product.description : truncatedDescription }}
            <button
              v-if="product.description && product.description.length > 120"
              @click="showFullDescription = !showFullDescription"
              class="desc-toggle"
            >
              {{ showFullDescription ? '收起' : '更多' }}
            </button>
          </p>
        </div>

        <div v-if="product.specifications && Object.keys(product.specifications).length" class="product-specs">
          <h2>商品規格</h2>
          <ul>
            <li v-for="(value, key) in product.specifications" :key="key">
              <strong>{{ key }}:</strong> {{ value }}
            </li>
          </ul>
        </div>

        <div v-if="product.tags && product.tags.length" class="product-tags">
          <span v-for="tag in product.tags" :key="tag" class="tag">{{ tag }}</span>
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
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';
import ImageGallery from '@/components/ImageGallery.vue';
import noImage from '@/assets/images/no-image.svg';

export default {
  name: 'ProductDetailView',
  components: {
    ImageGallery
  },
  setup() {
    const route = useRoute();
    const productStore = useProductStore();
    const cartStore = useCartStore();
    const userStore = useUserStore();
    const quantity = ref(1);
    const showDebug = ref(false); // 預設隱藏調試模式
    const showFullDescription = ref(false);

    const isAdmin = computed(() => userStore.isAdmin);

    const filteredImages = computed(() => {
      return (productStore.product?.images || []).filter(img => !!img);
    });
    const truncatedDescription = computed(() => {
      const desc = productStore.product?.description || '';
      return desc.length > 120 ? desc.slice(0, 120) + '...' : desc;
    });
    
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
      cartStore.addToCart(productStore.product, quantity.value);
      alert(`已將 ${quantity.value} 個 "${productStore.product.name}" 加入購物車`);
    };
    
    return {
      loading: computed(() => productStore.loading),
      error: computed(() => productStore.error),
      product: computed(() => productStore.product),
      filteredImages,
      quantity,
      increaseQuantity,
      decreaseQuantity,
      addToCart,
      showDebug,
      refreshData,
      showFullDescription,
      truncatedDescription,
      isAdmin,
      noImage
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


.placeholder-image {
  width: 100%;
  height: 500px;
  object-fit: contain;
  background-color: #f2f2f2;
  border-radius: 8px;
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

.desc-toggle {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  margin-left: 5px;
  font-size: 0.9rem;
}

.order-info {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 0.9rem;
  color: #555;
}

.personalized-info {
  color: var(--primary-color);
  font-weight: 500;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
}

.star {
  color: #ddd;
  font-size: 1.2rem;
}

.star.filled {
  color: #ffc107;
}

.rating-number {
  font-size: 0.9rem;
  color: #666;
}

.product-specs {
  margin: 20px 0;
}

.product-specs h2 {
  font-size: 1.3rem;
  margin-bottom: 10px;
}

.product-specs ul {
  padding-left: 20px;
  color: #555;
}

.product-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.tag {
  background-color: #f1f1f1;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
}

.toggle-debug-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  margin-bottom: 10px;
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
