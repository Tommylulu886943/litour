<template>
  <div class="profile-page container">
    <h1 class="page-title">個人中心</h1>
    
    <div v-if="!isAuthenticated" class="not-authenticated">
      <p>請先登入以訪問個人中心</p>
      <router-link to="/login" class="auth-button">登入</router-link>
    </div>
    
    <div v-else class="profile-content">
      <div class="tabs">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === '個人資料' }" 
          @click="activeTab = '個人資料'"
        >
          個人資料
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === '收貨地址' }" 
          @click="activeTab = '收貨地址'"
        >
          收貨地址
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === '我的訂單' }" 
          @click="activeTab = '我的訂單'"
        >
          我的訂單
        </button>
      </div>
      
      <div class="tab-content">
        <!-- 個人資料 -->
        <div v-if="activeTab === '個人資料'" class="profile-tab">
          <h2 class="tab-title">個人資料</h2>
          
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
          
          <form @submit.prevent="updateProfile" class="profile-form">
            <div class="form-group">
              <label for="name">姓名</label>
              <input type="text" id="name" v-model="profileData.name" required>
            </div>
            
            <div class="form-group">
              <label for="email">電子郵件</label>
              <input type="email" id="email" v-model="profileData.email" required>
            </div>
            
            <div class="form-group">
              <label for="phone">電話</label>
              <input type="tel" id="phone" v-model="profileData.phone">
            </div>
            
            <div class="form-group">
              <label for="company">公司名稱</label>
              <input type="text" id="company" v-model="profileData.company">
            </div>
            
            <div class="password-section">
              <h3>變更密碼</h3>
              <small>如不變更密碼，請留空</small>
              
              <div class="form-group">
                <label for="password">新密碼</label>
                <input type="password" id="password" v-model="profileData.password" minlength="6">
              </div>
              
              <div class="form-group">
                <label for="confirmPassword">確認新密碼</label>
                <input type="password" id="confirmPassword" v-model="profileData.confirmPassword">
                <small v-if="passwordError" class="text-error">{{ passwordError }}</small>
              </div>
            </div>
            
            <button type="submit" class="update-button" :disabled="loading || !!passwordError">
              {{ loading ? '更新中...' : '更新資料' }}
            </button>
          </form>
        </div>
        
        <!-- 我的訂單 -->
        <div v-if="activeTab === '我的訂單'" class="orders-tab">
          <h2 class="tab-title">我的訂單</h2>
          
          <div v-if="ordersLoading" class="loading">載入中...</div>
          
          <div v-else-if="!orders.length" class="no-orders">
            您還沒有任何訂單
          </div>
          
          <div v-else class="orders-list">
            <div v-for="order in orders" :key="order._id" class="order-card">
              <div class="order-header">
                <div class="order-id">
                  <span class="label">訂單編號:</span> 
                  <span class="value">{{ order._id }}</span>
                </div>
                <div class="order-date">
                  <span class="label">訂單日期:</span> 
                  <span class="value">{{ formatDate(order.createdAt) }}</span>
                </div>
              </div>
              
              <div class="order-body">
                <div class="order-items">
                  <div v-for="(item, index) in order.items" :key="index" class="order-item">
                    <span class="item-name">{{ item.name }}</span>
                    <span class="item-quantity">x {{ item.quantity }}</span>
                    <span class="item-price">NT$ {{ item.price }}</span>
                  </div>
                </div>
                
                <div class="order-summary">
                  <div class="order-total">
                    <span class="label">總計:</span> 
                    <span class="value">NT$ {{ order.totalPrice }}</span>
                  </div>
                  <div class="order-status" :class="order.status">
                    {{ getStatusText(order.status) }}
                  </div>
                </div>
              </div>
              
              <div class="order-footer">
                <router-link :to="`/orders/${order._id}`" class="view-order-button">
                  查看詳情
                </router-link>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 收貨地址 -->
        <div v-if="activeTab === '收貨地址'" class="addresses-tab">
          <h2 class="tab-title">收貨地址</h2>
          
          <div v-if="!user.addresses || !user.addresses.length" class="no-addresses">
            您還沒有添加收貨地址
          </div>
          
          <div v-else class="addresses-list">
            <div v-for="(address, index) in user.addresses" :key="index" class="address-card">
              <div class="address-header">
                <h3 class="address-name">{{ address.fullName }}</h3>
                <span v-if="address.isDefault" class="default-badge">預設</span>
              </div>
              
              <div class="address-details">
                <p>{{ address.phone }}</p>
                <p>{{ address.addressLine1 }}</p>
                <p v-if="address.addressLine2">{{ address.addressLine2 }}</p>
                <p>{{ address.city }}, {{ address.postalCode }}</p>
              </div>
              
              <div class="address-actions">
                <button @click="editAddress(index)" class="edit-button">
                  編輯
                </button>
                <button @click="deleteAddress(index)" class="delete-button">
                  刪除
                </button>
                <button 
                  v-if="!address.isDefault" 
                  @click="setDefaultAddress(index)" 
                  class="default-button"
                >
                  設為預設
                </button>
              </div>
            </div>
          </div>
          
          <button @click="showAddAddressForm = true" class="add-address-button">
            添加新地址
          </button>
          
          <!-- 地址表單 -->
          <div v-if="showAddAddressForm" class="address-form-modal">
            <div class="modal-content">
              <h3 class="modal-title">{{ editingAddressIndex === null ? '添加新地址' : '編輯地址' }}</h3>
              
              <form @submit.prevent="saveAddress" class="address-form">
                <div class="form-group">
                  <label for="fullName">收件人姓名</label>
                  <input type="text" id="fullName" v-model="addressForm.fullName" required>
                </div>
                
                <div class="form-group">
                  <label for="phone">電話</label>
                  <input type="tel" id="phone" v-model="addressForm.phone" required>
                </div>
                
                <div class="form-group">
                  <label for="addressLine1">地址</label>
                  <input type="text" id="addressLine1" v-model="addressForm.addressLine1" required>
                </div>
                
                <div class="form-group">
                  <label for="addressLine2">地址第二行 (選填)</label>
                  <input type="text" id="addressLine2" v-model="addressForm.addressLine2">
                </div>
                
                <div class="form-group">
                  <label for="city">城市</label>
                  <input type="text" id="city" v-model="addressForm.city" required>
                </div>
                
                <div class="form-group">
                  <label for="postalCode">郵遞區號</label>
                  <input type="text" id="postalCode" v-model="addressForm.postalCode" required>
                </div>
                
                <div class="form-check">
                  <input type="checkbox" id="isDefault" v-model="addressForm.isDefault">
                  <label for="isDefault">設為預設地址</label>
                </div>
                
                <div class="form-actions">
                  <button type="button" @click="showAddAddressForm = false" class="cancel-button">
                    取消
                  </button>
                  <button type="submit" class="save-button">
                    儲存
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useUserStore } from '@/store/userStore';
import axios from 'axios';

