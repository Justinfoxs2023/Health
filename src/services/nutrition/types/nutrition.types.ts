import { IBaseHealthData } from '../../health/types/health-base.types';

// 营养分析结果
export interface INutritionAnalysis {
  /** period 的描述 */
    period: string;
  /** intake 的描述 */
    intake: INutrientIntake;
  /** balance 的描述 */
    balance: INutrientBalance;
  /** recommendations 的描述 */
    recommendations: INutritionRecommendation;
}

// 营养素摄入
export interface INutrientIntake {
  /** calories 的描述 */
    calories: {
    total: number;
    fromProtein: number;
    fromCarbs: number;
    fromFat: number;
  };
  /** macronutrients 的描述 */
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
  /** micronutrients 的描述 */
    micronutrients: {
    vitamins: Record<string, number>;
    minerals: Record<string, number>;
  };
  /** water 的描述 */
    water: number;
}

// 营养平衡
export interface INutrientBalance {
  /** macroRatio 的描述 */
    macroRatio: {
    protein: number;
    carbs: number;
    fat: number;
  };
  /** deficiencies 的描述 */
    deficiencies: Array<{
    nutrient: string;
    current: number;
    recommended: number;
    severity: 'mild' | 'moderate' | 'severe';
  }>;
  /** excess 的描述 */
    excess: Array<{
    nutrient: string;
    current: number;
    recommended: number;
    risk: 'low' | 'medium' | 'high';
  }>;
  /** score 的描述 */
    score: number; // 0-100的营养均衡评分
}

// 膳食计划
export interface IMealPlan extends IBaseHealthData {
  /** meals 的描述 */
    meals: Array<{
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    time: string;
    foods: Array<{
      name: string;
      amount: number;
      unit: string;
      nutrients: INutrientInfo;
      preparation?: string;
    }>;
    totalNutrients: INutrientInfo;
  }>;
  /** dailyTotals 的描述 */
    dailyTotals: INutrientIntake;
  /** compliance 的描述 */
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
export interface IFoodAnalysis {
  /** foods 的描述 */
    foods: Array{
    name: string;
    confidence: number;
    nutrients: NutrientInfo;
    category: string;
    tags: string;
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
export interface INutrientTracking {
  /** goals 的描述 */
    goals: Array{
    nutrient: string;
    target: number;
    current: number;
    trend: increasing  stable  decreasing;
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
export interface INutritionRecommendation {
  /** type 的描述 */
    type: food  meal  supplement  habit;
  priority: high  medium  low;
  content: string;
  reason: string;
  suggestions: Array{
    item: string;
    amount: string;
    frequency: string;
    notes: string;
  }>;
}

// 营养素信息
export interface INutrientInfo {
  /** calories 的描述 */
    calories: number;
  /** protein 的描述 */
    protein: number;
  /** carbs 的描述 */
    carbs: number;
  /** fat 的描述 */
    fat: number;
  /** fiber 的描述 */
    fiber: number;
  /** vitamins 的描述 */
    vitamins: Recordstring, /** number 的描述 */
    /** number 的描述 */
    number;
  /** minerals 的描述 */
    minerals: Recordstring, /** number 的描述 */
    /** number 的描述 */
    number;
  /** other 的描述 */
    other: Recordstring, /** number 的描述 */
    /** number 的描述 */
    number;
}
