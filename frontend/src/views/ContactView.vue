<template>
  <div class="contact-page container">
    <h1 class="page-title">聯絡我們</h1>
    
    <div class="contact-content">
      <div class="contact-info">
        <h2>聯絡資訊</h2>
        
        <ul class="info-list">
          <li>
            <div class="icon">📍</div>
            <div>
              <strong>地址</strong>
              <p>台北市信義區松仁路 100 號 10 樓</p>
            </div>
          </li>
          
          <li>
            <div class="icon">📞</div>
            <div>
              <strong>電話</strong>
              <p>(02) 2345-6789</p>
            </div>
          </li>
          
          <li>
            <div class="icon">📧</div>
            <div>
              <strong>電子郵件</strong>
              <p>info@giftconnect.com.tw</p>
            </div>
          </li>
          
          <li>
            <div class="icon">🕒</div>
            <div>
              <strong>營業時間</strong>
              <p>週一至週五：9:00 - 18:00</p>
            </div>
          </li>
        </ul>
      </div>
      
      <div class="contact-form">
        <h2>發送訊息</h2>
        
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="name">姓名</label>
            <input type="text" id="name" v-model="formData.name" required>
          </div>
          
          <div class="form-group">
            <label for="email">電子郵件</label>
            <input type="email" id="email" v-model="formData.email" required>
          </div>
          
          <div class="form-group">
            <label for="company">公司名稱</label>
            <input type="text" id="company" v-model="formData.company">
          </div>
          
          <div class="form-group">
            <label for="phone">電話</label>
            <input type="tel" id="phone" v-model="formData.phone">
          </div>
          
          <div class="form-group">
            <label for="message">訊息內容</label>
            <textarea id="message" v-model="formData.message" rows="5" required></textarea>
          </div>
          
          <button type="submit" class="submit-btn">送出訊息</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue';

export default {
  name: 'ContactView',
  setup() {
    const formData = reactive({
      name: '',
      email: '',
      company: '',
      phone: '',
      message: ''
    });
    
    const submitForm = () => {
      alert('感謝您的訊息！我們會盡快回覆您。');
      // 在實際應用中，這裡會發送API請求
      console.log('Form submitted:', formData);
      
      // 重置表單
      formData.name = '';
      formData.email = '';
      formData.company = '';
      formData.phone = '';
      formData.message = '';
    };
    
    return {
      formData,
      submitForm
    };
  }
}
</script>

<style scoped>
.contact-page {
  padding: 40px 0;
}

.page-title {
  text-align: center;
  margin-bottom: 40px;
  font-size: 2rem;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  max-width: 1000px;
  margin: 0 auto;
}

.contact-info h2, .contact-form h2 {
  font-size: 1.5rem;
  margin-bottom: 25px;
}

.info-list {
  list-style: none;
  padding: 0;
}

.info-list li {
  display: flex;
  margin-bottom: 25px;
}

.info-list .icon {
  font-size: 1.5rem;
  margin-right: 15px;
}

.info-list strong {
  display: block;
  margin-bottom: 5px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
}

.form-group input, .form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

.submit-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #3d8b40;
}

@media (max-width: 768px) {
  .contact-content {
    grid-template-columns: 1fr;
  }
}
</style>
