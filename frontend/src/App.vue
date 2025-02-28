<template>
  <div class="app">
    <header class="header">
      <div class="container">
        <div class="header-content">
          <h1 class="logo">
            <router-link to="/">台灣企業禮品選物網站</router-link>
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
              🔍
            </button>
          </div>
          
          <nav class="nav">
            <router-link to="/" class="nav-link">首頁</router-link>
            <router-link to="/products" class="nav-link">所有商品</router-link>
            <router-link to="/about" class="nav-link">關於我們</router-link>
            <router-link to="/contact" class="nav-link">聯絡我們</router-link>
          </nav>
          
          <div class="header-actions">
            <router-link to="/cart" class="cart-btn">
              購物車 <span class="cart-count">{{ cartItemCount }}</span>
            </router-link>
            
            <div v-if="isAuthenticated" class="user-dropdown">
              <button class="user-btn" @click="showUserMenu = !showUserMenu">
                {{ user.name }}
              </button>
              
              <div v-if="showUserMenu" class="dropdown-menu">
                <router-link to="/profile" class="dropdown-item">個人中心</router-link>
                <a href="#" @click.prevent="logout" class="dropdown-item">登出</a>
              </div>
            </div>
            
            <router-link v-else to="/login" class="login-btn">
              登入
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <main class="main">
      <router-view />
    </main>

    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3 class="footer-title">關於我們</h3>
            <p>台灣企業禮品選物網站是專業的企業禮品供應商，提供高品質的客製化禮品與贈品服務，幫助企業提升品牌價值。</p>
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
              <p>📍 台北市信義區松仁路100號</p>
              <p>📞 (02) 2345-6789</p>
              <p>📧 info@giftshop.com.tw</p>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2025 台灣企業禮品選物網站 版權所有</p>
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

export default {
  name: 'App',
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    const cartStore = useCartStore();
    
    const showUserMenu = ref(false);
    const searchQuery = ref('');
    
    // 用戶資訊
    const isAuthenticated = computed(() => userStore.isAuthenticated);
    const user = computed(() => userStore.user || {});
    
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
    onMounted(() => {
      userStore.initAuth();
      cartStore.initCart();
      
      // 註冊點擊事件
      document.addEventListener('click', closeUserMenu);
    });
    
    // 組件銷毀前清理
    onBeforeUnmount(() => {
      document.removeEventListener('click', closeUserMenu);
    });
    
    return {
      isAuthenticated,
      user,
      cartItemCount,
      showUserMenu,
      searchQuery,
      logout,
      handleSearch
    };
  }
}
</script>

<style>
:root {
  --primary-color: #4CAF50;
  --secondary-color: #2196F3;
  --accent-color: #FFC107;
  --text-color: #333;
  --light-gray: #f5f5f5;
  --border-color: #ddd;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Noto Sans TC', Arial, sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background-color: var(--light-gray);
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.header {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
  font-size: 1.5rem;
  font-weight: bold;
}

.search-bar {
  display: flex;
  flex: 1;
  max-width: 400px;
  position: relative;
}

.search-bar input {
  width: 100%;
  padding: 10px 40px 10px 15px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
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
}

.nav-link:hover, .nav-link.router-link-active {
  color: var(--primary-color);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.cart-btn, .login-btn, .user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  border-radius: 4px;
  text-decoration: none;
  transition: all 0.3s;
  font-weight: 600;
}

.cart-btn {
  background-color: var(--primary-color);
  color: white;
}

.cart-btn:hover {
  background-color: #3d8b40;
}

.cart-count {
  background-color: white;
  color: var(--primary-color);
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
}

.login-btn {
  background-color: white;
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.login-btn:hover {
  background-color: var(--light-gray);
}

.user-dropdown {
  position: relative;
}

.user-btn {
  background-color: var(--secondary-color);
  color: white;
  border: none;
  cursor: pointer;
}

.user-btn:hover {
  background-color: #1976D2;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  width: 180px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
  z-index: 1000;
}

.dropdown-item {
  display: block;
  padding: 10px 15px;
  color: var(--text-color);
  text-decoration: none;
  transition: background-color 0.3s;
}

.dropdown-item:hover {
  background-color: var(--light-gray);
}

.main {
  min-height: calc(100vh - 140px - 200px);
}

.footer {
  background-color: #333;
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
}

.footer-links {
  list-style: none;
}

.footer-links li {
  margin-bottom: 10px;
}

.footer-links a {
  color: #ddd;
  text-decoration: none;
  transition: color 0.3s;
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
}
</style>
