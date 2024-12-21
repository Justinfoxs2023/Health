import { Logger } from '../utils/logger';
import { NotificationService } from './notification.service';
import { OpenAI } from 'openai';

export class HealthRecommendationService {
  private openai: OpenAI;
  private logger: Logger;
  private notificationService: NotificationService;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.logger = new Logger('HealthRecommendation');
    this.notificationService = new NotificationService();
  }

  async generatePersonalizedRecommendation(userId: string): Promise<void> {
    try {
      // 获取用户最新的健康数据
      const healthData = await this.getUserHealthData(userId);

      // 使用AI生成个性化建议
      const recommendation = await this.generateAIRecommendation(healthData);

      // 发送推送通知
      await this.notificationService.sendNotification(userId, {
        type: 'HEALTH_RECOMMENDATION',
        title: '今日健康建议',
        content: recommendation,
        action: '/health-profile/recommendations',
      });
    } catch (error) {
      this.logger.error('���成健康建议失败', error);
    }
  }

  private async generateAIRecommendation(healthData: any): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的健康顾问，基于用户的健康数据生成个性化的建议。',
        },
        {
          role: 'user',
          content: JSON.stringify(healthData),
        },
      ],
    });

    return completion.choices[0].message.content;
  }
}
