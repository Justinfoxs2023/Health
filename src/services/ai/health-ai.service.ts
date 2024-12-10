import { OpenAI } from 'openai';
import { Logger } from '../utils/logger';
import { 
  HealthData, 
  RiskAssessment, 
  Recommendation, 
  Anomaly 
} from '../types/health';

export class HealthAIService {
  private openai: OpenAI;
  private logger: Logger;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.logger = new Logger('HealthAI');
  }

  // 健康风险预测
  async predictHealthRisks(healthData: HealthData): Promise<RiskAssessment> {
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
      this.logger.error('健康风险预测失败', error);
      throw error;
    }
  }

  // 生成个性化建议
  async generateRecommendations(healthData: HealthData, userProfile: any): Promise<Recommendation[]> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{
          role: "system",
          content: "基于用户的健康数据和个人画像，生成个性化的健康建议"
        }, {
          role: "user",
          content: JSON.stringify({ healthData, userProfile })
        }]
      });

      return this.parseRecommendations(response.choices[0].message.content);
    } catch (error) {
      this.logger.error('生成健康建议失败', error);
      throw error;
    }
  }

  // 异常检测
  async detectAnomalies(healthMetrics: any): Promise<Anomaly[]> {
    try {
      // 1. 统计分析
      const stats = await this.calculateStatistics(healthMetrics);
      
      // 2. 异常检测
      const anomalies = await this.detectOutliers(healthMetrics, stats);
      
      // 3. 上下文分析
      return await this.enrichAnomalies(anomalies, healthMetrics);
    } catch (error) {
      this.logger.error('异常检测失败', error);
      throw error;
    }
  }

  // 健康趋势分析
  async analyzeTrends(healthHistory: HealthData[]): Promise<TrendAnalysis> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{
          role: "system",
          content: "分析用户的健康历史数据，识别关键趋势和模式"
        }, {
          role: "user",
          content: JSON.stringify(healthHistory)
        }]
      });

      return this.parseTrendAnalysis(response.choices[0].message.content);
    } catch (error) {
      this.logger.error('趋势分析失败', error);
      throw error;
    }
  }
} 