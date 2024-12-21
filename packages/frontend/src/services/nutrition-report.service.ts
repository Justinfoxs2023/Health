import { IFoodAnalysisResult } from './food-analysis.service';
import { api } from '../utils/api';

export interface INutritionReport {
  /** userId 的描述 */
  userId: string;
  /** period 的描述 */
  period: 'daily' | 'weekly' | 'monthly';
  /** summary 的描述 */
  summary: {
    totalCalories: number;
    averageCalories: number;
    nutrientDistribution: {
      protein: number;
      carbs: number;
      fat: number;
    };
  };
  /** details 的描述 */
  details: {
    meals: Array<{
      date: Date;
      foods: IFoodAnalysisResult[];
      totalCalories: number;
    }>;
    trends: {
      caloriesTrend: Array<{ date: string; value: number }>;
      nutrientsTrend: Array<{ date: string; protein: number; carbs: number; fat: number }>;
    };
  };
  /** recommendations 的描述 */
  recommendations: string[];
}

export class NutritionReportService {
  async generateReport(
    userId: string,
    period: 'daily' | 'weekly' | 'monthly',
  ): Promise<INutritionReport> {
    try {
      const response = await api.get(`/api/nutrition/report/${userId}`, {
        params: { period },
      });
      return response.data;
    } catch (error) {
      console.error('Error in nutrition-report.service.ts:', '生成营养报告失败:', error);
      throw error;
    }
  }

  async exportReport(report: INutritionReport, format: 'pdf' | 'excel'): Promise<Blob> {
    try {
      const response = await api.post(
        '/api/nutrition/report/export',
        {
          report,
          format,
        },
        { responseType: 'blob' },
      );
      return response.data;
    } catch (error) {
      console.error('Error in nutrition-report.service.ts:', '导出报告失败:', error);
      throw error;
    }
  }
}