export default {
  name: 'ProfileView',
  setup() {
    const userStore = useUserStore();
    const activeTab = ref('個人資料');
    const user = computed(() => userStore.user || {});
    const isAuthenticated = computed(() => userStore.isAuthenticated);
    const loading = computed(() => userStore.loading);
    const error = computed(() => userStore.error);
    
    // 個人資料表單
    const profileData = reactive({
      name: user.value?.name || '',
      email: user.value?.email || '',
      phone: user.value?.phone || '',
      company: user.value?.company || '',
      password: '',
      confirmPassword: ''
    });
    
    // 當用戶資料變化時更新表單
    watch(() => user.value, (newUser) => {
      if (newUser) {
        profileData.name = newUser.name || '';
        profileData.email = newUser.email || '';
        profileData.phone = newUser.phone || '';
        profileData.company = newUser.company || '';
      }
    });
    
    // 密碼錯誤檢查
    const passwordError = computed(() => {
      if (profileData.password && profileData.password !== profileData.confirmPassword) {
        return '兩次輸入的密碼不一致';
      }
      return '';
    });
    
    // 更新個人資料
    const updateProfile = async () => {
      // 如果有設置密碼但兩次輸入不一致，則不提交
      if (profileData.password && profileData.password !== profileData.confirmPassword) {
        return;
      }
      
      // 準備提交的數據
      const userData = {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        company: profileData.company
      };
      
      // 只有當設置了密碼時才添加到提交數據中
      if (profileData.password) {
        userData.password = profileData.password;
      }
      
      const success = await userStore.updateProfile(userData);
      if (success) {
        // 清空密碼欄位
        profileData.password = '';
        profileData.confirmPassword = '';
        
        alert('個人資料已更新');
      }
    };
    
    // 訂單相關
    const orders = ref([]);
    const ordersLoading = ref(false);
    
    // 獲取用戶訂單
    const fetchOrders = async () => {
      if (!isAuthenticated.value) return;
      
      ordersLoading.value = true;
      try {
        const response = await axios.get('/api/orders/myorders');
        orders.value = response.data;
      } catch (error) {
        console.error('獲取訂單錯誤:', error);
      } finally {
        ordersLoading.value = false;
      }
    };
    
    // 格式化日期
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-TW');
    };
    
    // 獲取訂單狀態文字
    const getStatusText = (status) => {
      const statusMap = {
        'pending': '待處理',
        'processing': '處理中',
        'shipped': '已發貨',
        'delivered': '已送達',
        'cancelled': '已取消'
      };
      return statusMap[status] || status;
    };
    
    // 地址相關
    const showAddAddressForm = ref(false);
    const editingAddressIndex = ref(null);
    const addressForm = reactive({
      fullName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      postalCode: '',
      isDefault: false
    });
    
    // 編輯地址
    const editAddress = (index) => {
      const address = user.value.addresses[index];
      addressForm.fullName = address.fullName;
      addressForm.phone = address.phone;
      addressForm.addressLine1 = address.addressLine1;
      addressForm.addressLine2 = address.addressLine2 || '';
      addressForm.city = address.city;
      addressForm.postalCode = address.postalCode;
      addressForm.isDefault = address.isDefault;
      
      editingAddressIndex.value = index;
      showAddAddressForm.value = true;
    };
    
    // 刪除地址
    const deleteAddress = async (index) => {
      if (!confirm('確定要刪除此地址嗎？')) return;
      
      const addresses = [...user.value.addresses];
      addresses.splice(index, 1);
      
      await userStore.updateProfile({ addresses });
    };
    
    // 設置預設地址
    const setDefaultAddress = async (index) => {
      const addresses = user.value.addresses.map((addr, i) => ({
        ...addr,
        isDefault: i === index
      }));
      
      await userStore.updateProfile({ addresses });
    };
    
    // 保存地址
    const saveAddress = async () => {
      const addresses = [...(user.value.addresses || [])];
      
      // 如果設為預設地址，則將其他地址設為非預設
      if (addressForm.isDefault) {
        addresses.forEach(addr => {
          addr.isDefault = false;
        });
      }
      
      // 如果是編輯現有地址
      if (editingAddressIndex.value !== null) {
        addresses[editingAddressIndex.value] = { ...addressForm };
      } else {
        // 如果是第一個地址，自動設為預設
        if (addresses.length === 0) {
          addressForm.isDefault = true;
        }
        addresses.push({ ...addressForm });
      }
      
      const success = await userStore.updateProfile({ addresses });
      if (success) {
        showAddAddressForm.value = false;
        editingAddressIndex.value = null;
        
        // 重置表單
        Object.keys(addressForm).forEach(key => {
          addressForm[key] = key === 'isDefault' ? false : '';
        });
      }
    };
    
    // 組件掛載時獲取訂單
    onMounted(() => {
      if (isAuthenticated.value) {
        fetchOrders();
      }
    });
    
    // 監聽標籤變化，當切換到訂單標籤時獲取訂單數據
    watch(activeTab, (newTab) => {
      if (newTab === '我的訂單' && isAuthenticated.value) {
        fetchOrders();
      }
    });
    
    return {
      activeTab,
      user,
      isAuthenticated,
      loading,
      error,
      profileData,
      passwordError,
      updateProfile,
      orders,
      ordersLoading,
      formatDate,
      getStatusText,
      showAddAddressForm,
      editingAddressIndex,
      addressForm,
      editAddress,
      deleteAddress,
      setDefaultAddress,
      saveAddress
    };
  }
}
</script>

