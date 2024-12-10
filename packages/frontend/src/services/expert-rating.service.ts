import { api } from '../utils/api';

export interface ExpertRating {
  expertId: string;
  userId: string;
  rating: number;
  comment: string;
  consultationId: string;
}

export class ExpertRatingService {
  async submitRating(rating: ExpertRating) {
    try {
      const response = await api.post('/api/expert/rating', rating);
      return response.data;
    } catch (error) {
      console.error('提交评价失败:', error);
      throw error;
    }
  }

  async getExpertRatings(expertId: string) {
    try {
      const response = await api.get(`/api/expert/rating/${expertId}`);
      return response.data;
    } catch (error) {
      console.error('获取专家评价失败:', error);
      throw error;
    }
  }
} 