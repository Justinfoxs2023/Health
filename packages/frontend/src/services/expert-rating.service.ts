import { api } from '../utils/api';

export interface IExpertRating {
  /** expertId 的描述 */
  expertId: string;
  /** userId 的描述 */
  userId: string;
  /** rating 的描述 */
  rating: number;
  /** comment 的描述 */
  comment: string;
  /** consultationId 的描述 */
  consultationId: string;
}

export class ExpertRatingService {
  async submitRating(rating: IExpertRating) {
    try {
      const response = await api.post('/api/expert/rating', rating);
      return response.data;
    } catch (error) {
      console.error('Error in expert-rating.service.ts:', '提交评价失败:', error);
      throw error;
    }
  }

  async getExpertRatings(expertId: string) {
    try {
      const response = await api.get(`/api/expert/rating/${expertId}`);
      return response.data;
    } catch (error) {
      console.error('Error in expert-rating.service.ts:', '获取专家评价失败:', error);
      throw error;
    }
  }
}
