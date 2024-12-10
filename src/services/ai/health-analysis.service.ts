import { OpenAI } from 'openai';
import { Logger } from '../utils/logger';
import { HealthData, RiskAssessment, Recommendation } from '../types/health';

export class HealthAnalysisService {
  private openai: OpenAI;
  private logger: Logger;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.logger = new Logger('HealthAnalysis');
  }

  // 健康风险评估
  async assessHealthRisks(healthData: HealthData): Promise<RiskAssessment> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{
          role: "system",
          content: "你是一个专业的健康风险评估专家，请分析以下健康数据并提供风险评估"
        }, {
          role: "user",
          content: JSON.stringify(healthData)
        }]
      });

      return this.parseRiskAssessment(response.choices[0].message.content);
    } catch (error) {
      this.logger.error('健康风险评估失败', error);
      throw error;
    }
  }

  // 生成健康建议
  async generateRecommendations(userProfile: any): Promise<Recommendation[]> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{
          role: "system",
          content: "请基于用户画像生成个性化的健康建议"
        }, {
          role: "user",
          content: JSON.stringify(userProfile)
        }]
      });

      return this.parseRecommendations(response.choices[0].message.content);
    } catch (error) {
      this.logger.error('生成健康建议失败', error);
      throw error;
    }
  }
} 