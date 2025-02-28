<template>
  <div class="register-page container">
    <div class="auth-form-container">
      <h1 class="auth-title">會員註冊</h1>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      
      <form @submit.prevent="submitRegister" class="auth-form">
        <div class="form-group">
          <label for="name">姓名</label>
          <input 
            type="text" 
            id="name" 
            v-model="registerData.name" 
            required 
            autocomplete="name"
          >
        </div>
        
        <div class="form-group">
          <label for="email">電子郵件</label>
          <input 
            type="email" 
            id="email" 
            v-model="registerData.email" 
            required 
            autocomplete="email"
          >
        </div>
        
        <div class="form-group">
          <label for="password">密碼</label>
          <input 
            type="password" 
            id="password" 
            v-model="registerData.password" 
            required 
            autocomplete="new-password"
            minlength="6"
          >
          <small>密碼長度至少為6個字符</small>
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">確認密碼</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="registerData.confirmPassword" 
            required 
            autocomplete="new-password"
          >
          <small v-if="passwordError" class="text-error">{{ passwordError }}</small>
        </div>
        
        <div class="form-group">
          <label for="phone">電話 (選填)</label>
          <input 
            type="tel" 
            id="phone" 
            v-model="registerData.phone" 
            autocomplete="tel"
          >
        </div>
        
        <div class="form-group">
          <label for="company">公司名稱 (選填)</label>
          <input 
            type="text" 
            id="company" 
            v-model="registerData.company" 
            autocomplete="organization"
          >
        </div>
        
        <button type="submit" class="auth-button" :disabled="loading || !!passwordError">
          {{ loading ? '註冊中...' : '註冊' }}
        </button>
      </form>
      
      <div class="auth-links">
        <router-link to="/login" class="auth-link">已有帳號？立即登入</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, computed, watch, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/userStore';

export default {
  name: 'RegisterView',
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    
    const registerData = reactive({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      company: ''
    });
    
    const loading = computed(() => userStore.loading);
    const error = computed(() => userStore.error);
    const passwordError = ref('');
    
    // 監聽密碼變化
    watch([() => registerData.password, () => registerData.confirmPassword], ([password, confirmPassword]) => {
      if (confirmPassword && password !== confirmPassword) {
        passwordError.value = '兩次輸入的密碼不一致';
      } else {
        passwordError.value = '';
      }
    });
    
    const submitRegister = async () => {
      // 確認密碼是否一致
      if (registerData.password !== registerData.confirmPassword) {
        return;
      }
      
      // 準備提交的數據
      const userData = {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        phone: registerData.phone,
        company: registerData.company
      };
      
      const success = await userStore.register(userData);
      if (success) {
        router.push('/');
      }
    };
    
    return {
      registerData,
      loading,
      error,
      passwordError,
      submitRegister
    };
  }
}
</script>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
}

.auth-form-container {
  width: 100%;
  max-width: 500px;
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

.form-group small {
  display: block;
  margin-top: 5px;
  font-size: 0.8rem;
  color: #666;
}

.form-group small.text-error {
  color: #e74c3c;
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
