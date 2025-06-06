export const categoryMap = {
  Home: '園藝與生活',
  'Clothing & Accessories': '服飾配件',
  Drinkware: '飲水用品',
  Stationery: '藝術與手作',
  Tech: '科技與電子',
  Beauty: '美妝',
  'Food & Drink': '烹飪與美食',
  Other: '運動與戶外',
  Kids: '兒童與嬰幼兒禮贈',
  Occasions: '節慶與活動專區',
  Brand: '品牌館'
};

export const subcategoryMap = {
  Tea: '茶葉',
  Electronics: '電子產品',
  'Travel Mug': '隨行杯',
  Notebooks: '筆記本',
  Scarves: '絲巾',
  'Bath & Body': '沐浴護膚',
  Mugs: '馬克杯',
  Décor: '家居裝飾',
  Belts: '皮帶',
  'Bags & Wallets': '包包與錢包',
  'Water Bottles': '水瓶',
  Keychains: '鑰匙圈',
  'Wine & Spirits': '酒類',
  Ties: '領帶'
};

export function translateCategory(category) {
  return categoryMap[category] || category;
}

export function categoryToEnglish(chinese) {
  const entry = Object.entries(categoryMap).find(([, zh]) => zh === chinese);
  return entry ? entry[0] : chinese;
}

export function translateSubcategory(sub) {
  return subcategoryMap[sub] || sub;
}

export function subcategoryToEnglish(chinese) {
  const entry = Object.entries(subcategoryMap).find(([, zh]) => zh === chinese);
  return entry ? entry[0] : chinese;
}
