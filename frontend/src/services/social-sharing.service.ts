import { INutritionReport } from './nutrition-report.service';
import { api } from '../utils/api';

export interface IShareConfig {
  /** platform 的描述 */
  platform: 'wechat' | 'weibo' | 'twitter' | 'facebook';
  /** content 的描述 */
  content: {
    title: string;
    description: string;
    image?: string;
    url: string;
  };
  /** permissions 的描述 */
  permissions: {
    public: boolean;
    allowComments: boolean;
    expiresIn?: number;
  };
}

export class SocialSharingService {
  async shareReport(report: INutritionReport, config: IShareConfig) {
    try {
      const response = await api.post('/api/social/share', {
        report,
        config,
      });
      return response.data;
    } catch (error) {
      console.error('Error in social-sharing.service.ts:', '分享失败:', error);
      throw error;
    }
  }

  async getShareStatistics(shareId: string) {
    try {
      const response = await api.get(`/api/social/statistics/${shareId}`);
      return response.data;
    } catch (error) {
      console.error('Error in social-sharing.service.ts:', '获取分享统计失败:', error);
      throw error;
    }
  }
}
