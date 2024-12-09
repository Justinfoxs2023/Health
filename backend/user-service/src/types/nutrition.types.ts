export interface DietPlan {
  id: string;
  clientId: string;
  nutritionistId: string;
  meals: MealPlan[];
  goals: NutritionGoal;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MealPlan {
  time: string;
  foods: Food[];
  calories: number;
  nutrients: Nutrients;
}

export interface Food {
  name: string;
  amount: number;
  unit: string;
  calories: number;
  nutrients: Nutrients;
}

export interface Nutrients {
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  vitamins?: {[key: string]: number};
  minerals?: {[key: string]: number};
}

export interface MealRecord {
  id: string;
  clientId: string;
  date: Date;
  meal: MealPlan;
  actualFoods: Food[];
  photos?: string[];
  notes?: string;
}

export interface NutritionGoal {
  dailyCalories: number;
  macroRatio: {
    protein: number;
    carbs: number;
    fat: number;
  };
  restrictions?: string[];
  preferences?: string[];
  targetWeight?: number;
  targetDate?: Date;
} 