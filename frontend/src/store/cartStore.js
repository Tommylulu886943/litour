import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    loading: false,
    error: null
  }),
  
  getters: {
    totalItems: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0);
    },
    
    totalPrice: (state) => {
      return state.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
    },
    
    formattedTotal: (state) => {
      return state.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0).toFixed(0);
    }
  },
  
  actions: {
    addItem(product, quantity = 1) {
      const existingItem = this.items.find(item => item.productId === product._id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.items.push({
          productId: product._id,
          name: product.name,
          price: product.discountPrice || product.price,
          image: product.images && product.images.length > 0 ? product.images[0] : null,
          quantity
        });
      }
      
      // 保存到本地存儲
      this.saveCart();
    },
    
    updateItemQuantity(index, quantity) {
      if (quantity < 1) return;
      
      this.items[index].quantity = quantity;
      this.saveCart();
    },
    
    removeItem(index) {
      this.items.splice(index, 1);
      this.saveCart();
    },
    
    clearCart() {
      this.items = [];
      this.saveCart();
    },
    
    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.items));
    },
    
    loadCart() {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.items = JSON.parse(savedCart);
      }
    },
    
    initCart() {
      this.loadCart();
    }
  }
});
