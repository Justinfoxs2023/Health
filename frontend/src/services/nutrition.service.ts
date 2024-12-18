import { api } from '../utils/api';

export interface INutritionPlan {
  /** macroDistribution 的描述 */
  macroDistribution: {
    protein: number;
    carbs: number;
    fat: number;
  };
  /** micronutrients 的描述 */
  micronutrients: Record<
    string,
    {
      current: number;
      target: number;
      unit: string;
    }
  >;
  /** mealTiming 的描述 */
  mealTiming: any;
  /** portionGuide 的描述 */
  portionGuide: any;
}

export class NutritionService {
  async getPrecisionPlan(): Promise<INutritionPlan> {
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
