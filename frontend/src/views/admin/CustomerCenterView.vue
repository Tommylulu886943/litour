<template>
  <div class="customer-center container">
    <h1 class="page-title">客戶中心</h1>

    <div class="actions">
      <input
        type="text"
        v-model="search"
        class="search-input"
        placeholder="搜尋客戶..."
        @input="searchCustomers"
      >
      <button class="add-btn" @click="toggleForm">新增客戶</button>
    </div>

    <form v-if="showForm" @submit.prevent="create" class="customer-form">
      <div class="form-group">
        <label>姓名</label>
        <input v-model="form.name" required>
      </div>
      <div class="form-group">
        <label>Email</label>
        <input v-model="form.email" type="email" required>
      </div>
      <div class="form-group">
        <label>電話</label>
        <input v-model="form.phone">
      </div>
      <div class="form-group">
        <label>公司</label>
        <input v-model="form.company">
      </div>
      <div class="form-actions">
        <button type="submit">建立</button>
        <button type="button" class="cancel-btn" @click="toggleForm">取消</button>
      </div>
    </form>

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
import { computed, onMounted, reactive, ref } from 'vue';
import { useCustomerStore } from '@/store/customerStore';

export default {
  name: 'CustomerCenterView',
  setup() {
    const store = useCustomerStore();
    const customers = computed(() => store.customers);
    const loading = computed(() => store.loading);

    const search = ref('');
    const showForm = ref(false);
    const form = reactive({ name: '', email: '', phone: '', company: '' });

    onMounted(() => {
      store.fetchCustomers();
    });

    const searchCustomers = () => {
      store.fetchCustomers(search.value);
    };

    const toggleForm = () => {
      showForm.value = !showForm.value;
    };

    const create = async () => {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        company: form.company,
      };
      const { ok, message } = await store.createCustomer(payload);
      if (ok) {
        await store.fetchCustomers(search.value);
        showForm.value = false;
        form.name = '';
        form.email = '';
        form.phone = '';
        form.company = '';
      } else if (message) {
        alert(message);
      }
    };

    const deleteCustomer = async (id) => {
      if (confirm('確定刪除此客戶?')) {
        await store.deleteCustomer(id);
      }
    };

    return {
      customers,
      loading,
      search,
      searchCustomers,
      showForm,
      form,
      toggleForm,
      create,
      deleteCustomer,
    };
  },
};
</script>

<style scoped>
.customer-center {
  padding: 40px 0;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  margin-right: 10px;
}

.add-btn {
  padding: 10px 20px;
}

.customer-form {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 20px;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #333;
}

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
