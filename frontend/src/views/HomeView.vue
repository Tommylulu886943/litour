<template>
  <div class="home">
    <!-- 英雄區塊 -->
    <div class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge">專業禮品方案</div>
          <h1 class="hero-title">禮途</h1>
          <p class="hero-subtitle">從客製化禮盒到實用贈品，提升您企業的專業形象</p>
          <div class="hero-cta-group">
            <router-link to="/products" class="hero-cta primary-cta">瀏覽商品</router-link>
            <router-link to="/contact" class="hero-cta secondary-cta">聯絡顧問</router-link>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 品牌價值提案 -->
    <section class="value-props">
      <div class="container">
        <div class="value-props-grid">
          <div class="value-prop">
            <div class="value-icon">🎁</div>
            <h3>精選禮品</h3>
            <p>嚴選高質感品牌與產品</p>
          </div>
          <div class="value-prop">
            <div class="value-icon">⚡</div>
            <h3>快速出貨</h3>
            <p>72小時內完成配送</p>
          </div>
          <div class="value-prop">
            <div class="value-icon">🛠️</div>
            <h3>客製服務</h3>
            <p>專屬LOGO與包裝設計</p>
          </div>
          <div class="value-prop">
            <div class="value-icon">💰</div>
            <h3>企業優惠</h3>
            <p>大量訂購專屬折扣</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 精選商品區塊 -->
    <section class="featured-products container">
      <div class="section-header">
        <h2 class="section-title">熱門商品</h2>
        <p class="section-subtitle">為您精選最受歡迎的企業禮品</p>
      </div>
      
      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
        <p>載入中...</p>
      </div>
      
      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
        <button @click="retryFetchFeaturedProducts" class="retry-btn">重試</button>
      </div>
      
      <div v-else-if="!featuredProducts.length" class="empty">
        <p>暫無精選商品</p>
        <router-link to="/products" class="view-all-btn">瀏覽所有商品</router-link>
      </div>
      
      <div v-else class="product-grid">
        <ProductCard
          v-for="product in featuredProducts"
          :key="product._id"
          :product="product"
        />
      </div>
      
      <div class="text-center view-more">
        <router-link to="/products" class="view-all-btn">查看所有商品</router-link>
      </div>
    </section>
    
    <!-- 企業禮品類別 -->
    <section class="gift-categories">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">企業禮品類別</h2>
          <p class="section-subtitle">多樣選擇，滿足各種場合需求</p>
        </div>
        
        <div class="categories-grid">
          <router-link to="/category/tech" class="category-card">
            <div class="category-image tech-image"></div>
            <h3>科技禮品</h3>
          </router-link>
          
          <router-link to="/category/stationery" class="category-card">
            <div class="category-image stationery-image"></div>
            <h3>文具禮品</h3>
          </router-link>
          
          <router-link to="/category/drinkware" class="category-card">
            <div class="category-image drinkware-image"></div>
            <h3>飲品器皿</h3>
          </router-link>
          
          <router-link to="/category/food" class="category-card">
            <div class="category-image food-image"></div>
            <h3>食品禮盒</h3>
          </router-link>
        </div>
      </div>
    </section>
    
    <!-- 特色區塊 -->
    <section class="features">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">為什麼選擇我們</h2>
          <p class="section-subtitle">專業服務，提升企業形象</p>
        </div>
        
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
    
    <!-- 客戶見證 -->
    <section class="testimonials">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">客戶見證</h2>
          <p class="section-subtitle">聽聽他們怎麼說</p>
        </div>
        
        <div class="testimonials-grid">
          <div class="testimonial-card">
            <div class="testimonial-content">
              <p>"禮途的客製化服務超出我們的期望，每位員工都喜愛他們的紀念品，非常感謝您們的專業建議！"</p>
            </div>
            <div class="testimonial-author">
              <div class="author-image"></div>
              <div class="author-info">
                <h4>王小姐</h4>
                <p>某科技公司 人資主管</p>
              </div>
            </div>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-content">
              <p>"我們的客戶對禮途提供的年節禮盒讚不絕口，品質和包裝都非常精緻，明年一定會再合作！"</p>
            </div>
            <div class="testimonial-author">
              <div class="author-image"></div>
              <div class="author-info">
                <h4>林先生</h4>
                <p>某金融機構 行銷總監</p>
              </div>
            </div>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-content">
              <p>"從下單到收到商品，整個流程非常順暢，客服人員也很專業，解決了我們的所有疑問。"</p>
            </div>
            <div class="testimonial-author">
              <div class="author-image"></div>
              <div class="author-info">
                <h4>陳先生</h4>
                <p>某貿易公司 採購經理</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 訂閱區塊 -->
    <section class="subscription">
      <div class="container">
        <div class="subscription-card">
          <div class="subscription-content">
            <h2>訂閱我們的電子報</h2>
            <p>獲取最新產品消息和企業禮品趨勢</p>
            <form class="subscription-form">
              <input type="email" placeholder="請輸入您的電子郵件" required>
              <button type="submit">訂閱</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { onMounted, computed } from 'vue';
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
      productStore.loading = true;
      productStore.error = null;
      productStore.fetchFeaturedProducts();
    };
    
    onMounted(() => {
      productStore.fetchFeaturedProducts();
    });
    
    return {
      loading: computed(() => productStore.loading),
      error: computed(() => productStore.error),
      featuredProducts: computed(() => productStore.featuredProducts),
      retryFetchFeaturedProducts
    };
  }
}
</script>

