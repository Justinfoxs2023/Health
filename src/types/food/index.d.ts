/**
 * @fileoverview TS 文件 index.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 食品类型定义
export interface IFood {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** category 的描述 */
    category: FoodCategory;
  /** nutrition 的描述 */
    nutrition: INutritionInfo;
  /** ingredients 的描述 */
    ingredients: string;
  /** allergens 的描述 */
    allergens: string;
  /** tags 的描述 */
    tags: string;
  /** servingSize 的描述 */
    servingSize: {
    amount: number;
    unit: string;
  };
  /** image 的描述 */
    image?: undefined | string;
}

// 营养信息
export interface INutritionInfo {
  /** calories 的描述 */
    calories: number;  
  /** protein 的描述 */
    protein: number;  /** g 的描述 */
    /** g 的描述 */
    g
  /** fat 的描述 */
    fat: {
    total: number;  g
    saturated: number;  g
    trans: number;  g
  };
  /** carbohydrates 的描述 */
    carbohydrates: {
    total: number; // 总碳水(g)
    fiber: number; // 膳食纤维(g)
    sugar: number; // 糖(g)
  };
  /** vitamins 的描述 */
    vitamins: {
    A: number; // 维生素A(IU)
    C: number; // 维生素C(mg)
    D: number; // 维生素D(IU)
    E: number; // 维生素E(mg)
  };
  /** minerals 的描述 */
    minerals: {
    calcium: number; // 钙(mg)
    iron: number; // 铁(mg)
    potassium: number; // 钾(mg)
    sodium: number; // 钠(mg)
  };
}

// 食品分析结果
export interface IFoodAnalysis {
  /** food 的描述 */
    food: IFood;
  /** mealContext 的描述 */
    mealContext: {
    mealType: breakfast  lunch  dinner  snack;
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
