import { api } from '../utils/api';

export interface FoodPreference {
  userId: string;
  preferences: {
    likedFoods: string[];
    dislikedFoods: string[];
    allergies: string[];
    dietaryRestrictions: string[];
    mealTimes: Record<string, string[]>;
  };
  learningData: {
    interactions: Array<{
      foodId: string;
      action: 'like' | 'dislike' | 'skip';
      timestamp: Date;
    }>;
  };
}

export class FoodPreferenceLearningService {
  async learnFromInteraction(userId: string, foodId: string, action: 'like' | 'dislike' | 'skip') {
    try {
      await api.post('/api/food/preferences/interaction', {
        userId,
        foodId,
        action,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('记录交互失败:', error);
    }
  }

  async generatePersonalizedRecommendations(userId: string): Promise<any> {
    try {
      const response = await api.get(`/api/food/recommendations/${userId}`);
      return response.data;
    } catch (error) {
      console.error('获取推荐失败:', error);
      throw error;
    }
  }
} 