# 🎁 Litour 禮贈品網站

一個專為企業打造的禮贈品選購平台，支援商品管理、客製化商品展示與企業專屬後台，結合 Vue 3、Node.js 與 MongoDB 打造完整前後端架構。

🔗 **線上預覽**：  
[https://litour.vercel.app](https://litour.vercel.app)

---

## 🛠 技術架構

| 前端 | 後端 | 資料庫 | 部署 |
|------|------|--------|------|
| Vue 3 + Pinia + Vue Router | Node.js (Express) | MongoDB | Vercel (Frontend) + Railway (Backend + DB) |

---

## 📦 功能簡介

### 使用者端
- 🛍️ 商品瀏覽與分類
- ❤️ 收藏與評價功能
- 🔍 商品搜尋
- 📝 下單功能（待擴充）

### 管理端
- ✏️ 商品管理 CRUD
- 🔐 身分驗證與權限驗證
- 📦 批次上傳功能
- 📊 未來可擴充訂單管理／統計圖表

---

## 📁 專案結構

---

## 🚀 部署方式

### 🔧 後端部署至 Railway
- 使用 `Dockerfile` 部署 Express 伺服器
- 加入 MongoDB Plugin 並設置環境變數 `MONGODB_URI`

### 🌐 前端部署至 Vercel
- 根目錄為 `frontend`
- 設定環境變數 `VITE_API_BASE_URL` 指向 Railway 的後端網址

---

## 🧪 API 測試 (Postman)
- `/api`：確認服務是否運行中
- `/api/seed`：初始化商品資料
- `/api/products`：取得商品列表
- `/api/auth`：登入與註冊
- 更多請參見 `/routes` 資料夾

## 🖥 GUI 測試 (Selenium)
本專案的 `test` 目錄包含使用 Selenium 的 Python 測試範例，需先安裝相
關依賴：

```bash
pip install -r requirements.txt
```

測試前請確保已安裝 Chrome/Chromedriver，並在根目錄執行：

```bash
pytest -q
```


---

## 📌 Todo / 待辦清單

- [ ] 加入購物車功能
- [ ] 管理者後台 UI
- [ ] 使用者下訂流程（表單＋訂單追蹤）
- [ ] 上傳圖片儲存（S3 or Cloudinary）
- [ ] 加入 CI/CD 與測試框架

---

## 👩‍💻 開發者

**Tommy Lu**  

---

## 📝 License

MIT License.