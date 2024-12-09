// 食品类型定义
export interface Food {
  id: string;
  name: string;
  category: FoodCategory;
  nutrition: NutritionInfo;
  ingredients?: string[];
  allergens?: string[];
  tags: string[];
  servingSize: {
    amount: number;
    unit: string;
  };
  image?: string;
}

// 营养信息
export interface NutritionInfo {
  calories: number;      // 卡路里
  protein: number;       // 蛋白质(g)
  fat: {
    total: number;      // 总脂肪(g)
    saturated: number;  // 饱和脂肪(g)
    trans: number;      // 反式脂肪(g)
  };
  carbohydrates: {
    total: number;      // 总碳水(g)
    fiber: number;      // 膳食纤维(g)
    sugar: number;      // 糖(g)
  };
  vitamins: {
    A: number;          // 维生素A(IU)
    C: number;          // 维生素C(mg)
    D: number;          // 维生素D(IU)
    E: number;          // 维生素E(mg)
  };
  minerals: {
    calcium: number;    // 钙(mg)
    iron: number;       // 铁(mg)
    potassium: number;  // 钾(mg)
    sodium: number;     // 钠(mg)
  };
}

// 食品分析结果
export interface FoodAnalysis {
  food: Food;
  mealContext: {
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    time: Date;
  };
  nutritionBalance: {
    score: number;
    recommendations: string[];
  };
  healthImpact: {
    positive: string[];
    negative: string[];
  };
  alternatives: Food[];
} 