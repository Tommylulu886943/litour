<template>
  <div class="home">
    <!-- 英雄區塊 -->
    <div class="hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">禮途</h1>
          <p class="hero-subtitle">從客製化禮盒到實用贈品，提升您企業的專業形象</p>
          <router-link to="/products" class="hero-cta">瀏覽商品</router-link>
        </div>
      </div>
    </div>
    
    <!-- 精選商品區塊 -->
    <section class="featured-products container">
      <h2 class="section-title">熱門商品</h2>
      
      <div v-if="loading" class="loading">載入中...</div>
      
      <div v-else-if="error" class="error">{{ error }}</div>
      
      <div v-else-if="!featuredProducts.length" class="empty">
        暫無精選商品
      </div>
      
      <div v-else class="product-grid">
        <ProductCard
          v-for="product in featuredProducts"
          :key="product._id"
          :product="product"
        />
      </div>
      
      <div class="text-center">
        <router-link to="/products" class="view-all-btn">查看所有商品</router-link>
      </div>
    </section>
    
    <!-- 特色區塊 -->
    <section class="features">
      <div class="container">
        <h2 class="section-title">為什麼選擇我們</h2>
        
        <div class="features-grid">
          <div class="feature">
            <div class="feature-icon">🏆</div>
            <h3 class="feature-title">優質選材</h3>
            <p class="feature-description">嚴選台灣及國際優質品牌，品質保證</p>
          </div>
          
          <div class="feature">
            <div class="feature-icon">✨</div>
            <h3 class="feature-title">客製服務</h3>
            <p class="feature-description">提供Logo印製、包裝設計等客製化服務</p>
          </div>
          
          <div class="feature">
            <div class="feature-icon">👍</div>
            <h3 class="feature-title">專業服務</h3>
            <p class="feature-description">專業團隊協助企業禮品規劃，大量訂購優惠</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { useProductStore } from '@/store/productStore';
import ProductCard from '@/components/ProductCard.vue';

export default {
  name: 'HomeView',
  components: {
    ProductCard
  },
  setup() {
    const productStore = useProductStore();

    const retryFetchFeaturedProducts = () => {
      loading.value = true;
      error.value = null;
      productStore.fetchFeaturedProducts();
    };
    
    onMounted(() => {
      productStore.fetchFeaturedProducts();
    });
    
    return {
      loading: productStore.loading,
      error: productStore.error,
      featuredProducts: productStore.featuredProducts,
      retryFetchFeaturedProducts
    };
  }
}
</script>

<style scoped>
.hero {
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
             url('https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1920');
  background-size: cover;
  background-position: center;
  color: white;
  padding: 80px 0;
  margin-bottom: 40px;
}

.hero-content {
  max-width: 600px;
}

.hero-title {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.hero-subtitle {
  font-size: 1.2rem;
  margin-bottom: 25px;
  opacity: 0.9;
}

.hero-cta {
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  text-decoration: none;
  padding: 12px 30px;
  border-radius: 4px;
  font-weight: bold;
  transition: background-color 0.3s;
}

.hero-cta:hover {
  background-color: #3d8b40;
}

.section-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
}

.featured-products {
  margin-bottom: 50px;
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

.view-all-btn {
  display: inline-block;
  background-color: var(--secondary-color);
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 4px;
  margin-top: 30px;
  transition: background-color 0.3s;
}

.view-all-btn:hover {
  background-color: #1976D2;
}

.features {
  background-color: var(--light-gray);
  padding: 60px 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.feature {
  text-align: center;
  padding: 20px;
}

.feature-icon {
  font-size: 3rem;
  color: var(--primary-color);
  margin-bottom: 15px;
}

.feature-title {
  font-size: 1.3rem;
  margin-bottom: 10px;
}

.feature-description {
  color: #666;
}
.retry-btn {
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 4px;
  margin-top: 15px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.retry-btn:hover {
  background-color: #3d8b40;
}
</style>
