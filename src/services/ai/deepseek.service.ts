import axios from 'axios';
import { Logger } from '../../utils/logger';
import { RedisConfig } from '../../config/redis.config';
import { aiConfig } from '../../config/ai.config';

export class DeepseekService {
  private logger: Logger;
  private redis: RedisConfig;
  private apiBase: string;
  private apiKey: string;

  constructor() {
    this.logger = new Logger('DeepseekService');
    this.apiBase = process.env.DEEPSEEK_API_BASE || 'https://api.deepseek.com/v1';
    this.apiKey = process.env.DEEPSEEK_API_KEY;
  }

  // 调用 DeepSeek API
  private async callDeepseekAPI(messages: any[], temperature = 0.7) {
    try {
      const response = await axios.post(
        `${this.apiBase}/chat/completions`,
        {
          model: aiConfig.deepseek.model,
          messages,
          temperature,
          max_tokens: aiConfig.deepseek.defaultParams.maxTokens,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      this.logger.error('DeepSeek API 调用失败:', error);
      throw error;
    }
  }

  // 健康评估服务
  async generateHealthAssessment(userData: any) {
    try {
      const cacheKey = `health_assessment:${userData.userId}`;
      const cached = await this.redis.get(cacheKey);

      if (cached) {
        return JSON.parse(cached);
      }

      const messages = [
        {
          role: 'system',
          content: '你是一位专业的健康顾问，请基于用户的健康数据提供专业的评估和建议。',
        },
        {
          role: 'user',
          content: `请对以下健康数据进行综合评估:
            生命体征: ${JSON.stringify(userData.vitalSigns)}
            运动记录: ${JSON.stringify(userData.exerciseRecords)}
            饮食记录: ${JSON.stringify(userData.dietRecords)}
            睡眠记录: ${JSON.stringify(userData.sleepRecords)}

            请提供:
            1. 健康状况评估
            2. 潜在风险提示
            3. 改善建议`,
        },
      ];

      const response = await this.callDeepseekAPI(messages, 0.5);

      const result = {
        assessment: response,
        timestamp: new Date(),
        userId: userData.userId,
      };

      await this.redis.setex(
        cacheKey,
        aiConfig.healthAssessment.cacheExpiry,
        JSON.stringify(result),
      );

      return result;
    } catch (error) {
      this.logger.error('健康评估生成失败:', error);
      throw error;
    }
  }

  // 个性化推荐服务
  async generateRecommendations(userProfile: any) {
    try {
      const cacheKey = `recommendations:${userProfile.userId}`;
      const cached = await this.redis.get(cacheKey);

      if (cached) {
        return JSON.parse(cached);
      }

      const messages = [
        {
          role: 'system',
          content: '你是一位专业的健康顾问，请基于用户画像提供个性化的健康建议。',
        },
        {
          role: 'user',
          content: `请根据以下用户信息提供个性化建议:
            基本信息: ${JSON.stringify(userProfile.basic)}
            健康目标: ${JSON.stringify(userProfile.goals)}
            当前状态: ${JSON.stringify(userProfile.currentStatus)}

            请分别在以下方面提供建议:
            1. 饮食计划
            2. 运动建议
            3. 生活方式调整`,
        },
      ];

      const response = await this.callDeepseekAPI(messages, 0.7);

      const result = {
        recommendations: response,
        timestamp: new Date(),
        userId: userProfile.userId,
      };

      if (aiConfig.recommendation.cacheEnabled) {
        await this.redis.setex(
          cacheKey,
          aiConfig.recommendation.refreshInterval,
          JSON.stringify(result),
        );
      }

      return result;
    } catch (error) {
      this.logger.error('个性化推荐生成失败:', error);
      throw error;
    }
  }

  // 智能问答服务
  async chatWithAI(question: string, context: any = {}, chatHistory: any[] = []) {
    try {
      const messages = [
        {
          role: 'system',
          content: `你是一位专业的健康顾问，专注于${aiConfig.chatbot.supportedDomains.join(
            '、',
          )}等领域。
            请基于用户的具体情况提供专业、安全的建议。`,
        },
        ...chatHistory.slice(-aiConfig.chatbot.contextLength),
        {
          role: 'user',
          content: question,
        },
      ];

      const response = await this.callDeepseekAPI(messages, aiConfig.chatbot.temperature);

      return {
        answer: response,
        timestamp: new Date(),
        questionId: context.questionId,
      };
    } catch (error) {
      this.logger.error('AI问答失败:', error);
      throw error;
    }
  }
}
