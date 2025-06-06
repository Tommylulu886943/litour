<template>
  <div class="contact-page">
    <div class="container">
      <h1 class="page-title">聯絡我們</h1>
      
      <div class="contact-content">
        <!-- 左側聯絡資訊 -->
        <div class="contact-info">
          <h2 class="section-title">聯絡資訊</h2>
          
          <div class="info-item">
            <div class="info-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="#e74c3c" stroke-width="2"/>
                <path d="M12 22C16 18 20 14.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 14.4183 8 18 12 22Z" stroke="#e74c3c" stroke-width="2"/>
              </svg>
            </div>
            <div class="info-content">
              <div class="info-label">地址</div>
              <div class="info-text">台灣基隆市中山區中山里中山一路157號</div>
            </div>
          </div>
          
          <div class="info-item">
            <div class="info-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3.08 6.18 2 2 0 0 1 5 4h3a2 2 0 0 1 2 1.72c.12.81.34 1.6.63 2.34a2 2 0 0 1-.45 2.11L8.09 11.09a16 16 0 0 0 6 6l1.74-1.74a2 2 0 0 1 2.11-.45c.74.29 1.53.5 2.34.63A2 2 0 0 1 22 16.92z" stroke="#e74c3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="info-content">
              <div class="info-label">電話</div>
              <div class="info-text">0909-995690</div>
            </div>
          </div>
          
          <div class="info-item">
            <div class="info-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#e74c3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M22 6L12 13L2 6" stroke="#e74c3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="info-content">
              <div class="info-label">電子郵件</div>
              <div class="info-text">litourcandy@gmail.com</div>
            </div>
          </div>
          
          <div class="info-item">
            <div class="info-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#e74c3c" stroke-width="2"/>
                <path d="M12 6V12L16 14" stroke="#e74c3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="info-content">
              <div class="info-label">營業時間</div>
              <div class="info-text">週一至週五：9:00 - 18:00</div>
            </div>
          </div>
        </div>
        
        <!-- 右側聯絡表單 -->
        <div class="contact-form">
          <h2 class="section-title">發送訊息</h2>
          
          <div v-if="submitStatus.success" class="success-message">
            <div class="success-icon">✓</div>
            <div class="success-text">訊息已成功發送！我們會盡快與您聯繫。</div>
          </div>
          
          <div v-if="submitStatus.error" class="error-message">
            <div class="error-icon">!</div>
            <div class="error-text">{{ submitStatus.error }}</div>
          </div>
          
          <form @submit.prevent="submitForm">
            <div class="form-row">
              <div class="form-group">
                <label for="name">姓名</label>
                <input 
                  type="text" 
                  id="name" 
                  v-model="formData.name" 
                  class="form-control" 
                  placeholder="請輸入您的姓名"
                  required
                >
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="email">電子郵件</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="formData.email" 
                  class="form-control" 
                  placeholder="請輸入您的電子郵件"
                  required
                >
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="company">公司名稱</label>
                <input 
                  type="text" 
                  id="company" 
                  v-model="formData.company" 
                  class="form-control" 
                  placeholder="請輸入您的公司名稱"
                >
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="phone">電話</label>
                <input 
                  type="tel" 
                  id="phone" 
                  v-model="formData.phone" 
                  class="form-control" 
                  placeholder="請輸入您的電話號碼"
                >
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="lineId">LINE ID <span class="optional">(選填)</span></label>
                <input 
                  type="text" 
                  id="lineId" 
                  v-model="formData.lineId" 
                  class="form-control" 
                  placeholder="請輸入您的 LINE ID"
                >
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="message">訊息內容</label>
                <textarea 
                  id="message" 
                  v-model="formData.message" 
                  class="form-control" 
                  placeholder="請輸入您的訊息內容"
                  rows="5"
                  required
                ></textarea>
              </div>
            </div>
            
            <button type="submit" class="submit-btn" :disabled="submitting">
              <span v-if="submitting">發送中...</span>
              <span v-else>發送訊息</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import axios from 'axios';

export default {
  name: 'ContactView',
  setup() {
    // 表單數據
    const formData = reactive({
      name: '',
      email: '',
      company: '',
      phone: '',
      lineId: '',
      message: ''
    });
    
    // 提交狀態
    const submitting = ref(false);
    const submitStatus = reactive({
      success: false,
      error: null
    });
    
    // 提交表單
    const submitForm = async () => {
      submitting.value = true;
      submitStatus.success = false;
      submitStatus.error = null;
      
      try {
        // 發送數據到後端 API
        const response = await axios.post('/api/contact', formData);
        
        console.log('表單提交成功:', response.data);
        
        // 顯示成功消息
        submitStatus.success = true;
        
        // 清空表單
        Object.keys(formData).forEach(key => {
          formData[key] = '';
        });
        
        // 滾動到頁面頂部
        window.scrollTo(0, 0);
      } catch (error) {
        console.error('提交表單錯誤:', error);
        submitStatus.error = '發送訊息失敗，請稍後再試。';
        
        if (error.response) {
          console.error('伺服器回應:', error.response.data);
          if (error.response.data.message) {
            submitStatus.error = error.response.data.message;
          }
        }
      } finally {
        submitting.value = false;
      }
    };
    
    return {
      formData,
      submitting,
      submitStatus,
      submitForm
    };
  }
}
</script>

<style scoped>
.contact-page {
  padding: 60px 0;
  background-color: #f9f9f9;
}

.container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 15px;
}

.page-title {
  text-align: center;
  font-size: 2.2rem;
  margin-bottom: 50px;
  color: #333;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 50px;
}

/* 左側聯絡資訊 */
.contact-info {
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 30px;
  color: #333;
  position: relative;
  padding-bottom: 15px;
}

.section-title:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background-color: #e74c3c;
}

.info-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 25px;
}

.info-icon {
  margin-right: 15px;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-content {
  flex-grow: 1;
}

.info-label {
  font-weight: 600;
  font-size: 16px;
  color: #333;
  margin-bottom: 5px;
}

.info-text {
  color: #666;
  font-size: 15px;
  line-height: 1.5;
}

/* 右側表單 */
.contact-form {
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
}

.success-message, .error-message {
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
}

.success-icon, .error-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-weight: bold;
  flex-shrink: 0;
}

.success-icon {
  background-color: #28a745;
  color: white;
}

.error-icon {
  background-color: #dc3545;
  color: white;
}

.success-text, .error-text {
  flex-grow: 1;
  font-size: 15px;
}

.form-row {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.optional {
  font-weight: normal;
  color: #888;
  font-size: 14px;
}

.form-control {
  width: 100%;
  padding: 12px 15px;
  font-size: 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #f9f9f9;
  transition: all 0.3s;
  font-family: 'Noto Sans TC', sans-serif;
}

.form-control:focus {
  outline: none;
  border-color: #e74c3c;
  background-color: #fff;
  box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.1);
}

textarea.form-control {
  resize: vertical;
  min-height: 120px;
  font-family: 'Noto Sans TC', sans-serif;
  line-height: 1.6;
}

.submit-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 14px 30px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
  display: block;
  width: 100%;
  text-align: center;
}

.submit-btn:hover {
  background-color: #c0392b;
}

.submit-btn:disabled {
  background-color: #e57373;
  cursor: not-allowed;
}

/* 響應式設計 */
@media (max-width: 992px) {
  .contact-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .contact-info {
    margin-bottom: 20px;
  }
}

@media (max-width: 576px) {
  .page-title {
    font-size: 28px;
    margin-bottom: 30px;
  }
  
  .section-title {
    font-size: 22px;
  }
  
  .contact-form {
    padding: 20px;
  }
}
</style>
