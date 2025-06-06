<template>
  <div class="app">
    <header class="header">
      <div class="container">
        <div class="header-content">
          <h1 class="logo">
            <router-link to="/">禮途</router-link>
          </h1>
          
          <!-- 搜索框 -->
          <div class="search-bar">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="搜索商品..."
              @keyup.enter="handleSearch"
            >
            <button @click="handleSearch" class="search-btn">
              <i class="search-icon">🔍</i>
            </button>
          </div>

          <nav class="nav">
            <router-link to="/" class="nav-link">首頁</router-link>
            <router-link to="/products" class="nav-link">所有商品</router-link>
            <router-link to="/about" class="nav-link">關於我們</router-link>
            <router-link to="/contact" class="nav-link">聯絡我們</router-link>
          </nav>
        
          <div class="header-actions">
            <router-link to="/favorites" class="favorites-btn">
              <i class="heart-icon"></i>
              <span>收藏夾</span>
              <span v-if="favoritesCount > 0" class="favorites-count">{{ favoritesCount }}</span>
            </router-link>

            <router-link to="/cart" class="cart-btn">
              <i class="cart-icon"></i>
              <span>購物車</span>
              <span class="cart-count">{{ cartItemCount }}</span>
            </router-link>
            
            <div v-if="isAuthenticated" class="user-dropdown">
              <button class="user-btn" @click.stop="toggleUserMenu">
                <i class="user-icon"></i>
                {{ user.name || '會員' }}
              </button>
              
              <div v-show="showUserMenu" class="user-menu">
                <router-link to="/profile" class="menu-item">個人中心</router-link>
                <router-link v-if="isAdmin" to="/admin/batch-upload" class="menu-item">批量上傳</router-link>
                <a href="#" @click.prevent="logout" class="menu-item">登出</a>
              </div>
            </div>
            
            <router-link v-else to="/login" class="login-btn">
              <i class="login-icon"></i>
              登入
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <div class="category-nav">
      <div class="container">
        <nav class="main-nav">
          <div class="nav-item">
            <router-link :to="{ name: 'products' }" class="nav-link">新品與熱銷</router-link>
            <div class="dropdown-menu">
              <div class="dropdown-columns">
                <div class="dropdown-column">
                  <h3>熱門商品</h3>
                  <ul>
                    <li><router-link :to="{ name: 'products', query: { sort: 'newest' } }">最新商品</router-link></li>
                    <li><router-link :to="{ name: 'products', query: { sort: 'popular' } }">熱銷排行</router-link></li>
                    <li><router-link :to="{ name: 'products', query: { category: '季節精選' } }">季節精選</router-link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="nav-item">
            <router-link :to="{ name: 'products' }" class="nav-link">禮贈品靈感</router-link>
            <div class="dropdown-menu">
              <div class="dropdown-columns">
                <div class="dropdown-column">
                  <h3>按對象挑選</h3>
                  <ul>
                    <li><router-link :to="{ name: 'products', query: { forGender: 'Women' } }">女性禮贈品</router-link></li>
                    <li><router-link :to="{ name: 'products', query: { forGender: 'Men' } }">男性禮贈品</router-link></li>
                    <li><router-link :to="{ name: 'products', query: { category: '送摯友' } }">送摯友</router-link></li>
                    <li><router-link :to="{ name: 'products', query: { category: '青少年' } }">青少年禮贈</router-link></li>
                    <li><router-link :to="{ name: 'products', query: { category: '兒童' } }">兒童禮贈</router-link></li>
                    <li><router-link :to="{ name: 'products', query: { category: '嬰幼兒' } }">嬰幼兒禮贈</router-link></li>
                  </ul>
                </div>
                <div class="dropdown-column">
                  <h3>按預算範圍</h3>
                  <ul>
                    <li><router-link :to="{ name: 'products', query: { maxPrice: 25 } }">$25 以下</router-link></li>
                    <li><router-link :to="{ name: 'products', query: { minPrice: 25, maxPrice: 50 } }">$25 ~ $50</router-link></li>
                    <li><router-link :to="{ name: 'products', query: { minPrice: 50, maxPrice: 100 } }">$50 ~ $100</router-link></li>
                    <li><router-link :to="{ name: 'products', query: { minPrice: 100, maxPrice: 200 } }">$100 ~ $200</router-link></li>
                    <li><router-link :to="{ name: 'products', query: { minPrice: 200, maxPrice: 500 } }">$200 ~ $500</router-link></li>
                    <li><router-link :to="{ name: 'products', query: { minPrice: 500, maxPrice: 1000 } }">$500 ~ $1000</router-link></li>
                    <li><router-link :to="{ name: 'products', query: { minPrice: 1000 } }">$1000 以上</router-link></li>
                  </ul>
                </div>
                <div class="dropdown-column">
                  <h3>按興趣領域</h3>
                  <ul>
                    <li><router-link :to="{ name: 'products', query: { category: 'Stationery' } }">藝術與手作</router-link></li>
                    <li><router-link :to="{ name: 'products', query: { category: 'Food & Drink' } }">烹飪與美食</router-link></li>
                    <li><router-link :to="{ name: 'products', query: { category: 'Home' } }">園藝與生活</router-link></li>
                    <li><router-link :to="{ name: 'products', query: { category: 'Tech' } }">科技與電子</router-link></li>
                    <li><router-link :to="{ name: 'products', query: { category: 'Other' } }">運動與戶外</router-link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="nav-item">
            <router-link :to="{ name: 'products', query: { forGender: 'Women' } }" class="nav-link">女性專屬禮贈</router-link>
          </div>

          <div class="nav-item">
            <router-link :to="{ name: 'products', query: { forGender: 'Men' } }" class="nav-link">男性專屬禮贈</router-link>
          </div>

          <div class="nav-item">
            <router-link :to="{ name: 'products', query: { category: 'Kids' } }" class="nav-link">兒童與嬰幼兒禮贈</router-link>
          </div>

          <div class="nav-item">
            <router-link :to="{ name: 'products', query: { category: 'Occasions' } }" class="nav-link">節慶與活動專區</router-link>
          </div>

          <div class="nav-item">
            <router-link :to="{ name: 'products', query: { category: 'Brand' } }" class="nav-link">品牌館</router-link>
          </div>
        </nav>
      </div>
    </div>

    <main class="main">
      <router-view />
    </main>

    <!-- 全站可見的 LINE 聯絡圖示 -->
    <div class="line-floating" tabindex="0" role="button" aria-label="Contact us on LINE">
      <img class="line-icon" src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg" alt="LINE logo">
      <img class="line-qr" src="https://via.placeholder.com/200x200?text=LINE+QR" alt="Scan this QR code to contact us on LINE">
    </div>

    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3 class="footer-title">關於我們</h3>
            <p>禮途有限公司是專業的企業禮品供應商，提供高品質的客製化禮品與贈品服務，幫助企業提升品牌價值。</p>
          </div>
          
          <div class="footer-section">
            <h3 class="footer-title">快速連結</h3>
            <ul class="footer-links">
              <li><router-link to="/products">所有商品</router-link></li>
              <li><router-link to="/about">關於我們</router-link></li>
              <li><router-link to="/contact">聯絡我們</router-link></li>
              <li><router-link to="/profile">會員中心</router-link></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h3 class="footer-title">聯絡我們</h3>
            <div class="contact-info">
              <p>📍 基隆市中山區中山里中山一路157號 </p>
              <p>📞 (02) 2345-6789</p>
              <p>📧 litour@gmail.com</p>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2025 禮途有限公司 版權所有</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from './store/userStore';
