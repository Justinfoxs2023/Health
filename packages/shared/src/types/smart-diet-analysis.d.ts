// 智能饮食分析系统
export interface SmartDietSystem {
  id: string;
  userId: string;
  
  // 饮食习惯分析
  dietaryAnalysis: {
    eatingPatterns: EatingPattern[];
    problematicHabits: DietaryHabit[];
    emotionalEating: EmotionalEatingTrigger[];
    mealTimings: MealTiming[];
  };
  
  // 营养需求计算
  nutritionNeeds: {
    baseCalories: number;
    macroRatio: MacroNutrientRatio;
    microNutrients: MicroNutrientNeeds;
    hydrationNeeds: number;
    adjustments: DietaryAdjustment[];
  };
  
  // 智能餐单规划
  mealPlanning: {
    weeklyPlans: WeeklyMealPlan[];
    alternatives: MealAlternative[];
    groceryLists: GroceryList[];
    recipes: HealthyRecipe[];
  };
  
  // 饮食监测
  dietaryMonitoring: {
    calorieTracking: CalorieRecord[];
    nutritionBalance: NutritionBalance;
    mealAdherence: MealAdherence[];
    waterIntake: WaterIntakeRecord[];
  };
}

// 情绪饮食触发因素
export interface EmotionalEatingTrigger {
  emotion: string;
  foodType: string[];
  frequency: number;
  timePattern: string;
  copingStrategies: string[];
}

// 餐食计划
export interface WeeklyMealPlan {
  weekStart: Date;
  dailyPlans: DailyMealPlan[];
  totalCalories: number;
  nutritionSummary: NutritionSummary;
  shoppingList: GroceryItem[];
  preparationGuides: PreparationGuide[];
} 