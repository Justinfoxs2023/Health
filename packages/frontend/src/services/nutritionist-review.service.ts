import { INutritionReport } from './nutrition-report.service';
import { api } from '../utils/api';

export interface INutritionistReview {
  /** nutritionistId 的描述 */
  nutritionistId: string;
  /** userId 的描述 */
  userId: string;
  /** reportId 的描述 */
  reportId: string;
  /** review 的描述 */
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
  /** timestamp 的描述 */
  timestamp: Date;
}

export class NutritionistReviewService {
  async requestReview(report: INutritionReport): Promise<void> {
    try {
      await api.post('/api/nutritionist/review-request', {
        userId: report.userId,
        reportId: report.id,
        reportData: report,
      });
    } catch (error) {
      console.error('Error in nutritionist-review.service.ts:', '请求点评失败:', error);
      throw error;
    }
  }

  async getReview(reportId: string): Promise<INutritionistReview> {
    try {
      const response = await api.get(`/api/nutritionist/review/${reportId}`);
      return response.data;
    } catch (error) {
      console.error('Error in nutritionist-review.service.ts:', '获取点评失败:', error);
      throw error;
    }
  }

  async submitFeedback(
    reviewId: string,
    feedback: {
      helpful: boolean;
      comments?: string;
    },
  ): Promise<void> {
    try {
      await api.post(`/api/nutritionist/review/${reviewId}/feedback`, feedback);
    } catch (error) {
      console.error('Error in nutritionist-review.service.ts:', '提交反馈失败:', error);
      throw error;
    }
  }
}