import { useCartStore } from './store/cartStore';
import { useFavoriteStore } from './store/favoriteStore';

export default {
  name: 'App',
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    const cartStore = useCartStore();
    const favoriteStore = useFavoriteStore();
    const favoritesCount = computed(() => favoriteStore.totalFavorites);

    const showUserMenu = ref(false);
    const searchQuery = ref('');
    
    // 用戶資訊
    const isAuthenticated = computed(() => userStore.isAuthenticated);
    const user = computed(() => userStore.user || {});
    const isAdmin = computed(() => userStore.isAdmin);

    // 購物車資訊
    const cartItemCount = computed(() => cartStore.totalItems);
    
    // 登出
    const logout = () => {
      userStore.logout();
      showUserMenu.value = false;
    };
    
    // 處理搜索
    const handleSearch = () => {
      if (searchQuery.value.trim()) {
        router.push({
          name: 'products',
          query: { search: searchQuery.value.trim() }
        });
      }
    };
    
    // 點擊外部關閉用戶選單
    const closeUserMenu = (event) => {
      if (showUserMenu.value && !event.target.closest('.user-dropdown')) {
        showUserMenu.value = false;
      }
    };
    
    // 組件掛載時初始化
    onMounted(async () => {
      await userStore.initAuth();
      cartStore.initCart();
      
      // 如果已登入，加載收藏
      if (userStore.isAuthenticated) {
        favoriteStore.initFavorites();
        // 確保用戶資料完整
        await userStore.fetchUserProfile();
      }
      
      // 註冊點擊事件
      document.addEventListener('click', closeUserMenu);
    });

    // 組件銷毀前清理
    onBeforeUnmount(() => {
      document.removeEventListener('click', closeUserMenu);
    });

    // 點擊 User Menu
    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value;
      console.log('用戶選單狀態:', showUserMenu.value);
      
      setTimeout(() => {
        console.log('延遲檢查選單狀態:', showUserMenu.value);
      }, 100);
    };
    
    return {
      isAuthenticated,
      user,
      cartItemCount,
      showUserMenu,
      searchQuery,
      logout,
      handleSearch,
      toggleUserMenu,
      isAdmin,
      favoritesCount,
    };
  }
}
</script>

