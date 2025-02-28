import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    loading: false,
    error: null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.user?.role === 'admin'
  },
  
  actions: {
    async register(userData) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.post('/api/auth/register', userData);
        this.user = response.data;
        
        // 保存令牌到本地存儲
        localStorage.setItem('userToken', response.data.token);
        
        // 設置 axios 全局認證頭
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        return true;
      } catch (error) {
        this.error = error.response?.data?.message || '註冊失敗';
        console.error('註冊錯誤:', error);
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    async login(credentials) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.post('/api/auth/login', credentials);
        this.user = response.data;
        
        // 保存令牌到本地存儲
        localStorage.setItem('userToken', response.data.token);
        
        // 設置 axios 全局認證頭
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        return true;
      } catch (error) {
        this.error = error.response?.data?.message || '登錄失敗';
        console.error('登錄錯誤:', error);
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    async fetchUserProfile() {
      this.loading = true;
      
      try {
        const response = await axios.get('/api/auth/profile');
        this.user = { ...this.user, ...response.data };
        return true;
      } catch (error) {
        console.error('獲取用戶資料錯誤:', error);
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    async updateProfile(userData) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.put('/api/auth/profile', userData);
        this.user = { ...this.user, ...response.data };
        
        // 更新令牌
        if (response.data.token) {
          localStorage.setItem('userToken', response.data.token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        }
        
        return true;
      } catch (error) {
        this.error = error.response?.data?.message || '更新資料失敗';
        console.error('更新用戶資料錯誤:', error);
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    logout() {
      this.user = null;
      localStorage.removeItem('userToken');
      delete axios.defaults.headers.common['Authorization'];
    },
    
    initAuth() {
      const token = localStorage.getItem('userToken');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        this.fetchUserProfile();
      }
    }
  }
});
