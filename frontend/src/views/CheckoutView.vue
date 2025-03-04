<template>
  <div class="checkout-page container">
    <h1 class="page-title">結帳</h1>
    
    <!-- 空購物車 -->
    <div v-if="!cartItems.length" class="empty-checkout">
      <p>您的購物車是空的</p>
      <router-link to="/products" class="back-to-shopping">
        繼續購物
      </router-link>
    </div>
    
    <!-- 未登入提示 -->
    <div v-else-if="!isAuthenticated" class="login-required">
      <p>請先登入以繼續結帳</p>
      <router-link :to="{name: 'login', query: { redirect: '/checkout' }}" class="login-button">
        登入
      </router-link>
      <router-link to="/register" class="register-link">
        還沒有帳號？立即註冊
      </router-link>
    </div>
    
    <!-- 結帳流程 -->
    <div v-else class="checkout-content">
      <div class="checkout-steps">
        <!-- 步驟標頭 -->
        <div class="steps-header">
          <div 
            v-for="(step, index) in steps" 
            :key="index" 
            :class="['step', { 
              active: currentStep === index,
              completed: currentStep > index 
            }]"
            @click="goToStep(index)"
          >
            <div class="step-number">
              {{ index + 1 }}
            </div>
            <div class="step-title">{{ step }}</div>
          </div>
        </div>
        
        <div class="step-content">
          <!-- 步驟 1: 購物車確認 -->
          <div v-if="currentStep === 0" class="cart-overview">
            <h2 class="step-title">確認購物車內容</h2>
            
            <div class="cart-items">
              <div v-for="(item, index) in cartItems" :key="index" class="cart-item">
                <div class="item-image">
                  <img v-if="item.image" :src="item.image" :alt="item.name">
                  <div v-else class="placeholder-image"></div>
                </div>
                
                <div class="item-details">
                  <h3 class="item-name">{{ item.name }}</h3>
                  <p class="item-price">單價：NT$ {{ item.price }}</p>
                  <p>數量：{{ item.quantity }}</p>
                </div>
                
                <div class="item-total">NT$ {{ (item.price * item.quantity).toFixed(0) }}</div>
              </div>
            </div>
            
            <div class="cart-summary">
              <div class="summary-row">
                <span>小計</span>
                <span>NT$ {{ cartTotal }}</span>
              </div>
              
              <div class="summary-row">
                <span>運費</span>
                <span>NT$ {{ shippingCost }}</span>
              </div>
              
              <div class="summary-total">
                <span>總計</span>
                <span>NT$ {{ orderTotal }}</span>
              </div>
            </div>
          </div>
          
          <!-- 步驟 2: 收貨地址 -->
          <div v-if="currentStep === 1" class="shipping-address">
            <h2 class="step-title">選擇收貨地址</h2>
            
            <div v-if="user.addresses && user.addresses.length" class="saved-addresses">
              <h3>已保存的地址</h3>
              
              <div class="address-list">
                <div 
                  v-for="(address, index) in user.addresses" 
                  :key="index"
                  :class="['address-card', { selected: selectedAddressIndex === index }]"
                  @click="selectAddress(index)"
                >
                  <div class="address-header">
                    <h4>{{ address.fullName }}</h4>
                    <span v-if="address.isDefault" class="default-badge">預設</span>
                  </div>
                  
                  <div class="address-content">
                    <p>{{ address.phone }}</p>
                    <p>{{ address.addressLine1 }}</p>
                    <p v-if="address.addressLine2">{{ address.addressLine2 }}</p>
                    <p>{{ address.city }}, {{ address.postalCode }}</p>
                  </div>
                </div>
                
                <div class="address-card new-address" @click="showAddAddressForm = true">
                  <div class="add-icon">+</div>
                  <span>新增地址</span>
                </div>
              </div>
            </div>
            
            <div v-else class="no-saved-addresses">
              <p>您還沒有保存任何地址，請添加一個新地址</p>
              <button @click="showAddAddressForm = true" class="add-address-btn">
                添加地址
              </button>
            </div>
            
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
          
          <!-- 步驟 3: 付款方式 -->
          <div v-if="currentStep === 2" class="payment-method">
            <h2 class="step-title">選擇付款方式</h2>
            
            <div class="payment-options">
              <div 
                v-for="(method, index) in paymentMethods" 
                :key="index"
                :class="['payment-option', { selected: selectedPaymentMethod === method.value }]"
                @click="selectPaymentMethod(method.value)"
              >
                <div class="payment-icon">{{ method.icon }}</div>
                <div class="payment-details">
                  <h3>{{ method.name }}</h3>
                  <p>{{ method.description }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 步驟 4: 訂單確認 -->
          <div v-if="currentStep === 3" class="order-review">
            <h2 class="step-title">訂單確認</h2>
            
            <div v-if="error" class="error-message">
              {{ error }}
            </div>
            
            <div class="review-sections">
              <div class="review-section">
                <h3>商品資訊</h3>
                <div class="review-items">
                  <div v-for="(item, index) in cartItems" :key="index" class="review-item">
                    <span>{{ item.name }} x {{ item.quantity }}</span>
                    <span>NT$ {{ (item.price * item.quantity).toFixed(0) }}</span>
                  </div>
                </div>
              </div>
              
              <div class="review-section">
                <h3>收貨地址</h3>
                <div v-if="selectedAddress" class="review-address">
                  <p><strong>{{ selectedAddress.fullName }}</strong></p>
                  <p>{{ selectedAddress.phone }}</p>
                  <p>{{ selectedAddress.addressLine1 }}</p>
                  <p v-if="selectedAddress.addressLine2">{{ selectedAddress.addressLine2 }}</p>
                  <p>{{ selectedAddress.city }}, {{ selectedAddress.postalCode }}</p>
                </div>
                <div v-else class="missing-info">
                  <p>請選擇收貨地址</p>
                  <button @click="goToStep(1)" class="edit-button">編輯</button>
                </div>
              </div>
              
              <div class="review-section">
                <h3>付款方式</h3>
                <div v-if="selectedPaymentMethod" class="review-payment">
                  <p>{{ getPaymentMethodName(selectedPaymentMethod) }}</p>
                </div>
                <div v-else class="missing-info">
                  <p>請選擇付款方式</p>
                  <button @click="goToStep(2)" class="edit-button">編輯</button>
                </div>
              </div>
              
              <div class="review-section">
                <h3>訂單摘要</h3>
                <div class="order-summary">
                  <div class="summary-row">
                    <span>小計</span>
                    <span>NT$ {{ cartTotal }}</span>
                  </div>
                  
                  <div class="summary-row">
                    <span>運費</span>
                    <span>NT$ {{ shippingCost }}</span>
                  </div>
                  
                  <div class="summary-total">
                    <span>總計</span>
                    <span>NT$ {{ orderTotal }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="step-actions">
          <button 
            v-if="currentStep > 0"
            @click="prevStep" 
            class="prev-button"
          >
            上一步
          </button>
          
          <button 
            v-if="currentStep < steps.length - 1" 
            @click="nextStep" 
            class="next-button"
            :disabled="!canProceed"
          >
            下一步
          </button>
          
          <button 
            v-else 
            @click="placeOrder" 
            class="place-order-button"
            :disabled="!canPlaceOrder || loading"
          >
            {{ loading ? '處理中...' : '確認下單' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';
import axios from 'axios';

export default {
  name: 'CheckoutView',
  setup() {
    const router = useRouter();
    const cartStore = useCartStore();
    const userStore = useUserStore();
    
    const steps = ['購物車確認', '收貨地址', '付款方式', '訂單確認'];
    const currentStep = ref(0);
    const selectedAddressIndex = ref(null);
    const selectedPaymentMethod = ref(null);
    const showAddAddressForm = ref(false);
    const loading = ref(false);
    const error = ref(null);
    
    // 購物車和用戶資訊
    const cartItems = computed(() => cartStore.items);
    const cartTotal = computed(() => cartStore.formattedTotal);
    const user = computed(() => userStore.user || {});
    const isAuthenticated = computed(() => userStore.isAuthenticated);
    
    // 運費計算（示例：購物滿1000免運費，否則運費為100）
    const shippingCost = computed(() => {
      return cartStore.totalPrice >= 1000 ? 0 : 100;
    });
    
    // 訂單總計
    const orderTotal = computed(() => {
      return (cartStore.totalPrice + shippingCost.value).toFixed(0);
    });
    
    // 付款方式
    const paymentMethods = [
      {
        name: '信用卡付款',
        value: 'credit_card',
        icon: '💳',
        description: '使用VISA、MasterCard、JCB等信用卡付款'
      },
      {
        name: 'LINE Pay',
        value: 'line_pay',
        icon: '📱',
        description: '使用LINE Pay行動支付'
      },
      {
        name: '銀行轉帳',
        value: 'bank_transfer',
        icon: '🏦',
        description: '使用銀行轉帳（請在訂單成立後3天內完成付款）'
      }
    ];
    
    // 獲取付款方式名稱
    const getPaymentMethodName = (method) => {
      const found = paymentMethods.find(m => m.value === method);
      return found ? found.name : '';
    };
    
    // 選擇的地址
    const selectedAddress = computed(() => {
      if (selectedAddressIndex.value === null || !user.value.addresses) return null;
      return user.value.addresses[selectedAddressIndex.value];
    });
    
    // 判斷是否可以進行到下一步
    const canProceed = computed(() => {
      if (currentStep.value === 1) {
        return selectedAddressIndex.value !== null;
      }
      if (currentStep.value === 2) {
        return selectedPaymentMethod.value !== null;
      }
      return true;
    });
    
    // 判斷是否可以下單
    const canPlaceOrder = computed(() => {
      return selectedAddress.value && selectedPaymentMethod.value;
    });
    
    // 新增地址表單
    const addressForm = reactive({
      fullName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      postalCode: '',
      isDefault: false
    });
    
    // 選擇地址
    const selectAddress = (index) => {
      selectedAddressIndex.value = index;
    };
    
    // 選擇付款方式
    const selectPaymentMethod = (method) => {
      selectedPaymentMethod.value = method;
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
      
      // 如果是第一個地址，自動設為預設
      if (addresses.length === 0) {
        addressForm.isDefault = true;
      }
      
      // 添加新地址
      addresses.push({ ...addressForm });
      
      const success = await userStore.updateProfile({ addresses });
      if (success) {
        showAddAddressForm.value = false;
        
        // 選擇新添加的地址
        selectedAddressIndex.value = addresses.length - 1;
        
        // 重置表單
        Object.keys(addressForm).forEach(key => {
          addressForm[key] = key === 'isDefault' ? false : '';
        });
      }
    };
    
    // 下一步
    const nextStep = () => {
      if (currentStep.value < steps.length - 1 && canProceed.value) {
        currentStep.value++;
      }
    };
    
    // 上一步
    const prevStep = () => {
      if (currentStep.value > 0) {
        currentStep.value--;
      }
    };
    
    // 跳到指定步驟
    const goToStep = (step) => {
      // 只允許返回到之前的步驟或當前步驟
      if (step <= currentStep.value) {
        currentStep.value = step;
      }
    };
    
    // 提交訂單
    const placeOrder = async () => {
      if (!canPlaceOrder.value) return;
      
      loading.value = true;
      error.value = null;
      
      try {
        // 準備訂單項目
        const orderItems = cartItems.value.map(item => ({
          product: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        }));
        
        // 創建訂單
        const orderData = {
          orderItems,
          shippingAddress: selectedAddress.value,
          paymentMethod: selectedPaymentMethod.value,
          itemsPrice: parseFloat(cartTotal.value),
          shippingPrice: shippingCost.value,
          taxPrice: 0, // 這裡可以計算稅金
          totalPrice: parseFloat(orderTotal.value)
        };
        
        const response = await axios.post('/api/orders', orderData);
        
        // 清空購物車
        cartStore.clearCart();
        
        // 導航到訂單成功頁面
        router.push({
          name: 'order-success',
          params: { id: response.data._id }
        });
      } catch (err) {
        console.error('下單錯誤:', err);
        error.value = err.response?.data?.message || '訂單提交失敗，請稍後再試';
      } finally {
        loading.value = false;
      }
    };
    
    // 監聽用戶地址變化，自動選擇預設地址
    watch(() => user.value.addresses, (addresses) => {
      if (addresses && addresses.length) {
        // 找到預設地址
        const defaultIndex = addresses.findIndex(addr => addr.isDefault);
        
        // 如果有預設地址或者還沒有選擇過地址，則自動選擇
        if (defaultIndex !== -1 || selectedAddressIndex.value === null) {
          selectedAddressIndex.value = defaultIndex !== -1 ? defaultIndex : 0;
        }
      }
    }, { immediate: true, deep: true });
    
    // 組件掛載時加載購物車
    onMounted(() => {
      cartStore.initCart();
    });
    
    return {
      steps,
      currentStep,
      cartItems,
      cartTotal,
      shippingCost,
      orderTotal,
      user,
      isAuthenticated,
      selectedAddressIndex,
      selectedAddress,
      selectedPaymentMethod,
      paymentMethods,
      showAddAddressForm,
      addressForm,
      loading,
      error,
      canProceed,
      canPlaceOrder,
      nextStep,
      prevStep,
      goToStep,
      selectAddress,
      selectPaymentMethod,
      saveAddress,
      placeOrder,
      getPaymentMethodName
    };
  }
}
</script>

<style scoped>
.checkout-page {
  padding: 40px 0;
}

.page-title {
  text-align: center;
  margin-bottom: 40px;
  font-size: 2rem;
}

.empty-checkout, .login-required {
  text-align: center;
  padding: 50px 0;
}

.empty-checkout p, .login-required p {
  font-size: 1.2rem;
  margin-bottom: 20px;
  color: #666;
}

.back-to-shopping, .login-button {
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 4px;
  transition: background-color 0.3s;
  margin-bottom: 15px;
}

.back-to-shopping:hover, .login-button:hover {
  background-color: #3d8b40;
}

.register-link {
  display: block;
  color: var(--primary-color);
  text-decoration: none;
}

.register-link:hover {
  text-decoration: underline;
}

.checkout-content {
  max-width: 900px;
  margin: 0 auto;
}

.checkout-steps {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.steps-header {
  display: flex;
  border-bottom: 1px solid var(--border-color);
}

.step {
  flex: 1;
  text-align: center;
  padding: 15px;
  position: relative;
  cursor: pointer;
}

.step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 0;
  width: 100%;
  height: 2px;
  background-color: var(--border-color);
  z-index: 1;
}

.step-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 10px;
  position: relative;
  z-index: 2;
  border: 2px solid var(--border-color);
  transition: all 0.3s;
}

.step.active .step-number {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.step.completed .step-number {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.step.completed:not(:last-child)::after {
  background-color: var(--primary-color);
}

.step-title {
  font-size: 0.9rem;
  color: #666;
}

.step.active .step-title {
  color: var(--primary-color);
  font-weight: 600;
}

.step-content {
  padding: 30px;
  min-height: 400px;
}

.step-title {
  margin-bottom: 25px;
  font-size: 1.5rem;
}

.step-actions {
  display: flex;
  justify-content: space-between;
  padding: 20px 30px;
  border-top: 1px solid var(--border-color);
}

.prev-button, .next-button, .place-order-button {
  padding: 12px 25px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.prev-button {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  color: #333;
}

.prev-button:hover {
  background-color: #e0e0e0;
}

.next-button, .place-order-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
}

.next-button:hover, .place-order-button:hover {
  background-color: #3d8b40;
}

.next-button:disabled, .place-order-button:disabled {
  background-color: #a0a0a0;
  cursor: not-allowed;
}

/* 購物車確認樣式 */
.cart-items {
  margin-bottom: 30px;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 15px;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-image {
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
}

.item-details {
  flex-grow: 1;
}

.item-name {
  font-size: 1.1rem;
  margin-bottom: 5px;
}

.item-price {
  color: #666;
}

.item-total {
  font-weight: 600;
  min-width: 80px;
  text-align: right;
}

.cart-summary {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  margin-top: 10px;
  border-top: 1px solid var(--border-color);
  font-weight: 600;
  font-size: 1.1rem;
}

/* 地址樣式 */
.saved-addresses h3, .no-saved-addresses p {
  margin-bottom: 20px;
}

.address-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.address-card {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s;
}

.address-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.address-card.selected {
  border-color: var(--primary-color);
  background-color: #f0fff0;
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.address-header h4 {
  font-size: 1rem;
  margin: 0;
}

.default-badge {
  background-color: var(--primary-color);
  color: white;
  padding: 2px 6px;
  border-radius: 20px;
  font-size: 0.7rem;
}

.address-content p {
  margin: 5px 0;
  font-size: 0.9rem;
  color: #666;
}

.new-address {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-style: dashed;
  color: #666;
}

.add-icon {
  font-size: 2rem;
  margin-bottom: 10px;
}

.add-address-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-address-btn:hover {
  background-color: #3d8b40;
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

/* 付款方式樣式 */
.payment-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.payment-option {
  display: flex;
  align-items: center;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.payment-option:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.payment-option.selected {
  border-color: var(--primary-color);
  background-color: #f0fff0;
}

.payment-icon {
  font-size: 2rem;
  margin-right: 20px;
}

.payment-details h3 {
  font-size: 1.1rem;
  margin-bottom: 5px;
}

.payment-details p {
  color: #666;
  font-size: 0.9rem;
}

/* 訂單確認樣式 */
.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.review-sections {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.review-section {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
}

.review-section h3 {
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
}

.review-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.review-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.review-item:last-child {
  border-bottom: none;
}

.review-address, .review-payment {
  line-height: 1.6;
}

.missing-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #e74c3c;
}

.edit-button {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  color: #333;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.edit-button:hover {
  background-color: #e0e0e0;
}

.order-summary {
  margin-top: 10px;
}

@media (max-width: 768px) {
  .steps-header {
    flex-direction: column;
  }
  
  .step {
    display: flex;
    align-items: center;
    text-align: left;
    padding: 10px 15px;
  }
  
  .step:not(:last-child)::after {
    width: 2px;
    height: 100%;
    top: 50%;
    left: 15px;
  }
  
  .step-number {
    margin: 0 15px 0 0;
  }
  
  .step-content {
    padding: 20px;
  }
  
  .address-list {
    grid-template-columns: 1fr;
  }
  
  .step-actions {
    padding: 15px;
  }
  
  .prev-button, .next-button, .place-order-button {
    padding: 10px 15px;
  }
}
</style>