<style>
/* 粉紅色主題 App.vue 樣式 */
.header {
  background-color: white;
  box-shadow: 0 2px 15px rgba(232, 74, 95, 0.1);
  padding: 15px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 15px;
}

.logo a {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 1.8rem;
  font-weight: bold;
  position: relative;
  display: inline-block;
}

.logo a::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 3px;
  background-color: var(--primary-color);
  bottom: -3px;
  left: 0;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
}

.logo a:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

.search-bar {
  display: flex;
  flex: 1;
  max-width: 400px;
  position: relative;
}

.search-bar input {
  width: 100%;
  padding: 12px 40px 12px 15px;
  border: 1px solid var(--border-color);
  border-radius: 50px;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.search-bar input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(232, 74, 95, 0.2);
}

.search-btn {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: var(--primary-color);
  padding: 8px;
}

.search-btn:hover {
  background: none;
  transform: translateY(-50%) scale(1.1);
}

.search-icon {
  font-style: normal;
}

.nav {
  display: flex;
  gap: 20px;
}

.nav-link {
  color: var(--text-color);
  text-decoration: none;
  transition: color 0.3s;
  font-weight: 500;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--primary-color);
  transform: scaleX(0);
  transition: transform 0.3s;
}

.nav-link:hover::after, 
.nav-link.router-link-active::after {
  transform: scaleX(1);
}

.nav-link:hover, 
.nav-link.router-link-active {
  color: var(--primary-color);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.cart-btn, .login-btn, .user-btn, .favorites-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  border-radius: 50px;
  text-decoration: none;
  transition: all 0.3s;
  font-weight: 500;
}

.cart-btn {
  background-color: var(--primary-color);
  color: white;
}

.cart-btn:hover {
  background-color: var(--hover-color);
  transform: translateY(-2px);
}

