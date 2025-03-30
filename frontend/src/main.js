import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/main.css';
import axios from 'axios';

// 配置 axios 的基礎 URL
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

// 配置 axios 請求攔截器，從本地存儲獲取令牌
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 創建應用實例
const app = createApp(App);

// 使用 Pinia
app.use(createPinia());

// 使用路由
app.use(router);

// 掛載應用
app.mount('#app');
