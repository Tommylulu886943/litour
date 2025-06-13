import { defineStore } from 'pinia';
import axios from 'axios';

export const useCustomerStore = defineStore('customers', {
  state: () => ({
    customers: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchCustomers(query = '') {
      this.loading = true;
      try {
        const response = await axios.get('/api/customers', {
          params: query ? { q: query } : {}
        });
        this.customers = response.data;
        this.error = null;
      } catch (error) {
        console.error('獲取客戶列表失敗:', error);
        this.error = '無法獲取客戶列表';
      } finally {
        this.loading = false;
      }
    },

    async createCustomer(data) {
      try {
        const response = await axios.post('/api/customers', data);
        this.customers.push(response.data);
        return true;
      } catch (error) {
        console.error('創建客戶失敗:', error);
        return false;
      }
    },

    async deleteCustomer(id) {
      try {
        await axios.delete(`/api/customers/${id}`);
        this.customers = this.customers.filter(c => c._id !== id);
      } catch (error) {
        console.error('刪除客戶失敗:', error);
      }
    },
  },
});

