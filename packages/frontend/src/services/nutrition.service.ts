import { api } from '../utils/api';

export interface NutritionPlan {
  macroDistribution: {
    protein: number;
    carbs: number;
    fat: number;
  };
  micronutrients: Record<string, {
    current: number;
    target: number;
    unit: string;
  }>;
  mealTiming: any;
  portionGuide: any;
}

export class NutritionService {
  async getPrecisionPlan(): Promise<NutritionPlan> {
    const response = await api.get('/api/nutrition/precision-plan');
    return response.data;
  }

  async getFunctionalPlan(type: string): Promise<any> {
    const response = await api.get(`/api/nutrition/functional-plan/${type}`);
    return response.data;
  }

  async getSupplementPlan(userId: string): Promise<any> {
    const response = await api.get(`/api/nutrition/supplement-plan/${userId}`);
    return response.data;
  }

  async getTherapeuticDiet(condition: string): Promise<any> {
    const response = await api.get(`/api/nutrition/therapeutic-diet/${condition}`);
    return response.data;
  }
}

export const nutritionService = new NutritionService(); 