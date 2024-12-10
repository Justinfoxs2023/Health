import { BaseHealthData } from '../../health/types/health-base.types';

// 营养分析结果
export interface NutritionAnalysis {
  period: string;
  intake: NutrientIntake;
  balance: NutrientBalance;
  recommendations: NutritionRecommendation[];
}

// 营养素摄入
export interface NutrientIntake {
  calories: {
    total: number;
    fromProtein: number;
    fromCarbs: number;
    fromFat: number;
  };
  macronutrients: {
    protein: number;
    carbs: {
      total: number;
      fiber: number;
      sugar: number;
    };
    fat: {
      total: number;
      saturated: number;
      unsaturated: number;
      trans: number;
    };
  };
  micronutrients: {
    vitamins: Record<string, number>;
    minerals: Record<string, number>;
  };
  water: number;
}

// 营养平衡
export interface NutrientBalance {
  macroRatio: {
    protein: number;
    carbs: number;
    fat: number;
  };
  deficiencies: Array<{
    nutrient: string;
    current: number;
    recommended: number;
    severity: 'mild' | 'moderate' | 'severe';
  }>;
  excess: Array<{
    nutrient: string;
    current: number;
    recommended: number;
    risk: 'low' | 'medium' | 'high';
  }>;
  score: number; // 0-100的营养均衡评分
}

// 膳食计划
export interface MealPlan extends BaseHealthData {
  meals: Array<{
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    time: string;
    foods: Array<{
      name: string;
      amount: number;
      unit: string;
      nutrients: NutrientInfo;
      preparation?: string;
    }>;
    totalNutrients: NutrientInfo;
  }>;
  dailyTotals: NutrientIntake;
  compliance: {
    goals: Array<{
      type: string;
      target: number;
      current: number;
    }>;
    restrictions: Array<{
      type: string;
      limit: number;
      current: number;
    }>;
  };
}

// 食物分析
export interface FoodAnalysis {
  foods: Array<{
    name: string;
    confidence: number;
    nutrients: NutrientInfo;
    category: string;
    tags: string[];
  }>;
  nutrients: NutrientInfo;
  healthScore: number;
  suggestions: Array<{
    type: 'alternative' | 'complement' | 'warning';
    content: string;
    reason: string;
  }>;
}

// 营养素追踪
export interface NutrientTracking {
  goals: Array<{
    nutrient: string;
    target: number;
    current: number;
    trend: 'increasing' | 'stable' | 'decreasing';
  }>;
  intake: NutrientIntake;
  gaps: Array<{
    nutrient: string;
    amount: number;
    priority: 'high' | 'medium' | 'low';
  }>;
  recommendations: NutritionRecommendation[];
}

// 营养建议
export interface NutritionRecommendation {
  type: 'food' | 'meal' | 'supplement' | 'habit';
  priority: 'high' | 'medium' | 'low';
  content: string;
  reason: string;
  suggestions: Array<{
    item: string;
    amount?: string;
    frequency?: string;
    notes?: string;
  }>;
}

// 营养素信息
export interface NutrientInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  vitamins: Record<string, number>;
  minerals: Record<string, number>;
  other?: Record<string, number>;
} 