import { api } from '../utils/api';
import { FoodAnalysisResult } from './food-analysis.service';

export interface NutritionReport {
  userId: string;
  period: 'daily' | 'weekly' | 'monthly';
  summary: {
    totalCalories: number;
    averageCalories: number;
    nutrientDistribution: {
      protein: number;
      carbs: number;
      fat: number;
    };
  };
  details: {
    meals: Array<{
      date: Date;
      foods: FoodAnalysisResult[];
      totalCalories: number;
    }>;
    trends: {
      caloriesTrend: Array<{ date: string; value: number }>;
      nutrientsTrend: Array<{ date: string; protein: number; carbs: number; fat: number }>;
    };
  };
  recommendations: string[];
}

export class NutritionReportService {
  async generateReport(userId: string, period: 'daily' | 'weekly' | 'monthly'): Promise<NutritionReport> {
    try {
      const response = await api.get(`/api/nutrition/report/${userId}`, {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error('生成营养报告失败:', error);
      throw error;
    }
  }

  async exportReport(report: NutritionReport, format: 'pdf' | 'excel'): Promise<Blob> {
    try {
      const response = await api.post('/api/nutrition/report/export', {
        report,
        format
      }, { responseType: 'blob' });
      return response.data;
    } catch (error) {
      console.error('导出报告失败:', error);
      throw error;
    }
  }
} 