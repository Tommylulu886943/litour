<template>
  <div class="customer-center container">
    <h1 class="page-title">客戶中心</h1>

    <div v-if="loading" class="loading">載入中...</div>
    <div v-else>
      <table class="customer-table">
        <thead>
          <tr>
            <th>姓名</th>
            <th>Email</th>
            <th>電話</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="customer in customers" :key="customer._id">
            <td>{{ customer.name }}</td>
            <td>{{ customer.email }}</td>
            <td>{{ customer.phone }}</td>
            <td>
              <button @click="deleteCustomer(customer._id)">刪除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useCustomerStore } from '@/store/customerStore';

export default {
  name: 'CustomerCenterView',
  setup() {
    const store = useCustomerStore();
    const customers = computed(() => store.customers);
    const loading = computed(() => store.loading);

    onMounted(() => {
      store.fetchCustomers();
    });

    const deleteCustomer = async (id) => {
      if (confirm('確定刪除此客戶?')) {
        await store.deleteCustomer(id);
      }
    };

    return {
      customers,
      loading,
      deleteCustomer,
    };
  },
};
</script>

<style scoped>
.customer-table {
  width: 100%;
  border-collapse: collapse;
}
.customer-table th,
.customer-table td {
  border: 1px solid #ddd;
  padding: 8px;
}
</style>
