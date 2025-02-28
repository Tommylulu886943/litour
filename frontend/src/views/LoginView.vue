<template>
  <div class="login-page container">
    <div class="auth-form-container">
      <h1 class="auth-title">會員登入</h1>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      
      <form @submit.prevent="submitLogin" class="auth-form">
        <div class="form-group">
          <label for="email">電子郵件</label>
          <input 
            type="email" 
            id="email" 
            v-model="loginData.email" 
            required 
            autocomplete="email"
          >
        </div>
        
        <div class="form-group">
          <label for="password">密碼</label>
          <input 
            type="password" 
            id="password" 
            v-model="loginData.password" 
            required 
            autocomplete="current-password"
          >
        </div>
        
        <button type="submit" class="auth-button" :disabled="loading">
          {{ loading ? '登入中...' : '登入' }}
        </button>
      </form>
      
      <div class="auth-links">
        <router-link to="/register" class="auth-link">還沒有帳號？立即註冊</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/userStore';

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    
    const loginData = reactive({
      email: '',
      password: ''
    });
    
    const loading = computed(() => userStore.loading);
    const error = computed(() => userStore.error);
    
    const submitLogin = async () => {
      const success = await userStore.login(loginData);
      if (success) {
        router.push('/');
      }
    };
    
    return {
      loginData,
      loading,
      error,
      submitLogin
    };
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  padding: 40px 0;
}

.auth-form-container {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.auth-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 1.8rem;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.auth-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

.auth-button {
  width: 100%;
  padding: 12px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.auth-button:hover:not(:disabled) {
  background-color: #3d8b40;
}

.auth-button:disabled {
  background-color: #a0a0a0;
  cursor: not-allowed;
}

.auth-links {
  text-align: center;
  margin-top: 20px;
}

.auth-link {
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.3s;
}

.auth-link:hover {
  color: #3d8b40;
}
</style>
