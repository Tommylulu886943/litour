<template>
    <div class="batch-upload-page container">
      <h1 class="page-title">批量上傳商品</h1>
      
      <div v-if="!isAdmin" class="not-authorized">
        <p>您沒有權限訪問此頁面</p>
        <router-link to="/" class="back-button">返回首頁</router-link>
      </div>
      
      <div v-else class="upload-content">
        <!-- 操作指南 -->
        <div class="guide-section">
          <h2>使用指南</h2>
          <p>您可以通過兩種方式批量上傳商品：</p>
          <div class="methods">
            <div class="method">
              <h3>1. 使用 Excel 模板上傳</h3>
              <p>下載我們的模板，填寫商品信息後上傳</p>
              <button @click="downloadTemplate" class="download-btn">下載模板</button>
            </div>
            <div class="method">
              <h3>2. 手動添加多個商品</h3>
              <p>在下方表單中添加多個商品信息</p>
            </div>
          </div>
        </div>
        
        <!-- Excel 上傳區域 -->
        <div class="excel-upload-section">
          <h2>上傳 Excel 檔案</h2>
          <div class="upload-area" 
               :class="{ 'drag-over': isDragging }"
               @dragover.prevent="handleDragOver"
               @dragleave.prevent="handleDragLeave"
               @drop.prevent="handleDrop">
            <input type="file" ref="fileInput" @change="handleFileChange" accept=".xlsx, .xls, .csv" class="file-input">
            <div class="upload-icon">📊</div>
            <p>拖放 Excel 文件到此處或點擊上傳</p>
            <button @click="triggerFileInput" class="browse-btn">瀏覽文件</button>
          </div>
          
          <div v-if="excelFile" class="file-info">
            <p><strong>已選擇文件:</strong> {{ excelFile.name }}</p>
            <div class="action-buttons">
              <button @click="processExcelFile" class="process-btn" :disabled="processing">
                {{ processing ? '處理中...' : '處理文件' }}
              </button>
              <button @click="clearFile" class="clear-btn">清除</button>
            </div>
          </div>
        </div>
        
        <!-- 圖片批量上傳區域 -->
        <div class="image-upload-section">
          <h2>批量上傳商品圖片</h2>
          <p class="help-text">上傳商品圖片，建議使用以產品 ID 或 SKU 命名的文件</p>
          
          <div class="upload-area" 
               :class="{ 'drag-over': isImageDragging }"
               @dragover.prevent="handleImageDragOver"
               @dragleave.prevent="handleImageDragLeave"
               @drop.prevent="handleImageDrop">
            <input type="file" ref="imageInput" @change="handleImageChange" accept="image/*" multiple class="file-input">
            <div class="upload-icon">🖼️</div>
            <p>拖放圖片文件到此處或點擊上傳</p>
            <p class="small">可一次選擇多張圖片</p>
            <button @click="triggerImageInput" class="browse-btn">瀏覽圖片</button>
          </div>
          
          <div v-if="imageFiles.length > 0" class="image-preview-container">
            <h3>已選擇 {{ imageFiles.length }} 張圖片</h3>
            <div class="image-previews">
              <div v-for="(image, index) in imagePreviewUrls" :key="index" class="image-preview">
                <img :src="image.url" :alt="image.name">
                <div class="image-name">{{ image.name }}</div>
                <button @click="removeImage(index)" class="remove-btn">✕</button>
              </div>
            </div>
            <div class="action-buttons">
              <button @click="uploadImages" class="upload-btn" :disabled="uploadingImages">
                {{ uploadingImages ? '上傳中...' : '上傳圖片' }}
              </button>
              <button @click="clearImages" class="clear-btn">清除所有</button>
            </div>
          </div>
        </div>
        
        <!-- 手動批量添加區域 -->
        <div class="manual-add-section">
          <h2>手動添加商品</h2>
          
          <div class="products-container">
            <div v-for="(product, index) in manualProducts" :key="index" class="product-form">
              <div class="product-header">
                <h3>商品 #{{ index + 1 }}</h3>
                <button @click="removeProduct(index)" class="remove-product-btn">移除</button>
              </div>
              
              <div class="form-grid">
                <div class="form-group">
                  <label for="name">商品名稱 *</label>
                  <input type="text" id="name" v-model="product.name" required>
                </div>
                
                <div class="form-group">
                  <label for="price">價格 (NT$) *</label>
                  <input type="number" id="price" v-model="product.price" min="0" required>
                </div>
                
                <div class="form-group">
                  <label for="discountPrice">優惠價格 (NT$)</label>
                  <input type="number" id="discountPrice" v-model="product.discountPrice" min="0">
                </div>
                
                <div class="form-group">
                  <label for="stock">庫存 *</label>
                  <input type="number" id="stock" v-model="product.stock" min="0" required>
                </div>
                
                <div class="form-group">
                  <label for="category">分類 *</label>
                  <select id="category" v-model="product.category" required>
                    <option value="">選擇分類</option>
                    <option value="Home">家居</option>
                    <option value="Clothing & Accessories">服飾配件</option>
                    <option value="Drinkware">飲水用品</option>
                    <option value="Stationery">文具</option>
                    <option value="Tech">科技產品</option>
                    <option value="Beauty">美妝</option>
                    <option value="Food & Drink">食品飲料</option>
                    <option value="Other">其他</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label for="subcategory">子分類 *</label>
                  <input type="text" id="subcategory" v-model="product.subcategory" required>
                </div>
                
                <div class="form-group">
                  <label for="deliveryTime">預計交貨時間 (天) *</label>
                  <input type="number" id="deliveryTime" v-model="product.deliveryTime" min="1" required>
                </div>
                
                <div class="form-group">
                  <label for="forGender">性別</label>
                  <select id="forGender" v-model="product.forGender">
                    <option value="Unisex">通用</option>
                    <option value="Men">男生</option>
                    <option value="Women">女性</option>
                    <option value="Kids">兒童</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label for="isPersonalized">是否可客製化</label>
                  <select id="isPersonalized" v-model="product.isPersonalized">
                    <option :value="false">否</option>
                    <option :value="true">是</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label for="minimumOrderQuantity">最小訂購量</label>
                  <input type="number" id="minimumOrderQuantity" v-model="product.minimumOrderQuantity" min="1">
                </div>
              </div>
              
              <div class="form-group full-width">
                <label for="description">商品描述 *</label>
                <textarea id="description" v-model="product.description" rows="3" required></textarea>
              </div>
              
              <div class="form-group full-width">
                <label for="tags">標籤（以逗號分隔）</label>
                <input type="text" id="tags" v-model="product.tagsInput" placeholder="例如: 禮品,辦公,環保">
              </div>
              
              <div class="specifications-section">
                <h4>商品規格</h4>
                <p class="help-text">添加商品的詳細規格信息</p>
                
                <div class="specifications-container">
                  <div v-for="(spec, specIndex) in product.specifications" :key="specIndex" class="specification-item">
                    <div class="spec-inputs">
                      <input type="text" v-model="spec.key" placeholder="規格名稱" class="spec-key">
                      <input type="text" v-model="spec.value" placeholder="規格值" class="spec-value">
                    </div>
                    <button @click="removeSpecification(index, specIndex)" class="remove-spec-btn">✕</button>
                  </div>
                </div>
                
                <button @click="addSpecification(index)" class="add-spec-btn">添加規格</button>
              </div>
              
              <div class="images-section">
                <h4>選擇圖片</h4>
                <p class="help-text">從已上傳的圖片中選擇此商品的圖片</p>
                
                <div v-if="uploadedImages.length === 0" class="no-images">
                  <p>尚未上傳圖片，請先在上方上傳圖片區域上傳</p>
                </div>
                
                <div v-else class="image-selection">
                  <div v-for="(image, imageIndex) in uploadedImages" :key="imageIndex" class="image-select-item"
                       :class="{ 'selected': isImageSelected(index, image.id) }"
                       @click="toggleImageSelection(index, image.id)">
                    <img :src="image.url" :alt="image.name">
                    <div class="image-select-name">{{ image.name }}</div>
                    <div class="selection-indicator">✓</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="add-product-action">
            <button @click="addProduct" class="add-product-btn">
              <span class="add-icon">+</span> 添加另一個商品
            </button>
          </div>
        </div>
        
        <!-- 表單提交區域 -->
        <div class="submission-section">
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
          
          <div v-if="success" class="success-message">
            {{ success }}
          </div>
          
          <div class="submit-actions">
            <button @click="submitProducts" class="submit-btn" :disabled="submitting || manualProducts.length === 0">
              {{ submitting ? '提交中...' : '提交所有商品' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, reactive, onMounted } from 'vue';
  import { useUserStore } from '@/store/userStore';
  import axios from 'axios';
  
  export default {
    name: 'BatchUploadView',
    setup() {
      const userStore = useUserStore();
      const isAdmin = computed(() => userStore.isAdmin);
      
      // Excel 上傳
      const fileInput = ref(null);
      const excelFile = ref(null);
      const isDragging = ref(false);
      const processing = ref(false);
      
      // 圖片上傳
      const imageInput = ref(null);
      const imageFiles = ref([]);
      const imagePreviewUrls = ref([]);
      const isImageDragging = ref(false);
      const uploadingImages = ref(false);
      const uploadedImages = ref([]);
      
      // 手動添加商品
      const manualProducts = ref([]);
      
      // 提交狀態
      const submitting = ref(false);
      const error = ref('');
      const success = ref('');
      
      // 初始化添加一個空商品表單
      onMounted(() => {
        addProduct();
        
        // 加載已上傳的圖片
        fetchUploadedImages();
      });
      
      // 下載模板
      const downloadTemplate = () => {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
        const templateUrl = `${baseUrl}/api/admin/download-template`;
        window.open(templateUrl, '_blank');
      };
      
      // Excel 文件處理相關方法
      const triggerFileInput = () => {
        fileInput.value.click();
      };
      
      const handleDragOver = () => {
        isDragging.value = true;
      };
      
      const handleDragLeave = () => {
        isDragging.value = false;
      };
      
      const handleDrop = (event) => {
        isDragging.value = false;
        const files = event.dataTransfer.files;
        if (files.length) {
          handleFiles(files);
        }
      };
      
      const handleFileChange = (event) => {
        const files = event.target.files;
        handleFiles(files);
      };
      
      const handleFiles = (files) => {
        if (files.length > 0) {
          const file = files[0];
          const validTypes = [
            'application/vnd.ms-excel', 
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/csv'
          ];
          
          if (validTypes.includes(file.type) || file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
            excelFile.value = file;
          } else {
            alert('請上傳有效的 Excel 文件 (.xlsx, .xls) 或 CSV 文件');
            clearFile();
          }
        }
      };
      
      const clearFile = () => {
        excelFile.value = null;
        if (fileInput.value) {
          fileInput.value.value = "";
        }
      };
      
      const processExcelFile = async () => {
        if (!excelFile.value) return;
        
        processing.value = true;
        const formData = new FormData();
        formData.append('file', excelFile.value);
        
        try {
          const response = await axios.post('/api/admin/process-excel', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          
          // 處理返回的產品數據
          const processedProducts = response.data.products;
          
          // 將處理好的產品添加到手動產品列表中
          processedProducts.forEach(product => {
            addProductFromExcel(product);
          });
          
          // 顯示成功消息
          success.value = `成功處理 ${processedProducts.length} 個商品`;
          
          // 清除 Excel 文件
          clearFile();
        } catch (err) {
          console.error('處理 Excel 文件錯誤:', err);
          error.value = err.response?.data?.message || '處理 Excel 文件失敗';
        } finally {
          processing.value = false;
        }
      };
      
      // 圖片上傳相關方法
      const triggerImageInput = () => {
        imageInput.value.click();
      };
      
      const handleImageDragOver = () => {
        isImageDragging.value = true;
      };
      
      const handleImageDragLeave = () => {
        isImageDragging.value = false;
      };
      
      const handleImageDrop = (event) => {
        isImageDragging.value = false;
        const files = event.dataTransfer.files;
        if (files.length) {
          handleImageFiles(files);
        }
      };
      
      const handleImageChange = (event) => {
        const files = event.target.files;
        handleImageFiles(files);
      };
      
      const handleImageFiles = (files) => {
        // 檢查文件類型
        const newFiles = Array.from(files).filter(file => {
          return file.type.startsWith('image/');
        });
        
        if (newFiles.length === 0) {
          alert('請上傳有效的圖片文件');
          return;
        }
        
        // 添加到文件列表
        imageFiles.value = [...imageFiles.value, ...newFiles];
        
        // 生成預覽 URL
        newFiles.forEach(file => {
          const reader = new FileReader();
          reader.onload = (e) => {
            imagePreviewUrls.value.push({
              name: file.name,
              url: e.target.result
            });
          };
          reader.readAsDataURL(file);
        });
      };
      
      const removeImage = (index) => {
        imageFiles.value.splice(index, 1);
        imagePreviewUrls.value.splice(index, 1);
      };
      
      const clearImages = () => {
        imageFiles.value = [];
        imagePreviewUrls.value = [];
        if (imageInput.value) {
          imageInput.value.value = "";
        }
      };
      
      const uploadImages = async () => {
        if (imageFiles.value.length === 0) return;
        
        uploadingImages.value = true;
        const formData = new FormData();
        
        imageFiles.value.forEach(file => {
          formData.append('images', file);
        });
        
        try {
          const response = await axios.post('/api/admin/upload-images', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          
          // 添加上傳的圖片到已上傳列表
          const newImages = response.data.images;
          uploadedImages.value = [...uploadedImages.value, ...newImages];
          
          // 顯示成功消息
          success.value = `成功上傳 ${newImages.length} 張圖片`;
          
          // 清除圖片文件
          clearImages();
        } catch (err) {
          console.error('上傳圖片錯誤:', err);
          error.value = err.response?.data?.message || '上傳圖片失敗';
        } finally {
          uploadingImages.value = false;
        }
      };
      
      // 獲取已上傳的圖片
      const fetchUploadedImages = async () => {
        try {
          const response = await axios.get('/api/admin/uploaded-images');
          uploadedImages.value = response.data.images;
        } catch (err) {
          console.error('獲取上傳的圖片錯誤:', err);
        }
      };
      
      // 商品表單方法
      const addProduct = () => {
        manualProducts.value.push({
          name: '',
          price: '',
          discountPrice: '',
          stock: '',
          description: '',
          category: '',
          subcategory: '',
          deliveryTime: 7, // 預設值
          forGender: 'Unisex',
          isPersonalized: false,
          minimumOrderQuantity: 1,
          tagsInput: '',
          specifications: [],
          selectedImages: []
        });
      };
      
      const addProductFromExcel = (product) => {
        // 將 Excel 中的產品信息轉換為手動產品格式
        const specArray = [];
        if (product.specifications) {
          Object.entries(product.specifications).forEach(([key, value]) => {
            specArray.push({ key, value });
          });
        }
        
        manualProducts.value.push({
          name: product.name || '',
          price: product.price || '',
          discountPrice: product.discountPrice || '',
          stock: product.stock || '',
          description: product.description || '',
          category: product.category || '',
          subcategory: product.subcategory || '',
          deliveryTime: product.deliveryTime || 7,
          forGender: product.forGender || 'Unisex',
          isPersonalized: product.isPersonalized || false,
          minimumOrderQuantity: product.minimumOrderQuantity || 1,
          tagsInput: product.tags ? product.tags.join(',') : '',
          specifications: specArray,
          selectedImages: []
        });
      };
      
      const removeProduct = (index) => {
        manualProducts.value.splice(index, 1);
      };
      
      const addSpecification = (productIndex) => {
        manualProducts.value[productIndex].specifications.push({
          key: '',
          value: ''
        });
      };
      
      const removeSpecification = (productIndex, specIndex) => {
        manualProducts.value[productIndex].specifications.splice(specIndex, 1);
      };
      
      // 圖片選擇相關方法
      const toggleImageSelection = (productIndex, imageId) => {
        const selectedImages = manualProducts.value[productIndex].selectedImages;
        const index = selectedImages.indexOf(imageId);
        
        if (index === -1) {
          selectedImages.push(imageId);
        } else {
          selectedImages.splice(index, 1);
        }
      };
      
      const isImageSelected = (productIndex, imageId) => {
        return manualProducts.value[productIndex].selectedImages.includes(imageId);
      };
      
      // 提交所有商品
      const submitProducts = async () => {
        if (manualProducts.value.length === 0) {
          error.value = '請添加至少一個商品';
          return;
        }
        
        // 表單驗證
        let hasValidationError = false;
        manualProducts.value.forEach((product, index) => {
          if (!product.name || !product.price || !product.stock) {
            error.value = `商品 #${index + 1} 缺少必填欄位（名稱、價格或庫存）`;
            hasValidationError = true;
          }
        });
        
        if (hasValidationError) return;
        
        try {
          submitting.value = true;
          error.value = '';
          
          // 顯示更多日誌以幫助調試
          console.log('準備提交的商品數據:', manualProducts.value);
          
          // 準備提交的數據
          const productsToSubmit = manualProducts.value.map(product => {
            // 處理標籤
            const tags = product.tags ? product.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
            
            // 處理規格
            const specificationsObj = {};
            if (product.specifications && product.specifications.length > 0) {
              product.specifications.forEach(spec => {
                if (spec.name && spec.value) {
                  specificationsObj[spec.name] = spec.value;
                }
              });
            }
            
            return {
              name: product.name,
              price: Number(product.price) || 0,  // 確保轉換為數字
              discountPrice: product.discountPrice ? Number(product.discountPrice) || 0 : 0,
              stock: Number(product.stock) || 0,  // 確保轉換為數字
              description: product.description || '',
              category: product.category || '',
              subcategory: product.subcategory || '',
              deliveryTime: Number(product.deliveryTime) || 1,
              forGender: product.forGender || '所有',
              isPersonalized: Boolean(product.isPersonalized),
              minimumOrderQuantity: Number(product.minimumOrderQuantity) || 1,
              tags,
              specifications: specificationsObj,
              images: product.selectedImages || []
            };
          });
          
          console.log('轉換後準備發送的數據:', productsToSubmit);
          
          // 發送請求
          const response = await axios.post('/api/admin/batch-upload-products', {
            products: productsToSubmit
          });
          
          console.log('伺服器回應:', response.data);
          
          // 顯示成功消息
          success.value = `成功上傳 ${response.data.count} 個商品`;
          
          // 清空表單
          manualProducts.value = [];
          addProduct();
          
          // 清除錯誤
          error.value = '';
          
          // 滾動到頁面頂部
          window.scrollTo(0, 0);
        } catch (err) {
          console.error('提交商品錯誤:', err);
          // 顯示更詳細的錯誤信息
          error.value = err.response?.data?.message || 
                        (err.message ? `錯誤: ${err.message}` : '提交商品失敗');
          // 顯示更多錯誤詳情到控制台
          console.error('詳細錯誤信息:', err.response?.data || err);
          window.scrollTo(0, document.body.scrollHeight);
        } finally {
          submitting.value = false;
        }
      };
      
      return {
        isAdmin,
        fileInput,
        excelFile,
        isDragging,
        processing,
        imageInput,
        imageFiles,
        imagePreviewUrls,
        isImageDragging,
        uploadingImages,
        uploadedImages,
        manualProducts,
        submitting,
        error,
        success,
        
        downloadTemplate,
        triggerFileInput,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        handleFileChange,
        clearFile,
        processExcelFile,
        
        triggerImageInput,
        handleImageDragOver,
        handleImageDragLeave,
        handleImageDrop,
        handleImageChange,
        removeImage,
        clearImages,
        uploadImages,
        
        addProduct,
        removeProduct,
        addSpecification,
        removeSpecification,
        
        toggleImageSelection,
        isImageSelected,
        
        submitProducts
      };
    }
  }
  </script>
  
  <style scoped>
  .batch-upload-page {
    padding: 40px 0;
  }
  
  .page-title {
    text-align: center;
    margin-bottom: 40px;
    font-size: 2rem;
  }
  
  .not-authorized {
    text-align: center;
    padding: 50px 20px;
    background-color: var(--light-gray);
    border-radius: 8px;
    margin-bottom: 30px;
  }
  
  .back-button {
    display: inline-block;
    background-color: var(--primary-color);
    color: white;
    padding: 10px 20px;
    border-radius: 4px;
    text-decoration: none;
    margin-top: 15px;
    transition: background-color 0.3s;
  }
  
  .back-button:hover {
    background-color: var(--hover-color);
  }
  
  .guide-section, .excel-upload-section, .image-upload-section, 
  .manual-add-section, .submission-section {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 25px;
    margin-bottom: 30px;
  }
  
  h2 {
    font-size: 1.5rem;
    margin-bottom: 20px;
    color: var(--primary-color);
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 10px;
  }
  
  .methods {
    display: flex;
    gap: 30px;
    margin-top: 20px;
  }
  
  .method {
    flex: 1;
    padding: 20px;
    background-color: var(--light-gray);
    border-radius: 8px;
    text-align: center;
  }
  
  .method h3 {
    margin-bottom: 10px;
    font-size: 1.2rem;
  }
  
  .download-btn {
    background-color: var(--secondary-color);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    margin-top: 15px;
    cursor: pointer;
  }
  
  .download-btn:hover {
    background-color: #1976D2;
  }
  
  .browse-btn:hover {
    background-color: var(--hover-color);
  }
  
  .file-info {
    background-color: var(--light-gray);
    padding: 15px;
    border-radius: 4px;
    margin-top: 20px;
  }
  
  .action-buttons {
    display: flex;
    gap: 15px;
    margin-top: 15px;
  }
  
  .process-btn, .upload-btn {
    background-color: var(--secondary-color);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .process-btn:hover, .upload-btn:hover {
    background-color: #1976D2;
  }
  
  .process-btn:disabled, .upload-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  .clear-btn {
    background-color: #f5f5f5;
    color: #555;
    border: 1px solid #ddd;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .clear-btn:hover {
    background-color: #e0e0e0;
  }
  
  .help-text {
    color: #666;
    margin-bottom: 15px;
    font-size: 0.95rem;
  }
  
  .image-preview-container {
    margin-top: 20px;
  }
  
  .image-previews {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 15px;
    margin: 15px 0;
  }
  
  .image-preview {
    position: relative;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    overflow: hidden;
  }
  
  .image-preview img {
    width: 100%;
    height: 120px;
    object-fit: cover;
  }
  
  .image-name {
    padding: 5px;
    font-size: 0.8rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    background-color: rgba(255, 255, 255, 0.8);
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
  
  .remove-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
  }
  
  .remove-btn:hover {
    background-color: rgba(231, 76, 60, 0.8);
  }
  
  .products-container {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }
  
  .product-form {
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 20px;
    background-color: var(--light-gray);
  }
  
  .product-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border-color);
  }
  
  .product-header h3 {
    font-size: 1.3rem;
    color: var(--primary-color);
  }
  
  .remove-product-btn {
    background-color: #f8d7da;
    color: #721c24;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .remove-product-btn:hover {
    background-color: #f5c6cb;
  }
  
  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group.full-width {
    grid-column: 1 / -1;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: 600;
  }
  
  .form-group input,
  .form-group select,
  .form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background-color: white;
  }
  
  .form-group textarea {
    resize: vertical;
    min-height: 80px;
  }
  
  .specifications-section, .images-section {
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid var(--border-color);
  }
  
  .specifications-section h4, .images-section h4 {
    margin-bottom: 10px;
    font-size: 1.1rem;
  }
  
  .specifications-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 15px;
  }
  
  .specification-item {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .spec-inputs {
    display: flex;
    flex: 1;
    gap: 10px;
  }
  
  .spec-key, .spec-value {
    padding: 8px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background-color: white;
  }
  
  .spec-key {
    flex: 1;
    min-width: 120px;
  }
  
  .spec-value {
    flex: 2;
  }
  
  .remove-spec-btn {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #f8d7da;
    color: #721c24;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
  }
  
  .add-spec-btn {
    background-color: #e0f7fa;
    color: #0097a7;
    border: 1px solid #b2ebf2;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .add-spec-btn:hover {
    background-color: #b2ebf2;
  }
  
  .no-images {
    padding: 15px;
    background-color: #f5f5f5;
    border-radius: 4px;
    color: #666;
    text-align: center;
  }
  
  .image-selection {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 10px;
    margin-top: 15px;
  }
  
  .image-select-item {
    position: relative;
    border: 2px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
  }
  
  .image-select-item.selected {
    border-color: var(--primary-color);
  }
  
  .image-select-item img {
    width: 100%;
    height: 100px;
    object-fit: cover;
  }
  
  .image-select-name {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 5px;
    font-size: 0.75rem;
    background-color: rgba(255, 255, 255, 0.8);
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  
  .selection-indicator {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: var(--primary-color);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    opacity: 0;
  }
  
  .image-select-item.selected .selection-indicator {
    opacity: 1;
  }
  
  .add-product-action {
    margin-top: 20px;
    text-align: center;
  }
  
  .add-product-btn {
    background-color: var(--light-gray);
    color: var(--primary-color);
    border: 2px dashed var(--primary-color);
    padding: 12px 25px;
    border-radius: 4px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  
  .add-product-btn:hover {
    background-color: rgba(232, 74, 95, 0.1);
  }
  
  .add-icon {
    font-size: 1.2rem;
  }
  
  .error-message {
    background-color: #f8d7da;
    color: #721c24;
    padding: 15px;
    border-radius: 4px;
    margin-bottom: 20px;
  }
  
  .success-message {
    background-color: #d4edda;
    color: #155724;
    padding: 15px;
    border-radius: 4px;
    margin-bottom: 20px;
  }
  
  .submit-actions {
    text-align: center;
    margin-top: 20px;
  }
  
  .submit-btn {
    background-color: var(--primary-color);
    color: white;
    border: none;
    padding: 15px 30px;
    border-radius: 4px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
  }
  
  .submit-btn:hover {
    background-color: var(--hover-color);
  }
  
  .submit-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    .methods {
      flex-direction: column;
    }
    
    .form-grid {
      grid-template-columns: 1fr;
    }
    
    .image-selection {
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    }
  }
  
  .upload-area {
    border: 2px dashed var(--border-color);
    border-radius: 8px;
    padding: 40px 20px;
    text-align: center;
    margin: 20px 0;
    position: relative;
    transition: all 0.3s;
  }
  
  .upload-area.drag-over {
    border-color: var(--primary-color);
    background-color: rgba(232, 74, 95, 0.05);
  }
  
  .file-input {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
    cursor: pointer;
  }
  
  .upload-icon {
    font-size: 3rem;
    margin-bottom: 15px;
  }
  
  .small {
    font-size: 0.9rem;
    color: #666;
    margin-top: 5px;
  }
  
  .browse-btn {
    background-color: var(--primary-color);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    margin-top: 15px;
    cursor: pointer;
  }
  </style>