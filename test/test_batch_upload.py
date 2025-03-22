import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import os
import time
import pandas as pd
from openpyxl import Workbook

class TestBatchUpload:
    @pytest.fixture
    def setup(self):
        # 初始化 WebDriver
        options = webdriver.ChromeOptions()
        # options.add_argument('--headless')  # 無頭模式，視需要啟用
        self.driver = webdriver.Chrome(options=options)
        self.driver.maximize_window()
        self.driver.implicitly_wait(10)
        
        # 前往首頁
        self.driver.get("http://localhost:3000")
        
        # 設置等待
        self.wait = WebDriverWait(self.driver, 10)
        
        yield
        
        # 測試結束後關閉瀏覽器
        self.driver.quit()
        
    def login_as_admin(self):
        """登入為管理員使用者"""
        # 點擊登入按鈕
        self.driver.find_element(By.LINK_TEXT, "登入").click()
        
        # 填寫登入表單
        self.driver.find_element(By.ID, "email").send_keys("admin@example.com")
        self.driver.find_element(By.ID, "password").send_keys("admin123")
        
        # 點擊登入
        self.driver.find_element(By.XPATH, "//button[contains(text(), '登入')]").click()
        
        # 等待登入成功
        self.wait.until(EC.url_contains("http://localhost:3000"))
        
    def create_test_excel(self):
        """創建測試用的 Excel 文件"""
        # 創建 Excel 測試數據
        data = {
            'name': ['測試商品1', '測試商品2', '測試商品3'],
            'description': ['測試描述1', '測試描述2', '測試描述3'],
            'price': [100, 200, 300],
            'discountPrice': [90, 180, 270],
            'stock': [50, 100, 150],
            'category': ['Tech', 'Stationery', 'Home'],
            'subcategory': ['Electronics', 'Notebooks', 'Décor'],
            'deliveryTime': [3, 5, 7],
            'forGender': ['Unisex', 'Men', 'Women'],
            'isPersonalized': [True, False, True],
            'minimumOrderQuantity': [1, 2, 3],
            'tags': ['測試,電子,禮品', '文具,辦公', '裝飾,居家,禮物'],
            'spec_material': ['塑料', '紙張', '木材'],
            'spec_size': ['10x5cm', 'A5', '15x20cm'],
            'spec_weight': ['200g', '150g', '500g'],
            'spec_color': ['黑色', '藍色', '原木色']
        }
        
        # 創建 DataFrame
        df = pd.DataFrame(data)
        
        # 儲存為 Excel
        file_path = os.path.join(os.getcwd(), "test_products.xlsx")
        df.to_excel(file_path, index=False)
        
        return file_path
        
    def test_batch_upload_excel(self, setup):
        """測試使用 Excel 批量上傳商品"""
        # 登入為管理員
        self.login_as_admin()
        
        # 創建測試用 Excel 文件
        excel_file = self.create_test_excel()
        
        # 進入批量上傳頁面
        self.driver.get("http://localhost:3000/admin/batch-upload")
        
        # 等待頁面載入
        self.wait.until(EC.presence_of_element_located((By.CLASS_NAME, "excel-upload-section")))
        
        # 上傳 Excel 文件
        file_input = self.driver.find_element(By.CSS_SELECTOR, ".excel-upload-section input[type='file']")
        file_input.send_keys(excel_file)
        
        # 點擊處理文件按鈕
        self.driver.find_element(By.CSS_SELECTOR, ".process-btn").click()
        
        # 等待處理完成
        try:
            self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".success-message")))
            success = True
        except TimeoutException:
            success = False
        
        # 上傳圖片
        image_files = []
        for i in range(3):
            image_path = os.path.join(os.getcwd(), f"test_image_{i+1}.jpg")
            # 這裡需要真實的圖片文件
            # 如果沒有真實圖片，可以使用 PIL 創建示例圖片
            image_files.append(image_path)
        
        image_input = self.driver.find_element(By.CSS_SELECTOR, ".image-upload-section input[type='file']")
        image_input.send_keys('\n'.join(image_files))
        
        # 點擊上傳圖片按鈕
        self.driver.find_element(By.CSS_SELECTOR, ".upload-btn").click()
        
        # 等待圖片上傳完成
        try:
            self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".success-message")))
            images_success = True
        except TimeoutException:
            images_success = False
        
        # 為每個商品選擇圖片
        products = self.driver.find_elements(By.CSS_SELECTOR, ".product-form")
        for i, product in enumerate(products):
            # 點擊第一張圖片選擇
            images = product.find_elements(By.CSS_SELECTOR, ".image-select-item")
            if images:
                images[0].click()
        
        # 提交商品
        self.driver.find_element(By.CSS_SELECTOR, ".submit-btn").click()
        
        # 等待提交完成
        try:
            self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".success-message")))
            submit_success = True
        except TimeoutException:
            submit_success = False
        
        # 驗證結果
        assert success, "Excel 處理失敗"
        assert images_success, "圖片上傳失敗"
        assert submit_success, "商品提交失敗"
        
        # 清理測試文件
        os.remove(excel_file)
        for image_path in image_files:
            if os.path.exists(image_path):
                os.remove(image_path)
    
    def test_manually_add_products(self, setup):
        """測試手動添加多個商品"""
        # 登入為管理員
        self.login_as_admin()
        
        # 進入批量上傳頁面
        self.driver.get("http://localhost:3000/admin/batch-upload")
        
        # 等待頁面載入
        self.wait.until(EC.presence_of_element_located((By.CLASS_NAME, "manual-add-section")))
        
        # 填寫第一個商品表單
        product_form = self.driver.find_element(By.CSS_SELECTOR, ".product-form")
        
        # 填寫基本信息
        product_form.find_element(By.ID, "name").send_keys("測試手動商品")
        product_form.find_element(By.ID, "price").send_keys("150")
        product_form.find_element(By.ID, "stock").send_keys("50")
        product_form.find_element(By.ID, "category").send_keys("Tech")
        product_form.find_element(By.ID, "subcategory").send_keys("Gadgets")
        product_form.find_element(By.ID, "description").send_keys("這是一個測試手動添加的商品")
        product_form.find_element(By.ID, "tags").send_keys("測試,手動,商品")
        
        # 添加規格
        product_form.find_element(By.CSS_SELECTOR, ".add-spec-btn").click()
        spec_inputs = product_form.find_elements(By.CSS_SELECTOR, ".specification-item")
        spec_inputs[-1].find_element(By.CSS_SELECTOR, ".spec-key").send_keys("顏色")
        spec_inputs[-1].find_element(By.CSS_SELECTOR, ".spec-value").send_keys("黑色")
        
        # 再添加一個商品
        self.driver.find_element(By.CSS_SELECTOR, ".add-product-btn").click()
        
        # 等待新的商品表單出現
        self.wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".product-form")))
        
        # 填寫第二個商品表單
        product_forms = self.driver.find_elements(By.CSS_SELECTOR, ".product-form")
        second_form = product_forms[1]
        
        second_form.find_element(By.ID, "name").send_keys("第二個測試商品")
        second_form.find_element(By.ID, "price").send_keys("200")
        second_form.find_element(By.ID, "stock").send_keys("30")
        second_form.find_element(By.ID, "category").send_keys("Stationery")
        second_form.find_element(By.ID, "subcategory").send_keys("Pens")
        second_form.find_element(By.ID, "description").send_keys("這是第二個測試手動添加的商品")
        
        # 提交商品
        self.driver.find_element(By.CSS_SELECTOR, ".submit-btn").click()
        
        # 等待提交完成
        try:
            self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".success-message")))
            submit_success = True
        except TimeoutException:
            submit_success = False
        
        # 驗證結果
        assert submit_success, "手動添加商品提交失敗"