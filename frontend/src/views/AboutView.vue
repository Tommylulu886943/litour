<template>
  <div class="about-page container">
    <h1 class="page-title">關於我們</h1>
    
    <div class="about-content">
      <p>
        禮途是台灣領先的企業禮品供應商，專注於為企業客戶提供高品質、創新的禮品與贈品解決方案。
      </p>
      
      <p>
        成立於2023年，我們致力於幫助企業透過精心挑選的禮品，提升品牌形象、增強客戶關係、激勵員工表現。
      </p>
      
      <p>
        我們的團隊擁有多年禮品行業經驗，深入了解台灣市場需求，能夠為不同規模、不同行業的企業客戶提供最適合的禮品建議。
      </p>
      
      <div class="mission-vision">
        <div class="mission">
          <h2>我們的使命</h2>
          <p>提供企業客戶高品質、高性價比的禮品解決方案，幫助企業提升品牌價值。</p>
        </div>
        
        <div class="vision">
          <h2>我們的願景</h2>
          <p>成為台灣最值得信賴的企業禮品供應商，以創新和卓越的服務為企業創造價值。</p>
        </div>
      </div>
      
      <h2>我們的優勢</h2>
      
      <ul class="advantages-list">
        <li>
          <strong>優質選材</strong> - 嚴選台灣及國際優質品牌，品質保證
        </li>
        <li>
          <strong>客製服務</strong> - 提供Logo印製、包裝設計等客製化服務
        </li>
        <li>
          <strong>專業服務</strong> - 專業團隊協助企業禮品規劃，大量訂購優惠
        </li>
        <li>
          <strong>一站式服務</strong> - 從選品、設計、製作、包裝到配送，全程一條龍服務
        </li>
        <li>
          <strong>快速響應</strong> - 高效的溝通和反饋機制，確保項目按時完成
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  padding: 40px 0;
}

.page-title {
  text-align: center;
  margin-bottom: 40px;
  font-size: 2rem;
}

.about-content {
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.8;
}

.about-content p {
  margin-bottom: 20px;
}

.mission-vision {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin: 40px 0;
}

.mission, .vision {
  padding: 20px;
  background-color: var(--light-gray);
  border-radius: 8px;
}

.mission h2, .vision h2 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: var(--primary-color);
}

.advantages-list {
  list-style: none;
  padding: 0;
  margin-top: 20px;
}

.advantages-list li {
  padding: 15px 0;
  border-bottom: 1px solid var(--border-color);
}

.advantages-list li:last-child {
  border-bottom: none;
}

@media (max-width: 768px) {
  .mission-vision {
    grid-template-columns: 1fr;
  }
}
</style>
