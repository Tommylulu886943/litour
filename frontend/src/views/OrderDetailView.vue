<template>
  <div class="order-detail-page container">
    <div class="detail-content">
      <h1 class="page-title">訂單詳情</h1>
      
      <div v-if="loading" class="loading">
        載入訂單資訊中...
      </div>
      
      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>
      
      <div v-else-if="order" class="order-info">
        <div class="order-number">
          <span class="label">訂單編號:</span>
          <span class="value">{{ order._id }}</span>
        </div>
        
        <div class="order-summary">
          <h2>訂單摘要</h2>
          
          <div class="summary-row">
            <span class="label">訂單狀態:</span>
            <span class="value status">{{ getStatusText(order.status) }}</span>
          </div>
          
          <div class="summary-row">
            <span class="label">付款狀態:</span>
            <span class="value" :class="order.isPaid ? 'paid' : 'unpaid'">
              {{ order.isPaid ? '已付款' : '未付款' }}
            </span>
          </div>
          
          <div class="summary-row">
            <span class="label">付款方式:</span>
            <span class="value">{{ getPaymentMethodName(order.paymentMethod) }}</span>
          </div>
          
          <div class="summary-row">
            <span class="label">訂單金額:</span>
            <span class="value">NT$ {{ order.totalPrice }}</span>
          </div>
          
          <div class="summary-row">
            <span class="label">訂單日期:</span>
            <span class="value">{{ formatDate(order.createdAt) }}</span>
          </div>
        </div>
        
        <div class="order-items">
          <h2>商品明細</h2>
          
          <div class="items-list">
            <div v-for="(item, index) in order.items" :key="index" class="item">
              <span class="item-name">{{ item.name }} x {{ item.quantity }}</span>
              <span class="item-price">NT$ {{ item.price * item.quantity }}</span>
            </div>
          </div>
        </div>
        
        <div class="shipping-info">
          <h2>配送資訊</h2>
          
          <div class="address">
            <p><strong>{{ order.shippingAddress.fullName }}</strong></p>
            <p>{{ order.shippingAddress.phone }}</p>
            <p>{{ order.shippingAddress.addressLine1 }}</p>
            <p v-if="order.shippingAddress.addressLine2">{{ order.shippingAddress.addressLine2 }}</p>
            <p>{{ order.shippingAddress.city }}, {{ order.shippingAddress.postalCode }}</p>
          </div>
        </div>
        
        <div v-if="showPaymentInstructions" class="payment-instructions">
          <h2>付款說明</h2>
          
          <div v-if="order.paymentMethod === 'bank_transfer'" class="bank-transfer">
            <p>請在3天內完成銀行轉帳，轉帳資訊如下：</p>
            <div class="bank-info">
              <div class="info-row">
                <span class="label">銀行名稱:</span>
                <span class="value">台灣第一銀行</span>
              </div>
              <div class="info-row">
                <span class="label">戶名:</span>
                <span class="value">禮途禮品選物網</span>
              </div>
              <div class="info-row">
                <span class="label">帳號:</span>
                <span class="value">1234-5678-9012-3456</span>
              </div>
              <div class="info-row">
                <span class="label">轉帳金額:</span>
                <span class="value">NT$ {{ order.totalPrice }}</span>
              </div>
              <div class="info-row">
                <span class="label">轉帳備註:</span>
                <span class="value">訂單{{ order._id.slice(-6) }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="actions">
          <router-link to="/" class="home-button">
            返回首頁
          </router-link>
          <router-link :to="`/profile?tab=orders`" class="orders-button">
            查看我的訂單
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

export default {
  name: 'OrderDetailView',
  setup() {
    const route = useRoute();
    const order = ref(null);
    const loading = ref(true);
    const error = ref(null);
    
    // 付款方式名稱映射
    const paymentMethods = {
      'credit_card': '信用卡付款',
      'line_pay': 'LINE Pay',
      'bank_transfer': '銀行轉帳'
    };
    
    // 獲取付款方式名稱
    const getPaymentMethodName = (method) => {
      return paymentMethods[method] || method;
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
    
    // 格式化日期
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-TW');
    };
    
    // 是否顯示付款說明
    const showPaymentInstructions = computed(() => {
      return order.value && !order.value.isPaid;
    });
    
    // 獲取訂單詳情
    const fetchOrder = async () => {
      const orderId = route.params.id;
      if (!orderId) return;
      
      loading.value = true;
      
      try {
        const response = await axios.get(`/api/orders/${orderId}`);
        order.value = response.data;
      } catch (err) {
        console.error('獲取訂單錯誤:', err);
        error.value = err.response?.data?.message || '無法獲取訂單詳情';
      } finally {
        loading.value = false;
      }
    };
    
    // 組件掛載時獲取訂單
    onMounted(() => {
      fetchOrder();
    });
    
    return {
      order,
      loading,
      error,
      getPaymentMethodName,
      getStatusText,
      formatDate,
      showPaymentInstructions
    };
  }
}
</script>

<style scoped>
.order-detail-page {
  padding: 40px 0;
  display: flex;
  justify-content: center;
}

.detail-content {
  max-width: 800px;
  width: 100%;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 40px;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.order-number {
  text-align: center;
  margin-bottom: 10px;
  font-size: 1.2rem;
}

.order-summary, .order-items, .shipping-info, .payment-instructions {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
}

.order-summary h2, .order-items h2, .shipping-info h2, .payment-instructions h2 {
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
  font-size: 1.3rem;
}

.summary-row, .info-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.summary-row:last-child, .info-row:last-child {
  border-bottom: none;
}

.label {
  font-weight: 600;
}

.status {
  background-color: #ffeeba;
  color: #856404;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 0.9rem;
}

.paid {
  color: var(--primary-color);
}

.unpaid {
  color: #e74c3c;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.item:last-child {
  border-bottom: none;
}

.address {
  line-height: 1.7;
}

.bank-transfer p {
  margin-bottom: 15px;
}

.bank-info {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  border: 1px solid var(--border-color);
}

.actions {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.home-button, .orders-button {
  flex: 1;
  display: block;
  padding: 12px;
  text-align: center;
  border-radius: 4px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.3s;
}

.home-button {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.home-button:hover {
  background-color: #e0e0e0;
}

.orders-button {
  background-color: var(--primary-color);
  color: white;
}

.orders-button:hover {
  background-color: #3d8b40;
}

@media (max-width: 768px) {
  .detail-content {
    padding: 20px;
  }
  
  .actions {
    flex-direction: column;
  }
}
</style>