.cart-count {
  background-color: white;
  color: var(--primary-color);
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
  font-weight: bold;
}

.login-btn {
  background-color: white;
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.login-btn:hover {
  background-color: var(--light-gray);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.favorites-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  border-radius: 50px;
  text-decoration: none;
  transition: all 0.3s;
  font-weight: 500;
  background-color: white;
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.favorites-btn:hover {
  background-color: var(--light-gray);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.favorites-count {
  background-color: var(--primary-color);
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
  font-weight: bold;
}

.heart-icon, .cart-icon, .user-icon, .login-icon {
  font-size: 1.2rem;
  font-style: normal;
}

.heart-icon::before {
  content: '♥';
  color: var(--primary-color);
}

.cart-icon::before {
  content: '🛒';
}

.user-icon::before {
  content: '👤';
}

.login-icon::before {
  content: '🔑';
}

.user-dropdown {
  position: relative;
  display: inline-block;
}

.user-btn {
  background-color: var(--secondary-color);
  color: white;
  border: none;
  cursor: pointer;
  padding: 10px 15px;
  border-radius: 50px;
  font-size: 1rem;
}

.user-menu {
  position: absolute;
  top: 100%;
  right: 0;
  width: 120px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  margin-top: 10px;
  z-index: 9999;
  padding: 5px 0;
}

.menu-item {
  display: block;
  padding: 8px 15px;
  color: #333;
  text-decoration: none;
  font-size: 14px;
  text-align: left;
}

.menu-item:hover {
  background-color: #f5f5f5;
  color: var(--primary-color);
}

/* 類別導航 */
.category-nav {
  background-color: var(--light-gray);
  border-bottom: 1px solid var(--border-color);
  padding: 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.main-nav {
  display: flex;
  justify-content: space-between;
}

.main-nav .nav-link {
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-size: 0.9rem;
  padding: 15px 10px;
}

/* 頁面主體 */
.main {
  min-height: calc(100vh - 140px - 200px);
}

/* 頁尾樣式 */
.footer {
  background-color: #2A363B;
  color: white;
  padding: 40px 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 30px;
}

.footer-title {
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: var(--accent-color);
  position: relative;
  padding-bottom: 10px;
}

.footer-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background-color: var(--primary-color);
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 10px;
}

.footer-links a {
  color: #ddd;
  text-decoration: none;
  transition: color 0.3s;
  position: relative;
  padding-left: 15px;
}

.footer-links a::before {
  content: '❤';
  position: absolute;
  left: 0;
  color: var(--primary-color);
  font-size: 0.7rem;
  top: 50%;
  transform: translateY(-50%);
}

.footer-links a:hover {
  color: white;
}

.contact-info p {
  margin-bottom: 10px;
  color: #ddd;
}

.footer-bottom {
  border-top: 1px solid #444;
  padding-top: 20px;
  text-align: center;
  color: #999;
}

/* 浮動 LINE 圖標 */
.line-floating {
  position: fixed;
  right: 20px;
  bottom: 120px;
  z-index: 500;
  text-align: center;
}

.line-icon {
  width: 50px;
  height: 50px;
  cursor: pointer;
}

.line-qr {
  display: none;
  position: absolute;
  right: 0;
  bottom: 60px;
  width: 150px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.line-floating:hover .line-qr {
  display: block;
}

/* 響應式設計 */
@media (max-width: 992px) {
  .header-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-bar {
    max-width: 100%;
    order: 2;
  }
  
  .nav {
    order: 3;
    width: 100%;
    justify-content: center;
    margin: 15px 0;
  }
  
  .header-actions {
    order: 4;
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
  }
  
  .category-nav {
    overflow-x: auto;
  }
  
  .main-nav {
    width: max-content;
    padding: 0 15px;
  }
  
  .main-nav .nav-link {
    white-space: nowrap;
  }
}
</style>