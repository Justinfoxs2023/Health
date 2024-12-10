import { api } from '../utils/api';
import { NutritionReport } from './nutrition-report.service';

export interface NutritionistReview {
  nutritionistId: string;
  userId: string;
  reportId: string;
  review: {
    overallScore: number;
    comments: string;
    suggestions: string[];
    mealPlanAdjustments: {
      breakfast: string[];
      lunch: string[];
      dinner: string[];
      snacks: string[];
    };
    followUpActions: string[];
  };
  timestamp: Date;
}

export class NutritionistReviewService {
  async requestReview(report: NutritionReport): Promise<void> {
    try {
      await api.post('/api/nutritionist/review-request', {
        userId: report.userId,
        reportId: report.id,
        reportData: report
      });
    } catch (error) {
      console.error('请求点评失败:', error);
      throw error;
    }
  }

  async getReview(reportId: string): Promise<NutritionistReview> {
    try {
      const response = await api.get(`/api/nutritionist/review/${reportId}`);
      return response.data;
    } catch (error) {
      console.error('获取点评失败:', error);
      throw error;
    }
  }

  async submitFeedback(reviewId: string, feedback: {
    helpful: boolean;
    comments?: string;
  }): Promise<void> {
    try {
      await api.post(`/api/nutritionist/review/${reviewId}/feedback`, feedback);
    } catch (error) {
      console.error('提交反馈失败:', error);
      throw error;
    }
  }
} 