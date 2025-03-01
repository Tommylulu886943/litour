<template>
  <div class="products-page">
    <div class="container">
      <div class="products-header">
        <h1 class="page-title">{{ pageTitle }}</h1>
        
        <!-- 麵包屑導航 -->
        <div class="breadcrumbs">
          <router-link to="/">首頁</router-link>
          <span class="separator">/</span>
          <template v-if="searchParams.category">
            <router-link :to="{ name: 'products' }">所有商品</router-link>
            <span class="separator">/</span>
            <span class="current">{{ searchParams.category }}</span>
          </template>
          <template v-else>
            <span class="current">所有商品</span>
          </template>
        </div>
        
        <!-- 搜索結果摘要 -->
        <div v-if="searchParams.search" class="search-summary">
          搜索 "{{ searchParams.search }}" 的結果 ({{ pagination.total }} 項商品)
        </div>
      </div>
      
      <div class="products-layout">
        <!-- 左側過濾器 -->
        <aside class="filters-sidebar">
          <div class="filters-header">
            <h2>篩選商品</h2>
            <button 
              v-if="activeFiltersCount > 0" 
              @click="clearAllFilters" 
              class="clear-filters-btn"
            >
              清除所有篩選 ({{ activeFiltersCount }})
            </button>
          </div>
          
          <!-- 價格範圍 -->
          <div class="filter-section">
            <h3 class="filter-title">價格</h3>
            <div class="price-slider-container">
              <div class="price-inputs">
                <div class="price-input">
                  <span class="currency">$</span>
                  <input 
                    type="number" 
                    v-model="localMinPrice"
                    placeholder="0"
                    min="0"
                    @change="updatePriceRange"
                  >
                </div>
                <span class="price-separator">–</span>
                <div class="price-input">
                  <span class="currency">$</span>
                  <input 
                    type="number" 
                    v-model="localMaxPrice"
                    :placeholder="filterOptions.priceRange.max"
                    :min="localMinPrice || 0"
                    @change="updatePriceRange"
                  >
                </div>
              </div>
              
              <div class="range-slider-container">
                <div class="range-track"></div>
                <div class="range-progress" 
                    :style="{
                      left: ((sliderMinPrice - filterOptions.priceRange.min) / (filterOptions.priceRange.max - filterOptions.priceRange.min) * 100) + '%',
                      width: ((sliderMaxPrice - sliderMinPrice) / (filterOptions.priceRange.max - filterOptions.priceRange.min) * 100) + '%'
                    }">
                </div>
                <input 
                  type="range" 
                  v-model="sliderMinPrice"
                  :min="filterOptions.priceRange.min" 
                  :max="filterOptions.priceRange.max"
                  @input="handleMinSliderChange"
                  @change="updatePriceRange"
                  class="range-slider min-slider"
                >
                <input 
                  type="range" 
                  v-model="sliderMaxPrice"
                  :min="filterOptions.priceRange.min" 
                  :max="filterOptions.priceRange.max"
                  @input="handleMaxSliderChange"
                  @change="updatePriceRange"
                  class="range-slider max-slider"
                >
              </div>
              <div class="price-range-values">
                <span>$0</span>
                <span class="range-values">
                  ${{ localMinPrice || 0 }} - ${{ localMaxPrice || filterOptions.priceRange.max }}
                </span>
                <span>${{ filterOptions.priceRange.max }}+</span>
              </div>
            </div>
          </div>
          
          <!-- 分類 -->
          <div class="filter-section" v-for="category in filterOptions.categories" :key="category._id">
            <h3 class="filter-title">{{ category._id }}</h3>
            <div class="filter-options">
              <div 
                v-for="subcategory in category.subcategories" 
                :key="subcategory.name"
                class="filter-option"
              >
                <input 
                  type="checkbox"
                  :id="subcategory.name"
                  :value="subcategory.name"
                  v-model="subcategorySelections"
                  @change="updateSubcategories"
                >
                <label :for="subcategory.name">
                  {{ subcategory.name }}
                  <span class="count">({{ subcategory.count }})</span>
                </label>
              </div>
            </div>
          </div>
          
          <!-- 性別 -->
          <div class="filter-section">
            <h3 class="filter-title">適用性別</h3>
            <div class="filter-options">
              <div class="filter-option">
                <input 
                  type="radio"
                  id="gender-all"
                  :value="''"
                  v-model="searchParams.forGender"
                  @change="fetchProducts"
                >
                <label for="gender-all">所有</label>
              </div>
              <div class="filter-option">
                <input 
                  type="radio"
                  id="gender-men"
                  value="Men"
                  v-model="searchParams.forGender"
                  @change="fetchProducts"
                >
                <label for="gender-men">男士</label>
              </div>
              <div class="filter-option">
                <input 
                  type="radio"
                  id="gender-women"
                  value="Women"
                  v-model="searchParams.forGender"
                  @change="fetchProducts"
                >
                <label for="gender-women">女士</label>
              </div>
              <div class="filter-option">
                <input 
                  type="radio"
                  id="gender-unisex"
                  value="Unisex"
                  v-model="searchParams.forGender"
                  @change="fetchProducts"
                >
                <label for="gender-unisex">中性</label>
              </div>
            </div>
          </div>
          
          <!-- 個人化選項 -->
          <div class="filter-section">
            <h3 class="filter-title">個人化</h3>
            <div class="filter-options">
              <div class="filter-option">
                <input 
                  type="radio"
                  id="personalized-all"
                  :value="null"
                  v-model="searchParams.isPersonalized"
                  @change="fetchProducts"
                >
                <label for="personalized-all">所有</label>
              </div>
              <div class="filter-option">
                <input 
                  type="radio"
                  id="personalized-yes"
                  :value="true"
                  v-model="searchParams.isPersonalized"
                  @change="fetchProducts"
                >
                <label for="personalized-yes">可個人化</label>
              </div>
              <div class="filter-option">
                <input 
                  type="radio"
                  id="personalized-no"
                  :value="false"
                  v-model="searchParams.isPersonalized"
                  @change="fetchProducts"
                >
                <label for="personalized-no">不可個人化</label>
              </div>
            </div>
          </div>
        </aside>
        
        <!-- 右側產品列表 -->
        <div class="products-content">
          <!-- 排序和篩選工具列 -->
          <div class="products-toolbar">
            <div class="products-count">
              顯示 {{ products.length }} 個產品，共 {{ pagination.total }} 個結果
            </div>
            
            <div class="sorting">
              <label for="sort">排序：</label>
              <select 
                id="sort" 
                v-model="searchParams.sort"
                @change="fetchProducts"
              >
                <option value="newest">最新上架</option>
                <option value="price_asc">價格由低到高</option>
                <option value="price_desc">價格由高到低</option>
                <option value="rating">評分最高</option>
                <option value="popular">最受歡迎</option>
              </select>
            </div>
          </div>
          
          <!-- 產品載入中 -->
          <div v-if="loading" class="loading-products">
            <div class="spinner"></div>
            <p>載入商品中...</p>
          </div>
          
          <!-- 產品列表 -->
          <div v-else-if="products.length > 0" class="products-grid">
            <ProductCard 
              v-for="product in products" 
              :key="product._id" 
              :product="product"
            />
          </div>
          
          <!-- 沒有找到產品 -->
          <div v-else class="no-products">
            <p>沒有找到符合條件的商品</p>
            <button @click="clearAllFilters" class="reset-btn">
              重置所有篩選條件
            </button>
          </div>
          
          <!-- 分頁 -->
          <div v-if="pagination.pages > 1" class="pagination">
            <button 
              @click="prevPage" 
              class="page-btn prev"
              :disabled="pagination.page === 1"
            >
              上一頁
            </button>
            
            <div class="page-numbers">
              <button 
                v-for="page in getPageNumbers" 
                :key="page"
                :class="['page-number', { active: page === pagination.page }]"
                @click="goToPage(page)"
              >
                {{ page }}
              </button>
            </div>
            
            <button 
              @click="nextPage" 
              class="page-btn next"
              :disabled="pagination.page === pagination.pages"
            >
              下一頁
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFilterStore } from '@/store/filterStore';
import ProductCard from '@/components/ProductCard.vue';

