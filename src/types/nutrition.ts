export interface NutritionPlan {
  id: string;
  userId: string;
  requirements: NutritionRequirements;
  meals: MealPlan[];
  restrictions: DietaryRestriction[];
  preferences: DietaryPreference[];
  goals: NutritionGoal[];
}

export interface MealRecord {
  id: string;
  userId: string;
  planId: string;
  type: string;
  items: FoodItem[];
  nutrition: NutritionInfo;
  timestamp: Date;
}

export interface NutritionAnalysis {
  intake: NutrientIntake;
  patterns: EatingPattern[];
  balance: NutritionBalance;
  recommendations: Recommendation[];
} 