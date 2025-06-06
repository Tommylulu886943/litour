export const categoryMap = {
  'Home': '家居',
  'Clothing & Accessories': '服飾配件',
  'Drinkware': '飲水用品',
  'Stationery': '文具',
  'Tech': '科技產品',
  'Beauty': '美妝',
  'Food & Drink': '食品飲料',
  'Other': '其他',
  'Kids': '兒童與嬰幼兒禮贈',
  'Occasions': '節慶與活動專區',
  'Brand': '品牌館',
  'Sports': '運動用品'
};

export function translateCategory(category) {
  return categoryMap[category] || category;
}

export function categoryToEnglish(chinese) {
  const entry = Object.entries(categoryMap).find(([, zh]) => zh === chinese);
  return entry ? entry[0] : chinese;
}