<style scoped>
/* 更新後的紅粉色系首頁樣式 */
.home {
  color: var(--text-color);
}

/* 英雄區塊 */
.hero {
  background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), 
             url('https://images.unsplash.com/photo-1549465220-1a8b9238cd48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80');
  background-size: cover;
  background-position: center;
  color: white;
  padding: 100px 0;
  margin-bottom: 60px;
  text-align: center;
  position: relative;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(232, 74, 95, 0.7), rgba(255, 132, 124, 0.7));
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.hero-badge {
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 25px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  letter-spacing: 1px;
}

.hero-title {
  font-size: 3.5rem;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  font-weight: 700;
}

.hero-subtitle {
  font-size: 1.4rem;
  margin-bottom: 35px;
  opacity: 0.9;
  max-width: 650px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.5;
}

.hero-cta-group {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.hero-cta {
  display: inline-block;
  padding: 14px 30px;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
  font-size: 1.1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.primary-cta {
  background-color: var(--primary-color);
  color: white;
}

.primary-cta:hover {
  background-color: var(--hover-color);
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.secondary-cta {
  background-color: rgba(255, 255, 255, 0.9);
  color: var(--primary-color);
  border: 2px solid white;
}

.secondary-cta:hover {
  background-color: white;
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

/* 品牌價值提案 */
.value-props {
  margin-bottom: 60px;
}

.value-props-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 30px;
}

.value-prop {
  text-align: center;
  padding: 30px 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.04);
  transition: transform 0.3s;
}

.value-prop:hover {
  transform: translateY(-10px);
}

.value-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
  position: relative;
  display: inline-block;
}

.value-icon::after {
  content: '';
  position: absolute;
  width: 50px;
  height: 50px;
  background-color: var(--light-gray);
  border-radius: 50%;
  z-index: -1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.value-prop h3 {
  margin-bottom: 10px;
  font-size: 1.3rem;
  font-weight: 600;
}

.value-prop p {
  color: #666;
  font-size: 0.95rem;
}

/* 章節樣式 */
section {
  padding: 60px 0;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-title {
  font-size: 2.2rem;
  margin-bottom: 15px;
  color: var(--text-color);
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  width: 80px;
  height: 3px;
  background-color: var(--primary-color);
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
}

.section-subtitle {
  font-size: 1.1rem;
  color: #666;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

/* 精選商品 */
.featured-products {
  background-color: white;
  padding: 80px 0;
}

.loading, .error, .empty {
  text-align: center;
  padding: 40px 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(232, 74, 95, 0.1);
  border-left-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error {
  color: var(--primary-color);
}

.retry-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 50px;
  margin-top: 15px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.retry-btn:hover {
  background-color: var(--hover-color);
  transform: scale(1.05);
}

.view-more {
  margin-top: 40px;
}

.view-all-btn {
  display: inline-block;
  background-color: var(--secondary-color);
  color: white;
  text-decoration: none;
  padding: 12px 30px;
  border-radius: 50px;
  transition: all 0.3s;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(255, 132, 124, 0.3);
}

.view-all-btn:hover {
  background-color: var(--hover-color);
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(255, 132, 124, 0.4);
}

/* 禮品類別 */
.gift-categories {
  background-color: var(--light-gray);
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.category-card {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  text-decoration: none;
  color: var(--text-color);
  background-color: white;
  transition: all 0.3s;
  position: relative;
}

.category-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(232, 74, 95, 0.15);
}

.category-image {
  height: 200px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.category-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%);
}

.tech-image {
  background-image: url('https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80');
}

.stationery-image {
  background-image: url('https://images.unsplash.com/photo-1565377008835-786a6bc44e84?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80');
}

.drinkware-image {
  background-image: url('https://images.unsplash.com/photo-1530016242281-c95959513a0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80');
}

.food-image {
  background-image: url('https://images.unsplash.com/photo-1516743619420-154b70a65fea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80');
}

.category-card h3 {
  padding: 15px 20px;
  font-size: 1.2rem;
  text-align: center;
  border-top: 3px solid var(--primary-color);
}

/* 特色區塊 */
.features {
  background-color: white;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
}

.feature {
  text-align: center;
  padding: 30px;
  border-radius: 10px;
  transition: all 0.3s;
  background: linear-gradient(135deg, white 0%, var(--light-gray) 100%);
  border: 1px solid var(--border-color);
}

.feature:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  border-color: var(--primary-color);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 20px;
  display: inline-block;
  position: relative;
  z-index: 1;
}

.feature-icon::before {
  content: '';
  position: absolute;
  width: 70px;
  height: 70px;
  background-color: rgba(232, 74, 95, 0.1);
  border-radius: 50%;
  z-index: -1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.feature-title {
  font-size: 1.4rem;
  margin-bottom: 15px;
  color: var(--primary-color);
}

.feature-description {
  color: #666;
  line-height: 1.6;
}

/* 客戶見證 */
.testimonials {
  background-color: var(--light-gray);
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.testimonial-card {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  padding: 30px;
  position: relative;
}

.testimonial-card::before {
  content: '"';
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 4rem;
  color: rgba(232, 74, 95, 0.1);
  font-family: Georgia, serif;
  line-height: 1;
}

.testimonial-content {
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.testimonial-content p {
  font-style: italic;
  line-height: 1.6;
}

.testimonial-author {
  display: flex;
  align-items: center;
}

.author-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--border-color);
  margin-right: 15px;
  background-image: url('https://via.placeholder.com/50');
  background-size: cover;
}

.author-info h4 {
  margin-bottom: 5px;
  font-weight: 600;
}

.author-info p {
  color: #666;
  font-size: 0.9rem;
}

/* 訂閱區塊 */
.subscription {
  background-color: white;
  padding-bottom: 80px;
}

.subscription-card {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--hover-color) 100%);
  border-radius: 10px;
  padding: 50px;
  color: white;
  box-shadow: 0 15px 30px rgba(232, 74, 95, 0.2);
  text-align: center;
}

.subscription-content h2 {
  font-size: 2rem;
  margin-bottom: 15px;
}

.subscription-content p {
  font-size: 1.1rem;
  margin-bottom: 30px;
  opacity: 0.9;
}

.subscription-form {
  display: flex;
  max-width: 500px;
  margin: 0 auto;
}

.subscription-form input {
  flex: 1;
  padding: 15px 20px;
  border: none;
  border-radius: 50px 0 0 50px;
  font-size: 1rem;
}

.subscription-form input:focus {
  outline: none;
}

.subscription-form button {
  padding: 15px 30px;
  background-color: var(--text-color);
  color: white;
  border: none;
  border-radius: 0 50px 50px 0;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.subscription-form button:hover {
  background-color: #000;
}

/* 響應式設計 */
@media (max-width: 992px) {
  .hero {
    padding: 80px 0;
  }
  
  .hero-title {
    font-size: 2.8rem;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
  }
  
  .subscription-card {
    padding: 30px;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.2rem;
  }
  
  .hero-cta-group {
    flex-direction: column;
    gap: 15px;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
  
  .subscription-form {
    flex-direction: column;
    gap: 10px;
  }
  
  .subscription-form input,
  .subscription-form button {
    border-radius: 50px;
    width: 100%;
  }
}
</style>