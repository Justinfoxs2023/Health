/**
 * @fileoverview TS 文件 smart-diet-analysis.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 智能饮食分析系统
export interface ISmartDietSystem {
  /** id 的描述 */
  id: string;
  /** userId 的描述 */
  userId: string;

  // 饮食习惯分析
  /** dietaryAnalysis 的描述 */
  dietaryAnalysis: {
    eatingPatterns: EatingPattern[];
    problematicHabits: DietaryHabit[];
    emotionalEating: IEmotionalEatingTrigger[];
    mealTimings: MealTiming[];
  };

  // 营养需求计算
  /** nutritionNeeds 的描述 */
  nutritionNeeds: {
    baseCalories: number;
    macroRatio: MacroNutrientRatio;
    microNutrients: MicroNutrientNeeds;
    hydrationNeeds: number;
    adjustments: DietaryAdjustment[];
  };

  // 智能餐单规划
  /** mealPlanning 的描述 */
  mealPlanning: {
    weeklyPlans: IWeeklyMealPlan[];
    alternatives: MealAlternative[];
    groceryLists: GroceryList[];
    recipes: HealthyRecipe[];
  };

  // 饮食监测
  /** dietaryMonitoring 的描述 */
  dietaryMonitoring: {
    calorieTracking: CalorieRecord[];
    nutritionBalance: NutritionBalance;
    mealAdherence: MealAdherence[];
    waterIntake: WaterIntakeRecord[];
  };
}

// 情绪饮食触发因素
export interface IEmotionalEatingTrigger {
  /** emotion 的描述 */
  emotion: string;
  /** foodType 的描述 */
  foodType: string[];
  /** frequency 的描述 */
  frequency: number;
  /** timePattern 的描述 */
  timePattern: string;
  /** copingStrategies 的描述 */
  copingStrategies: string[];
}

// 餐食计划
export interface IWeeklyMealPlan {
  /** weekStart 的描述 */
  weekStart: Date;
  /** dailyPlans 的描述 */
  dailyPlans: DailyMealPlan[];
  /** totalCalories 的描述 */
  totalCalories: number;
  /** nutritionSummary 的描述 */
  nutritionSummary: NutritionSummary;
  /** shoppingList 的描述 */
  shoppingList: GroceryItem[];
  /** preparationGuides 的描述 */
  preparationGuides: PreparationGuide[];
}