export default {
  name: 'ProductsView',
  components: {
    ProductCard
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const filterStore = useFilterStore();
    
    // 本地價格範圍狀態（用於UI控制）
    const localMinPrice = ref('');
    const localMaxPrice = ref('');
    const sliderMinPrice = ref(0);
    const sliderMaxPrice = ref(1000);
    
    // 本地子類別選擇（用於UI控制）
    const subcategorySelections = ref([]);
    
    // 從 URL 解析查詢參數
    const parseQueryParams = () => {
      const { query } = route;
      
      // 搜索關鍵詞
      if (query.search) {
        filterStore.setSearchParam('search', query.search);
      }
      
      // 類別
      if (query.category) {
        filterStore.setSearchParam('category', query.category);
      }
      
      // 子類別
      if (query.subcategory) {
        const subcategories = query.subcategory.split(',');
        filterStore.setSearchParam('subcategory', subcategories);
        subcategorySelections.value = [...subcategories];
      }
      
      // 價格範圍
      if (query.minPrice) {
        const minPrice = parseInt(query.minPrice);
        filterStore.setSearchParam('minPrice', minPrice);
        localMinPrice.value = minPrice;
        sliderMinPrice.value = minPrice;
      }
      
      if (query.maxPrice) {
        const maxPrice = parseInt(query.maxPrice);
        filterStore.setSearchParam('maxPrice', maxPrice);
        localMaxPrice.value = maxPrice;
        sliderMaxPrice.value = maxPrice;
      }
      
      // 性別
      if (query.forGender) {
        filterStore.setSearchParam('forGender', query.forGender);
      }
      
      // 個人化選項
      if (query.isPersonalized !== undefined) {
        filterStore.setSearchParam('isPersonalized', query.isPersonalized === 'true');
      }
      
      // 排序
      if (query.sort) {
        filterStore.setSearchParam('sort', query.sort);
      }
      
      // 分頁
      if (query.page) {
        filterStore.setSearchParam('page', parseInt(query.page));
      }
    };
    
    // 更新 URL 查詢參數
    const updateQueryParams = () => {
      const query = {};
      const { searchParams } = filterStore;
      
      if (searchParams.search) query.search = searchParams.search;
      if (searchParams.category) query.category = searchParams.category;
      if (searchParams.subcategory.length > 0) {
        query.subcategory = searchParams.subcategory.join(',');
      }
      if (searchParams.minPrice) query.minPrice = searchParams.minPrice;
      if (searchParams.maxPrice) query.maxPrice = searchParams.maxPrice;
      if (searchParams.forGender) query.forGender = searchParams.forGender;
      if (searchParams.isPersonalized !== null) {
        query.isPersonalized = searchParams.isPersonalized;
      }
      if (searchParams.sort !== 'newest') query.sort = searchParams.sort;
      if (searchParams.page > 1) query.page = searchParams.page;
      
      router.replace({ query });
    };
    
    // 獲取產品
    const fetchProducts = async () => {
      try {
        await filterStore.fetchFilteredProducts();
        updateQueryParams();
      } catch (error) {
        console.error('獲取產品錯誤:', error);
      }
    };
    
    // 處理最小價格滑塊變化
    const handleMinSliderChange = () => {
      const min = parseInt(sliderMinPrice.value);
      const max = parseInt(sliderMaxPrice.value);
      
      if (min > max) {
        sliderMaxPrice.value = min;
      }
      
      localMinPrice.value = min;
    };
    
    // 處理最大價格滑塊變化
    const handleMaxSliderChange = () => {
      const min = parseInt(sliderMinPrice.value);
      const max = parseInt(sliderMaxPrice.value);
      
      if (max < min) {
        sliderMinPrice.value = max;
      }
      
      localMaxPrice.value = max;
    };
    
    // 更新價格範圍
    const updatePriceRange = () => {
      filterStore.setSearchParam('minPrice', localMinPrice.value || '');
      filterStore.setSearchParam('maxPrice', localMaxPrice.value || '');
      fetchProducts();
    };
    
    // 更新子類別
    const updateSubcategories = () => {
      filterStore.setSearchParam('subcategory', [...subcategorySelections.value]);
      fetchProducts();
    };
    
    // 清除所有過濾器
    const clearAllFilters = () => {
      filterStore.clearAllFilters();
      localMinPrice.value = '';
      localMaxPrice.value = '';
      sliderMinPrice.value = filterStore.filterOptions.priceRange.min;
      sliderMaxPrice.value = filterStore.filterOptions.priceRange.max;
      subcategorySelections.value = [];
      fetchProducts();
    };
    
    // 分頁相關方法
    const prevPage = () => {
      if (filterStore.pagination.page > 1) {
        filterStore.setSearchParam('page', filterStore.pagination.page - 1);
        fetchProducts();
        // 滾動到頁面頂部
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    
    const nextPage = () => {
      if (filterStore.pagination.page < filterStore.pagination.pages) {
        filterStore.setSearchParam('page', filterStore.pagination.page + 1);
        fetchProducts();
        // 滾動到頁面頂部
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    
    const goToPage = (page) => {
      filterStore.setSearchParam('page', page);
      fetchProducts();
      // 滾動到頁面頂部
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    // 獲取應顯示的頁碼（最多顯示5個）
    const getPageNumbers = computed(() => {
      const { page, pages } = filterStore.pagination;
      const pageNumbers = [];
      
      if (pages <= 5) {
        // 如果總頁數不超過5，顯示所有頁碼
        for (let i = 1; i <= pages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // 否則，顯示當前頁附近的頁碼
        if (page <= 3) {
          // 靠近開始的頁面
          for (let i = 1; i <= 5; i++) {
            pageNumbers.push(i);
          }
        } else if (page >= pages - 2) {
          // 靠近結束的頁面
          for (let i = pages - 4; i <= pages; i++) {
            pageNumbers.push(i);
          }
        } else {
          // 中間頁面
          for (let i = page - 2; i <= page + 2; i++) {
            pageNumbers.push(i);
          }
        }
      }
      
      return pageNumbers;
    });
    
    // 計算頁面標題
    const pageTitle = computed(() => {
      if (filterStore.searchParams.category) {
        return `${filterStore.searchParams.category} 禮品`;
      }
      return '所有禮品';
    });
    
    // 獲取 Store 數據
    const products = computed(() => filterStore.products);
    const loading = computed(() => filterStore.loading);
    const error = computed(() => filterStore.error);
    const pagination = computed(() => filterStore.pagination);
    const searchParams = computed(() => filterStore.searchParams);
    const filterOptions = computed(() => filterStore.filterOptions);
    const activeFiltersCount = computed(() => filterStore.activeFiltersCount);
    
    // 監聽路由變化，更新過濾器
    watch(() => route.query, () => {
      parseQueryParams();
      fetchProducts();
    });
    
    // 組件掛載時
    onMounted(async () => {
      // 初始化類別數據
      await filterStore.fetchCategories();
      
      // 從 URL 解析查詢參數
      parseQueryParams();
      
      // 獲取產品
      await fetchProducts();
      
      // 初始化價格滑塊
      if (filterStore.filterOptions.priceRange) {
        if (!localMinPrice.value) {
          sliderMinPrice.value = filterStore.filterOptions.priceRange.min;
        }
        if (!localMaxPrice.value) {
          sliderMaxPrice.value = filterStore.filterOptions.priceRange.max;
        }
      }
    });
    
    return {
      products,
      loading,
      error,
      pagination,
      searchParams,
      filterOptions,
      activeFiltersCount,
      localMinPrice,
      localMaxPrice,
      sliderMinPrice,
      sliderMaxPrice,
      subcategorySelections,
      pageTitle,
      getPageNumbers,
      handleMinSliderChange,
      handleMaxSliderChange,
      updatePriceRange,
      updateSubcategories,
      fetchProducts,
      clearAllFilters,
      prevPage,
      nextPage,
      goToPage
    };
  }
}
</script>

<style scoped>
.products-page {
  padding: 40px 0;
}

.products-header {
  margin-bottom: 30px;
}

.page-title {
  font-size: 2rem;
  margin-bottom: 10px;
}

.breadcrumbs {
  margin-bottom: 15px;
  font-size: 0.9rem;
}

.breadcrumbs a {
  color: var(--primary-color);
  text-decoration: none;
}

.breadcrumbs .separator {
  margin: 0 8px;
  color: #999;
}

.breadcrumbs .current {
  color: #666;
}

.search-summary {
  margin-bottom: 15px;
  font-size: 1rem;
  color: #666;
}

.products-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 30px;
}

/* 過濾器側邊欄 */
.filters-sidebar {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
  align-self: start;
  position: sticky;
  top: 20px;
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filters-header h2 {
  font-size: 1.2rem;
  font-weight: 600;
}

.clear-filters-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: underline;
}

.filter-section {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.filter-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
  margin-bottom: 0;
}

.filter-title {
  font-size: 1.1rem;
  margin-bottom: 15px;
  font-weight: 600;
}

/* 價格範圍 */
.price-inputs {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.price-input {
  position: relative;
  flex: 1;
}

.currency {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.price-input input {
  width: 100%;
  padding: 8px 8px 8px 25px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.price-separator {
  margin: 0 10px;
  color: #999;
}

.price-slider {
  position: relative;
  height: 30px;
  margin-bottom: 10px;
}

.price-slider input[type="range"] {
  position: absolute;
  width: 100%;
  height: 5px;
  background: none;
  pointer-events: none;
  -webkit-appearance: none;
}

.price-slider input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 15px;
  width: 15px;
  border-radius: 50%;
  background: var(--primary-color);
  cursor: pointer;
  pointer-events: auto;
}

.price-range-values {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 0.9rem;
  color: #666;
}

.range-values {
  font-weight: 600;
  color: var(--primary-color);
}

/* 過濾選項 */
.filter-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filter-option {
  display: flex;
  align-items: center;
}

.filter-option input {
  margin-right: 8px;
}

.filter-option label {
  cursor: pointer;
  font-size: 0.95rem;
}

.count {
  color: #999;
  font-size: 0.85rem;
  margin-left: 3px;
}

/* 產品內容區 */
.products-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.products-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.products-count {
  font-size: 0.9rem;
  color: #666;
}

.sorting {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sorting label {
  font-size: 0.9rem;
  color: #666;
}

.sorting select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
}

/* 產品列表 */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 25px;
  margin: 20px 0;
}

/* 載入狀態 */
.loading-products {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 沒有產品 */
.no-products {
  text-align: center;
  padding: 50px 0;
  color: #666;
}

.reset-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  margin-top: 15px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.reset-btn:hover {
  background-color: #3d8b40;
}

/* 分頁 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}

.page-btn {
  background-color: white;
  border: 1px solid #ddd;
  color: #333;
  padding: 8px 15px;
  cursor: pointer;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
  background-color: #f5f5f5;
}

.page-btn:disabled {
  color: #999;
  cursor: not-allowed;
}

.prev {
  border-radius: 4px 0 0 4px;
}

.next {
  border-radius: 0 4px 4px 0;
}

.page-numbers {
  display: flex;
}

.page-number {
  background-color: white;
  border: 1px solid #ddd;
  border-left: none;
  color: #333;
  width: 40px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.page-number:hover {
  background-color: #f5f5f5;
}

.page-number.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

/* 媒體查詢 */
@media (max-width: 992px) {
  .products-layout {
    grid-template-columns: 1fr;
  }
  
  .filters-sidebar {
    position: static;
  }
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
  
  .products-toolbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}

@media (max-width: 576px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  
  .page-numbers {
    display: none;
  }
  
  .prev {
    border-radius: 4px;
    margin-right: 10px;
  }
  
  .next {
    border-radius: 4px;
  }
}

.range-slider-container {
  position: relative;
  width: 100%;
  height: 5px;
  margin: 35px 0;
}

.range-track {
  position: absolute;
  width: 100%;
  height: 5px;
  background-color: #ddd;
  border-radius: 5px;
}

.range-progress {
  position: absolute;
  height: 5px;
  background-color: var(--primary-color);
  border-radius: 5px;
}

.range-slider {
  position: absolute;
  width: 100%;
  height: 5px;
  background: none;
  pointer-events: none;
  -webkit-appearance: none;
  appearance: none;
  outline: none;
  top: 0;
}

.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--primary-color);
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  pointer-events: auto;
  margin-top: -6px;
}

.range-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--primary-color);
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  pointer-events: auto;
}

.min-slider {
  z-index: 2;
}

.max-slider {
  z-index: 1;
}

</style>