<style scoped>
.profile-page {
  padding: 40px 0;
}

.page-title {
  text-align: center;
  margin-bottom: 40px;
  font-size: 2rem;
}

.not-authenticated {
  text-align: center;
  padding: 40px 0;
}

.not-authenticated p {
  margin-bottom: 20px;
  font-size: 1.2rem;
}

.auth-button {
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: 600;
  transition: background-color 0.3s;
}

.auth-button:hover {
  background-color: #3d8b40;
}

.profile-content {
  max-width: 800px;
  margin: 0 auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.tabs {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.tab-btn {
  flex: 1;
  padding: 15px 20px;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  color: #333333;
  background-color: #f5f5f5;
  border: none;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  border-right: 1px solid #ddd;
}

.tab-btn:last-child {
  border-right: none;
}

.tab-btn:hover {
  color: #e74c3c;
  background-color: #f9f9f9;
}

.tab-btn.active {
  color: #e74c3c;
  font-weight: 600;
  background-color: white;
  box-shadow: 0 -3px 0 #e74c3c inset, 0 1px 5px rgba(0, 0, 0, 0.1);
}

.tab-content {
  padding: 30px;
}

.tab-title {
  margin-bottom: 25px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
  font-size: 1.5rem;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 4px;
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

.password-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.password-section h3 {
  margin-bottom: 10px;
}

.password-section small {
  display: block;
  margin-bottom: 15px;
  color: #666;
  font-size: 0.9rem;
}

.text-error {
  color: #e74c3c;
}

.update-button, .add-address-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.update-button:hover, .add-address-button:hover {
  background-color: #3d8b40;
}

.update-button:disabled {
  background-color: #a0a0a0;
  cursor: not-allowed;
}

/* 訂單樣式 */
.loading, .no-orders {
  text-align: center;
  padding: 20px 0;
  color: #666;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}

.order-header {
  background-color: #f5f5f5;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

.order-id, .order-date {
  display: flex;
  align-items: center;
}

.label {
  font-weight: 600;
  margin-right: 5px;
}

.order-body {
  padding: 15px;
}

.order-items {
  margin-bottom: 15px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.order-item:last-child {
  border-bottom: none;
}

.order-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid var(--border-color);
}

.order-total {
  font-size: 1.1rem;
}

.order-total .value {
  font-weight: 600;
  color: var(--primary-color);
}

.order-status {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.order-status.pending {
  background-color: #ffeeba;
  color: #856404;
}

.order-status.processing {
  background-color: #b8daff;
  color: #004085;
}

.order-status.shipped {
  background-color: #c3e6cb;
  color: #155724;
}

.order-status.delivered {
  background-color: #d4edda;
  color: #155724;
}

.order-status.cancelled {
  background-color: #f5c6cb;
  color: #721c24;
}

.order-footer {
  padding: 15px;
  background-color: #f9f9f9;
  text-align: right;
}

.view-order-button {
  display: inline-block;
  background-color: var(--secondary-color);
  color: white;
  text-decoration: none;
  padding: 8px 15px;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.view-order-button:hover {
  background-color: #1976D2;
}

/* 地址樣式 */
.no-addresses {
  text-align: center;
  padding: 20px 0;
  color: #666;
}

.addresses-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

.address-card {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 20px;
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.address-name {
  font-size: 1.1rem;
  font-weight: 600;
}

.default-badge {
  background-color: var(--primary-color);
  color: white;
  padding: 3px 8px;
  border-radius: 20px;
  font-size: 0.7rem;
}

.address-details {
  margin-bottom: 15px;
  line-height: 1.7;
}

.address-actions {
  display: flex;
  gap: 10px;
}

.edit-button, .delete-button, .default-button {
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.edit-button {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  color: #333;
}

.edit-button:hover {
  background-color: #e0e0e0;
}

.delete-button {
  background-color: #fff5f5;
  border: 1px solid #ffcccc;
  color: #e74c3c;
}

.delete-button:hover {
  background-color: #ffe5e5;
}

.default-button {
  background-color: #f0f9ff;
  border: 1px solid #b8daff;
  color: #0070f3;
}

.default-button:hover {
  background-color: #e1f5fe;
}

.add-address-button {
  width: 100%;
}

/* 地址表單模態框 */
.address-form-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-title {
  text-align: center;
  margin-bottom: 25px;
  font-size: 1.5rem;
}

.form-check {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.form-check input {
  margin-right: 10px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 15px;
}

.cancel-button, .save-button {
  flex: 1;
  padding: 10px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cancel-button {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  color: #333;
}

.cancel-button:hover {
  background-color: #e0e0e0;
}

.save-button {
  background-color: var(--primary-color);
  border: none;
  color: white;
}

.save-button:hover {
  background-color: #3d8b40;
}

@media (max-width: 768px) {
  .tabs {
    flex-direction: column;
  }
  
  .tab-btn {
    border-bottom: 1px solid var(--border-color);
  }
  
  .tab-btn.active {
    border-bottom: 1px solid var(--border-color);
    border-left: 3px solid var(--primary-color);
  }
  
  .tab-content {
    padding: 20px;
  }
  
  .order-header {
    flex-direction: column;
    gap: 10px;
  }
  
  .address-actions {
    flex-direction: column;
  }
}

/* 個人中心標籤樣式優化 */
.個人中心 {
  padding: 30px 0;
}

/* 標籤容器樣式 */
.個人中心 .tabs {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 30px;
  background: #f9f9f9;
}

/* 標籤按鈕基礎樣式 */
.個人中心 .tab-btn {
  flex: 1;
  padding: 15px 20px;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  color: #333333; /* 未選中標籤改為深灰色，提高可讀性 */
  background: transparent;
  cursor: pointer;
  border: none;
  position: relative;
  transition: all 0.2s ease;
}

/* 標籤按鈕懸停效果 */
.個人中心 .tab-btn:hover {
  color: #e74c3c; /* 紅色主題色 */
  background-color: rgba(231, 76, 60, 0.05);
}

/* 選中標籤樣式 */
.個人中心 .tab-btn.active {
  color: #e74c3c; /* 選中使用紅色 */
  font-weight: 600;
  background-color: white;
  box-shadow: 0 -3px 0 #e74c3c inset; /* 上邊緣紅色標記 */
}

/* 標籤分隔線 */
.個人中心 .tab-btn:not(:last-child) {
  border-right: 1px solid #ddd;
}
</style>
