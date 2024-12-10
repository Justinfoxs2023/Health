export interface FoodInfo {
  foodName: string;
  confidence: number;
  category: string;
  nutrition: NutritionInfo;
  timestamp: Date;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  vitamins: VitaminInfo;
  minerals: MineralInfo;
  servingSize: string;
}

export interface VitaminInfo {
  vitaminA: number;
  vitaminB1: number;
  vitaminB2: number;
  vitaminB6: number;
  vitaminB12: number;
  vitaminC: number;
  vitaminD: number;
  vitaminE: number;
  vitaminK: number;
}

export interface MineralInfo {
  calcium: number;
  iron: number;
  magnesium: number;
  phosphorus: number;
  potassium: number;
  sodium: number;
  zinc: number;
} 