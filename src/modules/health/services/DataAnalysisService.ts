import { IAnalysisResult, IHealthTrend, IHealthRisk, IHealthAdvice } from '../models/AnalysisTypes';

import { AIService } from '@/services/ai/AIService';
import { CacheService } from '@/services/cache/CacheService';
import { Logger } from '@/utils/Logger';

export class DataAnalysisService {
  private logger: Logger;
  private aiService: AIService;
  private cacheService: CacheService;

  constructor() {
    this.logger = new Logger('DataAnalysis');
    this.aiService = new AIService();
    this.cacheService = new CacheService();
  }

  /**
   * 分析健康数据
   * @param userId 用户ID
   */
  async analyzeHealthData(userId: string): Promise<IAnalysisResult> {
    try {
      // 1. 获取历史数据
      const historicalData = await this.getHistoricalData(userId);

      // 2. 趋势分析
      const trends = await this.analyzeTrends(historicalData);

      // 3. 风险评估
      const risks = await this.assessRisks(historicalData, trends);

      // 4. 生成建议
      const advice = await this.generateAdvice(risks, trends);

      // 5. 缓存分析结果
      await this.cacheAnalysisResult(userId, { trends, risks, advice });

      return {
        trends,
        risks,
        advice,
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error('健康数据分析失败', error);
      throw error;
    }
  }

  /**
   * 分析健康趋势
   */
  private async analyzeTrends(data: any[]): Promise<IHealthTrend[]> {
    try {
      // 1. 数据预处理
      const processedData = await this.preprocessData(data);

      // 2. 时间序列分析
      const timeSeriesAnalysis = await this.aiService.analyzeTimeSeries(processedData);

      // 3. 趋势识别
      const trends = await this.identifyTrends(timeSeriesAnalysis);

      return trends;
    } catch (error) {
      this.logger.error('趋势分析失败', error);
      throw error;
    }
  }

  /**
   * 评估健康风险
   */
  private async assessRisks(data: any[], trends: IHealthTrend[]): Promise<IHealthRisk[]> {
    try {
      // 1. 风险因素分析
      const riskFactors = await this.analyzeRiskFactors(data);

      // 2. AI风险评估
      const aiRiskAssessment = await this.aiService.assessHealthRisks(riskFactors);

      // 3. 风险等级划分
      return this.categorizeRisks(aiRiskAssessment);
    } catch (error) {
      this.logger.error('风险评估失败', error);
      throw error;
    }
  }

  /**
   * 生成健康建议
   */
  private async generateAdvice(
    risks: IHealthRisk[],
    trends: IHealthTrend[],
  ): Promise<IHealthAdvice[]> {
    try {
      // 1. 基于风险生成建议
      const riskBasedAdvice = await this.generateRiskBasedAdvice(risks);

      // 2. 基于趋势生成建议
      const trendBasedAdvice = await this.generateTrendBasedAdvice(trends);

      // 3. 整合建议
      return this.integrateAdvice(riskBasedAdvice, trendBasedAdvice);
    } catch (error) {
      this.logger.error('建议生成失败', error);
      throw error;
    }
  }

  /**
   * 缓存分析结果
   */
  private async cacheAnalysisResult(userId: string, result: any): Promise<void> {
    const cacheKey = `analysis:${userId}`;
    await this.cacheService.set(cacheKey, result, 3600); // 缓存1小时
  }
}
