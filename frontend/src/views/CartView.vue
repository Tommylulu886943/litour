<template>
  <div class="cart-page container">
    <h1 class="page-title">購物車</h1>
    
    <div v-if="!cartItems.length" class="empty-cart">
      <p>您的購物車是空的</p>
      <router-link to="/products" class="continue-shopping">繼續購物</router-link>
    </div>
    
    <div v-else class="cart-content">
      <div class="cart-items">
        <div class="cart-headers">
          <span class="header-product">商品</span>
          <span class="header-price">單價</span>
          <span class="header-quantity">數量</span>
          <span class="header-total">小計</span>
          <span class="header-actions"></span>
        </div>
        
        <div v-for="(item, index) in cartItems" :key="index" class="cart-item">
          <div class="item-product">
            <div class="item-image">
              <img v-if="item.image" :src="item.image" :alt="item.name">
              <div v-else class="placeholder-image"></div>
            </div>
            <div class="item-details">
              <h3 class="item-name">{{ item.name }}</h3>
            </div>
          </div>
          
          <div class="item-price">
            NT$ {{ item.price }}
          </div>
          
          <div class="item-quantity">
            <div class="quantity-controls">
              <button 
                @click="decreaseQuantity(index)" 
                class="quantity-btn"
                :disabled="item.quantity <= 1"
              >-</button>
              <input 
                type="number" 
                v-model.number="item.quantity" 
                min="1" 
                @change="updateQuantity(index, item.quantity)"
              >
              <button 
                @click="increaseQuantity(index)" 
                class="quantity-btn"
              >+</button>
            </div>
          </div>
          
          <div class="item-total">
            NT$ {{ (item.price * item.quantity).toFixed(0) }}
          </div>
          
          <div class="item-actions">
            <button @click="removeFromCart(index)" class="remove-btn">
              <span class="remove-icon">×</span>
            </button>
          </div>
        </div>
      </div>
      
      <div class="cart-summary">
        <h2 class="summary-title">訂單摘要</h2>
        
        <div class="summary-row">
          <span class="summary-label">小計</span>
          <span class="summary-value">NT$ {{ cartTotal }}</span>
        </div>
        
        <div class="summary-row">
          <span class="summary-label">運費</span>
          <span class="summary-value">NT$ {{ shippingCost }}</span>
        </div>
        
        <div class="summary-total">
          <span class="total-label">總計</span>
          <span class="total-value">NT$ {{ orderTotal }}</span>
        </div>
        
        <div class="cart-actions">
          <router-link to="/products" class="continue-shopping">
            繼續購物
          </router-link>
          <router-link to="/checkout" class="checkout-btn">
            前往結帳
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useCartStore } from '@/store/cartStore';

export default {
  name: 'CartView',
  setup() {
    const cartStore = useCartStore();
    
    const cartItems = computed(() => cartStore.items);
    const cartTotal = computed(() => cartStore.formattedTotal);
    
    // 運費計算（示例：購物滿1000免運費，否則運費為100）
    const shippingCost = computed(() => {
      return cartStore.totalPrice >= 1000 ? 0 : 100;
    });
    
    // 訂單總計
    const orderTotal = computed(() => {
      return (cartStore.totalPrice + shippingCost.value).toFixed(0);
    });
    
    // 增加數量
    const increaseQuantity = (index) => {
      const item = cartItems.value[index];
      cartStore.updateItemQuantity(index, item.quantity + 1);
    };
    
    // 減少數量
    const decreaseQuantity = (index) => {
      const item = cartItems.value[index];
      if (item.quantity > 1) {
        cartStore.updateItemQuantity(index, item.quantity - 1);
      }
    };
    
    // 更新數量
    const updateQuantity = (index, quantity) => {
      cartStore.updateItemQuantity(index, Math.max(1, quantity));
    };
    
    // 從購物車移除
    const removeFromCart = (index) => {
      cartStore.removeItem(index);
    };
    
    // 組件掛載時加載購物車
    onMounted(() => {
      cartStore.initCart();
    });
    
    return {
      cartItems,
      cartTotal,
      shippingCost,
      orderTotal,
      increaseQuantity,
      decreaseQuantity,
      updateQuantity,
      removeFromCart
    };
  }
}
</script>

<style scoped>
.cart-page {
  padding: 40px 0;
}

.page-title {
  text-align: center;
  margin-bottom: 40px;
  font-size: 2rem;
}

.empty-cart {
  text-align: center;
  padding: 50px 0;
}

.empty-cart p {
  font-size: 1.2rem;
  margin-bottom: 20px;
  color: #666;
}

.continue-shopping {
  display: inline-block;
  background-color: var(--secondary-color);
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.continue-shopping:hover {
  background-color: #1976D2;
}

.cart-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

.cart-items {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.cart-headers {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr 40px;
  padding: 15px;
  background-color: #f5f5f5;
  font-weight: 600;
}

.cart-item {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr 40px;
  padding: 15px;
  border-bottom: 1px solid var(--border-color);
  align-items: center;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-product {
  display: flex;
  align-items: center;
}

.item-image {
  width: 80px;
  height: 80px;
  margin-right: 15px;
  border-radius: 4px;
  overflow: hidden;
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

.item-name {
  font-size: 1.1rem;
  margin-bottom: 5px;
}

.item-price, .item-total {
  font-weight: 600;
}

.quantity-controls {
  display: flex;
  align-items: center;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  overflow: hidden;
  width: 120px;
}

.quantity-btn {
  width: 40px;
  height: 40px;
  background-color: #f5f5f5;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.quantity-btn:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.quantity-btn:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.quantity-controls input {
  width: 40px;
  height: 40px;
  text-align: center;
  border: none;
  border-left: 1px solid var(--border-color);
  border-right: 1px solid var(--border-color);
}

.remove-btn {
  background: none;
  border: none;
  color: #999;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  color: #e74c3c;
}

.cart-summary {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 25px;
}

.summary-title {
  font-size: 1.5rem;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border-color);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.summary-label, .summary-value {
  font-size: 1.1rem;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 25px;
}

.total-label, .total-value {
  font-size: 1.3rem;
  font-weight: 600;
}

.total-value {
  color: var(--primary-color);
}

.cart-actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.checkout-btn {
  display: block;
  background-color: var(--primary-color);
  color: white;
  text-decoration: none;
  padding: 15px;
  border-radius: 4px;
  text-align: center;
  font-weight: 600;
  transition: background-color 0.3s;
}

.checkout-btn:hover {
  background-color: #3d8b40;
}

@media (max-width: 1024px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .cart-headers .header-price,
  .cart-item .item-price {
    display: none;
  }
  
  .cart-headers, .cart-item {
    grid-template-columns: 3fr 1fr 1fr 40px;
  }
}

@media (max-width: 576px) {
  .item-image {
    width: 60px;
    height: 60px;
  }
  
  .quantity-controls {
    width: 90px;
  }
  
  .quantity-btn, .quantity-controls input {
    height: 30px;
  }
}
</style>
