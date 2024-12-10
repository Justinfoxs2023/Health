import { api } from '../utils/api';
import { NutritionReport } from './nutrition-report.service';

export interface ShareConfig {
  platform: 'wechat' | 'weibo' | 'twitter' | 'facebook';
  content: {
    title: string;
    description: string;
    image?: string;
    url: string;
  };
  permissions: {
    public: boolean;
    allowComments: boolean;
    expiresIn?: number;
  };
}

export class SocialSharingService {
  async shareReport(report: NutritionReport, config: ShareConfig) {
    try {
      const response = await api.post('/api/social/share', {
        report,
        config
      });
      return response.data;
    } catch (error) {
      console.error('分享失败:', error);
      throw error;
    }
  }

  async getShareStatistics(shareId: string) {
    try {
      const response = await api.get(`/api/social/statistics/${shareId}`);
      return response.data;
    } catch (error) {
      console.error('获取分享统计失败:', error);
      throw error;
    }
  }
} 