import { HealthAdvice, AdviceCategory } from '../models/HealthAdvice';
import { HealthData } from '../models/HealthData';
import { HealthRiskService } from '../health/HealthRiskService';
import { OpenAI } from 'openai';
import { UserPreferenceService } from '../user/UserPreferenceService';

import { AIError } from '@/utils/errors';
import { Logger } from '@/utils/Logger';

export class HealthAdviceService {
  private logger: Logger;
  private openai: OpenAI;
  private riskService: HealthRiskService;
  private preferenceService: UserPreferenceService;

  constructor() {
    this.logger = new Logger('HealthAdvice');
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.riskService = new HealthRiskService();
    this.preferenceService = new UserPreferenceService();
  }

  /**
   * 生成健康建议
   */
  async generateAdvice(healthData: HealthData): Promise<HealthAdvice> {
    try {
      // 1. 分析健康风险
      const risks = await this.riskService.analyzeRisks(healthData);

      // 2. 获取用户偏好
      const preferences = await this.preferenceService.getUserPreferences(healthData.userId);

      // 3. 生成建议内容
      const adviceContent = await this.generateAdviceContent(healthData, risks, preferences);

      // 4. 个性化建议
      const personalizedAdvice = await this.personalizeAdvice(adviceContent, preferences);

      // 5. 优先级排序
      return this.prioritizeAdvice(personalizedAdvice);
    } catch (error) {
      this.logger.error('健康建议生成失败', error);
      throw new AIError('ADVICE_GENERATION_FAILED', error.message);
    }
  }

  /**
   * 生成建议内容
   */
  private async generateAdviceContent(
    healthData: HealthData,
    risks: any[],
    preferences: any,
  ): Promise<any> {
    try {
      // 1. 准备提示信息
      const prompt = this.preparePrompt(healthData, risks, preferences);

      // 2. 调用OpenAI API
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的健康顾问，基于用户的健康数据提供个性化的建议。',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      // 3. 解析响应
      return this.parseAdviceResponse(response.choices[0].message.content);
    } catch (error) {
      throw new AIError('ADVICE_CONTENT_GENERATION_FAILED', error.message);
    }
  }

  /**
   * 个性化建议
   */
  private async personalizeAdvice(advice: any, preferences: any): Promise<HealthAdvice> {
    // 根据用户偏好调整建议
    const categories: AdviceCategory[] = ['diet', 'exercise', 'lifestyle', 'medical'];

    return {
      categories: categories.map(category => ({
        type: category,
        recommendations: this.filterRecommendations(advice[category], preferences),
      })),
      priority: this.calculatePriority(advice),
      timeframe: this.determineTimeframe(advice),
      goals: this.setHealthGoals(advice, preferences),
    };
  }

  /**
   * 优先级排序
   */
  private prioritizeAdvice(advice: HealthAdvice): HealthAdvice {
    // 根据重要性和紧急性排序
    advice.categories.forEach(category => {
      category.recommendations.sort((a, b) => {
        const priorityScore = {
          high: 3,
          medium: 2,
          low: 1,
        };
        return priorityScore[b.priority] - priorityScore[a.priority];
      });
    });

    return advice;
  }

  /**
   * 准备提示信息
   */
  private preparePrompt(healthData: HealthData, risks: any[], preferences: any): string {
    return `
基于以下信息生成��康建议：

健康数据：
${JSON.stringify(healthData, null, 2)}

健康风险：
${JSON.stringify(risks, null, 2)}

用户偏好：
${JSON.stringify(preferences, null, 2)}

请提供以下方面的具体建议：
1. 饮食建议
2. 运动建议
3. 生活方式建议
4. 医疗建议

每个建议需包含：
- 具体可执行的行动步骤
- 预期效果
- 时间框架
- 注意事项
    `;
  }

  /**
   * 解析建议响应
   */
  private parseAdviceResponse(response: string): any {
    // 实现响应解析逻辑
    return JSON.parse(response);
  }
}
