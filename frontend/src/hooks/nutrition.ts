import { useState } from 'react';
import { nutritionService, NutritionPlan } from '../services/nutrition.service';

export const usePrecisionNutrition = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generatePlan = async (): Promise<NutritionPlan | null> => {
    try {
      setLoading(true);
      const plan = await nutritionService.getPrecisionPlan();
      return plan;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    generatePlan,
    loading,
    error
  };
}; 