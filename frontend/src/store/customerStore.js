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
        const response = await axios.get('/api/admin/customers', {
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
        const response = await axios.post('/api/admin/customers', data);
        this.customers.push(response.data);
        this.error = null;
        return { ok: true };
      } catch (error) {
        console.error('創建客戶失敗:', error);
        this.error = error.response?.data?.message || '創建客戶失敗';
        return { ok: false, message: this.error };
      }
    },

    async deleteCustomer(id) {
      try {
        await axios.delete(`/api/admin/customers/${id}`);
        this.customers = this.customers.filter(c => c._id !== id);
      } catch (error) {
        console.error('刪除客戶失敗:', error);
      }
    },
  },
});

