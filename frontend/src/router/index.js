import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import { useUserStore } from '../store/userStore';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/ProductsView.vue')
    },
    {
      path: '/product/:id',
      name: 'product-detail',
      component: () => import('../views/ProductDetailView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { hideForAuth: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { hideForAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/CartView.vue')
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/CheckoutView.vue')
    },
    {
      path: '/order-success/:id',
      name: 'order-success',
      component: () => import('../views/OrderSuccessView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/ProductsView.vue')
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('../views/FavoritesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/ProductsView.vue')
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('../views/FavoritesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/batch-upload',
      name: 'admin-batch-upload',
      component: () => import('../views/admin/BatchUploadView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    }
  ]
});

// 路由前置守衛
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  
  // 檢查是否需要身份驗證
  if (to.matched.some(record => record.meta.requiresAuth) && !userStore.isAuthenticated) {
    // 需要登錄但用戶未登錄，重定向到登錄頁面
    next({ name: 'login', query: { redirect: to.fullPath } });
  } 
  // 檢查是否需要管理員權限
  else if (to.matched.some(record => record.meta.requiresAdmin) && !userStore.isAdmin) {
    // 需要管理員權限但用戶不是管理員，重定向到首頁
    next({ name: 'home' });
  }
  // 檢查是否為已登錄用戶隱藏的頁面
  else if (to.matched.some(record => record.meta.hideForAuth) && userStore.isAuthenticated) {
    // 用戶已登錄但嘗試訪問登錄/註冊頁面，重定向到首頁
    next({ name: 'home' });
  } 
  else {
    // 正常導航
    next();
  }
});

export default router;
